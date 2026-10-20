import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AddOnCard } from '../../components/AddOnCard'
import { FilterSheet } from '../../components/features/FilterSheet'
import { CustomizeSheet } from '../../components/features/CustomizeSheet'
import { HeartIcon, RefreshIcon } from '../../components/icons'
import { ActionBar } from '../../components/layout/ActionBar'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/Button'
import { FilterButton, InfoPill } from '../../components/ui/Chip'
import { EmptyState } from '../../components/ui/EmptyState'
import { SkeletonGrid } from '../../components/ui/Skeleton'
import { Stepper } from '../../components/ui/Stepper'
import { useToast } from '../../components/ui/Toast'
import { DISH_BY_ID } from '../../data/dishes'
import { toggleAddOnId } from '../../lib/addons'
import { applyFilter, DEFAULT_FILTER, isFilterActive } from '../../lib/filters'
import { rupees } from '../../lib/format'
import { lineTotal } from '../../lib/pricing'
import { useAsync } from '../../lib/useAsync'
import { getAddOns } from '../../services/api'
import { DEFAULT_OPTIONS, useApp } from '../../state/AppState'
import type { Dish, DishOptions } from '../../types'
import { NotFound } from '../NotFound'
import styles from './Dish.module.css'

export function DishPage() {
  const { id = '' } = useParams()
  const dish = DISH_BY_ID[id]
  if (!dish) return <NotFound title="Dish not found" text="We couldn’t find that dish. It may have been removed from the menu." />
  return <DishDetail key={dish.id} dish={dish} />
}

const SPICE_LABEL = { mild: 'Mild', medium: 'Medium', spicy: 'Spicy' } as const

