import { MEDIA_PLAYER, WINDOW_DEFINITIONS } from "@/constants/windows";
import type { Dimensions, Position, WindowState } from "@/types";
import { findById } from "@/utils/collection-utils";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";

interface DesktopState {
    activeWindowId: string | undefined;
    windows: {
        [id: string]: WindowState;
    };
}

const initialState: DesktopState = {
    activeWindowId: MEDIA_PLAYER.id,
    windows: {
        [MEDIA_PLAYER.id]: MEDIA_PLAYER.defaultState,
    },
};

const desktopSlice = createSlice({
    name: "desktop",
    initialState,
    reducers: {
        setActiveWindowAction: (
            state,
            action: PayloadAction<{ id: string }>
        ) => {
            const { id } = action.payload;
            const windowState = findByIdOrDefault(id, state);

            windowState.minimized = false;
            state.windows = { ...state.windows, [id]: windowState };
            state.activeWindowId = id;
        },
        clearActiveWindowAction: (state) => {
            state.activeWindowId = undefined;
        },
        setMinimizedAction: (
            state,
            action: PayloadAction<{ id: string; minimized: boolean }>
        ) => {
            const { id, minimized } = action.payload;
            const windowState = findByIdOrDefault(id, state);

            windowState.minimized = minimized;
            if (state.activeWindowId === id && minimized) {
                state.activeWindowId = undefined;
            }
            if (!minimized) {
                state.activeWindowId = id;
            }
            state.windows = { ...state.windows, [id]: windowState };
        },
        toggleMinimizedAction: (
            state,
            action: PayloadAction<{ id: string }>
        ) => {
            const { id } = action.payload;
            const windowState = findByIdOrDefault(id, state);

            const minimized = !windowState.minimized;
            windowState.minimized = minimized;
            if (state.activeWindowId === id && minimized) {
                state.activeWindowId = undefined;
            }
            if (!minimized) {
                state.activeWindowId = id;
            }
            state.windows = { ...state.windows, [id]: windowState };
        },
        setMaximizedAction: (
            state,
            action: PayloadAction<{ id: string; maximized: boolean }>
        ) => {
            const { id, maximized } = action.payload;
            const windowState = findByIdOrDefault(id, state);

            windowState.maximized = maximized;
            state.windows = { ...state.windows, [id]: windowState };
        },
        toggleMaximizedAction: (
            state,
            action: PayloadAction<{ id: string }>
        ) => {
            const { id } = action.payload;
            const windowState = findByIdOrDefault(id, state);
            windowState.maximized = !windowState.maximized;
            state.activeWindowId = id;
            state.windows = { ...state.windows, [id]: windowState };
        },
        setWindowPositionAction: (
            state,
            action: PayloadAction<{ id: string; position: Position }>
        ) => {
            const { id, position } = action.payload;
            const windowState = findByIdOrDefault(id, state);
            if (windowState.maximized) {
                return;
            }

            windowState.x = position.x;
            windowState.y = position.y;
            state.windows = { ...state.windows, [id]: windowState };
        },
        setWindowSizeAction: (
            state,
            action: PayloadAction<{ id: string; size: Dimensions }>
        ) => {
            const { id, size } = action.payload;
            const windowState = findByIdOrDefault(id, state);
            if (windowState.maximized) {
                return;
            }

            windowState.width = size.width;
            windowState.height = size.height;
            state.windows = { ...state.windows, [id]: windowState };
        },
        closeWindowAction: (state, action: PayloadAction<{ id: string }>) => {
            const { id } = action.payload;
            if (!(id in state.windows)) {
                return;
            }

            delete state.windows[id];
        },
        openWindowAction: (state, action: PayloadAction<{ id: string }>) => {
            const { id } = action.payload;

            const windowState: undefined | WindowState = state.windows[id];
            if (windowState !== undefined) {
                state.windows[id].minimized = false;
                state.activeWindowId = id;
                return;
            }

            const defaultWindow = findById(
                WINDOW_DEFINITIONS,
                id
            )?.defaultState;

            if (defaultWindow === undefined) {
                return;
            }

            state.windows[id] = defaultWindow;
            state.activeWindowId = id;
        },
    },
});

const findByIdOrDefault = (id: string, state: DesktopState): WindowState => {
    let windowState: undefined | WindowState = state.windows[id];
    if (windowState === undefined) {
        windowState = cloneDeep(findById(WINDOW_DEFINITIONS, id)?.defaultState);
    }

    return windowState as WindowState;
};

const {
    clearActiveWindowAction,
    setMinimizedAction,
    setActiveWindowAction,
    setWindowPositionAction,
    closeWindowAction,
    openWindowAction,
    toggleMaximizedAction,
    setWindowSizeAction,
    toggleMinimizedAction,
    setMaximizedAction,
} = desktopSlice.actions;

export type { DesktopState };
export {
    clearActiveWindowAction,
    closeWindowAction,
    desktopSlice,
    openWindowAction,
    setActiveWindowAction,
    setMaximizedAction,
    setMinimizedAction,
    setWindowPositionAction,
    setWindowSizeAction,
    toggleMaximizedAction,
    toggleMinimizedAction,
};
