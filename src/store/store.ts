import { desktopSlice } from "@/store/desktop-slice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    [desktopSlice.reducerPath]: desktopSlice.reducer,
});

const store = configureStore({
    reducer: rootReducer,
});

type AppStore = typeof store;
type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export type { AppDispatch, AppStore, RootState };
export { rootReducer, store };
