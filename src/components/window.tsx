import { SizeControl } from "@/components";
import { WINDOW_DEFINITIONS } from "@/constants/windows";
import {
    useBreakpoint,
    useDesktopState,
    useRepositionHandlers,
    useWindowState,
} from "@/hooks";
import { cn } from "@/utils/classnames";
import { findById } from "@/utils/collection-utils";
import type { CSSProperties, PropsWithChildren } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface WindowProps extends PropsWithChildren {
    id: string;
    title?: string;
}

type AnimPhase =
    | {
          left: number;
          titleBarHeight: number;
          top: number;
          type: "minimizing";
          width: number;
      }
    | {
          left: number;
          titleBarHeight: number;
          top: number;
          type: "restore-ready";
          width: number;
      }
    | { titleBarHeight: number; type: "restoring" }
    | { type: "idle" };

/** Default title bar height used when the real one can't be measured
 * (e.g. during restore when the window is hidden). Matches 98.css:
 * 3px top padding + 3px bottom padding + ~16px line-height. */
const DEFAULT_TITLE_BAR_HEIGHT = 22;

const Window: React.FC<WindowProps> = (props) => {
    const { title, children, id } = props;
    const windowRef = useRef<HTMLDivElement>(null);
    const { activeWindowId } = useDesktopState();
    const {
        state,
        minimize: storeMinimize,
        setPosition,
        activate,
        close,
        setSize,
        toggleMaximized,
    } = useWindowState(id);
    const definition = findById(WINDOW_DEFINITIONS, id);
    const { minHeight, minWidth } = definition ?? {};
    const { minimized, width, height, x, y, maximized = false } = state ?? {};
    const breakpoint = useBreakpoint();

    const [anim, setAnim] = useState<AnimPhase>({ type: "idle" });

    // Cache the title bar height so restore animations (which run while the
    // window is hidden) can still set the correct height.
    const titleBarHeightRef = useRef(DEFAULT_TITLE_BAR_HEIGHT);

    // Keep a ref to the computed state so the restore event handler always
    // reads the latest values (avoids stale closures).
    const stateRef = useRef(state);
    stateRef.current = state;

    const isAnimating = anim.type !== "idle";
    const hasTransition =
        anim.type === "minimizing" || anim.type === "restoring";

    const style: CSSProperties = useMemo(() => {
        return {
            zIndex: id === activeWindowId ? 0 : undefined,
            // During animation, lock height to just the title bar and
            // override position/size so the element transitions between
            // the window rect and the taskbar button rect directly.
            // No transform — text stays crisp; overflow:hidden clips it.
            height:
                "titleBarHeight" in anim
                    ? (anim as { titleBarHeight: number }).titleBarHeight
                    : height,
            width: "width" in anim ? (anim as { width: number }).width : width,
            left: "left" in anim ? (anim as { left: number }).left : x,
            top: "top" in anim ? (anim as { top: number }).top : y,
            // During animation, drop min constraints so the element can
            // shrink to the taskbar button's dimensions.
            minHeight: isAnimating ? 0 : minHeight,
            minWidth: isAnimating ? 0 : minWidth,
            position: "fixed",
            // Keep the window visible during animation even if the store says
            // it's minimized — the transition needs a visible element to work.
            display: minimized === true && !isAnimating ? "none" : undefined,
            transition: hasTransition
                ? "left 300ms steps(5, end), top 300ms steps(5, end), width 300ms steps(5, end)"
                : undefined,
        };
    }, [
        activeWindowId,
        anim,
        breakpoint,
        hasTransition,
        height,
        id,
        isAnimating,
        minHeight,
        minWidth,
        minimized,
        width,
        x,
        y,
    ]);

    const {
        handleMouseDown,
        handleMouseMove,
        handleTouchStart,
        handleTouchMove,
    } = useRepositionHandlers({
        onReposition: setPosition,
    });

    const handleActionButtonMouseDown = useCallback(
        function handleActionButtonMouseDown(event: React.MouseEvent) {
            event.stopPropagation();
        },
        []
    );

    /** Measure the real title bar height from the DOM and cache it. */
    const measureTitleBarHeight = useCallback(() => {
        const tb = windowRef.current?.querySelector<HTMLElement>(".title-bar");
        if (tb) {
            titleBarHeightRef.current = tb.getBoundingClientRect().height;
        }
        return titleBarHeightRef.current;
    }, []);

    // Shared minimize animation logic — used by both the title-bar minimize
    // button and the "minimize-window" CustomEvent from the taskbar.
    const startMinimizeAnimation = useCallback(() => {
        const windowRect = windowRef.current?.getBoundingClientRect();
        const buttonEl = document.querySelector(
            `[data-taskbar-window="${id}"]`
        );
        const buttonRect = buttonEl?.getBoundingClientRect();

        if (
            windowRect &&
            buttonRect &&
            windowRect.width > 0 &&
            buttonRect.width > 0
        ) {
            const titleBarHeight = measureTitleBarHeight();

            setAnim({
                type: "minimizing",
                left: buttonRect.x,
                top: buttonRect.y,
                width: buttonRect.width,
                titleBarHeight,
            });
            return true;
        }
        return false;
    }, [id, measureTitleBarHeight]);

    const handleMinimizeClick = useCallback(
        function handleMinimizeClick(event: React.MouseEvent) {
            event.stopPropagation();
            if (!startMinimizeAnimation()) {
                storeMinimize();
            }
        },
        [startMinimizeAnimation, storeMinimize]
    );

    const handleMaximizeClick = useCallback(
        function handleMinimizeClick(event: React.MouseEvent) {
            event.stopPropagation();
            toggleMaximized();
        },
        [toggleMaximized]
    );

    const handleCloseClick = useCallback(
        function handleMinimizeClick(event: React.MouseEvent) {
            event.stopPropagation();
            close();
        },
        [close]
    );

    const handleTitleBarMouseDown = useCallback(
        function handleTitleBarMouseDown(event: React.MouseEvent) {
            activate();
            handleMouseDown(event);
        },
        [activate, handleMouseDown]
    );

    // Listen for CustomEvents dispatched by the taskbar button. Using DOM
    // events avoids pulling transient animation signals into Zustand.
    useEffect(() => {
        const el = windowRef.current;
        if (!el) {
            return;
        }

        const handleMinimize = () => {
            if (!startMinimizeAnimation()) {
                storeMinimize();
            }
        };

        const handleRestore = (e: Event) => {
            const { buttonRect } = (e as CustomEvent).detail as {
                buttonRect: DOMRect;
            };
            const target = stateRef.current;
            if (!target || !buttonRect) {
                return;
            }

            // Use the cached title bar height — the window is hidden so we
            // can't measure it right now.
            const titleBarHeight = titleBarHeightRef.current;

            setAnim({
                type: "restore-ready",
                left: buttonRect.x,
                top: buttonRect.y,
                width: buttonRect.width,
                titleBarHeight,
            });
        };

        el.addEventListener("minimize-window", handleMinimize);
        el.addEventListener("restore-window", handleRestore);
        return () => {
            el.removeEventListener("minimize-window", handleMinimize);
            el.removeEventListener("restore-window", handleRestore);
        };
    }, [id, startMinimizeAnimation, storeMinimize]);

    // After restore-ready is painted (window at button position, no
    // transition), switch to restoring on the next frame. The style then
    // uses the store's position/size, and the CSS transition animates to
    // full size.
    useEffect(() => {
        if (anim.type !== "restore-ready") {
            return;
        }

        const titleBarHeight =
            "titleBarHeight" in anim
                ? (anim as { titleBarHeight: number }).titleBarHeight
                : titleBarHeightRef.current;

        const raf = requestAnimationFrame(() => {
            setAnim({ type: "restoring", titleBarHeight });
        });
        return () => cancelAnimationFrame(raf);
    }, [anim]);

    const handleTransitionEnd = useCallback(
        function handleTransitionEnd(e: React.TransitionEvent) {
            if (e.propertyName !== "width") {
                return;
            }

            if (anim.type === "minimizing") {
                setAnim({ type: "idle" });
                storeMinimize();
            } else if (anim.type === "restoring") {
                setAnim({ type: "idle" });
            }
        },
        [anim.type, storeMinimize]
    );

    return (
        <div
            className="window"
            data-animating={isAnimating ? "true" : undefined}
            id={id}
            onClick={activate}
            onTransitionEnd={handleTransitionEnd}
            ref={windowRef}
            style={style}>
            {!maximized && <SizeControl onResize={setSize} />}

            <div
                className={cn("title-bar", {
                    inactive: activeWindowId !== id,
                })}
                onMouseDown={handleTitleBarMouseDown}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                onTouchStart={handleTouchStart}>
                <div className="title-bar-text">{title}</div>
                <div className="title-bar-controls">
                    <button
                        aria-label="Minimize"
                        onClick={handleMinimizeClick}
                        onMouseDown={handleActionButtonMouseDown}
                    />
                    {breakpoint !== "mobile" && (
                        <button
                            aria-label="Maximize"
                            onClick={handleMaximizeClick}
                            onMouseDown={handleActionButtonMouseDown}
                        />
                    )}
                    <button
                        aria-label="Close"
                        onClick={handleCloseClick}
                        onMouseDown={handleActionButtonMouseDown}
                    />
                </div>
            </div>
            <div className="window-body">{children}</div>
        </div>
    );
};

export { Window };
