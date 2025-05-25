interface SizeControlEdgeHandleProps {
    edge: SizeControlEdge;
    onMouseDownCapture: (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => void;
}

type SizeControlEdge = "bottom" | "left" | "right" | "top";

const HANDLE_WIDTH = 2;

const SizeControlEdgeHandle: React.FC<SizeControlEdgeHandleProps> = (props) => {
    const { edge, onMouseDownCapture } = props;

    const isHorizontalEdge = edge === "top" || edge === "bottom";

    return (
        <div
            data-handle={edge}
            onMouseDownCapture={onMouseDownCapture}
            style={{
                position: "absolute",
                bottom: edge === "bottom" || edge === "right" ? 0 : undefined,
                top: edge === "top" ? 0 : undefined,
                left: edge === "left" || edge === "top" ? 0 : undefined,
                right: edge === "right" ? 0 : undefined,
                width: isHorizontalEdge ? "100%" : HANDLE_WIDTH,
                height: isHorizontalEdge ? HANDLE_WIDTH : "100%",
                pointerEvents: "all",
                cursor: `${isHorizontalEdge ? "row" : "col"}-resize`,
            }}
        />
    );
};

export type { SizeControlEdge, SizeControlEdgeHandleProps };
export { SizeControlEdgeHandle };
