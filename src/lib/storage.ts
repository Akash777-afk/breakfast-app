const KEY = 'breakfit:v1'

/** Reads persisted JSON. Storage can throw (private mode, blocked cookies) or hold junk, so never trust it. */
export function readPersisted(): unknown {
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function writePersisted(value: unknown): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(value))
  } catch {
    /* storage unavailable or full — the app keeps working from memory */
  }
}

export function clearPersisted(): void {
  try {
    window.localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
