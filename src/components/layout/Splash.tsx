import { useEffect, useState } from 'react'
import styles from './Splash.module.css'

const SEEN_KEY = 'breakfit:splash-seen'

function alreadySeen(): boolean {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

function BreakFitLogo() {
  return (
    <svg className={styles.logo} viewBox="0 0 120 148" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="BreakFit logo">
      <path
        d="M60 4C48 18 30 40 30 68C30 95.5 44 116 60 132C76 116 90 95.5 90 68C90 52 83 40 76 30C77 42 71 50 63 50C66 34 66 16 60 4Z"
        fill="#fbf6e9"
      />
      <g stroke="#0e7c36" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M50 62V108" />
        <path d="M42 62C42 68.5 45.5 73.5 50 73.5C54.5 73.5 58 68.5 58 62" />
        <path d="M72 62V108" />
        <path d="M72 62V80" />
        <path d="M65 62V80" />
        <path d="M79 62V80" />
      </g>
    </svg>
  )
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
        <BreakFitLogo />
        <h1 className={styles.title}>BreakFit</h1>
        <p className={styles.tagline}>Daily breakfast made simple</p>
      </div>
    </div>
  )
}
