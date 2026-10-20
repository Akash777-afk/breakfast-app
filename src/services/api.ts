/**
 * Mock backend. Every call is async with simulated latency so screens exercise real loading/error states.
 * To go live, replace the bodies with fetch() calls — the signatures are what the UI depends on.
 */
import { addOnsForDish } from '../lib/addons'
import { COUPONS } from '../data/checkout'
import { DISHES } from '../data/dishes'
import {
  DEFAULT_PREFERRED_IDS,
  DIETICIAN_RECOMMENDED_IDS,
  INTAKE_BARS,
  MACRO_DONUTS,
  POPULAR_CARBS,
  POPULAR_PROTEINS,
  REPORT_STATS,
  SUMMARY_NOTES,
  type IntakeBar,
  type MacroDonut,
} from '../data/health'
import { PLANS } from '../data/plans'
import type { AddOn, Coupon, Dish, PaymentMethod, Plan } from '../types'

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/** First request of each kind is "cold" (slower); later ones feel cached. */
const warm = new Set<string>()
async function latency(key: string, cold = 550, hot = 40) {
  await wait(warm.has(key) ? hot : cold)
  warm.add(key)
}

export async function getDishes(): Promise<Dish[]> {
  await latency('dishes')
  return DISHES
}

/** The add-ons that make sense for one dish (none for a dish that has nothing to add to). */
export async function getAddOns(dishId: string): Promise<AddOn[]> {
  await latency('addons', 450)
  return addOnsForDish(dishId)
}

export async function getPlans(): Promise<Plan[]> {
  await latency('plans', 400)
  return PLANS
}

export interface HealthReport {
  carbs: string[]
  proteins: string[]
  stats: { label: string; value: number }[]
}

export async function getHealthReport(): Promise<HealthReport> {
  await latency('health', 500)
  return { carbs: POPULAR_CARBS, proteins: POPULAR_PROTEINS, stats: REPORT_STATS }
}

export interface Insights {
  macros: MacroDonut[]
  bars: IntakeBar[]
  notes: string[]
  recommendedIds: string[]
}

export async function getInsights(): Promise<Insights> {
  await latency('insights', 600)
  return { macros: MACRO_DONUTS, bars: INTAKE_BARS, notes: SUMMARY_NOTES, recommendedIds: DIETICIAN_RECOMMENDED_IDS }
}

export async function getRecommendations(): Promise<{ recommendedIds: string[]; defaultPreferredIds: string[] }> {
  await latency('recs', 500)
  return { recommendedIds: DIETICIAN_RECOMMENDED_IDS, defaultPreferredIds: DEFAULT_PREFERRED_IDS }
}

export type CouponResult = { ok: true; coupon: Coupon } | { ok: false; reason: string }

export async function validateCoupon(code: string, subtotal: number): Promise<CouponResult> {
  await wait(450)
  const clean = code.trim().toUpperCase()
  if (!clean) return { ok: false, reason: 'Enter a coupon code.' }
  const coupon = COUPONS.find((c) => c.code === clean)
  if (!coupon) return { ok: false, reason: `“${clean}” isn’t a valid coupon.` }
  if (subtotal < coupon.minSubtotal) {
    return { ok: false, reason: `Add ₹${coupon.minSubtotal - subtotal} more to use ${coupon.code}.` }
  }
  return { ok: true, coupon }
}

export class PaymentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PaymentError'
  }
}

export interface PaymentRequest {
  method: PaymentMethod
  amount: number
  upiId?: string
  cardNumber?: string
}

/**
 * Demo behaviour: a UPI id containing "fail" or a card ending in 0000 is declined, "timeout@…" times out;
 * everything else succeeds.
 */
export async function pay(req: PaymentRequest): Promise<{ transactionId: string }> {
  await wait(1400)
  if (req.method === 'upi') {
    const id = (req.upiId ?? '').toLowerCase()
    if (id.startsWith('timeout')) throw new PaymentError('The payment timed out. You have not been charged — please try again.')
    if (id.includes('fail')) throw new PaymentError('Your bank declined this UPI request. Try another UPI ID or payment method.')
  }
  if (req.method === 'card' && (req.cardNumber ?? '').replace(/\s/g, '').endsWith('0000')) {
    throw new PaymentError('This card was declined by the issuing bank. Try a different card or payment method.')
  }
  return { transactionId: `TXN${Date.now().toString(36).toUpperCase()}` }
}
