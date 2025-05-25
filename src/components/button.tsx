import { cn } from "@/utils/classnames";
import type { HTMLAttributes } from "react";

type ButtonProps = {
    /**
     * Whether the button is displayed in an active state.
     */
    active?: boolean;
} & HTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = (props) => {
    const { children, active, className, ...rest } = props;

    return (
        <button className={cn(className, { active })} {...rest}>
            {children}
        </button>
    );
};

export { Button };
