import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DonutChart } from '../../components/charts/DonutChart'
import { ProgressBar } from '../../components/charts/ProgressBar'
import { DishGrid } from '../../components/DishGrid'
import { FilterSheet } from '../../components/features/FilterSheet'
import { SummarySheet } from '../../components/features/SummarySheet'
import { RefreshIcon } from '../../components/icons'
import { ActionBar } from '../../components/layout/ActionBar'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { Skeleton } from '../../components/ui/Skeleton'
import { DISH_BY_ID } from '../../data/dishes'
import { applyFilter, DEFAULT_FILTER, isFilterActive } from '../../lib/filters'
import { useAsync } from '../../lib/useAsync'
import { getInsights } from '../../services/api'
import styles from './Insights.module.css'

export function Insights() {
  const navigate = useNavigate()
  const { data, loading, error, reload } = useAsync(getInsights)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [filter, setFilter] = useState(DEFAULT_FILTER)

  const recommended = useMemo(
    () => applyFilter((data?.recommendedIds ?? []).map((id) => DISH_BY_ID[id]).filter(Boolean), filter),
    [data, filter],
  )

  return (
    <>
      <TopBar title="Dietician’s insight" backFallback="/health" />

      {error ? (
        <EmptyState
          tone="error"
          icon={<RefreshIcon />}
          title="Couldn’t load your insights"
          text="Check your connection and try again."
          action={<Button variant="pill" onClick={reload}>Try again</Button>}
        />
      ) : (
        <div className={styles.content}>
          <section aria-labelledby="insights-title">
            <div className={styles.heading}>
              <h2 id="insights-title" className={styles.title}>
                Health insights
              </h2>
              <Button variant="link" onClick={() => setSummaryOpen(true)} disabled={!data} aria-haspopup="dialog">
                View full summary
              </Button>
            </div>

            {loading || !data ? (
              <div className={styles.skeletons} role="status" aria-label="Loading insights">
                <Skeleton style={{ height: 150 }} />
                <Skeleton style={{ height: 150 }} />
              </div>
            ) : (
              <>
                <div className={styles.donuts}>
                  {data.macros.map((macro) => (
                    <DonutChart key={macro.key} label={macro.label} percent={macro.percent} shades={macro.shades} weights={macro.weights} accent={macro.accent} />
                  ))}
                </div>
                <div className={styles.bars}>
                  {data.bars.map((bar) => (
                    <ProgressBar key={bar.label} {...bar} />
                  ))}
                </div>
              </>
            )}
          </section>

          <DishGrid
            title="Dietician recommended food"
            dishes={recommended}
            row
            loading={loading}
            onFilter={() => setFilterOpen(true)}
            filterActive={isFilterActive(filter)}
            headingId="insights-recommended"
            empty={
              <EmptyState
                title="No picks match"
                text="Try a different filter."
                action={
                  <Button variant="pill" onClick={() => setFilter(DEFAULT_FILTER)}>
                    Reset filter
                  </Button>
                }
              />
            }
          />
        </div>
      )}

      <ActionBar>
        <Button variant="outline" onClick={() => navigate('/health')}>
          Not this time
        </Button>
        <Button onClick={() => navigate('/health/recommendations')}>Proceed</Button>
      </ActionBar>

      {data && <SummarySheet open={summaryOpen} onClose={() => setSummaryOpen(false)} insights={data} />}
      <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} value={filter} onApply={setFilter} />
    </>
  )
}
