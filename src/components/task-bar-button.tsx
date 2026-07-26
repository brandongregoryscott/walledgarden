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
            // Minimize: capture rects, dispatch animation, then minimize
            const windowEl = document.getElementById(id);
            const windowRect = windowEl?.getBoundingClientRect();
            const buttonRect = buttonRef.current?.getBoundingClientRect();

            if (windowRect && buttonRect) {
                store.getState().setMinimizeAnimation({
                    windowId: id,
                    fromRect: {
                        x: windowRect.x,
                        y: windowRect.y,
                        width: windowRect.width,
                        height: windowRect.height,
                    },
                    toRect: {
                        x: buttonRect.x,
                        y: buttonRect.y,
                        width: buttonRect.width,
                        height: buttonRect.height,
                    },
                    direction: "minimize",
                });
            }

            toggleMinimized();
        } else {
            const windowState = store.getState().windows[id];
            if (windowState?.minimized) {
                // Restore: capture button rect, compute target, dispatch animation
                const buttonRect = buttonRef.current?.getBoundingClientRect();

                if (windowState && buttonRect) {
                    const targetRect = windowState.maximized
                        ? {
                              x: 0,
                              y: 0,
                              width: window.innerWidth,
                              height: window.innerHeight - 30,
                          }
                        : {
                              x: windowState.x!,
                              y: windowState.y!,
                              width: windowState.width!,
                              height: windowState.height!,
                          };

                    store.getState().setMinimizeAnimation({
                        windowId: id,
                        fromRect: {
                            x: buttonRect.x,
                            y: buttonRect.y,
                            width: buttonRect.width,
                            height: buttonRect.height,
                        },
                        toRect: targetRect,
                        direction: "restore",
                    });
                    // MinimizeAnimator.onfinish calls setMinimized(false)
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
