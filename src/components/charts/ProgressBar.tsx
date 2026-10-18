import styles from './ProgressBar.module.css'

interface ProgressBarProps {
  label: string
  current: number
  target: number
  unit?: string
}

const format = (n: number) => n.toLocaleString('en-IN')

/** Labelled yellow progress bar, e.g. "Daily Calories 1,870/2,000". */
export function ProgressBar({ label, current, target, unit = '' }: ProgressBarProps) {
  const ratio = Math.min(1, Math.max(0, current / target))
  return (
    <div className={styles.row}>
      <div className={styles.text}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>
          {format(current)}
          {unit}/{format(target)}
          {unit}
        </span>
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={target}
        aria-valuenow={current}
        aria-valuetext={`${format(current)}${unit} of ${format(target)}${unit}`}
      >
        <div className={styles.fill} style={{ width: `${ratio * 100}%` }} />
      </div>
    </div>
  )
}
