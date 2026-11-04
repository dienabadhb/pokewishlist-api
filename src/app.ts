import { Hono } from 'hono'
import {
  MAX_WISHLIST_SIZE,
  addItem,
  removeItem,
  wishlist,
  type WishItem,
} from './store'

export const app = new Hono()

app.get('/health', (c) => c.json({ status: 'ok' }))

app.get('/wishlist', (c) => c.json(wishlist))

app.post('/wishlist', async (c) => {
  let body: unknown
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'JSON invalide' }, 400)
  }

  const { id, name, sprite } = (body ?? {}) as Partial<WishItem>
  if (typeof id !== 'number' || typeof name !== 'string' || !name.trim()) {
    return c.json({ error: 'id (nombre) et name (texte) sont requis' }, 400)
  }
  if (wishlist.some((p) => p.id === id)) {
    return c.json({ error: 'Pokémon déjà dans la wishlist' }, 409)
  }
  if (wishlist.length >= MAX_WISHLIST_SIZE) {
    return c.json({ error: 'Wishlist pleine' }, 409)
  }

  const item: WishItem = {
    id,
    name: name.trim(),
    sprite: typeof sprite === 'string' ? sprite : null,
    addedAt: Date.now(),
  }
  addItem(item)
  return c.json(item, 201)
})

app.delete('/wishlist/:id', (c) => {
  const id = Number(c.req.param('id'))
  if (!Number.isInteger(id) || !removeItem(id)) {
    return c.json({ error: 'Pokémon introuvable' }, 404)
  }
  return c.json({ deleted: id })
})