import { describe, it, expect } from 'vitest'
import { app } from './app'

describe('CORS', () => {
  it('autorise Nuxt (localhost:3001)', async () => {
    const res = await app.request('/wishlist', {
      headers: { Origin: 'http://localhost:3001' },
    })
    expect(res.headers.get('access-control-allow-origin')).toBe(
      'http://localhost:3001',
    )
  })

  it('répond à la requête préliminaire OPTIONS', async () => {
    const res = await app.request('/wishlist', {
      method: 'OPTIONS',
      headers: {
        Origin: 'http://localhost:3001',
        'Access-Control-Request-Method': 'POST',
      },
    })
    expect(res.status).toBeLessThan(300)
  })
})
