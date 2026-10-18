export const rupees = (n: number): string => `₹${Math.round(n).toLocaleString('en-IN')}`

/** Local-time yyyy-mm-dd for `dayOffset` days from today (1 = tomorrow). */
export function isoDateForOffset(dayOffset: number, now: Date = new Date()): string {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

function parseIso(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** "today" / "tomorrow" / "Thu, 23 Oct" */
export function formatDeliveryDay(iso: string, now: Date = new Date()): string {
  const target = parseIso(iso)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diff = Math.round((target.getTime() - today.getTime()) / 86_400_000)
  if (diff === 0) return 'today'
  if (diff === 1) return 'tomorrow'
  return target.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function dayChipLabel(dayOffset: number, now: Date = new Date()): string {
  const iso = isoDateForOffset(dayOffset, now)
  const word = formatDeliveryDay(iso, now)
  return word === 'tomorrow' ? 'Tomorrow' : word
}

/** "8.15 am" → minutes since midnight. */
export function slotToMinutes(label: string): number {
  const [clock, meridiem] = label.split(' ')
  const [h, m] = clock.split('.').map(Number)
  const hour24 = (h % 12) + (meridiem === 'pm' ? 12 : 0)
  return hour24 * 60 + m
}

/** 360 → "6:00 AM" */
export function formatClock(minutes: number): string {
  const total = ((minutes % 1440) + 1440) % 1440
  const h24 = Math.floor(total / 60)
  const m = total % 60
  const meridiem = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}:${String(m).padStart(2, '0')} ${meridiem}`
}

/** The kitchen starts cooking 2½ hours before the delivery slot. */
export const PREP_LEAD_MINUTES = 150

export function kitchenStartLabel(slotLabel: string): string {
  return formatClock(slotToMinutes(slotLabel) - PREP_LEAD_MINUTES)
}

export function formatOrderStamp(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
}
