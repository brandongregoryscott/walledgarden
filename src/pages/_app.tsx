import "@/styles/globals.css";
import "@/styles/98.css";
import "@/styles/98-extended.css";
import type { AppProps } from "next/app";
import { ApplicationLayout } from "@/components/layouts/application-layout";

const App: React.FC<AppProps> = (props) => {
    const { Component, pageProps } = props;
    return (
        <ApplicationLayout>
            <Component {...pageProps} />
        </ApplicationLayout>
    );
};

// eslint-disable-next-line collation/no-default-export -- NextJS pages need to be default exported
export default App;
