import { SizeControlCornerHandle } from "@/components/size-control/size-control-corner-handle";
import { SizeControlEdgeHandle } from "@/components/size-control/size-control-edge-handle";
import { useResizeHandlers } from "@/hooks";
import type { Dimensions } from "@/types";

interface SizeControlProps {
    onResize?: (size: Dimensions) => void;
    onResizeStarted?: () => void;
    onResizeStopped?: (size: Dimensions) => void;
}

const SizeControl: React.FC<SizeControlProps> = (props) => {
    const { onResize, onResizeStarted, onResizeStopped } = props;
    const { handleMouseDownCapture } = useResizeHandlers({
        onResize,
        onResizeStarted,
        onResizeStopped,
    });

    return (
        <>
            <SizeControlEdgeHandle
                edge="top"
                onMouseDownCapture={handleMouseDownCapture}
            />
            <SizeControlEdgeHandle
                edge="bottom"
                onMouseDownCapture={handleMouseDownCapture}
            />
            <SizeControlEdgeHandle
                edge="left"
                onMouseDownCapture={handleMouseDownCapture}
            />
            <SizeControlEdgeHandle
                edge="right"
                onMouseDownCapture={handleMouseDownCapture}
            />
            <SizeControlCornerHandle
                corner="top-left"
                onMouseDownCapture={handleMouseDownCapture}
            />
            <SizeControlCornerHandle
                corner="top-right"
                onMouseDownCapture={handleMouseDownCapture}
            />
            <SizeControlCornerHandle
                corner="bottom-right"
                onMouseDownCapture={handleMouseDownCapture}
            />
            <SizeControlCornerHandle
                corner="bottom-left"
                onMouseDownCapture={handleMouseDownCapture}
            />
        </>
    );
};

export { SizeControl };
