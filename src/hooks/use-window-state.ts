"use client";
import { TASKBAR_HEIGHT } from "@/constants/layout";
import { useBreakpoint } from "@/hooks";
import { store, useStore } from "@/store";
import type { Dimensions, Position, WindowState } from "@/types";
import { useCallback, useMemo } from "react";

const useWindowState = (id: string) => {
    const _state: undefined | WindowState = useStore(
        (state) => state.windows[id]
    );
    const breakpoint = useBreakpoint();

    const open = useCallback(
        function open() {
            store.getState().openWindow(id);
        },
        [id]
    );

    const activate = useCallback(
        function activate() {
            store.getState().setActiveWindow(id);
        },
        [id]
    );

    const minimize = useCallback(
        function minimize() {
            store.getState().setMinimized(id, true);
        },
        [id]
    );

    const maximize = useCallback(
        function maximize() {
            store.getState().setMaximized(id, true);
        },
        [id]
    );

    const toggleMaximized = useCallback(
        function toggleMaximized() {
            store.getState().toggleMaximized(id);
        },
        [id]
    );

    const unminimize = useCallback(
        function unminimize() {
            store.getState().setMinimized(id, false);
        },
        [id]
    );

    const toggleMinimized = useCallback(
        function toggleMinimized() {
            store.getState().toggleMinimized(id);
        },
        [id]
    );

    const close = useCallback(
        function close() {
            store.getState().closeWindow(id);
        },
        [id]
    );

    const setPosition = useCallback(
        function setPosition(position: Position) {
            store.getState().setWindowPosition(id, position);
        },
        [id]
    );

    const setSize = useCallback(
        function setSize(size: Dimensions) {
            store.getState().setWindowSize(id, size);
        },
        [id]
    );

    const state: undefined | WindowState = useMemo(() => {
        if (_state === undefined) {
            return undefined;
        }

        if (_state.maximized) {
            return {
                ..._state,
                x: 0,
                y: 0,
                width: window.innerWidth,
                height: window.innerHeight - TASKBAR_HEIGHT,
            };
        }

        return _state;
    }, [_state]);

    if (breakpoint === "mobile" && _state !== undefined && !_state.maximized) {
        maximize();
    }

    return {
        state,
        open,
        close,
        activate,
        minimize,
        toggleMaximized,
        toggleMinimized,
        maximize,
        setPosition,
        setSize,
        unminimize,
    };
};

export { useWindowState };
