export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

export const DEFAULT_SLEEP_HOURS: number[] = [4.7, 5.2, 4.5, 5.8, 5.1, 6.5, 5.3]

export const SLEEP_AXIS = { min: 4, max: 7 }

export const POPULAR_CARBS = ['Oats', 'Brown rice / red rice', 'Sweet potato']
export const POPULAR_PROTEINS = ['Eggs', 'Greek yogurt + fruits', 'Moong dal dosa']

export const REPORT_STATS = [
  { label: 'Metabolism', value: 80.4 },
  { label: 'Calories', value: 71.8 },
  { label: 'Cravings', value: 91.5 },
]

export interface MacroDonut {
  key: 'carbs' | 'protein' | 'fats'
  label: string
  percent: number
  /** Four shades, light → dark, used for the donut segments. */
  shades: [string, string, string, string]
  weights: [number, number, number, number]
  /** Solid colour for the label pill — dark enough for white text (AA). */
  accent: string
}

export const MACRO_DONUTS: MacroDonut[] = [
  {
    key: 'carbs',
    label: 'Carbs',
    percent: 95.6,
    shades: ['#ffd1d4', '#ff9a9f', '#ff2d2d', '#6b1414'],
    weights: [18, 22, 26, 34],
    accent: '#d61f1f',
  },
  {
    key: 'protein',
    label: 'Protein',
    percent: 92.6,
    shades: ['#c4d0ff', '#3b5bff', '#1236ff', '#001a8f'],
    weights: [24, 18, 22, 36],
    accent: '#1236ff',
  },
  {
    key: 'fats',
    label: 'Fats',
    percent: 75.6,
    shades: ['#ecc7f4', '#d89be6', '#c26ae0', '#8e4fb8'],
    weights: [22, 26, 24, 28],
    accent: '#a43fcb',
  },
]

export interface IntakeBar {
  label: string
  current: number
  target: number
  unit: string
}

export const INTAKE_BARS: IntakeBar[] = [
  { label: 'Daily Calories', current: 1870, target: 2000, unit: '' },
  { label: 'Protein Intake', current: 94, target: 110, unit: 'g' },
  { label: 'Fiber Intake', current: 21, target: 30, unit: 'g' },
  { label: 'Water Intake', current: 2.3, target: 3, unit: 'L' },
]

export const SUMMARY_NOTES = [
  'Your protein intake is close to target — an egg or a paneer skewer at breakfast will close the gap.',
  'Fibre is the biggest shortfall (21g of 30g). Oats, sprouts and millets are the easiest fixes.',
  'You are 0.7L short on water. Add a glass with every meal.',
  'Sleep dipped midweek (4.5h on Wednesday). Lighter, earlier dinners help with morning cravings.',
]

export const DIETICIAN_RECOMMENDED_IDS = ['oats-berries', 'paneer-skewers', 'sprouts', 'pesarattu', 'boiled-egg', 'garden-salad']

/** Fallback "preferred food" for a new user (favourites are added in front). */
export const DEFAULT_PREFERRED_IDS = ['sandwich', 'boiled-egg', 'paneer-skewers', 'upma', 'paniyaram', 'sprouts']
