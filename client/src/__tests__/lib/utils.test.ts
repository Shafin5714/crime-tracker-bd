import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn utility', () => {
  it('combines class names', () => {
    expect(cn('btn', 'btn-primary')).toBe('btn btn-primary')
  })

  it('handles conditional class names', () => {
    expect(cn('btn', true && 'active', false && 'hidden')).toBe('btn active')
  })

  it('merges tailwind classes correctly', () => {
    // p-2 and p-4 should merge to p-4 (last one wins in tailwind-merge)
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('handles empty inputs', () => {
    expect(cn()).toBe('')
  })
})
