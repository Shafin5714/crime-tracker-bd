import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@/test-utils/render'
import { useCrimes, useSubmitCrime } from '@/hooks/useCrimes'
import { server } from '@/test-utils/mocks/server'
import { http, HttpResponse } from 'msw'
import { CrimeType, Severity } from '@/types/api.types'

describe('useCrimes hook', () => {
  it('should fetch crimes and return data', async () => {
    const mockCrimes = [
      { id: '1', crimeType: CrimeType.THEFT, description: 'Test theft', severity: Severity.LOW },
    ]

    server.use(
      http.get('*/crimes', () => {
        return HttpResponse.json({
          data: mockCrimes,
          pagination: { page: 1, limit: 10, total: 1, totalPages: 1 }
        })
      })
    )

    const { result } = renderHook(() => useCrimes())

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.data).toEqual(mockCrimes)
  })

  it('should handle crime submission', async () => {
    const newCrime = {
      crimeType: CrimeType.ROBBERY,
      description: 'New robbery',
      severity: Severity.HIGH,
      latitude: 23.8,
      longitude: 90.4,
      address: 'Test Address',
      occurredAt: new Date().toISOString(),
    }

    server.use(
      http.post('*/crimes', () => {
        return HttpResponse.json({ 
          data: { id: 'new-123', ...newCrime } 
        })
      })
    )

    const { result } = renderHook(() => useSubmitCrime())

    let submittedData;
    await result.current.mutateAsync(newCrime as any).then(data => {
      submittedData = data;
    });

    expect(submittedData).toBeDefined();
    expect((submittedData as any).id).toBe('new-123');
  })
})
