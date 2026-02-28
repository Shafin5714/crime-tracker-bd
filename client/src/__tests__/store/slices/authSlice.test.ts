import { describe, it, expect } from 'vitest'
import authReducer, { 
  setCredentials, 
  updateUser, 
  logout, 
  selectIsAuthenticated, 
  selectCurrentUser 
} from '@/store/slices/authSlice'
import { UserRole, User } from '@/types/api.types'
import type { RootState } from '@/store'

describe('auth slice', () => {
  const initialState = {
    user: null,
    accessToken: null,
    refreshToken: null,
  }

  const mockUser: User = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: UserRole.USER,
    isBanned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('should handle setCredentials', () => {
    const payload = {
      user: mockUser,
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    }
    const state = authReducer(initialState, setCredentials(payload))
    expect(state.user).toEqual(mockUser)
    expect(state.accessToken).toBe('access-token')
  })

  it('should handle updateUser', () => {
    const stateWithUser = { ...initialState, user: mockUser }
    const state = authReducer(stateWithUser, updateUser({ name: 'New Name' }))
    expect(state.user?.name).toBe('New Name')
    expect(state.user?.email).toBe(mockUser.email)
  })

  it('should handle logout', () => {
    const stateWithUser = { 
      user: mockUser, 
      accessToken: 'token', 
      refreshToken: 'token' 
    }
    const state = authReducer(stateWithUser, logout())
    expect(state).toEqual(initialState)
  })

  describe('selectors', () => {
    const rootState: RootState = {
      auth: {
        user: mockUser,
        accessToken: 'token',
        refreshToken: 'token',
        _persist: { version: -1, rehydrated: true }
      },
      ui: {
        isSidebarOpen: true,
        isSidebarCollapsed: false,
        activeModal: null,
        theme: 'light',
        _persist: { version: -1, rehydrated: true }
      },
      map: {
        viewport: { center: [23.8, 90.4], zoom: 12, bounds: null },
        filters: { crimeTypes: [], severities: [], status: [], startDate: null, endDate: null, radius: null },
        selectedCrimeId: null,
        userLocation: null,
        isLocating: false,
        showHeatmap: false,
        showClusters: true
      },
    }

    it('selectIsAuthenticated should return true if user and token exist', () => {
      expect(selectIsAuthenticated(rootState)).toBe(true)
    })

    it('selectCurrentUser should return the user', () => {
      expect(selectCurrentUser(rootState)).toEqual(mockUser)
    })
  })
})
