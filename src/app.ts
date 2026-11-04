import { Hono } from 'hono'
import { addItem, removeItem, wishlist } from './store'
import { tryAdd } from './rules'

export const app = new Hono()

app.use(
  '*',
  cors({
    origin: ['http://localhost:3001'],
    allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
  }),
)

app.get('/health', (c) => c.json({ status: 'ok' }))

app.get('/wishlist', (c) => c.json(wishlist))

app.post('/wishlist', async (c) => {
  let body: unknown
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'JSON invalide' }, 400)
  }

  const result = tryAdd(wishlist, body)
  if (!result.ok) {
    if (result.error === 'invalid') {
      return c.json({ error: 'id (nombre) et name (texte) sont requis' }, 400)
    }
    const message =
      result.error === 'duplicate'
        ? 'Pokémon déjà dans la wishlist'
        : 'Wishlist pleine'
    return c.json({ error: message }, 409)
  }

  addItem(result.item)
  return c.json(result.item, 201)
})

app.delete('/wishlist/:id', (c) => {
  const id = Number(c.req.param('id'))
  if (!Number.isInteger(id) || !removeItem(id)) {
    return c.json({ error: 'Pokémon introuvable' }, 404)
  }
  return c.json({ deleted: id })
})
function cors(arg0: {
  origin: string[]
  allowMethods: string[]
  allowHeaders: string[]
}): import('hono').MiddlewareHandler<
  import('hono/types').BlankEnv,
  '*',
  any,
  any
> {
  throw new Error('Function not implemented.')
}
