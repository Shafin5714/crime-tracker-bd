import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@/test-utils/render'
import { useDebounce } from '@/hooks/useDebounce'

describe('useDebounce hook', () => {
  vi.useFakeTimers()

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('should update value after delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    // Update the value
    rerender({ value: 'updated', delay: 500 })
    
    // Should still be initial
    expect(result.current).toBe('initial')

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('updated')
  })

  it('should cancel previous timer if value changes again', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    rerender({ value: 'update1', delay: 500 })
    
    act(() => {
      vi.advanceTimersByTime(300)
    })

    rerender({ value: 'update2', delay: 500 })

    act(() => {
      vi.advanceTimersByTime(300)
    })
    
    // Total time 600ms, but only 300ms since last update
    expect(result.current).toBe('initial')

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(result.current).toBe('update2')
  })
})
