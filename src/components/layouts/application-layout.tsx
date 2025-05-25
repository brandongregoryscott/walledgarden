import { store } from "@/store";
import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";

const ApplicationLayout: React.FC<PropsWithChildren> = (props) => {
    const { children } = props;
    return <Provider store={store}>{children}</Provider>;
};

export { ApplicationLayout };
