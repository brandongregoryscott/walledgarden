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
import type { WindowState } from "@/types";
import type { CSSProperties, PropsWithChildren } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface WindowProps extends PropsWithChildren {
    id: string;
    title?: string;
}

const DEFAULT_TITLE_BAR_HEIGHT = 22;
const ANIMATION_DURATION = 300;
const ANIMATION_EASING = "steps(5, end)";

const KEYFRAME_OPTIONS: KeyframeAnimationOptions = {
    duration: ANIMATION_DURATION,
    easing: ANIMATION_EASING,
    fill: "both",
};

function useWindowAnimation(
    id: string,
    storeMinimize: () => void,
    state: undefined | WindowState
) {
    const windowRef = useRef<HTMLDivElement>(null);
    const generationRef = useRef(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const titleBarHeightRef = useRef(DEFAULT_TITLE_BAR_HEIGHT);
    const stateRef = useRef(state);
    stateRef.current = state;

    useEffect(() => {
        const element = windowRef.current;
        return function cleanup() {
            generationRef.current += 1;
            element?.getAnimations().forEach((animation) => animation.cancel());
        };
    }, []);

    const measureTitleBarHeight = useCallback(() => {
        const titleBar =
            windowRef.current?.querySelector<HTMLElement>(".title-bar");
        if (titleBar != null) {
            titleBarHeightRef.current = titleBar.getBoundingClientRect().height;
        }
        return titleBarHeightRef.current;
    }, []);

    const animateMinimize = useCallback(async () => {
        const element = windowRef.current;
        if (element == null) {
            return;
        }

        const generation = ++generationRef.current;

        setIsAnimating(true);

        // Read the current visual position BEFORE cancelling the old
        // animation — this ensures the new animation starts from where
        // the element actually is, not from the stored position (which
        // would cause a visible jump).
        const windowRect = element.getBoundingClientRect();
        const buttonElement = document.querySelector(
            `[data-taskbar-window="${id}"]`
        );
        const buttonRect = buttonElement?.getBoundingClientRect();

        if (buttonRect == null || buttonRect.width === 0) {
            if (generation === generationRef.current) {
                setIsAnimating(false);
            }
            storeMinimize();
            return;
        }

        const titleBarHeight = measureTitleBarHeight();

        element.getAnimations().forEach((a) => a.cancel());

        const animation = element.animate(
            [
                {
                    left: `${windowRect.x}px`,
                    top: `${windowRect.y}px`,
                    width: `${windowRect.width}px`,
                    height: `${windowRect.height}px`,
                },
                {
                    left: `${buttonRect.x}px`,
                    top: `${buttonRect.y}px`,
                    width: `${buttonRect.width}px`,
                    height: `${titleBarHeight}px`,
                },
            ],
            KEYFRAME_OPTIONS
        );

        try {
            await animation.finished;
        } catch {
            // Cancelled by a newer animation.
        }

        if (generation !== generationRef.current) {
            return;
        }
        setIsAnimating(false);
    }, [id, storeMinimize, measureTitleBarHeight]);

    const animateRestore = useCallback(async (buttonRect: DOMRect) => {
        const element = windowRef.current;
        const target = stateRef.current;
        if (
            element == null ||
            target == null ||
            buttonRect.width === 0 ||
            buttonRect.height === 0
        ) {
            return;
        }

        const generation = ++generationRef.current;

        setIsAnimating(true);

        const titleBarHeight = titleBarHeightRef.current;

        // WAAPI's fill:"both" applies the first keyframe instantly —
        // no need for manual position styles. Only display needs a
        // manual override (WAAPI can't un-hide a display:none element).
        element.style.display = "";

        element.getAnimations().forEach((a) => a.cancel());

        const animation = element.animate(
            [
                {
                    left: `${buttonRect.x}px`,
                    top: `${buttonRect.y}px`,
                    width: `${buttonRect.width}px`,
                    height: `${titleBarHeight}px`,
                },
                {
                    left: `${target.x}px`,
                    top: `${target.y}px`,
                    width: `${target.width}px`,
                    height: `${titleBarHeight}px`,
                },
            ],
            KEYFRAME_OPTIONS
        );

        try {
            await animation.finished;
        } catch {
            // Cancelled by a newer animation.
        }

        if (generation !== generationRef.current) {
            return;
        }

        // Set final position explicitly — React's style diff will skip
        // re-applying these during re-render (it sees same JS values),
        // so the DOM must already have the correct inline styles.
        element.style.left = `${target.x}px`;
        element.style.top = `${target.y}px`;
        element.style.width = `${target.width}px`;
        element.style.height = `${target.height}px`;

        setIsAnimating(false);
    }, []);

    useEffect(() => {
        const element = windowRef.current;
        if (element == null) {
            return;
        }

        const handleMinimize = () => {
            animateMinimize();
        };

        const handleRestore = (event: Event) => {
            const { buttonRect } = (
                event as CustomEvent<{ buttonRect: DOMRect }>
            ).detail;
            animateRestore(buttonRect);
        };

        element.addEventListener("minimize-window", handleMinimize);
        element.addEventListener("restore-window", handleRestore);
        return () => {
            element.removeEventListener("minimize-window", handleMinimize);
            element.removeEventListener("restore-window", handleRestore);
        };
    }, [animateMinimize, animateRestore]);

    return { windowRef, isAnimating, animateMinimize };
}

const Window: React.FC<WindowProps> = (props) => {
    const { title, children, id } = props;
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

    const { windowRef, isAnimating, animateMinimize } = useWindowAnimation(
        id,
        storeMinimize,
        state
    );

    const {
        handleMouseDown,
        handleMouseMove,
        handleTouchStart,
        handleTouchMove,
    } = useRepositionHandlers({
        onReposition: setPosition,
    });

    const handleMinimizeClick = useCallback(
        function handleMinimizeClick(event: React.MouseEvent) {
            event.stopPropagation();
            storeMinimize();
            animateMinimize();
        },
        [animateMinimize, storeMinimize]
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

    const handleActionButtonMouseDown = useCallback(
        function handleActionButtonMouseDown(event: React.MouseEvent) {
            event.stopPropagation();
        },
        []
    );

    const style: CSSProperties = useMemo(() => {
        return {
            zIndex: id === activeWindowId ? 0 : undefined,
            height,
            width,
            left: x,
            top: y,
            minHeight: isAnimating ? 0 : minHeight,
            minWidth: isAnimating ? 0 : minWidth,
            position: "fixed",
            display: minimized === true && !isAnimating ? "none" : undefined,
        };
    }, [
        activeWindowId,
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

    return (
        <div
            className="window"
            data-animating={isAnimating ? "true" : undefined}
            id={id}
            onClick={activate}
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
