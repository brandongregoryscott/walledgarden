import dynamic from "next/dynamic";
import type { FunctionComponent, PropsWithChildren } from "react";

const _ClientOnly: FunctionComponent<PropsWithChildren> = ({ children }) => (
    <>{children}</>
);

/**
 * Utility component to force a component tree to render without attempting server-side rendering.
 * @see https://stackoverflow.com/a/76679943
 */
const ClientOnly = dynamic(() => Promise.resolve(_ClientOnly), {
    ssr: false,
});

ClientOnly.displayName = "ClientOnly";

export { ClientOnly };
