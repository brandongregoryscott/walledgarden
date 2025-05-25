interface SizeControlCornerHandleProps {
    corner: SizeControlCorner;
    onMouseDownCapture: (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => void;
}

type SizeControlCorner =
    | "bottom-left"
    | "bottom-right"
    | "top-left"
    | "top-right";

const HANDLE_WIDTH = 8;

const SizeControlCornerHandle: React.FC<SizeControlCornerHandleProps> = (
    props
) => {
    const { corner, onMouseDownCapture } = props;

    return (
        <div
            data-handle={corner}
            onMouseDownCapture={onMouseDownCapture}
            style={{
                position: "absolute",
                bottom: corner.includes("bottom")
                    ? -(HANDLE_WIDTH / 2 + 1)
                    : undefined,
                top: corner.includes("top")
                    ? -(HANDLE_WIDTH / 2 + 1)
                    : undefined,
                left: corner.includes("left")
                    ? -(HANDLE_WIDTH / 2 + 1)
                    : undefined,
                right: corner.includes("right")
                    ? -(HANDLE_WIDTH / 2 + 1)
                    : undefined,
                width: HANDLE_WIDTH,
                height: HANDLE_WIDTH,
                pointerEvents: "all",
                cursor:
                    corner === "top-left" || corner === "bottom-right"
                        ? "nwse-resize"
                        : "nesw-resize",
                boxSizing: "border-box",
            }}
        />
    );
};

export type { SizeControlCorner, SizeControlCornerHandleProps };
export { SizeControlCornerHandle };
