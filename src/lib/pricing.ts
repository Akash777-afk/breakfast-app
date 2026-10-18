import { DELIVERY_FEE, FREE_DELIVERY_ABOVE, LARGE_PORTION_EXTRA } from '../data/checkout'
import { ADDON_BY_ID } from '../data/addons'
import { DISH_BY_ID } from '../data/dishes'
import type { CartLine, Coupon, Totals } from '../types'

/** Dish price for one serving, including the portion upcharge but not add-ons. */
export function servingPrice(line: CartLine): number {
  const dish = DISH_BY_ID[line.dishId]
  if (!dish) return 0
  return dish.price + (line.options.portion === 'large' ? LARGE_PORTION_EXTRA : 0)
}

export function addOnsPrice(line: CartLine): number {
  return line.addOnIds.reduce((sum, id) => sum + (ADDON_BY_ID[id]?.price ?? 0), 0)
}

/** Each serving comes with the chosen add-ons, so add-ons scale with quantity. */
export function lineTotal(line: CartLine): number {
  return (servingPrice(line) + addOnsPrice(line)) * line.qty
}

export function cartSubtotal(cart: CartLine[]): number {
  return cart.reduce((sum, line) => sum + lineTotal(line), 0)
}

export function cartCount(cart: CartLine[]): number {
  return cart.reduce((sum, line) => sum + line.qty, 0)
}

export function couponDiscount(subtotal: number, coupon: Coupon | null): number {
  if (!coupon || subtotal < coupon.minSubtotal) return 0
  const raw = coupon.kind === 'percent' ? (subtotal * coupon.value) / 100 : coupon.value
  const capped = coupon.maxDiscount ? Math.min(raw, coupon.maxDiscount) : raw
  return Math.min(Math.round(capped), subtotal)
}

export function deliveryFee(subtotal: number, subscribed: boolean): number {
  if (subtotal === 0 || subscribed || subtotal >= FREE_DELIVERY_ABOVE) return 0
  return DELIVERY_FEE
}

export function computeTotals(cart: CartLine[], opts: { subscribed: boolean; coupon: Coupon | null }): Totals {
  const subtotal = cartSubtotal(cart)
  const discount = couponDiscount(subtotal, opts.coupon)
  const delivery = deliveryFee(subtotal, opts.subscribed)
  return { subtotal, delivery, discount, total: Math.max(0, subtotal - discount + delivery) }
}

/** "2 idli + 1 dosa + 1 filter coffee" */
export function cartSummary(cart: CartLine[]): string {
  return cart
    .map((line) => `${line.qty} ${(DISH_BY_ID[line.dishId]?.name ?? line.dishId).toLowerCase()}`)
    .join(' + ')
}
