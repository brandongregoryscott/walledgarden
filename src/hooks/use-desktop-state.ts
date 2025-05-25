import { useAppDispatch, useAppSelector } from "@/hooks";
import { clearActiveWindowAction } from "@/store";
import { useCallback } from "react";

const useDesktopState = () => {
    const state = useAppSelector((state) => state.desktop);
    const dispatch = useAppDispatch();

    const clearActiveWindow = useCallback(
        function clearActiveWindow() {
            dispatch(clearActiveWindowAction());
        },
        [dispatch]
    );

    return { ...state, clearActiveWindow };
};

export { useDesktopState };
