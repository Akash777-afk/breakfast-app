import type { Insights } from '../../services/api'
import { ProgressBar } from '../charts/ProgressBar'
import { Button } from '../ui/Button'
import { Sheet } from '../ui/Overlay'
import styles from './SummarySheet.module.css'

interface SummarySheetProps {
  open: boolean
  onClose: () => void
  insights: Insights
}

export function SummarySheet({ open, onClose, insights }: SummarySheetProps) {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Your full summary"
      footer={
        <Button block onClick={onClose}>
          Got it
        </Button>
      }
    >
      <div className={styles.bars}>
        {insights.bars.map((bar) => (
          <ProgressBar key={bar.label} {...bar} />
        ))}
      </div>

      <h3 className={styles.heading}>What your dietician noticed</h3>
      <ul className={styles.notes}>
        {insights.notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
      <p className={styles.disclaimer}>Sample data for this demo — not medical advice.</p>
    </Sheet>
  )
}
