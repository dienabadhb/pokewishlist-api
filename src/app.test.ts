import { describe, it, expect } from 'vitest'
import { app } from './app'

describe('GET /health', () => {
  it('renvoie 200 et { status: "ok" }', async () => {
    const res = await app.request('/health')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ status: 'ok' })
  })
})
