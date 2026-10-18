import sandwich from '../assets/food/sandwich.png'
import salad from '../assets/food/salad.png'
import all from '../assets/categories/all.png'
import salads from '../assets/categories/salads.png'
import beverages from '../assets/categories/beverages.png'
import millets from '../assets/categories/millets.png'

export interface FoodCategory {
  id: string
  label: string
  image: string
}

export const APP_TITLE = 'BreakFit'

export const APP_TAGLINE = "India's first breakfast app"

export const PROFILE_INITIAL = 'A'

export const SEARCH_EXAMPLE = 'dosa'

export const HERO_IMAGES = { topRight: salad, bottomLeft: sandwich }

export const CATEGORIES: FoodCategory[] = [
  { id: 'all', label: 'All', image: all },
  { id: 'salads', label: 'Salads', image: salads },
  { id: 'beverages', label: 'Beverages', image: beverages },
  { id: 'millets', label: 'Millets', image: millets },
]
