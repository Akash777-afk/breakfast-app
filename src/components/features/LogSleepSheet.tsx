import { useEffect, useState, type FormEvent } from 'react'
import { DAYS } from '../../data/health'
import { useApp } from '../../state/AppState'
import { Button } from '../ui/Button'
import { OptionChip } from '../ui/Chip'
import { TextField } from '../ui/Field'
import { Sheet } from '../ui/Overlay'
import { useToast } from '../ui/Toast'
import styles from './LogSleepSheet.module.css'

interface LogSleepSheetProps {
  open: boolean
  onClose: () => void
}

/** Monday = 0 … Sunday = 6 */
const todayIndex = () => (new Date().getDay() + 6) % 7

export function validateHours(value: string): string | null {
  const hours = Number(value)
  if (value.trim() === '' || Number.isNaN(hours)) return 'Enter the hours you slept, like 6.5.'
  if (hours < 2 || hours > 12) return 'Enter a value between 2 and 12 hours.'
  return null
}

export function LogSleepSheet({ open, onClose }: LogSleepSheetProps) {
  const { state, actions } = useApp()
  const toast = useToast()
  const [day, setDay] = useState(todayIndex())
  const [hours, setHours] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    const index = todayIndex()
    setDay(index)
    setHours(String(state.health.sleepHours[index]))
    setError(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const pickDay = (index: number) => {
    setDay(index)
    setHours(String(state.health.sleepHours[index]))
    setError(null)
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const problem = validateHours(hours)
    setError(problem)
    if (problem) return
    const value = Math.round(Number(hours) * 10) / 10
    actions.setSleepHours(day, value)
    toast.show(`Logged ${value}h of sleep for ${DAYS[day]}`)
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title="Log your sleep">
      <form className={styles.form} onSubmit={submit} noValidate>
        <fieldset className={styles.group}>
          <legend className={styles.legend}>Day</legend>
          <div className={styles.chips} role="radiogroup" aria-label="Day">
            {DAYS.map((d, i) => (
              <OptionChip key={d} selected={day === i} onSelect={() => pickDay(i)}>
                {d}
              </OptionChip>
            ))}
          </div>
        </fieldset>

        <TextField
          label="Hours slept"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          error={error ?? undefined}
          inputMode="decimal"
          placeholder="6.5"
          hint="Between 2 and 12 hours."
          data-autofocus
        />

        <Button type="submit" block>
          Save
        </Button>
      </form>
    </Sheet>
  )
}
