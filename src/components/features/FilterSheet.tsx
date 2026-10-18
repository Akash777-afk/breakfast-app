import { useEffect, useState } from 'react'
import { DEFAULT_FILTER } from '../../lib/filters'
import type { FilterState } from '../../types'
import { Button } from '../ui/Button'
import { OptionChip } from '../ui/Chip'
import { Sheet } from '../ui/Overlay'
import styles from './FilterSheet.module.css'

const SORT_LABELS: Record<FilterState['sort'], string> = {
  recommended: 'Recommended',
  'price-asc': 'Price: low to high',
  'calories-asc': 'Fewest calories',
  'protein-desc': 'Most protein',
}

interface FilterSheetProps {
  open: boolean
  onClose: () => void
  value: FilterState
  onApply: (next: FilterState) => void
  sorts?: FilterState['sort'][]
}

/** Diet + sort chooser shared by every dish and add-on list. Applies on "Show results". */
export function FilterSheet({ open, onClose, value, onApply, sorts = ['recommended', 'price-asc', 'calories-asc', 'protein-desc'] }: FilterSheetProps) {
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    if (open) setDraft(value)
  }, [open, value])

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Filter"
      footer={
        <div className={styles.footer}>
          <Button variant="outline" onClick={() => setDraft(DEFAULT_FILTER)} className={styles.btn}>
            Reset
          </Button>
          <Button
            onClick={() => {
              onApply(draft)
              onClose()
            }}
            className={styles.btn}
          >
            Show results
          </Button>
        </div>
      }
    >
      <fieldset className={styles.group}>
        <legend className={styles.legend}>Diet</legend>
        <div className={styles.chips} role="radiogroup" aria-label="Diet">
          <OptionChip selected={draft.diet === 'all'} onSelect={() => setDraft({ ...draft, diet: 'all' })}>
            All
          </OptionChip>
          <OptionChip selected={draft.diet === 'veg'} onSelect={() => setDraft({ ...draft, diet: 'veg' })}>
            Veg only
          </OptionChip>
        </div>
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.legend}>Sort by</legend>
        <div className={styles.chips} role="radiogroup" aria-label="Sort by">
          {sorts.map((sort) => (
            <OptionChip key={sort} selected={draft.sort === sort} onSelect={() => setDraft({ ...draft, sort })}>
              {SORT_LABELS[sort]}
            </OptionChip>
          ))}
        </div>
      </fieldset>
    </Sheet>
  )
}
