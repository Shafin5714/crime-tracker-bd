import { describe, it, expect, vi, beforeEach } from 'vitest'
import { showSuccess, showError, showApiError, toast } from '@/lib/toast'

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
    promise: vi.fn(),
  }
}))

describe('toast utility', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls toast.success with the correct message', () => {
    showSuccess('Success message')
    expect(toast.success).toHaveBeenCalledWith('Success message')
  })

  it('calls toast.error with the correct message', () => {
    showError('Error message')
    expect(toast.error).toHaveBeenCalledWith('Error message')
  })

  describe('showApiError', () => {
    it('shows message from Error object', () => {
      showApiError(new Error('API failed'))
      expect(toast.error).toHaveBeenCalledWith('API failed')
    })

    it('shows message from object with message property', () => {
      showApiError({ message: 'Custom error' })
      expect(toast.error).toHaveBeenCalledWith('Custom error')
    })

    it('shows default message for unknown errors', () => {
      showApiError('something random')
      expect(toast.error).toHaveBeenCalledWith('An unexpected error occurred')
    })
  })
})
