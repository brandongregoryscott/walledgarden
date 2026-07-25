import { Button } from "@/components";
import { WINDOW_DEFINITIONS } from "@/constants/windows";
import { useDesktopState, useWindowState } from "@/hooks";
import { findById } from "@/utils/collection-utils";

interface TaskBarButtonProps {
    id: string;
}

const TaskBarButton: React.FC<TaskBarButtonProps> = (props) => {
    const { id } = props;
    const { activeWindowId } = useDesktopState();
    const title = findById(WINDOW_DEFINITIONS, id)?.title;
    const { activate, toggleMinimized } = useWindowState(id);
    if (title === undefined) {
        return;
    }

    const isActive = id === activeWindowId;

    const handleClick = () => {
        if (isActive) {
            toggleMinimized();
        } else {
            activate();
        }
    };

    return (
        <Button
            active={isActive}
            className="task-bar"
            onClick={handleClick}>
            <span style={{ minWidth: 0 }}>{title}</span>
        </Button>
    );
};

export { TaskBarButton };
