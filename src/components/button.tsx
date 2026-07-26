import { cn } from "@/utils/classnames";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";

type ButtonProps = {
    /**
     * Whether the button is displayed in an active state.
     */
    active?: boolean;
} & HTMLAttributes<HTMLButtonElement>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const { children, active, className, ...rest } = props;

    return (
        <button ref={ref} className={cn(className, { active })} {...rest}>
            {children}
        </button>
    );
});

Button.displayName = "Button";

export { Button };
