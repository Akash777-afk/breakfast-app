import { useEffect, useState } from 'react'
import styles from './DeliveryMap.module.css'

const HOME = { x: 296, y: 214 }
const KITCHEN = { x: 92, y: 392 }
const ROUTE = `M${KITCHEN.x} ${KITCHEN.y} L${KITCHEN.x} 330 L186 330 L186 262 L${HOME.x} 262 L${HOME.x} ${HOME.y}`

interface DeliveryMapProps {
  /** Zooms in on the delivery address (the "locate me" action). */
  zoomed: boolean
}

/** Illustrative map: streets, a park, a river, the kitchen, and the route to the delivery address. */
export function DeliveryMap({ zoomed }: DeliveryMapProps) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(query.matches)
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return (
    <svg className={styles.map} viewBox="0 0 430 640" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Map showing the route from our kitchen to your delivery address">
      <g className={`${styles.world} ${zoomed ? styles.zoomed : ''}`}>
        <rect width="430" height="640" fill="#e8eee4" />
        {/* river */}
        <path d="M-20 90 C 80 120, 120 40, 230 70 S 380 130, 460 80 L460 130 C 380 180, 260 120, 220 118 S 60 190, -20 150 Z" fill="#bfdcec" />
        {/* park */}
        <rect x="236" y="300" width="150" height="104" rx="14" fill="#c9e3b0" />
        <circle cx="270" cy="332" r="12" fill="#a9d28a" />
        <circle cx="318" cy="366" r="16" fill="#a9d28a" />
        <circle cx="356" cy="324" r="10" fill="#a9d28a" />
        {/* blocks */}
        <g fill="#f6f4ee">
          <rect x="20" y="190" width="70" height="56" rx="6" />
          <rect x="110" y="190" width="60" height="56" rx="6" />
          <rect x="20" y="268" width="56" height="46" rx="6" />
          <rect x="110" y="268" width="62" height="46" rx="6" />
          <rect x="20" y="420" width="56" height="70" rx="6" />
          <rect x="110" y="420" width="90" height="70" rx="6" />
          <rect x="226" y="430" width="70" height="60" rx="6" />
          <rect x="316" y="430" width="80" height="60" rx="6" />
          <rect x="20" y="520" width="150" height="70" rx="6" />
          <rect x="196" y="520" width="200" height="70" rx="6" />
          <rect x="206" y="190" width="56" height="56" rx="6" />
          <rect x="330" y="190" width="70" height="56" rx="6" />
        </g>
        {/* streets */}
        <g stroke="#ffffff" strokeWidth="14" strokeLinecap="round" fill="none">
          <path d="M-10 260 H 440" />
          <path d="M-10 330 H 440" />
          <path d="M-10 500 H 440" />
          <path d="M186 160 V 640" />
          <path d="M92 160 V 640" />
          <path d="M296 160 V 640" />
        </g>
        <g stroke="#d9dfd5" strokeWidth="1.5" fill="none">
          <path d="M-10 260 H 440" strokeDasharray="6 8" />
          <path d="M186 160 V 640" strokeDasharray="6 8" />
        </g>
        {/* route */}
        <path d={ROUTE} fill="none" stroke="#039719" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 10" />
        <path id="route-path" d={ROUTE} fill="none" stroke="none" />

        {/* kitchen */}
        <g transform={`translate(${KITCHEN.x} ${KITCHEN.y})`}>
          <circle r="18" fill="#073d10" />
          <path d="M-8 -3 h16 v10 h-16 z M-10 -3 l2 -7 h16 l2 7" fill="none" stroke="#c6e84d" strokeWidth="2" strokeLinejoin="round" />
        </g>

        {/* delivery partner */}
        {!reducedMotion && (
          <g>
            <circle r="9" fill="#f08a24" stroke="#fff" strokeWidth="3" />
            <animateMotion dur="9s" repeatCount="indefinite" rotate="0">
              <mpath href="#route-path" />
            </animateMotion>
          </g>
        )}

        {/* home */}
        <g transform={`translate(${HOME.x} ${HOME.y})`}>
          <circle r="26" fill="#039719" opacity="0.18" className={reducedMotion ? undefined : styles.pulse} />
          <path d="M0 -4 C -16 -24 -22 -34 -22 -42 a22 22 0 0 1 44 0 c0 8 -6 18 -22 38 z" transform="translate(0 4)" fill="#039719" stroke="#fff" strokeWidth="3" />
          <circle cx="0" cy="-38" r="8" fill="#fff" />
        </g>
      </g>
    </svg>
  )
}
