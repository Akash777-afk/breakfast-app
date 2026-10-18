import type { AddOn } from '../types'
import { rupees } from '../lib/format'
import { CheckIcon, PlusIcon } from './icons'
import styles from './DishCard.module.css'

interface AddOnCardProps {
  addOn: AddOn
  selected: boolean
  onToggle: () => void
}

/** Same card as DishCard, but toggling selects an add-on instead of opening a dish. */
export function AddOnCard({ addOn, selected, onToggle }: AddOnCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <img className={styles.image} src={addOn.image} alt="" loading="lazy" />
        <div className={styles.shade} aria-hidden="true" />
      </div>
      {/* Larger tap target for pointer users; keyboard and screen-reader users use the labelled button below. */}
      <button type="button" className={styles.cover} onClick={onToggle} tabIndex={-1} aria-hidden="true" />
      <div className={styles.label}>
        <h3 className={styles.labelName}>{addOn.name}</h3>
        <span className={styles.labelPrice}>+{rupees(addOn.price)}</span>
      </div>
      <button
        type="button"
        className={`${styles.add} ${selected ? styles.addActive : ''}`}
        aria-pressed={selected}
        aria-label={`${selected ? 'Remove' : 'Add'} ${addOn.name}, ${rupees(addOn.price)}`}
        onClick={onToggle}
      >
        {selected ? <CheckIcon className={styles.addIcon} /> : <PlusIcon className={styles.addIcon} />}
      </button>
    </article>
  )
}
