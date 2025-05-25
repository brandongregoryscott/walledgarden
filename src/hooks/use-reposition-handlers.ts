import type { Position } from "@/types";
import { first } from "lodash";
import type React from "react";
import { useCallback, useRef } from "react";

interface UseRepositionHandlersOptions {
    onReposition?: (position: Position) => void;
    onRepositionStarted?: () => void;
    onRepositionStopped?: (position: Position) => void;
}

const LEFT_MOUSE_BUTTON = 1 as const;

const useRepositionHandlers = (options: UseRepositionHandlersOptions) => {
    const { onReposition, onRepositionStarted, onRepositionStopped } = options;
    /**
     * Offset of the initial mouse position and the top/left position of the target element
     */
    const offsetRef = useRef<Position | undefined>(undefined);
    const isRepositioningRef = useRef<boolean>(false);

    const handleWindowMouseMove = useCallback(
        function handleWindowMouseMove(event: MouseEvent) {
            const isRepositioning = isRepositioningRef.current;
            const offset = offsetRef.current;
            if (!isRepositioning || offset === undefined) {
                return;
            }

            const updatedPosition: Position = {
                x: event.clientX - offset.x,
                y: event.clientY - offset.y,
            };

            onReposition?.(updatedPosition);
        },
        [onReposition]
    );

    const handleWindowMouseUp = useCallback(
        function handleWindowMouseUp(event: MouseEvent) {
            const isRepositioning = isRepositioningRef.current;
            if (!isRepositioning) {
                return;
            }

            isRepositioningRef.current = false;

            const offset = offsetRef.current;
            if (offset === undefined) {
                return;
            }

            const updatedPosition: Position = {
                x: event.clientX - offset.x,
                y: event.clientY - offset.y,
            };

            offsetRef.current = undefined;
            onRepositionStopped?.(updatedPosition);
        },
        [onRepositionStopped]
    );

    const handleMouseMove = useCallback(
        function handleMouseMove(event: React.MouseEvent) {
            const isLeftClick = event.buttons === LEFT_MOUSE_BUTTON;
            const isRepositioning = isRepositioningRef.current;
            if (isLeftClick && !isRepositioning) {
                isRepositioningRef.current = true;
                onRepositionStarted?.();
                window.addEventListener("mousemove", handleWindowMouseMove);
                window.addEventListener("mouseup", handleWindowMouseUp);
            }
        },
        [handleWindowMouseMove, handleWindowMouseUp, onRepositionStarted]
    );

    const handleMouseDown = useCallback(function handleMouseDown(
        event: React.MouseEvent
    ) {
        const isLeftClick = event.buttons === LEFT_MOUSE_BUTTON;
        if (!isLeftClick) {
            return;
        }

        const target = event.target as HTMLElement | null;
        if (target === null) {
            return;
        }

        const rect = target.getBoundingClientRect();
        const offset: Position = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
        offsetRef.current = offset;
    }, []);

    const handleTouchStart = useCallback(function handleTouchStart(
        event: React.TouchEvent
    ) {
        const position = getTouchEventPosition(event);
        if (position === undefined) {
            return;
        }

        const target = event.target as HTMLElement | null;
        if (target === null) {
            return;
        }

        const rect = target.getBoundingClientRect();

        const offset = {
            x: position.x - rect.left,
            y: position.y - rect.top,
        };
        offsetRef.current = offset;
    }, []);

    const handleTouchMove = useCallback(
        function handleTouchMove(event: React.TouchEvent) {
            const offset = offsetRef.current;
            if (offset === undefined) {
                return;
            }

            const position = getTouchEventPosition(event);
            if (position === undefined) {
                return;
            }

            const target = event.target as HTMLElement | null;
            if (target === null) {
                return;
            }

            const updatedPosition: Position = {
                x: position.x - offset.x,
                y: position.y - offset.y,
            };

            onReposition?.(updatedPosition);
        },
        [onReposition]
    );

    return {
        handleMouseDown,
        handleMouseMove,
        handleTouchStart,
        handleTouchMove,
    };
};

const getTouchEventPosition = (
    event: React.TouchEvent | TouchEvent
): Position | undefined => {
    const touch = first(event.touches);
    if (touch === undefined) {
        return undefined;
    }

    const { clientX, clientY } = touch;

    return { x: clientX, y: clientY };
};

export { useRepositionHandlers };
