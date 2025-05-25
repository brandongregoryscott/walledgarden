import { Clock, Hr } from "@/components";
import type { PropsWithChildren } from "react";

type TaskBarProps = PropsWithChildren;

const TaskBar: React.FC<TaskBarProps> = (props) => {
    const { children } = props;
    return (
        <div
            className="task-bar"
            style={{
                height: 30,
                width: "100%",
                display: "flex",
                alignItems: "center",
                backgroundColor: "var(--surface)",
                boxShadow:
                    "inset 1px 1px var(--surface), inset 2px 2px var(--button-highlight)",
                position: "fixed",
                bottom: 0,
                padding: "0 2px",
            }}>
            {children}
            <div
                style={{
                    display: "flex",
                    height: "100%",
                    width: "100%",
                    justifyContent: "flex-end",
                    alignItems: "center",
                }}>
                <Hr vertical={true} />
                <Clock />
            </div>
        </div>
    );
};

export { TaskBar };
