import type { FileRouteTypes } from "@/generated/route-tree";

type RoutePath = FileRouteTypes["to"];

// Note: These routes are strongly typed based on the generated route tree, but cannot reference
// the `Route` objects directly, or they will be `undefined` at runtime due to a circular dependency.
const Routes = {
    Home: "/",
} as const satisfies Record<string, RoutePath>;

export { Routes };
export type { RoutePath };
