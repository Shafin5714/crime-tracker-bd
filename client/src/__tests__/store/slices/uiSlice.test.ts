import { describe, it, expect } from 'vitest'
import uiReducer, { 
  toggleSidebar, 
  setSidebarCollapsed, 
  openModal, 
  closeModal, 
  setTheme 
} from '@/store/slices/uiSlice'

describe('ui slice', () => {
  const initialState = {
    sidebarOpen: true,
    sidebarCollapsed: false,
    mobileNavOpen: false,
    theme: "dark" as const,
    modals: {
      confirmDelete: { isOpen: false },
      crimeDetails: { isOpen: false },
      reportForm: { isOpen: false },
    },
  }

  it('should handle toggleSidebar', () => {
    const state = uiReducer(initialState, toggleSidebar())
    expect(state.sidebarOpen).toBe(false)
    const state2 = uiReducer(state, toggleSidebar())
    expect(state2.sidebarOpen).toBe(true)
  })

  it('should handle setSidebarCollapsed', () => {
    const state = uiReducer(initialState, setSidebarCollapsed(true))
    expect(state.sidebarCollapsed).toBe(true)
  })

  it('should handle setTheme', () => {
    const state = uiReducer(initialState, setTheme('light'))
    expect(state.theme).toBe('light')
  })

  it('should handle openModal', () => {
    const state = uiReducer(initialState, openModal({ modal: 'confirmDelete', data: 'test-id' }))
    expect(state.modals.confirmDelete.isOpen).toBe(true)
    expect(state.modals.confirmDelete.data).toBe('test-id')
  })

  it('should handle closeModal', () => {
    const openState = {
      ...initialState,
      modals: { ...initialState.modals, confirmDelete: { isOpen: true, data: 'test' } }
    }
    const state = uiReducer(openState, closeModal('confirmDelete'))
    expect(state.modals.confirmDelete.isOpen).toBe(false)
    expect(state.modals.confirmDelete.data).toBeUndefined()
  })
})
