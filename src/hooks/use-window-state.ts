"use client";
import { useAppDispatch, useAppSelector, useBreakpoint } from "@/hooks";
import {
    closeWindowAction,
    openWindowAction,
    setActiveWindowAction,
    setMaximizedAction,
    setMinimizedAction,
    setWindowPositionAction,
    setWindowSizeAction,
    toggleMaximizedAction,
    toggleMinimizedAction,
} from "@/store";
import type { Dimensions, Position, WindowState } from "@/types";
import { useCallback, useMemo } from "react";

const useWindowState = (id: string) => {
    const _state: undefined | WindowState = useAppSelector(
        (state) => state.desktop.windows[id]
    );
    const dispatch = useAppDispatch();
    const breakpoint = useBreakpoint();

    const open = useCallback(
        function open() {
            dispatch(openWindowAction({ id }));
        },
        [dispatch, id]
    );

    const activate = useCallback(
        function activate() {
            dispatch(setActiveWindowAction({ id }));
        },
        [dispatch, id]
    );

    const minimize = useCallback(
        function minimize() {
            dispatch(setMinimizedAction({ id, minimized: true }));
        },
        [dispatch, id]
    );

    const maximize = useCallback(
        function maximize() {
            dispatch(setMaximizedAction({ id, maximized: true }));
        },
        [dispatch, id]
    );

    const toggleMaximized = useCallback(
        function maximize() {
            dispatch(toggleMaximizedAction({ id }));
        },
        [dispatch, id]
    );

    const unminimize = useCallback(
        function unminimize() {
            dispatch(setMinimizedAction({ id, minimized: false }));
        },
        [dispatch, id]
    );

    const toggleMinimized = useCallback(
        function toggleMinimized() {
            dispatch(toggleMinimizedAction({ id }));
        },
        [dispatch, id]
    );

    const close = useCallback(
        function close() {
            dispatch(closeWindowAction({ id }));
        },
        [dispatch, id]
    );

    const setPosition = useCallback(
        function setPosition(position: Position) {
            dispatch(setWindowPositionAction({ id, position }));
        },
        [dispatch, id]
    );

    const setSize = useCallback(
        function setSize(size: Dimensions) {
            dispatch(setWindowSizeAction({ id, size }));
        },
        [dispatch, id]
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
                height: window.innerHeight - 30,
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
