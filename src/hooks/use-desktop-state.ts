import { useStore } from "@/store";

const useDesktopState = () => {
    const activeWindowId = useStore((state) => state.activeWindowId);
    const windows = useStore((state) => state.windows);
    const clearActiveWindow = useStore((state) => state.clearActiveWindow);

    return { activeWindowId, windows, clearActiveWindow };
};

export { useDesktopState };
