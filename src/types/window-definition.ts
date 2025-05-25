import type { WindowState } from "@/types";

interface WindowDefinition {
    /**
     * Default state for the window describing size/position.
     */
    defaultState: WindowState;

    /**
     * Unique identifier for the window, used for determining
     *
     */
    id: string;

    /**
     * Min height of the window
     */
    minHeight?: number;

    /**
     * Min width of the window
     */
    minWidth?: number;

    /**
     * Application route associated with the window. Not all windows need to map to a path,
     * but the path will be updated to reflect the active window if present.
     */
    path?: string;

    /**
     * Title for the title and task bars to display.
     */
    title: string;
}

export type { WindowDefinition };
