import type { ComponentType, SVGProps } from 'react'
import { NavLink } from 'react-router-dom'
import { PLANS } from '../../data/plans'
import { useApp } from '../../state/AppState'
import { HealthTrackerIcon, HeartIcon, HomeIcon, ReceiptIcon, RefreshIcon, TagIcon, UserIcon } from '../icons'
import { Sheet } from '../ui/Overlay'
import styles from './MenuSheet.module.css'

interface MenuSheetProps {
  open: boolean
  onClose: () => void
  onProfile: () => void
  onReset: () => void
}

type IconType = ComponentType<SVGProps<SVGSVGElement>>

const LINKS: { to: string; label: string; end?: boolean; Icon: IconType }[] = [
  { to: '/', label: 'Home', end: true, Icon: HomeIcon },
  { to: '/health', label: 'Health Tracker', Icon: HealthTrackerIcon },
  { to: '/favorites', label: 'Favorites', Icon: HeartIcon },
  { to: '/orders', label: 'My orders', Icon: ReceiptIcon },
  { to: '/plans', label: 'Subscription plans', Icon: TagIcon },
]

export function MenuSheet({ open, onClose, onProfile, onReset }: MenuSheetProps) {
  const { state } = useApp()
  const plan = state.subscription ? PLANS.find((p) => p.id === state.subscription?.planId) : undefined

  return (
    <Sheet open={open} onClose={onClose} title="Menu">
      <button type="button" className={styles.profile} onClick={onProfile}>
        <span className={styles.avatar} aria-hidden="true">
          {state.profile.name.trim().charAt(0).toUpperCase() || 'A'}
        </span>
        <span className={styles.who}>
          <span className={styles.name}>{state.profile.name}</span>
          <span className={styles.plan}>{plan ? `${plan.name}${state.subscription?.status === 'trial' ? ' · free trial' : ''}` : 'No active plan'}</span>
        </span>
        <UserIcon className={styles.profileIcon} />
      </button>

      <nav className={styles.list} aria-label="Menu">
        {LINKS.map(({ to, label, end, Icon }) => (
          <NavLink key={to} to={to} end={end} onClick={onClose} className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}>
            <Icon className={styles.linkIcon} />
            {label}
          </NavLink>
        ))}
        <button type="button" className={`${styles.link} ${styles.reset}`} onClick={onReset}>
          <RefreshIcon className={styles.linkIcon} />
          Reset demo data
        </button>
      </nav>
    </Sheet>
  )
}
