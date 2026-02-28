import { http, HttpResponse } from 'msw'

export const handlers = [
  // Auth handlers
  http.get('*/auth/me', () => {
    return HttpResponse.json({
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'USER',
      isBanned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }),

  http.post('*/auth/login', () => {
    return HttpResponse.json({
      user: {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
        createdAt: new Date().toISOString(),
      },
      accessToken: 'fake-access-token',
      refreshToken: 'fake-refresh-token',
    })
  }),

  // Crime handlers
  http.get('*/crimes', () => {
    return HttpResponse.json({
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    })
  }),
]
