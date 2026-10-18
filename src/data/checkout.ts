import type { Address, Coupon } from '../types'

/** Chips shown by default, laid out column-wise exactly like the design (6.15/6.30/6.45 in the first column…). */
export const SLOT_COLUMNS: string[][] = [
  ['6.15 am', '6.30 am', '6.45 am'],
  ['7.15 am', '7.30 am', '7.45 am'],
  ['8.15 am', '8.30 am', '8.45 am'],
  ['9.00 am', '9.15 am', '9.30 am'],
]

/** Row-major order for a 4-column grid. */
export const SLOTS_ROW_MAJOR: string[] = [0, 1, 2].flatMap((row) => SLOT_COLUMNS.map((col) => col[row]))

export const OTHER_SLOTS: string[] = [
  '5.30 am',
  '5.45 am',
  '9.45 am',
  '10.00 am',
  '10.15 am',
  '10.30 am',
  '10.45 am',
  '11.00 am',
]

export const MAX_DAYS_AHEAD = 4

export const DEFAULT_ADDRESS: Address = {
  id: 'addr-home',
  label: 'Home',
  line1: 'No.14, 10th cross street, Lakshmi Nagar, Porur',
  city: 'Chennai',
  pincode: '600116',
}

export const COUPONS: Coupon[] = [
  {
    code: 'DISCWITHSTARBUCK',
    name: 'Starbucks partner offer',
    description: '10% off, up to ₹60',
    kind: 'percent',
    value: 10,
    maxDiscount: 60,
    minSubtotal: 100,
  },
  {
    code: 'BREAKFIT50',
    name: 'Welcome offer',
    description: 'Flat ₹50 off on orders above ₹250',
    kind: 'flat',
    value: 50,
    minSubtotal: 250,
  },
  {
    code: 'FIRSTBITE',
    name: 'First bite',
    description: '20% off, up to ₹80',
    kind: 'percent',
    value: 20,
    maxDiscount: 80,
    minSubtotal: 150,
  },
]

export const DELIVERY_FEE = 30
export const FREE_DELIVERY_ABOVE = 250
export const LARGE_PORTION_EXTRA = 25
