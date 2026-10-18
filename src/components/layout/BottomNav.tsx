import type { ComponentType, SVGProps } from 'react'
import { NavLink } from 'react-router-dom'
import { HealthTrackerIcon, HeartIcon, HomeIcon } from '../icons'
import styles from './BottomNav.module.css'

const NAV_ITEMS: { to: string; label: string; end?: boolean; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { to: '/', label: 'Home', end: true, Icon: HomeIcon },
  { to: '/health', label: 'Health Tracker', Icon: HealthTrackerIcon },
  { to: '/favorites', label: 'Favorites', Icon: HeartIcon },
]

export function BottomNav() {
  return (
    <nav className={styles.nav} aria-label="Primary">
      {NAV_ITEMS.map(({ to, label, end, Icon }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => `${styles.item} ${isActive ? styles.itemActive : ''}`}>
          <span className={styles.iconWrap}>
            <Icon className={styles.icon} />
          </span>
          <span className={styles.label}>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
