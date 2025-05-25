import type { WindowDefinition } from "@/types";

const TEST_WINDOW_1: WindowDefinition = {
    id: "test-window-1",
    title: "Test Window 1",
    defaultState: {
        maximized: false,
        minimized: false,
        width: 300,
        height: 400,
        x: 100,
        y: 100,
    },
};

const TEST_WINDOW_2: WindowDefinition = {
    id: "test-window-2",
    title: "Test Window 2",
    defaultState: {
        maximized: false,
        minimized: false,
        width: 300,
        height: 400,
        x: 300,
        y: 100,
    },
};

const MEDIA_PLAYER: WindowDefinition = {
    id: "media-player",
    title: "Windows Media Player",
    minHeight: 400,
    minWidth: 400,
    defaultState: {
        maximized: false,
        minimized: false,
        x: 220,
        y: 220,
        width: 400,
        height: 400,
    },
};

const WINDOW_DEFINITIONS = [TEST_WINDOW_1, TEST_WINDOW_2, MEDIA_PLAYER];

export { MEDIA_PLAYER, TEST_WINDOW_1, TEST_WINDOW_2, WINDOW_DEFINITIONS };
