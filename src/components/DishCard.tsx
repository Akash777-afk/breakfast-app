import { Link } from 'react-router-dom'
import { useApp } from '../state/AppState'
import type { Dish } from '../types'
import { CheckIcon, HeartIcon, PlusIcon } from './icons'
import { useToast } from './ui/Toast'
import styles from './DishCard.module.css'

interface DishCardProps {
  dish: Dish
  /** Show a favorite toggle on the photo (used on the Favorites screen). */
  heart?: boolean
}

export function DishCard({ dish, heart }: DishCardProps) {
  const { state, actions } = useApp()
  const toast = useToast()
  const added = state.cart.some((line) => line.dishId === dish.id)
  const favorite = state.favorites.includes(dish.id)

  const toggleCart = () => {
    actions.toggleDish(dish.id)
    toast.show(added ? `Removed ${dish.name} from your order` : `Added ${dish.name} to your order`, {
      actionLabel: 'Undo',
      onAction: () => actions.toggleDish(dish.id),
    })
  }

  const toggleFavorite = () => {
    actions.toggleFavorite(dish.id)
    toast.show(favorite ? `Removed ${dish.name} from favorites` : `Saved ${dish.name} to favorites`, {
      actionLabel: 'Undo',
      onAction: () => actions.toggleFavorite(dish.id),
    })
  }

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <img className={styles.image} src={dish.image} alt="" loading="lazy" />
        <div className={styles.shade} aria-hidden="true" />
      </div>
      <Link to={`/dish/${dish.id}`} className={styles.cover} aria-label={`${dish.name}, view details and customize`} />
      <h3 className={styles.name}>{dish.name}</h3>
      {heart && (
        <button
          type="button"
          className={`${styles.heart} ${favorite ? styles.heartOn : ''}`}
          aria-pressed={favorite}
          aria-label={favorite ? `Remove ${dish.name} from favorites` : `Save ${dish.name} to favorites`}
          onClick={toggleFavorite}
        >
          <HeartIcon filled={favorite} className={styles.heartIcon} />
        </button>
      )}
      <button
        type="button"
        className={`${styles.add} ${added ? styles.addActive : ''}`}
        aria-pressed={added}
        aria-label={added ? `Remove ${dish.name} from your order` : `Add ${dish.name} to your order`}
        onClick={toggleCart}
      >
        {added ? <CheckIcon className={styles.addIcon} /> : <PlusIcon className={styles.addIcon} />}
      </button>
    </article>
  )
}
