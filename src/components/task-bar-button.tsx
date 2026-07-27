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
    if (title === undefined) {
        return;
    }

    const isActive = id === activeWindowId;

    const handleClick = useCallback(() => {
        if (isActive) {
            // Minimize: let the window animate itself, then toggle the store.
            const windowEl = document.getElementById(id);
            windowEl?.dispatchEvent(new CustomEvent("minimize-window"));
            toggleMinimized();
        } else {
            const windowState = store.getState().windows[id];
            if (windowState?.minimized) {
                // Restore: unminimize in the store, then tell the window to
                // animate in from the button position.
                const buttonRect =
                    buttonRef.current?.getBoundingClientRect();

                if (buttonRect) {
                    store.getState().setMinimized(id, false);
                    const windowEl = document.getElementById(id);
                    windowEl?.dispatchEvent(
                        new CustomEvent("restore-window", {
                            detail: { buttonRect },
                        })
                    );
                } else {
                    activate();
                }
            } else {
                activate();
            }
        }
    }, [isActive, id, toggleMinimized, activate]);

    return (
        <Button
            ref={buttonRef}
            active={isActive}
            className="task-bar"
            data-taskbar-window={id}
            onClick={handleClick}>
            <span style={{ minWidth: 0 }}>{title}</span>
        </Button>
    );
};

export { TaskBarButton };
