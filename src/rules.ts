import { MAX_WISHLIST_SIZE, type WishItem } from './store'

export type AddError = 'invalid' | 'duplicate' | 'full'

export type AddResult =
  | { ok: true; item: WishItem }
  | { ok: false; error: AddError }

export function validateInput(
  input: unknown,
): { id: number; name: string; sprite: string | null } | null {
  if (typeof input !== 'object' || input === null) return null
  const { id, name, sprite } = input as Record<string, unknown>
  if (typeof id !== 'number' || !Number.isInteger(id)) return null
  if (typeof name !== 'string' || !name.trim()) return null
  return {
    id,
    name: name.trim(),
    sprite: typeof sprite === 'string' ? sprite : null,
  }
}

export function tryAdd(
  list: WishItem[],
  input: unknown,
  now: number = Date.now(),
): AddResult {
  const valid = validateInput(input)
  if (!valid) return { ok: false, error: 'invalid' }
  if (list.some((p) => p.id === valid.id)) {
    return { ok: false, error: 'duplicate' }
  }
  if (list.length > MAX_WISHLIST_SIZE) return { ok: false, error: 'full' }
  return { ok: true, item: { ...valid, addedAt: now } }
}

export function tryRemove(
  list: WishItem[],
  id: number,
): { removed: boolean; list: WishItem[] } {
  const next = list.filter((p) => p.id !== id)
  return { removed: next.length < list.length, list: next }
}