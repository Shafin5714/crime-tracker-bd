import { describe, it, expect } from 'vitest'
import mapReducer, { 
  setCenter, 
  setZoom, 
  toggleCrimeType, 
  resetMap,
  CrimeType,
  CrimeStatus
} from '@/store/slices/mapSlice'

describe('map slice', () => {
  const initialState = {
    viewport: {
      center: [23.8103, 90.4125] as [number, number],
      zoom: 12,
      bounds: null,
    },
    filters: {
      crimeTypes: [] as CrimeType[],
      severities: [],
      status: ["VERIFIED"] as CrimeStatus[],
      startDate: null,
      endDate: null,
      radius: null,
    },
    selectedCrimeId: null,
    userLocation: null,
    isLocating: false,
    showHeatmap: false,
    showClusters: true,
  }

  it('should handle setCenter', () => {
    const newCenter: [number, number] = [23.7, 90.4]
    const state = mapReducer(initialState, setCenter(newCenter))
    expect(state.viewport.center).toEqual(newCenter)
  })

  it('should handle setZoom', () => {
    const state = mapReducer(initialState, setZoom(15))
    expect(state.viewport.zoom).toBe(15)
  })

  it('should handle toggleCrimeType', () => {
    // Add type
    const state = mapReducer(initialState, toggleCrimeType('THEFT'))
    expect(state.filters.crimeTypes).toContain('THEFT')
    
    // Remove type
    const state2 = mapReducer(state, toggleCrimeType('THEFT'))
    expect(state2.filters.crimeTypes).not.toContain('THEFT')
  })

  it('should handle resetMap', () => {
    const modifiedState = {
      ...initialState,
      viewport: { ...initialState.viewport, zoom: 18 },
      selectedCrimeId: 'test-id'
    }
    const state = mapReducer(modifiedState, resetMap())
    expect(state).toEqual(initialState)
  })
})
