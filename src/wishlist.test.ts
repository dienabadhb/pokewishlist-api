import { describe, it, expect, beforeEach } from 'vitest'
import { app } from './app'
import { resetWishlist } from './store'

const post = (body: unknown) =>
  app.request('/wishlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

beforeEach(() => {
  resetWishlist()
})

describe('GET /wishlist', () => {
  it('renvoie 200 et une liste vide au départ', async () => {
    const res = await app.request('/wishlist')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual([])
  })

  it('renvoie 200 avec les Pokémon ajoutés', async () => {
    await post({ id: 25, name: 'pikachu' })
    const res = await app.request('/wishlist')
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveLength(1)
    expect(data[0].name).toBe('pikachu')
  })
})

describe('POST /wishlist', () => {
  it('renvoie 201 et le Pokémon créé', async () => {
    const res = await post({ id: 25, name: 'pikachu', sprite: null })
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.id).toBe(25)
    expect(data.name).toBe('pikachu')
  })

  it('renvoie 400 si le corps est invalide', async () => {
    const res = await post({ name: 'sans-id' })
    expect(res.status).toBe(400)
  })

  it('renvoie 409 pour un doublon', async () => {
    await post({ id: 25, name: 'pikachu' })
    const res = await post({ id: 25, name: 'pikachu' })
    expect(res.status).toBe(409)
  })

  it('renvoie 409 quand la liste est pleine', async () => {
    for (let i = 1; i <= 6; i++) await post({ id: i, name: `p${i}` })
    const res = await post({ id: 99, name: 'de-trop' })
    expect(res.status).toBe(409)
  })
})

describe('DELETE /wishlist/:id', () => {
  it('renvoie 200 quand le Pokémon existe', async () => {
    await post({ id: 25, name: 'pikachu' })
    const res = await app.request('/wishlist/25', { method: 'DELETE' })
    expect(res.status).toBe(200)
    expect(await (await app.request('/wishlist')).json()).toEqual([])
  })

  it('renvoie 404 quand le Pokémon est inconnu', async () => {
    const res = await app.request('/wishlist/999', { method: 'DELETE' })
    expect(res.status).toBe(404)
  })
})