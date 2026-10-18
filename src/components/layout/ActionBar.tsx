import type { ReactNode } from 'react'
import styles from './ActionBar.module.css'

/** Sticky bottom bar holding one or two actions. Children share the width equally. */
export function ActionBar({ children, note }: { children: ReactNode; note?: ReactNode }) {
  return (
    <div className={styles.bar}>
      {note && <p className={styles.note}>{note}</p>}
      <div className={styles.actions}>{children}</div>
    </div>
  )
}
