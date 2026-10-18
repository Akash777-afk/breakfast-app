import type { ReactNode } from 'react'
import { cx } from '../../lib/cx'
import styles from './RadioCard.module.css'

interface RadioCardProps {
  selected: boolean
  /** When given, the card is a real radio; otherwise the dot is a static "selected" indicator. */
  onSelect?: () => void
  children: ReactNode
  /** Right-aligned content on the first row (e.g. a price). */
  aside?: ReactNode
  /** Links/buttons shown under the card body. Kept outside the radio so controls are never nested. */
  actions?: ReactNode
  className?: string
}

export function RadioCard({ selected, onSelect, children, aside, actions, className }: RadioCardProps) {
  const body = (
    <>
      <span className={cx(styles.dot, selected && styles.dotOn)} aria-hidden="true" />
      <span className={styles.content}>{children}</span>
      {aside && <span className={styles.aside}>{aside}</span>}
    </>
  )

  return (
    <div className={cx(styles.card, selected && styles.selected, className)}>
      {onSelect ? (
        <button type="button" role="radio" aria-checked={selected} className={cx(styles.main, styles.interactive)} onClick={onSelect}>
          {body}
        </button>
      ) : (
        <div className={styles.main}>{body}</div>
      )}
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  )
}
