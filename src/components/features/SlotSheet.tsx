import { useEffect, useMemo, useState } from 'react'
import { MAX_DAYS_AHEAD, OTHER_SLOTS, SLOTS_ROW_MAJOR } from '../../data/checkout'
import { dayChipLabel, slotToMinutes } from '../../lib/format'
import type { Slot } from '../../types'
import { Button } from '../ui/Button'
import { OptionChip, SlotChip } from '../ui/Chip'
import { Sheet } from '../ui/Overlay'
import styles from './SlotSheet.module.css'

interface SlotSheetProps {
  open: boolean
  onClose: () => void
  value: Slot | null
  onSave: (slot: Slot) => void
}

const ALL_TIMES = [...SLOTS_ROW_MAJOR, ...OTHER_SLOTS].sort((a, b) => slotToMinutes(a) - slotToMinutes(b))
const DAY_OFFSETS = Array.from({ length: MAX_DAYS_AHEAD }, (_, i) => i + 1)

/** "Other Timings": pick any delivery day (up to a few days ahead) and any time slot. */
export function SlotSheet({ open, onClose, value, onSave }: SlotSheetProps) {
  const [dayOffset, setDayOffset] = useState(value?.dayOffset ?? 1)
  const [time, setTime] = useState(value?.time ?? '')

  useEffect(() => {
    if (!open) return
    setDayOffset(value?.dayOffset ?? 1)
    setTime(value?.time ?? '')
  }, [open, value])

  const dayLabels = useMemo(() => DAY_OFFSETS.map((offset) => ({ offset, label: dayChipLabel(offset) })), [])

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Other timings"
      footer={
        <Button
          block
          disabled={!time}
          onClick={() => {
            onSave({ dayOffset, time })
            onClose()
          }}
        >
          {time ? `Confirm ${dayLabels.find((d) => d.offset === dayOffset)?.label}, ${time}` : 'Pick a time'}
        </Button>
      }
    >
      <fieldset className={styles.group}>
        <legend className={styles.legend}>Delivery day</legend>
        <div className={styles.days} role="radiogroup" aria-label="Delivery day">
          {dayLabels.map(({ offset, label }) => (
            <OptionChip key={offset} selected={dayOffset === offset} onSelect={() => setDayOffset(offset)}>
              {label}
            </OptionChip>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.legend}>Delivery time</legend>
        <div className={styles.times} role="radiogroup" aria-label="Delivery time">
          {ALL_TIMES.map((t) => (
            <SlotChip key={t} selected={time === t} onSelect={() => setTime(t)}>
              {t}
            </SlotChip>
          ))}
        </div>
      </fieldset>
    </Sheet>
  )
}
