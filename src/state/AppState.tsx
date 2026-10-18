import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { DEFAULT_ADDRESS } from '../data/checkout'
import { DEFAULT_SLEEP_HOURS } from '../data/health'
import { clearPersisted, readPersisted, writePersisted } from '../lib/storage'
import type {
  Address,
  CartLine,
  DishOptions,
  HealthState,
  Order,
  PlanId,
  Profile,
  Slot,
  Subscription,
} from '../types'

export interface AppState {
  profile: Profile
  cart: CartLine[]
  favorites: string[]
  addresses: Address[]
  selectedAddressId: string | null
  slot: Slot | null
  subscription: Subscription | null
  combos: Partial<Record<PlanId, string[]>>
  orders: Order[]
  health: HealthState
}

export const DEFAULT_OPTIONS: DishOptions = { portion: 'regular', spice: 'medium', note: '' }

function initialState(): AppState {
  return {
    profile: { name: 'Aarav Kumar' },
    cart: [],
    favorites: [],
    addresses: [DEFAULT_ADDRESS],
    selectedAddressId: DEFAULT_ADDRESS.id,
    slot: null,
    subscription: null,
    combos: {},
    orders: [],
    health: { sleepHours: DEFAULT_SLEEP_HOURS, dietician: 'unset' },
  }
}

type Action =
  | { type: 'profile/set'; name: string }
  | { type: 'cart/toggle'; dishId: string }
  | { type: 'cart/add'; dishId: string; qty?: number; addOnIds?: string[]; options?: DishOptions }
  | { type: 'cart/setQty'; dishId: string; qty: number }
  | { type: 'cart/setAddOns'; dishId: string; addOnIds: string[] }
  | { type: 'cart/setOptions'; dishId: string; options: DishOptions }
  | { type: 'cart/clear' }
  | { type: 'fav/toggle'; dishId: string }
  | { type: 'address/save'; address: Address }
  | { type: 'address/select'; id: string }
  | { type: 'address/delete'; id: string }
  | { type: 'slot/set'; slot: Slot | null }
  | { type: 'subscription/set'; subscription: Subscription | null }
  | { type: 'combo/set'; planId: PlanId; items: string[] }
  | { type: 'order/place'; order: Order }
  | { type: 'health/sleep'; index: number; hours: number }
  | { type: 'health/dietician'; choice: HealthState['dietician'] }
  | { type: 'reset' }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'profile/set':
      return { ...state, profile: { name: action.name } }
    case 'cart/toggle': {
      const exists = state.cart.some((l) => l.dishId === action.dishId)
      return {
        ...state,
        cart: exists
          ? state.cart.filter((l) => l.dishId !== action.dishId)
          : [...state.cart, { dishId: action.dishId, qty: 1, addOnIds: [], options: DEFAULT_OPTIONS }],
      }
    }
    case 'cart/add': {
      const qty = Math.max(1, action.qty ?? 1)
      const existing = state.cart.find((l) => l.dishId === action.dishId)
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((l) =>
            l.dishId === action.dishId
              ? { ...l, qty: l.qty + qty, addOnIds: action.addOnIds ?? l.addOnIds, options: action.options ?? l.options }
              : l,
          ),
        }
      }
      return {
        ...state,
        cart: [
          ...state.cart,
          { dishId: action.dishId, qty, addOnIds: action.addOnIds ?? [], options: action.options ?? DEFAULT_OPTIONS },
        ],
      }
    }
    case 'cart/setQty':
      return {
        ...state,
        cart:
          action.qty <= 0
            ? state.cart.filter((l) => l.dishId !== action.dishId)
            : state.cart.map((l) => (l.dishId === action.dishId ? { ...l, qty: Math.min(action.qty, 20) } : l)),
      }
    case 'cart/setAddOns':
      return { ...state, cart: state.cart.map((l) => (l.dishId === action.dishId ? { ...l, addOnIds: action.addOnIds } : l)) }
    case 'cart/setOptions':
      return { ...state, cart: state.cart.map((l) => (l.dishId === action.dishId ? { ...l, options: action.options } : l)) }
    case 'cart/clear':
      return { ...state, cart: [] }
    case 'fav/toggle':
      return {
        ...state,
        favorites: state.favorites.includes(action.dishId)
          ? state.favorites.filter((id) => id !== action.dishId)
          : [...state.favorites, action.dishId],
      }
    case 'address/save': {
      const exists = state.addresses.some((a) => a.id === action.address.id)
      return {
        ...state,
        addresses: exists
          ? state.addresses.map((a) => (a.id === action.address.id ? action.address : a))
          : [...state.addresses, action.address],
        selectedAddressId: action.address.id,
      }
    }
    case 'address/select':
      return { ...state, selectedAddressId: action.id }
    case 'address/delete': {
      const addresses = state.addresses.filter((a) => a.id !== action.id)
      return {
        ...state,
        addresses,
        selectedAddressId: state.selectedAddressId === action.id ? (addresses[0]?.id ?? null) : state.selectedAddressId,
      }
    }
    case 'slot/set':
      return { ...state, slot: action.slot }
    case 'subscription/set':
      return { ...state, subscription: action.subscription }
    case 'combo/set':
      return { ...state, combos: { ...state.combos, [action.planId]: action.items } }
    case 'order/place':
      return { ...state, orders: [action.order, ...state.orders], cart: [], slot: null }
    case 'health/sleep': {
      const sleepHours = state.health.sleepHours.map((h, i) => (i === action.index ? action.hours : h))
      return { ...state, health: { ...state.health, sleepHours } }
    }
    case 'health/dietician':
      return { ...state, health: { ...state.health, dietician: action.choice } }
    case 'reset':
      return initialState()
  }
}

