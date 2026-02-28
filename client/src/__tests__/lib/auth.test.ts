import { describe, it, expect } from 'vitest'
import { hasPermission, getRoleLabel, getAssignableRoles } from '@/lib/auth'
import { UserRole } from '@/types/api.types'

describe('auth utility', () => {
  describe('hasPermission', () => {
    it('returns true if user role is equal to required role', () => {
      expect(hasPermission(UserRole.ADMIN, UserRole.ADMIN)).toBe(true)
    })

    it('returns true if user role is higher than required role', () => {
      expect(hasPermission(UserRole.SUPER_ADMIN, UserRole.ADMIN)).toBe(true)
    })

    it('returns false if user role is lower than required role', () => {
      expect(hasPermission(UserRole.USER, UserRole.ADMIN)).toBe(false)
    })

    it('returns false if user role is undefined', () => {
      expect(hasPermission(undefined, UserRole.USER)).toBe(false)
    })
  })

  describe('getRoleLabel', () => {
    it('returns human-readable labels for roles', () => {
      expect(getRoleLabel(UserRole.USER)).toBe('User')
      expect(getRoleLabel(UserRole.MODERATOR)).toBe('Moderator')
      expect(getRoleLabel(UserRole.ADMIN)).toBe('Admin')
      expect(getRoleLabel(UserRole.SUPER_ADMIN)).toBe('Super Admin')
    })
  })

  describe('getAssignableRoles', () => {
    it('returns lower roles that can be assigned by a specific role', () => {
      const adminRoles = getAssignableRoles(UserRole.ADMIN)
      expect(adminRoles).toContain(UserRole.USER)
      expect(adminRoles).toContain(UserRole.MODERATOR)
      expect(adminRoles).not.toContain(UserRole.ADMIN)
      expect(adminRoles).not.toContain(UserRole.SUPER_ADMIN)
    })

    it('returns no roles for a standard user', () => {
      expect(getAssignableRoles(UserRole.USER)).toEqual([])
    })
  })
})
