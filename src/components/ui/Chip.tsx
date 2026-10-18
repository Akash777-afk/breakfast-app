import type { ReactNode } from 'react'
import { cx } from '../../lib/cx'
import { FilterIcon } from '../icons'
import styles from './Chip.module.css'

interface FilterButtonProps {
  onClick: () => void
  /** Shows a dot when a non-default filter is applied. */
  active?: boolean
  label?: string
}

/** The "Filter" chip used above every dish/add-on list. */
export function FilterButton({ onClick, active, label = 'Filter' }: FilterButtonProps) {
  return (
    <button type="button" className={styles.filter} onClick={onClick} aria-haspopup="dialog">
      <FilterIcon className={styles.filterIcon} />
      {label}
      {active && <span className={styles.activeDot} role="img" aria-label="filters applied" />}
    </button>
  )
}

interface SlotChipProps {
  selected: boolean
  onSelect: () => void
  children: ReactNode
}

/** Orange outlined time chip. Parents render these inside `role="radiogroup"`. */
export function SlotChip({ selected, onSelect, children }: SlotChipProps) {
  return (
    <button type="button" role="radio" aria-checked={selected} className={cx(styles.slot, selected && styles.slotOn)} onClick={onSelect}>
      {children}
    </button>
  )
}

interface OptionChipProps {
  selected: boolean
  onSelect: () => void
  children: ReactNode
  /** Multi-select chips are checkboxes rather than radios. */
  multi?: boolean
  disabled?: boolean
}

/** Generic single-choice chip for sheets (diet, sort, portion, spice…). */
export function OptionChip({ selected, onSelect, children, multi, disabled }: OptionChipProps) {
  return (
    <button
      type="button"
      role={multi ? 'checkbox' : 'radio'}
      aria-checked={selected}
      disabled={disabled}
      className={cx(styles.option, selected && styles.optionOn)}
      onClick={onSelect}
    >
      {children}
    </button>
  )
}

/** Static pill, e.g. nutrition facts. */
export function InfoPill({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'green' | 'orange' }) {
  return <span className={cx(styles.info, styles[tone])}>{children}</span>
}
