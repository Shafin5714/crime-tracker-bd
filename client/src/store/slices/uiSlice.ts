import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ModalState {
  isOpen: boolean;
  data?: unknown;
}

export interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  theme: "light" | "dark" | "system";
  modals: {
    confirmDelete: ModalState;
    crimeDetails: ModalState;
    reportForm: ModalState;
  };
}

const initialState: UIState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  mobileNavOpen: false,
  theme: "dark",
  modals: {
    confirmDelete: { isOpen: false },
    crimeDetails: { isOpen: false },
    reportForm: { isOpen: false },
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setMobileNavOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileNavOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<UIState["theme"]>) => {
      state.theme = action.payload;
    },
    openModal: (
      state,
      action: PayloadAction<{ modal: keyof UIState["modals"]; data?: unknown }>
    ) => {
      state.modals[action.payload.modal] = {
        isOpen: true,
        data: action.payload.data,
      };
    },
    closeModal: (state, action: PayloadAction<keyof UIState["modals"]>) => {
      state.modals[action.payload] = { isOpen: false };
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((key) => {
        state.modals[key as keyof UIState["modals"]] = { isOpen: false };
      });
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapsed,
  setSidebarCollapsed,
  setMobileNavOpen,
  setTheme,
  openModal,
  closeModal,
  closeAllModals,
} = uiSlice.actions;

export default uiSlice.reducer;
