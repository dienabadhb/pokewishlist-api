export interface WishItem {
  id: number
  name: string
  sprite: string | null
  addedAt: number
}

export const MAX_WISHLIST_SIZE = 6

export let wishlist: WishItem[] = []

export function resetWishlist(): void {
  wishlist = []
}

export function addItem(item: WishItem): void {
  wishlist = [...wishlist, item]
}

export function removeItem(id: number): boolean {
  const before = wishlist.length
  wishlist = wishlist.filter((p) => p.id !== id)
  return wishlist.length < before
}
