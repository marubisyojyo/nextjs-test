export type Product = {
  id: string
  title: string
  points: number
  description?: string | null
  category_id?: number | null
  thumbnail_url?: string | null
  image_url?: string | null
  image_urls?: string[] | null
  file_url?: string | null
  file_name?: string | null
  file_path?: string | null
  download_url?: string | null
  is_active?: boolean | null
  is_deleted?: boolean | null
  purchase_count?: number | null
  created_at?: string | null
}

export type Category = {
  id: number
  name: string
}

export const RECENT_PRODUCTS_KEY = "recent_products"
export const FAVORITE_PRODUCTS_KEY = "favorite_products"
export const RECENT_LIMIT = 12
export const SECTION_LIMIT = 4
export const FALLBACK_IMAGE = "/file.svg"

export function formatDate(value?: string | null) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return date.toLocaleDateString("ja-JP")
}

export function isNewProduct(value?: string | null, days = 3) {
  if (!value) return false
  const created = new Date(value).getTime()
  if (Number.isNaN(created)) return false
  const diff = (Date.now() - created) / (1000 * 60 * 60 * 24)
  return diff <= days
}

export function normalizeProducts<T extends { id: string | number }>(items: T[]) {
  const seen = new Set<string>()
  return items.filter((item) => {
    const key = String(item.id)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function saveRecentProduct(product: Product) {
  if (typeof window === "undefined") return
  const current = readLocalProducts(RECENT_PRODUCTS_KEY)
  const next = normalizeProducts([product, ...current]).slice(0, RECENT_LIMIT)
  localStorage.setItem(RECENT_PRODUCTS_KEY, JSON.stringify(next))
}

export function readLocalProducts(key: string): Product[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function syncFavoriteProduct(product: Product, isFavorite: boolean) {
  if (typeof window === "undefined") return
  const current = readLocalProducts(FAVORITE_PRODUCTS_KEY)
  const next = isFavorite
    ? normalizeProducts([product, ...current]).slice(0, RECENT_LIMIT)
    : current.filter((item) => String(item.id) !== String(product.id))
  localStorage.setItem(FAVORITE_PRODUCTS_KEY, JSON.stringify(next))
}

export function buildCounts(items: Array<{ category_id?: number | null }>) {
  return items.reduce<Record<number, number>>((acc, item) => {
    const key = Number(item.category_id)
    if (!Number.isFinite(key)) return acc
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
}
