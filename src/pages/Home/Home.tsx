import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppHeader } from '../../components/AppHeader'
import { SearchRow } from '../../components/SearchRow'
import { HeroBanner } from '../../components/HeroBanner'
import { CategoryRow } from '../../components/CategoryRow'
import { DishGrid } from '../../components/DishGrid'
import { FilterSheet } from '../../components/features/FilterSheet'
import { RefreshIcon, SearchIcon } from '../../components/icons'
import { useShell } from '../../components/layout/ShellContext'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { useToast } from '../../components/ui/Toast'
import { APP_TAGLINE, APP_TITLE, CATEGORIES, HERO_IMAGES, SEARCH_EXAMPLE } from '../../data/home'
import { applyFilter, DEFAULT_FILTER, isFilterActive, matchesQuery } from '../../lib/filters'
import { useAsync } from '../../lib/useAsync'
import { useVoiceSearch } from '../../lib/useVoiceSearch'
import { getDishes } from '../../services/api'
import { useApp } from '../../state/AppState'
import styles from './Home.module.css'

export function Home() {
  const navigate = useNavigate()
  const toast = useToast()
  const { openProfile } = useShell()
  const { state } = useApp()
  const { data: dishes, loading, error, reload } = useAsync(getDishes)

  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id)
  const [filter, setFilter] = useState(DEFAULT_FILTER)
  const [filterOpen, setFilterOpen] = useState(false)

  const voice = useVoiceSearch({
    onResult: (text) => {
      setQuery(text)
      setActiveCategory('all')
      toast.show(`Searching for “${text}”`, { tone: 'info' })
    },
    onProblem: (message) => toast.show(message, { tone: 'error', duration: 5000 }),
  })

  const visible = useMemo(() => {
    const inCategory = (dishes ?? []).filter((dish) => activeCategory === 'all' || dish.categories.some((c) => c === activeCategory))
    return applyFilter(
      inCategory.filter((dish) => matchesQuery(dish, query)),
      filter,
    )
  }, [dishes, activeCategory, query, filter])

  const searching = query.trim().length > 0
  const category = CATEGORIES.find((c) => c.id === activeCategory)
  const narrowed = searching || activeCategory !== 'all' || isFilterActive(filter)
  const title = searching
    ? `${visible.length} ${visible.length === 1 ? 'result' : 'results'} for “${query.trim()}”`
    : activeCategory === 'all'
      ? 'Explore Healthy breakfast'
      : category?.label ?? 'Explore Healthy breakfast'

  const clearAll = () => {
    setQuery('')
    setActiveCategory('all')
    setFilter(DEFAULT_FILTER)
  }

  return (
    <div className={styles.page}>
      <div className={styles.greenTop}>
        <div className={styles.ring} aria-hidden="true" />
        <div className={styles.greenContent}>
          <AppHeader title={APP_TITLE} subtitle={APP_TAGLINE} initial={state.profile.name.trim().charAt(0).toUpperCase() || 'A'} onProfile={openProfile} />
          <SearchRow example={SEARCH_EXAMPLE} value={query} onChange={setQuery} onVoice={voice.start} listening={voice.listening} />
          <HeroBanner topRightImage={HERO_IMAGES.topRight} bottomLeftImage={HERO_IMAGES.bottomLeft} onExplore={() => navigate('/plans')} />
        </div>
      </div>

      <CategoryRow categories={CATEGORIES} activeId={activeCategory} onSelect={setActiveCategory} />

      {error ? (
        <EmptyState
          tone="error"
          icon={<RefreshIcon />}
          title="Couldn’t load the menu"
          text="Check your connection and try again."
          action={<Button variant="pill" onClick={reload}>Try again</Button>}
        />
      ) : (
        <DishGrid
          title={title}
          dishes={visible}
          loading={loading}
          onFilter={() => setFilterOpen(true)}
          filterActive={isFilterActive(filter)}
          headingId="home-dishes"
          empty={
            <EmptyState
              icon={<SearchIcon />}
              title="No dishes found"
              text={searching ? `Nothing matches “${query.trim()}”. Try a different word, like idli or salad.` : 'No dishes match these filters.'}
              action={
                narrowed && (
                  <Button variant="pill" onClick={clearAll}>
                    Clear search & filters
                  </Button>
                )
              }
            />
          }
        />
      )}

      <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} value={filter} onApply={setFilter} />
    </div>
  )
}
