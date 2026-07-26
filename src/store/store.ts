import { MEDIA_PLAYER, WINDOW_DEFINITIONS } from "@/constants/windows";
import type { Dimensions, Position, WindowState } from "@/types";
import { findById } from "@/utils/collection-utils";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface MinimizeAnimationState {
    windowId: string;
    fromRect: { x: number; y: number; width: number; height: number };
    toRect: { x: number; y: number; width: number; height: number };
    direction: "minimize" | "restore";
}

interface DesktopStore {
    activeWindowId: string | undefined;
    clearActiveWindow: () => void;
    closeWindow: (id: string) => void;
    minimizeAnimation: MinimizeAnimationState | null;
    openWindow: (id: string) => void;
    setActiveWindow: (id: string) => void;
    setMaximized: (id: string, maximized: boolean) => void;
    setMinimizeAnimation: (animation: MinimizeAnimationState | null) => void;
    setMinimized: (id: string, minimized: boolean) => void;
    setWindowPosition: (id: string, position: Position) => void;
    setWindowSize: (id: string, size: Dimensions) => void;
    toggleMaximized: (id: string) => void;
    toggleMinimized: (id: string) => void;
    windows: Record<string, WindowState>;
}

const store = create<DesktopStore>()(
    immer((set) => ({
        activeWindowId: MEDIA_PLAYER.id,
        minimizeAnimation: null,
        windows: {
            [MEDIA_PLAYER.id]: MEDIA_PLAYER.defaultState,
        },

        clearActiveWindow: () =>
            set((state) => {
                state.activeWindowId = undefined;
            }),

        closeWindow: (id) =>
            set((state) => {
                if (!(id in state.windows)) {
                    return;
                }
                delete state.windows[id];
            }),

        openWindow: (id) =>
            set((state) => {
                const existing = state.windows[id];
                if (existing !== undefined) {
                    existing.minimized = false;
                    state.activeWindowId = id;
                    return;
                }

                const definition = findById(WINDOW_DEFINITIONS, id);
                if (definition?.defaultState === undefined) {
                    return;
                }

                state.windows[id] = { ...definition.defaultState };
                state.activeWindowId = id;
            }),

        setActiveWindow: (id) =>
            set((state) => {
                const windowState = ensureWindow(id, state);
                windowState.minimized = false;
                state.activeWindowId = id;
            }),

        setMaximized: (id, maximized) =>
            set((state) => {
                ensureWindow(id, state).maximized = maximized;
            }),

        setMinimizeAnimation: (animation) =>
            set((state) => {
                state.minimizeAnimation = animation;
            }),

        setMinimized: (id, minimized) =>
            set((state) => {
                ensureWindow(id, state).minimized = minimized;
                if (state.activeWindowId === id && minimized) {
                    state.activeWindowId = undefined;
                }
                if (!minimized) {
                    state.activeWindowId = id;
                }
            }),

        setWindowPosition: (id, position) =>
            set((state) => {
                const windowState = ensureWindow(id, state);
                if (windowState.maximized) {
                    return;
                }
                windowState.x = position.x;
                windowState.y = position.y;
            }),

        setWindowSize: (id, size) =>
            set((state) => {
                const windowState = ensureWindow(id, state);
                if (windowState.maximized) {
                    return;
                }
                windowState.width = size.width;
                windowState.height = size.height;
            }),

        toggleMaximized: (id) =>
            set((state) => {
                const windowState = ensureWindow(id, state);
                windowState.maximized = !windowState.maximized;
                state.activeWindowId = id;
            }),

        toggleMinimized: (id) =>
            set((state) => {
                const windowState = ensureWindow(id, state);
                const minimized = !windowState.minimized;
                windowState.minimized = minimized;
                if (state.activeWindowId === id && minimized) {
                    state.activeWindowId = undefined;
                }
                if (!minimized) {
                    state.activeWindowId = id;
                }
            }),
    }))
);

function ensureWindow(id: string, state: DesktopStore): WindowState {
    if (state.windows[id] === undefined) {
        const definition = findById(WINDOW_DEFINITIONS, id);
        state.windows[id] = { ...definition!.defaultState };
    }
    return state.windows[id];
}

const useStore = store;

export { store, useStore };
export type { DesktopStore, MinimizeAnimationState };
