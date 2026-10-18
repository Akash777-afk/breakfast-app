import type { Plan } from '../types'

const BASIC_COMBO = ['Carbs like idli or dosa', 'Medhu vada', 'Boiled eggs', 'Uthappam', 'Sprouts bowl']
const PREMIUM_COMBO = ['Carbs like idli or dosa', 'Filter coffee', 'Boiled eggs', 'Bread with peanut butter', 'Fruits & nuts']

export const PLANS: Plan[] = [
  { id: 'basic-weekly', name: 'Basic weekly plan', tier: 'Basic', period: 'week', price: 799, combo: BASIC_COMBO },
  { id: 'premium-weekly', name: 'Premium weekly plan', tier: 'Premium', period: 'week', price: 999, combo: PREMIUM_COMBO },
  { id: 'basic-monthly', name: 'Basic monthly plan', tier: 'Basic', period: 'month', price: 2999, combo: BASIC_COMBO },
  { id: 'premium-monthly', name: 'Premium monthly plan', tier: 'Premium', period: 'month', price: 3299, combo: PREMIUM_COMBO },
]

/** Everything a subscriber can swap into their combo. */
export const COMBO_POOL: string[] = [
  'Carbs like idli or dosa',
  'Medhu vada',
  'Boiled eggs',
  'Uthappam',
  'Sprouts bowl',
  'Filter coffee',
  'Bread with peanut butter',
  'Fruits & nuts',
  'Paneer bhurji',
  'Oats & berries',
  'Millet upma',
  'Ragi koozh',
  'Egg mayo sandwich',
]

export const COMBO_MIN = 4
export const COMBO_MAX = 6
export const TRIAL_DAYS = 3
