import { cx } from '../../lib/cx'
import { MinusIcon, PlusIcon, TrashIcon } from '../icons'
import styles from './Stepper.module.css'

interface StepperProps {
  value: number
  onChange: (next: number) => void
  /** Accessible name of the thing being counted, e.g. the dish name. */
  label: string
  min?: number
  max?: number
  /** At `min`, the minus button becomes a remove button. */
  removable?: boolean
  size?: 'md' | 'sm'
}

export function Stepper({ value, onChange, label, min = 1, max = 20, removable, size = 'md' }: StepperProps) {
  const atMin = value <= min
  const showRemove = removable && atMin
  return (
    <div className={cx(styles.stepper, size === 'sm' && styles.sm)} role="group" aria-label={`Quantity of ${label}`}>
      <button
        type="button"
        className={styles.btn}
        onClick={() => onChange(showRemove ? 0 : value - 1)}
        disabled={atMin && !removable}
        aria-label={showRemove ? `Remove ${label}` : `Decrease quantity of ${label}`}
      >
        {showRemove ? <TrashIcon className={styles.icon} /> : <MinusIcon className={styles.icon} />}
      </button>
      <span className={styles.value} aria-live="polite">
        {value}
      </span>
      <button type="button" className={styles.btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={`Increase quantity of ${label}`}>
        <PlusIcon className={styles.icon} />
      </button>
    </div>
  )
}
