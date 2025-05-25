import { useCallback, useRef } from "react";

interface UseDoubleTapOptions {
    onDoubleTap: (event: React.MouseEvent) => void;
    onSingleTap?: (event: React.MouseEvent) => void;
    /**
     * Maximum time between taps to consider the second tap a double tap
     */
    threshold?: number;
}

const useDoubleTap = (options: UseDoubleTapOptions) => {
    const { onSingleTap, onDoubleTap, threshold = 300 } = options;
    const timer = useRef<NodeJS.Timeout | null>(null);

    const handleClick = useCallback(
        (event: React.MouseEvent) => {
            if (timer.current === null) {
                timer.current = setTimeout(() => {
                    onSingleTap?.(event);
                    timer.current = null;
                }, threshold);
                return;
            }

            clearTimeout(timer.current);
            timer.current = null;
            onDoubleTap(event);
        },
        [onDoubleTap, onSingleTap, threshold]
    );

    return { handleClick };
};

export { useDoubleTap };
