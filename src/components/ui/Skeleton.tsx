import type { CSSProperties } from 'react'
import { cx } from '../../lib/cx'
import styles from './Skeleton.module.css'

interface SkeletonProps {
  className?: string
  style?: CSSProperties
}

/** Shimmering placeholder block; size it with `style` or a class. */
export function Skeleton({ className, style }: SkeletonProps) {
  return <div className={cx(styles.skeleton, className)} style={style} aria-hidden="true" />
}

/** Placeholder matching the 3-column dish grid. */
export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className={styles.grid} role="status" aria-label="Loading">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className={styles.card} />
      ))}
    </div>
  )
}
