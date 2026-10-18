import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DishGrid } from '../../components/DishGrid'
import { FilterSheet } from '../../components/features/FilterSheet'
import { HeartIcon } from '../../components/icons'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { DISH_BY_ID } from '../../data/dishes'
import { applyFilter, DEFAULT_FILTER, isFilterActive } from '../../lib/filters'
import { useApp } from '../../state/AppState'

export function Favorites() {
  const navigate = useNavigate()
  const { state } = useApp()
  const [filter, setFilter] = useState(DEFAULT_FILTER)
  const [filterOpen, setFilterOpen] = useState(false)

  const saved = useMemo(() => state.favorites.map((id) => DISH_BY_ID[id]).filter(Boolean), [state.favorites])
  const visible = useMemo(() => applyFilter(saved, filter), [saved, filter])

  return (
    <>
      <TopBar title="Favorites" />
      {saved.length === 0 ? (
        <EmptyState
          icon={<HeartIcon />}
          title="No favorites yet"
          text="Tap the heart on any dish to save it here for quick reordering."
          action={
            <Button variant="pill" onClick={() => navigate('/')}>
              Explore breakfast
            </Button>
          }
        />
      ) : (
        <DishGrid
          title={`Your favorites (${saved.length})`}
          dishes={visible}
          heart
          onFilter={() => setFilterOpen(true)}
          filterActive={isFilterActive(filter)}
          headingId="favorites-title"
          empty={
            <EmptyState
              title="No favorites match"
              text="Try a different filter."
              action={
                <Button variant="pill" onClick={() => setFilter(DEFAULT_FILTER)}>
                  Reset filter
                </Button>
              }
            />
          }
        />
      )}
      <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} value={filter} onApply={setFilter} />
    </>
  )
}
