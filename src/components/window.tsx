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
import { useCallback, useMemo } from "react";

interface WindowProps extends PropsWithChildren {
    id: string;
    title?: string;
}

const Window: React.FC<WindowProps> = (props) => {
    const { title, children, id } = props;
    const { activeWindowId } = useDesktopState();
    const {
        state,
        minimize,
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

    const style: CSSProperties = useMemo(() => {
        return {
            zIndex: id === activeWindowId ? 0 : undefined,
            height,
            width,
            left: x,
            top: y,
            minHeight: breakpoint === "mobile" ? undefined : minHeight,
            minWidth: breakpoint === "mobile" ? undefined : minWidth,
            position: "fixed",
            display: minimized === true ? "none" : undefined,
        };
    }, [
        activeWindowId,
        breakpoint,
        height,
        id,
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

    const handleMinimizeClick = useCallback(
        function handleMinimizeClick(event: React.MouseEvent) {
            event.stopPropagation();
            minimize();
        },
        [minimize]
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

    return (
        <div className="window" id={id} onClick={activate} style={style}>
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
