import { CSS_PROPERTIES } from "@/constants/css-properties";

interface SplitPropsResult<
    P extends Record<string, unknown>,
    K extends keyof P,
> {
    matchedProps: Pick<P, K>;
    remainingProps: Omit<P, K>;
}

const splitProps = <P extends Record<string, unknown>, K extends keyof P>(
    props: P,
    keys: K[] | readonly K[]
): SplitPropsResult<P, K> => {
    const matchedProps = {} as Pick<P, K>;
    const remainingProps = {} as P;
    const propKeys = Object.keys(props) as K[];

    propKeys.forEach((key) => {
        const propValue = props[key];
        if (keys.includes(key)) {
            matchedProps[key] = propValue;
            return;
        }

        remainingProps[key] = propValue;
    });

    return { matchedProps, remainingProps };
};

const splitBoxProps = <P extends Record<string, unknown>>(props: P) =>
    splitProps(props, CSS_PROPERTIES);

export { splitBoxProps };
