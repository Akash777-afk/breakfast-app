export type DishCategory = 'salads' | 'beverages' | 'millets'
export type Diet = 'veg' | 'egg'

export interface Dish {
  id: string
  name: string
  image: string
  description: string
  price: number
  calories: number
  protein: number
  carbs: number
  diet: Diet
  categories: DishCategory[]
}

export interface AddOn {
  id: string
  name: string
  image: string
  price: number
  diet: Diet
}

export type Portion = 'regular' | 'large'
export type Spice = 'mild' | 'medium' | 'spicy'

export interface DishOptions {
  portion: Portion
  spice: Spice
  note: string
}

export interface CartLine {
  dishId: string
  qty: number
  addOnIds: string[]
  options: DishOptions
}

export type AddressLabel = 'Home' | 'Work' | 'Other'

export interface Address {
  id: string
  label: AddressLabel
  line1: string
  city: string
  pincode: string
}

/** dayOffset 1 = tomorrow. `time` is the label shown on the chip, e.g. "8.15 am". */
export interface Slot {
  dayOffset: number
  time: string
}

export type PlanId = 'basic-weekly' | 'premium-weekly' | 'basic-monthly' | 'premium-monthly'

export interface Plan {
  id: PlanId
  name: string
  tier: 'Basic' | 'Premium'
  period: 'week' | 'month'
  price: number
  combo: string[]
}

export interface Subscription {
  planId: PlanId
  status: 'trial' | 'active'
  startedAt: string
}

export interface Coupon {
  code: string
  name: string
  description: string
  kind: 'percent' | 'flat'
  value: number
  maxDiscount?: number
  minSubtotal: number
}

export type PaymentMethod = 'upi' | 'card' | 'cod'

export interface Totals {
  subtotal: number
  delivery: number
  discount: number
  total: number
}

export interface OrderLine {
  dishId: string
  name: string
  qty: number
  /** Add-on display names. */
  addOns: string[]
  addOnIds: string[]
  unitPrice: number
}

export interface Profile {
  name: string
}

export interface Order {
  id: string
  createdAt: string
  lines: OrderLine[]
  address: Address
  slot: Slot
  /** ISO date (yyyy-mm-dd) the breakfast is delivered on. */
  deliveryDate: string
  totals: Totals
  coupon: { code: string; name: string } | null
  payment: PaymentMethod
}

export interface HealthState {
  /** Hours slept, Monday → Sunday. */
  sleepHours: number[]
  dietician: 'unset' | 'declined' | 'accepted'
}

export interface FilterState {
  diet: 'all' | 'veg'
  sort: 'recommended' | 'price-asc' | 'calories-asc' | 'protein-desc'
}
