import { Button } from "@/components";
import { WINDOW_DEFINITIONS } from "@/constants/windows";
import { useDesktopState, useWindowState } from "@/hooks";
import { store } from "@/store";
import { findById } from "@/utils/collection-utils";
import { useCallback, useRef } from "react";

interface TaskBarButtonProps {
    id: string;
}

const TaskBarButton: React.FC<TaskBarButtonProps> = (props) => {
    const { id } = props;
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { activeWindowId } = useDesktopState();
    const title = findById(WINDOW_DEFINITIONS, id)?.title;
    const { activate, toggleMinimized } = useWindowState(id);
    const isActive = id === activeWindowId;

    const handleClick = useCallback(() => {
        if (isActive) {
            document
                .getElementById(id)
                ?.dispatchEvent(new CustomEvent("minimize-window"));
            toggleMinimized();
            return;
        }

        const windowState = store.getState().windows[id];
        if (!windowState?.minimized) {
            activate();
            return;
        }

        const buttonRect = buttonRef.current?.getBoundingClientRect();
        if (buttonRect == null) {
            activate();
            return;
        }

        store.getState().setMinimized(id, false);
        document.getElementById(id)?.dispatchEvent(
            new CustomEvent("restore-window", {
                detail: { buttonRect },
            })
        );
    }, [isActive, id, toggleMinimized, activate]);

    if (title === undefined) {
        return;
    }

    return (
        <Button
            active={isActive}
            className="task-bar"
            data-taskbar-window={id}
            onClick={handleClick}
            ref={buttonRef}>
            <span style={{ minWidth: 0 }}>{title}</span>
        </Button>
    );
};

export { TaskBarButton };
