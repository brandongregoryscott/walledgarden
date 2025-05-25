import { splitBoxProps } from "@/utils/box-utils";
import type { JSX, Ref } from "react";
import { createElement, forwardRef } from "react";
import { useCss } from "react-use";

type Without<T, K> = Pick<T, Exclude<keyof T, K>>;

type PropsOf<
    E extends
        | keyof JSX.IntrinsicElements
        | React.JSXElementConstructor<unknown>,
> = JSX.LibraryManagedAttributes<E, React.ComponentPropsWithRef<E>>;

type BoxProps<E extends React.ElementType> = BoxOwnProps<E> &
    Without<PropsOf<E>, keyof BoxOwnProps>;

type BoxOwnProps<
    E extends React.ElementType = React.ElementType,
    P = object,
> = {
    /**
     * Replaces the underlying element
     */
    as?: E;
} & Without<React.CSSProperties, keyof P>;

const Box = forwardRef(
    <E extends React.ElementType>(props: BoxProps<E>, ref: Ref<E>) => {
        const { as = "div", children, ...rest } = props;
        const { matchedProps: cssProperties, remainingProps } =
            splitBoxProps(rest);
        const cssClassName = useCss(cssProperties);

        const className =
            "className" in remainingProps &&
            typeof remainingProps.className === "string"
                ? `${remainingProps.className} ${cssClassName}`
                : cssClassName;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- We don't really care what `remainingProps` is here, we just want to attach the prop
        (remainingProps as any).className = className;

        if (ref) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- We don't really care what `remainingProps` is here, we just want to attach the prop
            (remainingProps as any).ref = ref;
        }

        return createElement(as, remainingProps, children);
    }
) as <E extends React.ElementType = "div">(props: BoxProps<E>) => JSX.Element;

/* @ts-expect-error -- We should add a display name for debugging, but the cast above clobbers the typing */
Box.displayName = "Box";

export type { BoxProps };
export { Box };
