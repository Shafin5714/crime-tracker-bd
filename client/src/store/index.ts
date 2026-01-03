import { configureStore, createSlice } from "@reduxjs/toolkit";

// Placeholder auth slice - will be expanded later
// Using TanStack Query for server state, Redux for UI state only
const uiSlice = createSlice({
  name: "ui",
  initialState: {
    sidebarOpen: false,
    theme: "dark" as "light" | "dark",
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const { toggleSidebar, setTheme } = uiSlice.actions;

export const makeStore = () => {
  return configureStore({
    reducer: {
      ui: uiSlice.reducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

