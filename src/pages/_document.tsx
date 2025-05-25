import { Html, Head, Main, NextScript } from "next/document";

function Document() {
    return (
        <Html lang="en">
            <Head />
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}

// eslint-disable-next-line collation/no-default-export -- NextJS pages need to be default exported
export default Document;
