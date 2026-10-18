import type { ReactNode } from 'react'
import { cx } from '../../lib/cx'
import styles from './EmptyState.module.css'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  text?: string
  action?: ReactNode
  tone?: 'neutral' | 'error'
}

export function EmptyState({ icon, title, text, action, tone = 'neutral' }: EmptyStateProps) {
  return (
    <div className={cx(styles.empty, tone === 'error' && styles.error)} role={tone === 'error' ? 'alert' : undefined}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <h2 className={styles.title}>{title}</h2>
      {text && <p className={styles.text}>{text}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}
