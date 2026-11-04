import { describe, it, expect } from 'vitest'
import { tryAdd, tryRemove, validateInput } from './rules'
import { MAX_WISHLIST_SIZE, type WishItem } from './store'

const item = (id: number): WishItem => ({
  id,
  name: `p${id}`,
  sprite: null,
  addedAt: 0,
})

const fullList = (): WishItem[] =>
  Array.from({ length: MAX_WISHLIST_SIZE }, (_, i) => item(i + 1))

describe('ajout', () => {
  it('ajoute un Pokémon valide', () => {
    const result = tryAdd([], { id: 25, name: 'pikachu' }, 123)
    expect(result).toEqual({
      ok: true,
      item: { id: 25, name: 'pikachu', sprite: null, addedAt: 123 },
    })
  })
})

describe('doublon', () => {
  it('refuse un Pokémon déjà présent', () => {
    const result = tryAdd([item(25)], { id: 25, name: 'pikachu' })
    expect(result).toEqual({ ok: false, error: 'duplicate' })
  })
})

describe('limite de 6', () => {
  it('accepte le 6e Pokémon', () => {
    const list = fullList().slice(0, MAX_WISHLIST_SIZE - 1)
    expect(tryAdd(list, { id: 99, name: 'sixieme' }).ok).toBe(true)
  })

  it('refuse le 7e Pokémon', () => {
    const result = tryAdd(fullList(), { id: 99, name: 'de-trop' })
    expect(result).toEqual({ ok: false, error: 'full' })
  })
})

describe('entrée invalide', () => {
  it.each([
    ['null', null],
    ['un texte', 'pikachu'],
    ['sans id', { name: 'pikachu' }],
    ['id en texte', { id: '25', name: 'pikachu' }],
    ['id décimal', { id: 2.5, name: 'pikachu' }],
    ['sans nom', { id: 25 }],
    ['nom vide', { id: 25, name: '   ' }],
  ])('refuse %s', (_label, input) => {
    expect(validateInput(input)).toBeNull()
    expect(tryAdd([], input)).toEqual({ ok: false, error: 'invalid' })
  })
})

describe('suppression', () => {
  it('supprime un Pokémon existant', () => {
    const result = tryRemove([item(25), item(151)], 151)
    expect(result.removed).toBe(true)
    expect(result.list).toEqual([item(25)])
  })

  it('signale un Pokémon introuvable', () => {
    const result = tryRemove([item(25)], 999)
    expect(result.removed).toBe(false)
    expect(result.list).toEqual([item(25)])
  })
})
