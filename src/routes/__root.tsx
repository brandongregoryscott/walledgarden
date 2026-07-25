import {
    createRootRoute,
    HeadContent,
    Outlet,
    Scripts,
} from "@tanstack/react-router";
import { ApplicationLayout } from "@/components/layouts/application-layout";
import "@/styles/globals.css";
import "@/styles/98.css";
import "@/styles/98-extended.css";

const RootComponent: React.FC = () => {
    return (
        <html lang="en">
            <head>
                <HeadContent />
            </head>
            <body>
                <ApplicationLayout>
                    <Outlet />
                </ApplicationLayout>
                <Scripts />
            </body>
        </html>
    );
};

const Route = createRootRoute({
    component: RootComponent,
    head: () => ({
        links: [
            {
                href: "/favicon.ico",
                rel: "icon",
                type: "image/x-icon",
            },
        ],
        meta: [
            {
                charSet: "utf-8",
            },
            {
                content: "width=device-width, initial-scale=1",
                name: "viewport",
            },
            {
                title: "walled garden",
            },
        ],
    }),
});

export { Route };