const isArray = Array.isArray

/** Merge whatever is in storage over the defaults, keeping only well-formed pieces. */
function hydrate(): AppState {
  const base = initialState()
  const saved = readPersisted()
  if (!saved || typeof saved !== 'object') return base
  const s = saved as Partial<AppState>
  const sleep = s.health?.sleepHours
  return {
    profile: typeof s.profile?.name === 'string' && s.profile.name.trim() ? { name: s.profile.name } : base.profile,
    cart: isArray(s.cart) ? s.cart.filter((l) => l && typeof l.dishId === 'string' && l.qty > 0) : base.cart,
    favorites: isArray(s.favorites) ? s.favorites : base.favorites,
    addresses: isArray(s.addresses) && s.addresses.length > 0 ? s.addresses : base.addresses,
    selectedAddressId: typeof s.selectedAddressId === 'string' || s.selectedAddressId === null ? s.selectedAddressId : base.selectedAddressId,
    slot: s.slot && typeof s.slot.time === 'string' ? s.slot : null,
    subscription: s.subscription && typeof s.subscription.planId === 'string' ? s.subscription : null,
    combos: s.combos && typeof s.combos === 'object' ? s.combos : base.combos,
    orders: isArray(s.orders) ? s.orders : base.orders,
    health: {
      sleepHours: isArray(sleep) && sleep.length === 7 && sleep.every((h) => typeof h === 'number') ? sleep : base.health.sleepHours,
      dietician: s.health?.dietician === 'declined' || s.health?.dietician === 'accepted' ? s.health.dietician : 'unset',
    },
  }
}

export function makeOrderId(): string {
  return `BF${Math.floor(100000 + Math.random() * 900000)}`
}

export function makeAddressId(): string {
  return `addr-${Date.now().toString(36)}`
}

interface AppContextValue {
  state: AppState
  actions: {
    setProfileName: (name: string) => void
    toggleDish: (dishId: string) => void
    addToCart: (dishId: string, extra?: { qty?: number; addOnIds?: string[]; options?: DishOptions }) => void
    setQty: (dishId: string, qty: number) => void
    setAddOns: (dishId: string, addOnIds: string[]) => void
    setOptions: (dishId: string, options: DishOptions) => void
    clearCart: () => void
    toggleFavorite: (dishId: string) => void
    saveAddress: (address: Address) => void
    selectAddress: (id: string) => void
    deleteAddress: (id: string) => void
    setSlot: (slot: Slot | null) => void
    setSubscription: (subscription: Subscription | null) => void
    setCombo: (planId: PlanId, items: string[]) => void
    placeOrder: (order: Order) => void
    setSleepHours: (index: number, hours: number) => void
    setDietician: (choice: HealthState['dietician']) => void
    resetAll: () => void
  }
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, hydrate)

  useEffect(() => {
    writePersisted(state)
  }, [state])

  const actions = useMemo<AppContextValue['actions']>(
    () => ({
      setProfileName: (name) => dispatch({ type: 'profile/set', name }),
      toggleDish: (dishId) => dispatch({ type: 'cart/toggle', dishId }),
      addToCart: (dishId, extra) => dispatch({ type: 'cart/add', dishId, ...extra }),
      setQty: (dishId, qty) => dispatch({ type: 'cart/setQty', dishId, qty }),
      setAddOns: (dishId, addOnIds) => dispatch({ type: 'cart/setAddOns', dishId, addOnIds }),
      setOptions: (dishId, options) => dispatch({ type: 'cart/setOptions', dishId, options }),
      clearCart: () => dispatch({ type: 'cart/clear' }),
      toggleFavorite: (dishId) => dispatch({ type: 'fav/toggle', dishId }),
      saveAddress: (address) => dispatch({ type: 'address/save', address }),
      selectAddress: (id) => dispatch({ type: 'address/select', id }),
      deleteAddress: (id) => dispatch({ type: 'address/delete', id }),
      setSlot: (slot) => dispatch({ type: 'slot/set', slot }),
      setSubscription: (subscription) => dispatch({ type: 'subscription/set', subscription }),
      setCombo: (planId, items) => dispatch({ type: 'combo/set', planId, items }),
      placeOrder: (order) => dispatch({ type: 'order/place', order }),
      setSleepHours: (index, hours) => dispatch({ type: 'health/sleep', index, hours }),
      setDietician: (choice) => dispatch({ type: 'health/dietician', choice }),
      resetAll: () => {
        clearPersisted()
        dispatch({ type: 'reset' })
      },
    }),
    [],
  )

  const value = useMemo(() => ({ state, actions }), [state, actions])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppStateProvider>')
  return ctx
}
