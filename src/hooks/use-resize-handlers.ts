import type { SizeControlCorner } from "@/components/size-control/size-control-corner-handle";
import type { SizeControlEdge } from "@/components/size-control/size-control-edge-handle";
import type { Dimensions, Position } from "@/types";
import { useCallback, useRef } from "react";

const { floor, max } = Math;

interface UseResizeHandlersOptions {
    onResize?: (position: Dimensions) => void;
    onResizeStarted?: () => void;
    onResizeStopped?: (position: Dimensions) => void;
}

const useResizeHandlers = (options: UseResizeHandlersOptions) => {
    const { onResize, onResizeStarted, onResizeStopped } = options;
    const initialMousePositionRef = useRef<Position | undefined>(undefined);
    const initialSizeRef = useRef<Dimensions | undefined>(undefined);
    const sizeRef = useRef<Dimensions | undefined>(undefined);
    const activeHandleRef = useRef<
        SizeControlCorner | SizeControlEdge | undefined
    >(undefined);

    const handleMouseMove = useCallback(
        function handleMouseMove(event: MouseEvent) {
            event.stopPropagation();

            const activeHandle = activeHandleRef.current;
            if (activeHandle === undefined) {
                return;
            }

            const initialSize = initialSizeRef.current;
            if (initialSize === undefined) {
                return;
            }

            const initialMousePosition = initialMousePositionRef.current;
            if (initialMousePosition === undefined) {
                return;
            }

            const updatedSize = calculateUpdatedSize({
                activeHandle,
                initialMousePosition,
                initialSize,
                mousePosition: { x: event.clientX, y: event.clientY },
            });
            if (updatedSize !== undefined) {
                onResize?.(updatedSize);
                sizeRef.current = updatedSize;
            }
        },
        [onResize]
    );

    const handleMouseUp = useCallback(
        function handleMouseUp() {
            window.removeEventListener("mousemove", handleMouseMove, true);
            window.removeEventListener("mouseup", handleMouseUp, true);

            const size = sizeRef.current ?? initialSizeRef.current;
            if (size !== undefined) {
                onResizeStopped?.(size);
            }
            resetBodyStyle();
            activeHandleRef.current = undefined;
            initialMousePositionRef.current = undefined;
            initialSizeRef.current = undefined;
            sizeRef.current = undefined;
        },
        [handleMouseMove, onResizeStopped]
    );

    const handleMouseDownCapture = useCallback(
        function handleMouseDownCapture(event: React.MouseEvent) {
            const target = event.target as HTMLElement | null;
            if (target === null) {
                return;
            }

            const { parentElement } = target;
            if (parentElement === null) {
                return;
            }

            const style = window.getComputedStyle(target.parentElement!);
            const width = parseInt(style.width);
            const height = parseInt(style.height);

            const activeHandle = target.dataset.handle as
                | SizeControlCorner
                | SizeControlEdge;
            activeHandleRef.current = activeHandle;
            initialMousePositionRef.current = {
                x: event.clientX,
                y: event.clientY,
            };
            initialSizeRef.current = {
                width,
                height,
            };

            onResizeStarted?.();
            disablePointerEventsAndSelection();
            window.addEventListener("mousemove", handleMouseMove, true);
            window.addEventListener("mouseup", handleMouseUp, true);
        },
        [handleMouseMove, handleMouseUp, onResizeStarted]
    );

    return { handleMouseDownCapture };
};

interface CalculateUpdatedSizeOptions {
    activeHandle: SizeControlCorner | SizeControlEdge;
    initialMousePosition: Position;
    initialSize: Dimensions;
    mousePosition: Position;
}

const calculateUpdatedSize = (
    options: CalculateUpdatedSizeOptions
): Dimensions | undefined => {
    const { activeHandle, initialMousePosition, initialSize, mousePosition } =
        options;
    const { width: initialWidth, height: initialHeight } = initialSize;
    const { x: initialX, y: initialY } = initialMousePosition;
    const { x, y } = mousePosition;

    let widthDelta = floor(x - initialX);
    let heightDelta = floor(y - initialY);

    // Invert the delta if the active side is left or top so moving the mouse left or up will increase the size
    if (activeHandle.includes("left")) {
        widthDelta = widthDelta * -1;
    }

    if (activeHandle.includes("top")) {
        heightDelta = heightDelta * -1;
    }

    const isCornerHandle = activeHandle.includes("-");

    if (isCornerHandle) {
        const updatedHeight = max(floor(initialHeight + floor(heightDelta)), 0);
        const updatedWidth = max(floor(initialWidth + floor(widthDelta)), 0);

        return {
            width: updatedWidth,
            height: updatedHeight,
        };
    }

    const dimension =
        activeHandle === "left" || activeHandle === "right"
            ? "width"
            : "height";
    const initialDimensionValue = initialSize[dimension];
    if (initialDimensionValue === undefined) {
        return undefined;
    }

    const delta = dimension === "width" ? widthDelta : heightDelta;
    const value = max(floor(initialDimensionValue + floor(delta)), 0);

    const updatedSize: Dimensions = {
        ...initialSize,
        [dimension]: value,
    };
    return updatedSize;
};

const disablePointerEventsAndSelection = () => {
    document.body.style.userSelect = "none";
    document.body.style.pointerEvents = "none";
};

const resetBodyStyle = () => {
    document.body.style.userSelect = "";
    document.body.style.pointerEvents = "";
};

export { useResizeHandlers };
