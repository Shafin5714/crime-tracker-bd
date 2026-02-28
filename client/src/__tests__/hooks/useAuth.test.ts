import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@/test-utils/render'
import { useAuth } from '@/hooks/useAuth'
import { server } from '@/test-utils/mocks/server'
import { http, HttpResponse } from 'msw'
import { UserRole } from '@/types/api.types'

describe('useAuth hook', () => {
  it('should return initial unauthenticated state', () => {
    const { result } = renderHook(() => useAuth())
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBe(null)
  })

  it('should handle successful login', async () => {
    const { result } = renderHook(() => useAuth())
    
    await result.current.login({ email: 'test@example.com', password: 'password' })

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true)
    })
    
    expect(result.current.user?.email).toBe('test@example.com')
  })

  it('should handle logout', async () => {
    // Start with authenticated state
    const preloadedState = {
      auth: {
        user: { id: '1', email: 'test@example.com', name: 'Test', role: UserRole.USER as any },
        accessToken: 'token',
        refreshToken: 'token',
      }
    }
    
    const { result } = renderHook(() => useAuth(), { preloadedState })
    expect(result.current.isAuthenticated).toBe(true)

    // Mock logout endpoint
    server.use(
      http.post('*/auth/logout', () => {
        return new HttpResponse(null, { status: 200 })
      })
    )

    await result.current.logout()

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false)
    })
  })

  it('should correctly check roles with hasRole', () => {
    const preloadedState = {
      auth: {
        user: { id: '1', email: 'admin@example.com', name: 'Admin', role: UserRole.ADMIN as any },
        accessToken: 'token',
        refreshToken: 'token',
      }
    }
    
    const { result } = renderHook(() => useAuth(), { preloadedState })
    
    expect(result.current.hasRole(UserRole.USER)).toBe(true)
    expect(result.current.hasRole(UserRole.ADMIN)).toBe(true)
    expect(result.current.hasRole(UserRole.SUPER_ADMIN)).toBe(false)
  })
})
