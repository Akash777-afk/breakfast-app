import { useId, useMemo, useState, type KeyboardEvent } from 'react'
import styles from './LineChart.module.css'

interface LineChartProps {
  labels: readonly string[]
  values: number[]
  unit?: string
  /** Accessible name for the chart. */
  label: string
}

const W = 340
const H = 214
const PAD = { left: 38, right: 14, top: 30, bottom: 30 }
const LOW = '#ff4d8d'
const HIGH = '#039719'

/** Smooth path through the points (Catmull-Rom → cubic Bézier). */
function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return ''
  const tension = 0.18
  let d = `M${points[0].x},${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const c1x = p1.x + (p2.x - p0.x) * tension
    const c1y = p1.y + (p2.y - p0.y) * tension
    const c2x = p2.x - (p3.x - p1.x) * tension
    const c2y = p2.y - (p3.y - p1.y) * tension
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x},${p2.y}`
  }
  return d
}

export function LineChart({ labels, values, unit = 'h', label }: LineChartProps) {
  const uid = useId().replace(/:/g, '')
  const [active, setActive] = useState<number | null>(null)

  const chart = useMemo(() => {
    const axisMin = Math.min(4, Math.floor(Math.min(...values)))
    const axisMax = Math.max(7, Math.ceil(Math.max(...values)))
    const innerW = W - PAD.left - PAD.right
    const innerH = H - PAD.top - PAD.bottom
    const x = (i: number) => PAD.left + (i * innerW) / (values.length - 1)
    const y = (v: number) => PAD.top + innerH - ((v - axisMin) / (axisMax - axisMin)) * innerH
    const points = values.map((v, i) => ({ x: x(i), y: y(v), v }))
    const ticks = Array.from({ length: axisMax - axisMin + 1 }, (_, i) => axisMin + i)
    return { points, ticks, y, minIndex: values.indexOf(Math.min(...values)), maxIndex: values.indexOf(Math.max(...values)) }
  }, [values])

  const { points, ticks, y, minIndex, maxIndex } = chart
  const colorFor = (i: number) => (i === minIndex ? LOW : i === maxIndex ? HIGH : 'var(--color-brand)')

  const onKey = (event: KeyboardEvent<SVGGElement>, i: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setActive(i)
    }
    if (event.key === 'Escape') setActive(null)
  }

  const shown = active ?? null
  const fmt = (v: number) => `${Number.isInteger(v) ? v : v.toFixed(1)}${unit}`

  return (
    <figure className={styles.figure}>
      <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} role="group" aria-label={label} onMouseLeave={() => setActive(null)}>
        <defs>
          <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#039719" stopOpacity="0.22" />
            <stop offset="1" stopColor="#039719" stopOpacity="0" />
          </linearGradient>
        </defs>

        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} className={styles.grid} />
            <text x={PAD.left - 10} y={y(t) + 4} textAnchor="end" className={styles.axis}>
              {t}
              {unit}
            </text>
          </g>
        ))}

        <path d={`${smoothPath(points)} L${points[points.length - 1].x},${H - PAD.bottom} L${points[0].x},${H - PAD.bottom} Z`} fill={`url(#${uid}-fill)`} className={styles.area} />
        <path d={smoothPath(points)} pathLength={1} className={styles.line} />

        {points.map((p, i) => {
          const isActive = shown === i
          const color = colorFor(i)
          return (
            <g
              key={labels[i]}
              className={styles.point}
              role="button"
              tabIndex={0}
              aria-label={`${labels[i]}: ${fmt(p.v)} of sleep`}
              aria-pressed={isActive}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              onKeyDown={(e) => onKey(e, i)}
            >
              <circle cx={p.x} cy={p.y} r={18} fill="transparent" />
              <circle cx={p.x} cy={p.y} r={isActive ? 8 : i === minIndex || i === maxIndex ? 6.5 : 5} fill={i === minIndex || i === maxIndex ? color : '#fff'} stroke={color} strokeWidth={3} className={styles.dot} />
            </g>
          )
        })}

        {labels.map((l, i) => (
          <text key={l} x={points[i].x} y={H - 8} textAnchor="middle" className={`${styles.axis} ${shown === i ? styles.axisActive : ''}`}>
            {l}
          </text>
        ))}

        {shown !== null && (
          <g className={styles.tip} pointerEvents="none" transform={`translate(${Math.min(Math.max(points[shown].x, PAD.left + 22), W - PAD.right - 22)} ${points[shown].y - 16})`}>
            <rect x={-24} y={-26} width={48} height={24} rx={8} fill="#06210f" />
            <path d="M-5 -2 L0 4 L5 -2 Z" fill="#06210f" />
            <text x={0} y={-10} textAnchor="middle" className={styles.tipText}>
              {fmt(points[shown].v)}
            </text>
          </g>
        )}
      </svg>

      <figcaption className={styles.legend}>
        <span className={styles.pill} style={{ background: '#ffe0ec', color: '#a1124a' }}>
          <span className={styles.swatch} style={{ background: LOW }} />
          Lowest · {labels[minIndex]} {fmt(values[minIndex])}
        </span>
        <span className={styles.pill} style={{ background: 'var(--color-success-bg)', color: 'var(--color-brand-text)' }}>
          <span className={styles.swatch} style={{ background: HIGH }} />
          Highest · {labels[maxIndex]} {fmt(values[maxIndex])}
        </span>
      </figcaption>
    </figure>
  )
}
