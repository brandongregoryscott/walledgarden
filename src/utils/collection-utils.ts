import type { Entity } from "@/types";

const findById = <T extends Entity>(items: T[], id: string | undefined) =>
    items.find((item) => item.id === id);

export { findById };
