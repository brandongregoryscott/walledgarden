import type { RootState } from "@/store";
import { useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { useAppSelector };
