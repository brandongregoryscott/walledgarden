import type { Dimensions, Position } from "@/types";

interface WindowState extends Position, Partial<Dimensions> {
    maximized: boolean;
    minimized: boolean;
}

export type { WindowState };
