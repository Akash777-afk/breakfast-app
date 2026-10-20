import { ADDONS, ADDON_BY_ID } from '../data/addons'
import { DISH_BY_ID } from '../data/dishes'
import type { AddOn, AddOnGroup, Dish } from '../types'

const HOT_DRINKS = new Set(['filter-coffee', 'masala-chai'])
const SWEET_BOWLS = new Set(['fruit-bowl', 'oats-berries'])
const LIGHT_MEALS = new Set(['lemon-millet', 'curd-millet', 'kambu-koozh'])
const SNACKS = new Set(['sandwich', 'paneer-skewers'])
/** Already complete as they are: a boiled egg, and the sambar that is itself the side. */
const NOTHING_TO_ADD = new Set(['boiled-egg', 'sambar'])

/** Which kind of dish this is for add-on purposes, or null when nothing sensible can be added to it. */
export function groupOfDish(dish: Dish): AddOnGroup | null {
  if (NOTHING_TO_ADD.has(dish.id)) return null
  if (HOT_DRINKS.has(dish.id)) return 'hot-drink'
  if (dish.categories.includes('beverages')) return 'cold-drink'
  if (SWEET_BOWLS.has(dish.id)) return 'sweet-bowl'
  if (dish.categories.includes('salads')) return 'salad'
  if (SNACKS.has(dish.id)) return 'snack'
  if (LIGHT_MEALS.has(dish.id)) return 'light-meal'
  return 'tiffin'
}

export function addOnApplies(addOn: AddOn, dish: Dish): boolean {
  const group = groupOfDish(dish)
  if (!group || !addOn.groups.includes(group)) return false
  if (addOn.only && !addOn.only.includes(dish.id)) return false
  if (addOn.except?.includes(dish.id)) return false
  return true
}

/** The add-ons offered for a dish, in menu order. */
export function addOnsForDish(dishId: string): AddOn[] {
  const dish = DISH_BY_ID[dishId]
  return dish ? ADDONS.filter((a) => addOnApplies(a, dish)) : []
}

/** Drops add-on ids that don't belong on this dish (e.g. a Sambar left over on a chai from before add-ons were per dish). */
export function sanitizeAddOnIds(dishId: string, ids: string[]): string[] {
  const dish = DISH_BY_ID[dishId]
  if (!dish) return ids
  return ids.filter((id) => {
    const addOn = ADDON_BY_ID[id]
    return !!addOn && addOnApplies(addOn, dish)
  })
}

/** Toggles one add-on; choosing one of an exclusive set (Less sugar / No sugar) clears the others in it. */
export function toggleAddOnId(ids: string[], id: string): string[] {
  if (ids.includes(id)) return ids.filter((x) => x !== id)
  const key = ADDON_BY_ID[id]?.exclusive
  const kept = key ? ids.filter((x) => ADDON_BY_ID[x]?.exclusive !== key) : ids
  return [...kept, id]
}