function DishDetail({ dish }: { dish: Dish }) {
  const navigate = useNavigate()
  const toast = useToast()
  const { state, actions } = useApp()
  const { data: addOns, loading, error, reload } = useAsync(() => getAddOns(dish.id), [dish.id])

  const line = state.cart.find((l) => l.dishId === dish.id)
  const favorite = state.favorites.includes(dish.id)

  // Until the dish is in the order, selections are held locally and applied when it is added.
  const [draftAddOns, setDraftAddOns] = useState<string[]>([])
  const [draftOptions, setDraftOptions] = useState<DishOptions>(DEFAULT_OPTIONS)
  const addOnIds = line ? line.addOnIds : draftAddOns
  const options = line ? line.options : draftOptions

  const [customizeOpen, setCustomizeOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [filter, setFilter] = useState(DEFAULT_FILTER)

  const visibleAddOns = useMemo(() => applyFilter(addOns ?? [], filter), [addOns, filter])
  const total = lineTotal({ dishId: dish.id, qty: line?.qty ?? 1, addOnIds, options })

  const toggleAddOn = (addOnId: string) => {
    const next = toggleAddOnId(addOnIds, addOnId)
    if (line) actions.setAddOns(dish.id, next)
    else setDraftAddOns(next)
  }

  const saveOptions = (next: DishOptions) => {
    if (line) actions.setOptions(dish.id, next)
    else setDraftOptions(next)
    toast.show('Customization saved')
  }

  const addDish = () => {
    actions.addToCart(dish.id, { addOnIds: draftAddOns, options: draftOptions })
    toast.show(`${dish.name} added to your order`)
  }

  const changeQty = (qty: number) => {
    if (qty <= 0 && line) {
      setDraftAddOns(line.addOnIds)
      setDraftOptions(line.options)
      toast.show(`${dish.name} removed from your order`, { actionLabel: 'Undo', onAction: () => actions.addToCart(dish.id, { addOnIds: line.addOnIds, options: line.options }) })
    }
    actions.setQty(dish.id, qty)
  }

  const toggleFavorite = () => {
    actions.toggleFavorite(dish.id)
    toast.show(favorite ? `Removed ${dish.name} from favorites` : `Saved ${dish.name} to favorites`, {
      actionLabel: 'Undo',
      onAction: () => actions.toggleFavorite(dish.id),
    })
  }

  const proceed = () => {
    if (!line) actions.addToCart(dish.id, { addOnIds: draftAddOns, options: draftOptions })
    navigate('/checkout')
  }

  const customised = options.portion !== 'regular' || options.spice !== 'medium' || options.note.trim() !== ''

  return (
    <>
      <TopBar title="Customize your order" />

      <div className={styles.content}>
        <section className={styles.dish} aria-labelledby="dish-name">
          <img className={styles.photo} src={dish.image} alt={dish.name} />
          <div className={styles.info}>
            <div className={styles.nameRow}>
              <h2 id="dish-name" className={styles.name}>
                {dish.name}
              </h2>
              <button
                type="button"
                className={`${styles.heart} ${favorite ? styles.heartOn : ''}`}
                aria-pressed={favorite}
                aria-label={favorite ? `Remove ${dish.name} from favorites` : `Save ${dish.name} to favorites`}
                onClick={toggleFavorite}
              >
                <HeartIcon filled={favorite} className={styles.heartIcon} />
              </button>
            </div>
            <p className={styles.description}>{dish.description}</p>
            <div className={styles.actions}>
              <Button variant="link" onClick={() => setCustomizeOpen(true)} aria-haspopup="dialog">
                Customize
              </Button>
              {line ? (
                <Stepper value={line.qty} onChange={changeQty} label={dish.name} removable size="sm" />
              ) : (
                <Button variant="pill" onClick={addDish}>
                  Add +
                </Button>
              )}
            </div>
          </div>
        </section>

        <div className={styles.facts}>
          <InfoPill tone="green">{rupees(dish.price)}</InfoPill>
          <InfoPill>{dish.calories} kcal</InfoPill>
          <InfoPill>{dish.protein}g protein</InfoPill>
          <InfoPill tone={dish.diet === 'veg' ? 'green' : 'orange'}>{dish.diet === 'veg' ? 'Veg' : 'Contains egg'}</InfoPill>
        </div>

        {customised && (
          <p className={styles.applied}>
            <strong>Your changes:</strong> {options.portion === 'large' ? 'Large portion' : 'Regular portion'} · {SPICE_LABEL[options.spice]} spice
            {options.note.trim() && ` · “${options.note.trim()}”`}
          </p>
        )}

        {/* A dish with nothing sensible to add (a boiled egg, a bowl of sambar) simply has no add-on section. */}
        {(loading || error || (addOns && addOns.length > 0)) && (
        <section className={styles.addOns} aria-labelledby="addons-title">
          <div className={styles.addOnsHeading}>
            <h2 id="addons-title" className={styles.sectionTitle}>
              Select your add ons
            </h2>
            <FilterButton onClick={() => setFilterOpen(true)} active={isFilterActive(filter)} />
          </div>

          {error ? (
            <EmptyState
              tone="error"
              icon={<RefreshIcon />}
              title="Couldn’t load add ons"
              text="Check your connection and try again."
              action={<Button variant="pill" onClick={reload}>Try again</Button>}
            />
          ) : loading ? (
            <div className={styles.gridWrap}>
              <SkeletonGrid count={6} />
            </div>
          ) : visibleAddOns.length === 0 ? (
            <EmptyState title="No add ons match" text="Try changing the filter." action={<Button variant="pill" onClick={() => setFilter(DEFAULT_FILTER)}>Reset filter</Button>} />
          ) : (
            <div className={styles.grid}>
              {visibleAddOns.map((addOn) => (
                <AddOnCard key={addOn.id} addOn={addOn} selected={addOnIds.includes(addOn.id)} onToggle={() => toggleAddOn(addOn.id)} />
              ))}
            </div>
          )}
        </section>
        )}
      </div>

      <ActionBar note={`${line ? `${line.qty} × ` : ''}${dish.name}${addOnIds.length ? ` + ${addOnIds.length} add on${addOnIds.length > 1 ? 's' : ''}` : ''} · ${rupees(total)}`}>
        <Button variant="outline" onClick={() => navigate('/')}>
          Back to home
        </Button>
        <Button onClick={proceed}>Proceed checkout</Button>
      </ActionBar>

      <CustomizeSheet open={customizeOpen} onClose={() => setCustomizeOpen(false)} dish={dish} value={options} onSave={saveOptions} />
      <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} value={filter} onApply={setFilter} sorts={['recommended', 'price-asc']} />
    </>
  )
}
