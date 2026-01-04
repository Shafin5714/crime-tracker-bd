import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CrimeType =
  | "THEFT"
  | "ROBBERY"
  | "ASSAULT"
  | "MURDER"
  | "KIDNAPPING"
  | "FRAUD"
  | "VANDALISM"
  | "DRUG_OFFENSE"
  | "HARASSMENT"
  | "OTHER";

export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type CrimeStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface MapFilters {
  crimeTypes: CrimeType[];
  severities: Severity[];
  status: CrimeStatus[];
  startDate: string | null;
  endDate: string | null;
  radius: number | null; // in meters, null = no radius filter
}

export interface MapViewport {
  center: [number, number]; // [lat, lng]
  zoom: number;
  bounds: [[number, number], [number, number]] | null; // [[sw_lat, sw_lng], [ne_lat, ne_lng]]
}

export interface MapState {
  viewport: MapViewport;
  filters: MapFilters;
  selectedCrimeId: string | null;
  userLocation: [number, number] | null;
  isLocating: boolean;
  showHeatmap: boolean;
  showClusters: boolean;
}

// Default center: Dhaka, Bangladesh
const defaultCenter: [number, number] = [23.8103, 90.4125];
const defaultZoom = 12;

const initialState: MapState = {
  viewport: {
    center: defaultCenter,
    zoom: defaultZoom,
    bounds: null,
  },
  filters: {
    crimeTypes: [],
    severities: [],
    status: ["VERIFIED"],
    startDate: null,
    endDate: null,
    radius: null,
  },
  selectedCrimeId: null,
  userLocation: null,
  isLocating: false,
  showHeatmap: false,
  showClusters: true,
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setViewport: (state, action: PayloadAction<Partial<MapViewport>>) => {
      state.viewport = { ...state.viewport, ...action.payload };
    },
    setCenter: (state, action: PayloadAction<[number, number]>) => {
      state.viewport.center = action.payload;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.viewport.zoom = action.payload;
    },
    setBounds: (
      state,
      action: PayloadAction<[[number, number], [number, number]] | null>
    ) => {
      state.viewport.bounds = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<MapFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    toggleCrimeType: (state, action: PayloadAction<CrimeType>) => {
      const type = action.payload;
      const index = state.filters.crimeTypes.indexOf(type);
      if (index === -1) {
        state.filters.crimeTypes.push(type);
      } else {
        state.filters.crimeTypes.splice(index, 1);
      }
    },
    toggleSeverity: (state, action: PayloadAction<Severity>) => {
      const severity = action.payload;
      const index = state.filters.severities.indexOf(severity);
      if (index === -1) {
        state.filters.severities.push(severity);
      } else {
        state.filters.severities.splice(index, 1);
      }
    },
    setSelectedCrime: (state, action: PayloadAction<string | null>) => {
      state.selectedCrimeId = action.payload;
    },
    setUserLocation: (state, action: PayloadAction<[number, number] | null>) => {
      state.userLocation = action.payload;
      state.isLocating = false;
    },
    setIsLocating: (state, action: PayloadAction<boolean>) => {
      state.isLocating = action.payload;
    },
    toggleHeatmap: (state) => {
      state.showHeatmap = !state.showHeatmap;
    },
    toggleClusters: (state) => {
      state.showClusters = !state.showClusters;
    },
    setShowHeatmap: (state, action: PayloadAction<boolean>) => {
      state.showHeatmap = action.payload;
    },
    setShowClusters: (state, action: PayloadAction<boolean>) => {
      state.showClusters = action.payload;
    },
    resetMap: () => initialState,
  },
});

export const {
  setViewport,
  setCenter,
  setZoom,
  setBounds,
  setFilters,
  resetFilters,
  toggleCrimeType,
  toggleSeverity,
  setSelectedCrime,
  setUserLocation,
  setIsLocating,
  toggleHeatmap,
  toggleClusters,
  setShowHeatmap,
  setShowClusters,
  resetMap,
} = mapSlice.actions;

export default mapSlice.reducer;
