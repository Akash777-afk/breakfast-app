import type { Dish, FilterState } from '../types'

export const DEFAULT_FILTER: FilterState = { diet: 'all', sort: 'recommended' }

export const isFilterActive = (filter: FilterState): boolean => filter.diet !== DEFAULT_FILTER.diet || filter.sort !== DEFAULT_FILTER.sort

interface Filterable {
  diet: Dish['diet']
  price: number
  calories?: number
  protein?: number
}

/** Filters by diet and re-sorts. "recommended" keeps the incoming order. */
export function applyFilter<T extends Filterable>(items: T[], filter: FilterState): T[] {
  const filtered = filter.diet === 'veg' ? items.filter((item) => item.diet === 'veg') : items.slice()
  switch (filter.sort) {
    case 'price-asc':
      return filtered.sort((a, b) => a.price - b.price)
    case 'calories-asc':
      return filtered.sort((a, b) => (a.calories ?? 0) - (b.calories ?? 0))
    case 'protein-desc':
      return filtered.sort((a, b) => (b.protein ?? 0) - (a.protein ?? 0))
    default:
      return filtered
  }
}

/** Case-insensitive match against name, description and category. */
export function matchesQuery(dish: Dish, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return dish.name.toLowerCase().includes(q) || dish.description.toLowerCase().includes(q) || dish.categories.some((c) => c.includes(q))
}
