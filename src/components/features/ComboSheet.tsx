import { useEffect, useState } from 'react'
import { COMBO_MAX, COMBO_MIN, COMBO_POOL } from '../../data/plans'
import type { Plan } from '../../types'
import { Button } from '../ui/Button'
import { OptionChip } from '../ui/Chip'
import { Sheet } from '../ui/Overlay'
import styles from './ComboSheet.module.css'

interface ComboSheetProps {
  open: boolean
  onClose: () => void
  plan: Plan
  value: string[]
  onSave: (items: string[]) => void
}

/** Lets subscribers swap the items in their plan's combo (between COMBO_MIN and COMBO_MAX). */
export function ComboSheet({ open, onClose, plan, value, onSave }: ComboSheetProps) {
  const [items, setItems] = useState(value)

  useEffect(() => {
    if (open) setItems(value)
  }, [open, value])

  const toggle = (item: string) => setItems((current) => (current.includes(item) ? current.filter((x) => x !== item) : [...current, item]))
  const full = items.length >= COMBO_MAX
  const tooFew = items.length < COMBO_MIN

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={`Edit ${plan.tier.toLowerCase()} combo`}
      footer={
        <div className={styles.footer}>
          <Button variant="outline" onClick={() => setItems(plan.combo)} className={styles.btn}>
            Reset
          </Button>
          <Button
            disabled={tooFew}
            onClick={() => {
              onSave(items)
              onClose()
            }}
            className={styles.btn}
          >
            Save combo
          </Button>
        </div>
      }
    >
      <p className={styles.count} role="status">
        {items.length} of {COMBO_MAX} selected
        {tooFew && <span className={styles.warn}> · pick at least {COMBO_MIN}</span>}
      </p>
      <div className={styles.chips} role="group" aria-label="Combo items">
        {COMBO_POOL.map((item) => {
          const selected = items.includes(item)
          return (
            <OptionChip key={item} multi selected={selected} disabled={full && !selected} onSelect={() => toggle(item)}>
              {item}
            </OptionChip>
          )
        })}
      </div>
    </Sheet>
  )
}
