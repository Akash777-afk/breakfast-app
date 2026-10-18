import type { FoodCategory } from '../data/home'
import styles from './CategoryRow.module.css'

interface CategoryRowProps {
  categories: FoodCategory[]
  activeId: string
  onSelect: (id: string) => void
}

export function CategoryRow({ categories, activeId, onSelect }: CategoryRowProps) {
  return (
    <nav className={styles.row} aria-label="Food categories">
      {categories.map((category) => {
        const isActive = category.id === activeId
        return (
          <button
            key={category.id}
            type="button"
            className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
            aria-pressed={isActive}
            onClick={() => onSelect(category.id)}
          >
            <img className={styles.image} src={category.image} alt="" />
            <span className={styles.label}>{category.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
