import sambar from '../assets/addons/sambar.jpg'
import coconutChutney from '../assets/addons/coconut-chutney.jpg'
import podiOil from '../assets/addons/podi-oil.jpg'
import coconutMilk from '../assets/addons/coconut-milk.jpg'
import kadalaCurry from '../assets/addons/kadala-curry.jpg'
import dalTakda from '../assets/addons/dal-takda.jpg'
import mintChutney from '../assets/addons/mint-chutney.jpg'
import curd from '../assets/addons/curd.jpg'
import type { AddOn } from '../types'

export const ADDONS: AddOn[] = [
  { id: 'sambar', name: 'Sambar', image: sambar, price: 20, diet: 'veg' },
  { id: 'coconut-chutney', name: 'Chutney', image: coconutChutney, price: 15, diet: 'veg' },
  { id: 'podi-oil', name: 'Podi & oil', image: podiOil, price: 20, diet: 'veg' },
  { id: 'coconut-milk', name: 'Coconut milk', image: coconutMilk, price: 45, diet: 'veg' },
  { id: 'kadala-curry', name: 'Kadala Curry', image: kadalaCurry, price: 35, diet: 'veg' },
  { id: 'dal-takda', name: 'Dal takda', image: dalTakda, price: 40, diet: 'veg' },
  { id: 'mint-chutney', name: 'Mint chutney', image: mintChutney, price: 15, diet: 'veg' },
  { id: 'curd', name: 'Curd', image: curd, price: 25, diet: 'veg' },
]

export const ADDON_BY_ID: Record<string, AddOn> = Object.fromEntries(ADDONS.map((a) => [a.id, a]))
