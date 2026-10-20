import sambar from '../assets/addons/sambar.jpg'
import coconutChutney from '../assets/addons/coconut-chutney.jpg'
import podiOil from '../assets/addons/podi-oil.jpg'
import coconutMilk from '../assets/addons/coconut-milk.jpg'
import kadalaCurry from '../assets/addons/kadala-curry.jpg'
import dalTakda from '../assets/addons/dal-takda.jpg'
import mintChutney from '../assets/addons/mint-chutney.jpg'
import curd from '../assets/addons/curd.jpg'
import type { AddOn } from '../types'

/**
 * Every add-on, and where it makes sense.
 *
 *   groups     – the kinds of dish it can go with (see `groupOfDish` in lib/addons.ts)
 *   only       – narrows it to specific dishes within those groups (Coconut milk goes with idiyappam, not idli)
 *   except     – dishes within those groups that should not get it (Podi on a dish that already is podi)
 *   exclusive  – picking one clears the others in the same set (Less sugar / No sugar)
 *
 * The first eight keep their photos. The rest have no photo yet, so they show an illustrated tile (`art`) until one is added:
 * drop a file in src/assets/addons, import it here and set `image`.
 */
export const ADDONS: AddOn[] = [
  // ---- tiffins and millet meals ---------------------------------------------------------------------------------------
  { id: 'sambar', name: 'Sambar', image: sambar, price: 20, diet: 'veg', groups: ['tiffin'] },
  { id: 'coconut-chutney', name: 'Chutney', image: coconutChutney, price: 15, diet: 'veg', groups: ['tiffin'] },
  { id: 'mint-chutney', name: 'Mint chutney', image: mintChutney, price: 15, diet: 'veg', groups: ['tiffin', 'snack'] },
  { id: 'podi-oil', name: 'Podi & oil', image: podiOil, price: 20, diet: 'veg', groups: ['tiffin', 'light-meal'], except: ['podi-idli', 'curd-millet', 'kambu-koozh'] },
  { id: 'coconut-milk', name: 'Coconut milk', image: coconutMilk, price: 45, diet: 'veg', groups: ['tiffin'], only: ['idiyappam', 'puttu', 'paniyaram'] },
  { id: 'kadala-curry', name: 'Kadala Curry', image: kadalaCurry, price: 35, diet: 'veg', groups: ['tiffin'], only: ['puttu', 'idiyappam'] },
  { id: 'dal-takda', name: 'Dal takda', image: dalTakda, price: 40, diet: 'veg', groups: ['tiffin', 'light-meal'], only: ['pongal', 'thinai-pongal', 'upma', 'lemon-millet'] },
  { id: 'curd', name: 'Curd', image: curd, price: 25, diet: 'veg', groups: ['tiffin', 'light-meal'], only: ['idli', 'pongal', 'thinai-pongal', 'upma', 'lemon-millet', 'kambu-koozh', 'ragi-kali'] },
  { id: 'pickle', name: 'Pickle', art: 'jar', price: 10, diet: 'veg', groups: ['tiffin', 'light-meal'], only: ['upma', 'pongal', 'thinai-pongal', 'lemon-millet', 'curd-millet', 'kambu-koozh'] },

  // ---- hot drinks (chai, filter coffee) -------------------------------------------------------------------------------
  { id: 'strong-decoction', name: 'Strong decoction', art: 'cup', price: 10, diet: 'veg', groups: ['hot-drink'] },
  { id: 'jaggery', name: 'Jaggery, no sugar', art: 'sugar', price: 10, diet: 'veg', groups: ['hot-drink'] },
  { id: 'rusk', name: 'Rusk or biscuit', art: 'cookie', price: 15, diet: 'veg', groups: ['hot-drink'] },
  { id: 'ginger-cardamom', name: 'Ginger & cardamom', art: 'leaf', price: 10, diet: 'veg', groups: ['hot-drink'] },

  // ---- cold drinks ----------------------------------------------------------------------------------------------------
  { id: 'sabja', name: 'Sabja seeds', art: 'seeds', price: 10, diet: 'veg', groups: ['cold-drink'], only: ['nannari-sharbat', 'kokum-sharbat', 'aloe-vera-cooler', 'mango-lassi'] },
  { id: 'chia', name: 'Chia seeds', art: 'seeds', price: 15, diet: 'veg', groups: ['cold-drink', 'sweet-bowl'], only: ['nannari-sharbat', 'kokum-sharbat', 'aloe-vera-cooler', 'mango-lassi', 'tender-coconut', 'fruit-bowl', 'oats-berries'] },
  { id: 'mint-lemon', name: 'Mint & lemon', art: 'leaf', price: 10, diet: 'veg', groups: ['cold-drink'], only: ['buttermilk', 'tender-coconut', 'kokum-sharbat', 'nannari-sharbat', 'aloe-vera-cooler'] },
  { id: 'chilled', name: 'Served chilled', art: 'ice', price: 0, diet: 'veg', groups: ['cold-drink'], except: ['koozh'] },
  { id: 'lassi-nuts', name: 'Pistachio & almonds', art: 'nuts', price: 30, diet: 'veg', groups: ['cold-drink'], only: ['mango-lassi'] },
  { id: 'jeera-tadka', name: 'Jeera & curry leaf', art: 'seeds', price: 10, diet: 'veg', groups: ['cold-drink'], only: ['buttermilk', 'koozh'] },
  { id: 'onion-chilli', name: 'Onion & chilli', art: 'onion', price: 10, diet: 'veg', groups: ['cold-drink'], only: ['koozh'] },

  // ---- sweetness, for the drinks that are sweet (free; picking one clears the other) -----------------------------------
  { id: 'less-sugar', name: 'Less sugar', art: 'sugar', price: 0, diet: 'veg', groups: ['hot-drink', 'cold-drink'], only: ['masala-chai', 'filter-coffee', 'mango-lassi', 'nannari-sharbat', 'kokum-sharbat', 'aloe-vera-cooler'], exclusive: 'sugar' },
  { id: 'no-sugar', name: 'No sugar', art: 'sugar', price: 0, diet: 'veg', groups: ['hot-drink', 'cold-drink'], only: ['masala-chai', 'filter-coffee', 'mango-lassi', 'nannari-sharbat', 'kokum-sharbat', 'aloe-vera-cooler'], exclusive: 'sugar' },

  // ---- salads ---------------------------------------------------------------------------------------------------------
  { id: 'paneer-cubes', name: 'Paneer cubes', art: 'cubes', price: 40, diet: 'veg', groups: ['salad'] },
  { id: 'grilled-tofu', name: 'Grilled tofu', art: 'cubes', price: 45, diet: 'veg', groups: ['salad'] },
  { id: 'egg', name: 'Boiled egg', art: 'egg', price: 15, diet: 'egg', groups: ['salad'] },
  { id: 'sprouts', name: 'Sprouts', art: 'beans', price: 25, diet: 'veg', groups: ['salad'], except: ['sprouts'] },
  { id: 'chickpeas', name: 'Boiled chickpeas', art: 'beans', price: 25, diet: 'veg', groups: ['salad'] },
  { id: 'avocado', name: 'Avocado slices', art: 'avocado', price: 50, diet: 'veg', groups: ['salad'] },
  { id: 'feta', name: 'Cheese or feta', art: 'cubes', price: 35, diet: 'veg', groups: ['salad'] },
  { id: 'nut-mix', name: 'Nuts & seeds', art: 'nuts', price: 30, diet: 'veg', groups: ['salad', 'sweet-bowl'] },
  { id: 'peanuts', name: 'Roasted peanuts', art: 'nuts', price: 20, diet: 'veg', groups: ['salad'] },
  { id: 'dressing', name: 'Extra dressing', art: 'drop', price: 15, diet: 'veg', groups: ['salad'] },
  { id: 'hummus', name: 'Hummus', art: 'scoop', price: 30, diet: 'veg', groups: ['salad'], only: ['greek-salad'] },

  // ---- fruit bowl and oats --------------------------------------------------------------------------------------------
  { id: 'honey', name: 'Honey drizzle', art: 'drop', price: 10, diet: 'veg', groups: ['sweet-bowl'] },
  { id: 'yogurt', name: 'Yogurt scoop', art: 'scoop', price: 20, diet: 'veg', groups: ['sweet-bowl'] },
]

export const ADDON_BY_ID: Record<string, AddOn> = Object.fromEntries(ADDONS.map((a) => [a.id, a]))
