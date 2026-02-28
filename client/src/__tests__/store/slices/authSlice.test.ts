import { describe, it, expect } from 'vitest'
import authReducer, { 
  setCredentials, 
  updateUser, 
  logout, 
  selectIsAuthenticated, 
  selectCurrentUser 
} from '@/store/slices/authSlice'
import { UserRole } from '@/types/api.types'

describe('auth slice', () => {
  const initialState = {
    user: null,
    accessToken: null,
    refreshToken: null,
  }

  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: UserRole.USER,
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
    const rootState = {
      auth: {
        user: mockUser,
        accessToken: 'token',
        refreshToken: 'token',
      },
      ui: {} as any,
      map: {} as any,
    }

    it('selectIsAuthenticated should return true if user and token exist', () => {
      expect(selectIsAuthenticated(rootState as any)).toBe(true)
    })

    it('selectCurrentUser should return the user', () => {
      expect(selectCurrentUser(rootState as any)).toEqual(mockUser)
    })
  })
})
