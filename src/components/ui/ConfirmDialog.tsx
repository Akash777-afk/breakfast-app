import { useId } from 'react'
import { Button } from './Button'
import { Dialog } from './Overlay'
import styles from './ConfirmDialog.module.css'

interface ConfirmDialogProps {
  open: boolean
  title: string
  text: string
  confirmLabel: string
  cancelLabel?: string
  danger?: boolean
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ open, title, text, confirmLabel, cancelLabel = 'Cancel', danger, loading, onConfirm, onCancel }: ConfirmDialogProps) {
  const descId = useId()
  return (
    <Dialog open={open} onClose={onCancel} label={title}>
      <div className={styles.body}>
        <h2 className={styles.title}>{title}</h2>
        <p id={descId} className={styles.text}>
          {text}
        </p>
        <div className={styles.actions}>
          <Button variant="outline" onClick={onCancel} data-autofocus disabled={loading} className={styles.btn}>
            {cancelLabel}
          </Button>
          <Button onClick={onConfirm} loading={loading} className={danger ? `${styles.btn} ${styles.danger}` : styles.btn}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
