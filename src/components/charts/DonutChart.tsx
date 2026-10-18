import styles from './DonutChart.module.css'

interface DonutChartProps {
  label: string
  percent: number
  shades: readonly string[]
  weights: readonly number[]
  /** Pill background (usually the strongest shade). */
  accent: string
}

const R = 38
const C = 2 * Math.PI * R
const GAP = 3

/** Ring filled to `percent`, split into shaded segments sized by `weights`. */
export function DonutChart({ label, percent, shades, weights, accent }: DonutChartProps) {
  const filled = (C * percent) / 100
  const totalWeight = weights.reduce((sum, w) => sum + w, 0)
  let cursor = 0

  return (
    <figure className={styles.figure}>
      <svg viewBox="0 0 100 100" className={styles.svg} role="img" aria-label={`${label}: ${percent}% of target`}>
        <circle cx="50" cy="50" r={R} fill="none" stroke="var(--color-chip-bg)" strokeWidth="14" />
        <g transform="rotate(-90 50 50)">
          <g className={styles.segments}>
            {shades.map((shade, i) => {
              const length = (filled * weights[i]) / totalWeight
              const start = cursor
              cursor += length
              return (
                <circle
                  key={shade}
                  cx="50"
                  cy="50"
                  r={R}
                  fill="none"
                  stroke={shade}
                  strokeWidth="14"
                  strokeDasharray={`${Math.max(length - GAP, 0.5)} ${C}`}
                  strokeDashoffset={-start}
                />
              )
            })}
          </g>
        </g>
        <text x="50" y="55" textAnchor="middle" className={styles.value}>
          {percent}%
        </text>
      </svg>
      <figcaption className={styles.label} style={{ background: accent }}>
        {label}
      </figcaption>
    </figure>
  )
}
