import { useEffect, useState } from 'react'
import { LARGE_PORTION_EXTRA } from '../../data/checkout'
import { rupees } from '../../lib/format'
import type { Dish, DishOptions, Portion, Spice } from '../../types'
import { Button } from '../ui/Button'
import { OptionChip } from '../ui/Chip'
import { TextArea } from '../ui/Field'
import { Sheet } from '../ui/Overlay'
import styles from './CustomizeSheet.module.css'

const NOTE_LIMIT = 120

const PORTIONS: { id: Portion; label: string }[] = [
  { id: 'regular', label: 'Regular' },
  { id: 'large', label: `Large (+${rupees(LARGE_PORTION_EXTRA)})` },
]

const SPICES: { id: Spice; label: string }[] = [
  { id: 'mild', label: 'Mild' },
  { id: 'medium', label: 'Medium' },
  { id: 'spicy', label: 'Spicy' },
]

interface CustomizeSheetProps {
  open: boolean
  onClose: () => void
  dish: Dish
  value: DishOptions
  onSave: (options: DishOptions) => void
}

export function CustomizeSheet({ open, onClose, dish, value, onSave }: CustomizeSheetProps) {
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    if (open) setDraft(value)
  }, [open, value])

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={`Customize ${dish.name}`}
      footer={
        <Button
          block
          onClick={() => {
            onSave({ ...draft, note: draft.note.trim() })
            onClose()
          }}
        >
          Save changes
        </Button>
      }
    >
      <fieldset className={styles.group}>
        <legend className={styles.legend}>Portion</legend>
        <div className={styles.chips} role="radiogroup" aria-label="Portion">
          {PORTIONS.map((p) => (
            <OptionChip key={p.id} selected={draft.portion === p.id} onSelect={() => setDraft({ ...draft, portion: p.id })}>
              {p.label}
            </OptionChip>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.legend}>Spice level</legend>
        <div className={styles.chips} role="radiogroup" aria-label="Spice level">
          {SPICES.map((s) => (
            <OptionChip key={s.id} selected={draft.spice === s.id} onSelect={() => setDraft({ ...draft, spice: s.id })}>
              {s.label}
            </OptionChip>
          ))}
        </div>
      </fieldset>

      <TextArea
        label="Note for the kitchen"
        value={draft.note}
        onChange={(e) => setDraft({ ...draft, note: e.target.value.slice(0, NOTE_LIMIT) })}
        placeholder="e.g. less oil, no onions"
        hint={`${draft.note.length}/${NOTE_LIMIT}`}
        maxLength={NOTE_LIMIT}
      />
    </Sheet>
  )
}
