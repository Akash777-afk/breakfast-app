import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DishGrid } from '../../components/DishGrid'
import { FilterSheet } from '../../components/features/FilterSheet'
import { RefreshIcon } from '../../components/icons'
import { ActionBar } from '../../components/layout/ActionBar'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { DISH_BY_ID } from '../../data/dishes'
import { applyFilter, DEFAULT_FILTER, isFilterActive } from '../../lib/filters'
import { useAsync } from '../../lib/useAsync'
import { getRecommendations } from '../../services/api'
import { useApp } from '../../state/AppState'
import type { Dish, FilterState } from '../../types'
import styles from './Recommendations.module.css'

const MAX_PREFERRED = 9

export function Recommendations() {
  const navigate = useNavigate()
  const { state } = useApp()
  const { data, loading, error, reload } = useAsync(getRecommendations)

  const [preferredFilter, setPreferredFilter] = useState<FilterState>(DEFAULT_FILTER)
  const [recommendedFilter, setRecommendedFilter] = useState<FilterState>(DEFAULT_FILTER)
  const [sheet, setSheet] = useState<'none' | 'preferred' | 'recommended'>('none')

  // Favourites come first, then sensible defaults so a brand-new user still sees a full grid.
  const preferred = useMemo(() => {
    const ids = [...new Set([...state.favorites, ...(data?.defaultPreferredIds ?? [])])].slice(0, MAX_PREFERRED)
    return applyFilter(
      ids.map((id) => DISH_BY_ID[id]).filter((d): d is Dish => Boolean(d)),
      preferredFilter,
    )
  }, [state.favorites, data, preferredFilter])

  const recommended = useMemo(
    () =>
      applyFilter(
        (data?.recommendedIds ?? []).map((id) => DISH_BY_ID[id]).filter((d): d is Dish => Boolean(d)),
        recommendedFilter,
      ),
    [data, recommendedFilter],
  )

  const noMatches = (reset: () => void) => (
    <EmptyState
      title="Nothing matches"
      text="Try a different filter."
      action={
        <Button variant="pill" onClick={reset}>
          Reset filter
        </Button>
      }
    />
  )

  const cartEmpty = state.cart.length === 0

  return (
    <>
      <TopBar title="Recommendations" backFallback="/health" />

      {error ? (
        <EmptyState
          tone="error"
          icon={<RefreshIcon />}
          title="Couldn’t load recommendations"
          text="Check your connection and try again."
          action={<Button variant="pill" onClick={reload}>Try again</Button>}
        />
      ) : (
        <div className={styles.body}>
          <DishGrid
            title="Your preferred food"
            dishes={preferred}
            loading={loading}
            onFilter={() => setSheet('preferred')}
            filterActive={isFilterActive(preferredFilter)}
            headingId="preferred-title"
            empty={noMatches(() => setPreferredFilter(DEFAULT_FILTER))}
          />
          <DishGrid
            title="Dietician recommended food"
            dishes={recommended}
            row
            loading={loading}
            onFilter={() => setSheet('recommended')}
            filterActive={isFilterActive(recommendedFilter)}
            headingId="recommended-title"
            empty={noMatches(() => setRecommendedFilter(DEFAULT_FILTER))}
          />
        </div>
      )}

      <ActionBar note={cartEmpty ? 'Add at least one item to check out.' : undefined}>
        <Button variant="outline" onClick={() => navigate('/')}>
          Add more items
        </Button>
        <Button onClick={() => navigate('/checkout')} disabled={cartEmpty}>
          Checkout
        </Button>
      </ActionBar>

      <FilterSheet open={sheet === 'preferred'} onClose={() => setSheet('none')} value={preferredFilter} onApply={setPreferredFilter} />
      <FilterSheet open={sheet === 'recommended'} onClose={() => setSheet('none')} value={recommendedFilter} onApply={setRecommendedFilter} />
    </>
  )
}
