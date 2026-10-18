import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LineChart } from '../../components/charts/LineChart'
import { LogSleepSheet } from '../../components/features/LogSleepSheet'
import { RefreshIcon } from '../../components/icons'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { Skeleton } from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'
import { DAYS } from '../../data/health'
import { useAsync } from '../../lib/useAsync'
import { getHealthReport } from '../../services/api'
import { useApp } from '../../state/AppState'
import styles from './Health.module.css'

export function Health() {
  const navigate = useNavigate()
  const toast = useToast()
  const { state, actions } = useApp()
  const { data: report, loading, error, reload } = useAsync(getHealthReport)
  const [logOpen, setLogOpen] = useState(false)
  const dietician = state.health.dietician

  const accept = () => {
    actions.setDietician('accepted')
    navigate('/health/insights')
  }

  const decline = () => {
    actions.setDietician('declined')
    toast.show('No problem — you can turn dietician support on anytime.', {
      actionLabel: 'Undo',
      onAction: () => actions.setDietician('unset'),
    })
  }

  return (
    <>
      <TopBar title="Health management" />

      <div className={styles.content}>
        <section className={styles.card} aria-labelledby="weekly-title">
          <div className={styles.cardHeading}>
            <h2 id="weekly-title" className={styles.title}>
              Weekly progress
            </h2>
            <Button variant="pill" onClick={() => setLogOpen(true)} aria-haspopup="dialog">
              Log sleep
            </Button>
          </div>
          <LineChart labels={DAYS} values={state.health.sleepHours} label="Hours of sleep each day this week" />
        </section>

        <section aria-labelledby="report-title">
          <h2 id="report-title" className={styles.title}>
            Personalized report
          </h2>
          {error ? (
            <EmptyState
              tone="error"
              icon={<RefreshIcon />}
              title="Couldn’t load your report"
              text="Check your connection and try again."
              action={<Button variant="pill" onClick={reload}>Try again</Button>}
            />
          ) : loading || !report ? (
            <div className={styles.reportSkeleton} role="status" aria-label="Loading report">
              <Skeleton style={{ height: 64 }} />
              <Skeleton style={{ height: 64 }} />
              <Skeleton style={{ height: 76 }} />
            </div>
          ) : (
            <>
              <div className={styles.group}>
                <h3 className={styles.groupTitle}>Popular carbs</h3>
                <ul className={styles.chips}>
                  {report.carbs.map((item) => (
                    <li key={item} className={styles.chip}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.group}>
                <h3 className={styles.groupTitle}>Popular proteins</h3>
                <ul className={styles.chips}>
                  {report.proteins.map((item) => (
                    <li key={item} className={styles.chip}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <dl className={styles.stats}>
                {report.stats.map((stat) => (
                  <div key={stat.label} className={styles.stat}>
                    <dd className={styles.statValue}>{stat.value}%</dd>
                    <dt className={styles.statLabel}>{stat.label}</dt>
                  </div>
                ))}
              </dl>
            </>
          )}
        </section>

        <section className={styles.banner} aria-label="Dietician support">
          {dietician === 'unset' && (
            <>
              <p className={styles.bannerText}>
                Do you prefer our dietician recommended food for managing your weight ? <span className={styles.charges}>(Charges applied)</span>
              </p>
              <div className={styles.bannerActions}>
                <button type="button" className={styles.ghost} onClick={decline}>
                  No, Thanks
                </button>
                <button type="button" className={styles.solid} onClick={accept}>
                  Yes, continue
                </button>
              </div>
            </>
          )}
          {dietician === 'accepted' && (
            <>
              <p className={styles.bannerText}>Dietician support is on. Your personalised insights and picks are ready.</p>
              <div className={styles.bannerActions}>
                <button type="button" className={styles.ghost} onClick={() => actions.setDietician('declined')}>
                  Turn off
                </button>
                <Link to="/health/insights" className={styles.solid}>
                  View insights
                </Link>
              </div>
            </>
          )}
          {dietician === 'declined' && (
            <>
              <p className={styles.bannerText}>You’ve skipped dietician support for now. Changed your mind?</p>
              <div className={styles.bannerActions}>
                <button type="button" className={styles.solid} onClick={accept}>
                  Enable
                </button>
              </div>
            </>
          )}
        </section>
      </div>

      <LogSleepSheet open={logOpen} onClose={() => setLogOpen(false)} />
    </>
  )
}
