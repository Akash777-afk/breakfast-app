import { useEffect, useState } from 'react'
import { BrandLogo } from '../BrandLogo'
import styles from './Splash.module.css'

const SEEN_KEY = 'breakfit:splash-seen'

function alreadySeen(): boolean {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

/** Brand splash, shown once per browser session. Tap anywhere to skip. */
export function Splash() {
  const [phase, setPhase] = useState<'show' | 'leaving' | 'gone'>(() => (alreadySeen() ? 'gone' : 'show'))

  useEffect(() => {
    if (phase !== 'show') return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = window.setTimeout(() => setPhase('leaving'), reduced ? 700 : 1800)
    return () => window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'leaving') return
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* storage unavailable — splash will just show again next load */
    }
    const timer = window.setTimeout(() => setPhase('gone'), 450)
    return () => window.clearTimeout(timer)
  }, [phase])

  if (phase === 'gone') return null

  return (
    <div className={`${styles.splash} ${phase === 'leaving' ? styles.leaving : ''}`} onClick={() => setPhase('leaving')} role="presentation">
      <div className={styles.center}>
        <BrandLogo className={styles.logo} />
        <h1 className={styles.title}>BreakFit</h1>
        <p className={styles.tagline}>Daily breakfast made simple</p>
      </div>
    </div>
  )
}
