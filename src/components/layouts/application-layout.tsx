import type { PropsWithChildren } from "react";

const ApplicationLayout: React.FC<PropsWithChildren> = (props) => {
    const { children } = props;
    return children;
};

export { ApplicationLayout };
