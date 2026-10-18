import type { ReactNode } from 'react'
import type { Dish } from '../types'
import { DishCard } from './DishCard'
import { FilterButton } from './ui/Chip'
import { SkeletonGrid } from './ui/Skeleton'
import styles from './DishGrid.module.css'

interface DishGridProps {
  title: string
  dishes: Dish[]
  onFilter?: () => void
  filterActive?: boolean
  loading?: boolean
  /** Rendered instead of the grid when there are no dishes. */
  empty?: ReactNode
  heart?: boolean
  /** Lay the cards out as a horizontally scrolling row instead of a grid. */
  row?: boolean
  headingId?: string
}

export function DishGrid({ title, dishes, onFilter, filterActive, loading, empty, heart, row, headingId }: DishGridProps) {
  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <div className={styles.heading}>
        <h2 id={headingId} className={styles.title}>
          {title}
        </h2>
        {onFilter && <FilterButton onClick={onFilter} active={filterActive} />}
      </div>

      {loading ? (
        <div className={styles.skeleton}>
          <SkeletonGrid count={row ? 3 : 6} />
        </div>
      ) : dishes.length === 0 ? (
        empty
      ) : (
        <div className={row ? styles.row : styles.grid}>
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} heart={heart} />
          ))}
        </div>
      )}
    </section>
  )
}
