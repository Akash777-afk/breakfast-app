import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cx } from '../../lib/cx'
import { CheckIcon, CloseIcon } from '../icons'
import styles from './Toast.module.css'

type Tone = 'success' | 'info' | 'error'

interface ToastItem {
  id: number
  message: string
  tone: Tone
  actionLabel?: string
  onAction?: () => void
}

interface ShowOptions {
  tone?: Tone
  actionLabel?: string
  onAction?: () => void
  duration?: number
}

interface ToastContextValue {
  show: (message: string, options?: ShowOptions) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(1)
  const timers = useRef(new Map<number, number>())

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) window.clearTimeout(timer)
    timers.current.delete(id)
  }, [])

  const show = useCallback(
    (message: string, options: ShowOptions = {}) => {
      const id = nextId.current++
      const item: ToastItem = { id, message, tone: options.tone ?? 'success', actionLabel: options.actionLabel, onAction: options.onAction }
      setToasts((list) => [...list.slice(-1), item])
      timers.current.set(id, window.setTimeout(() => dismiss(id), options.duration ?? 3400))
    },
    [dismiss],
  )

  useEffect(() => {
    const active = timers.current
    return () => active.forEach((t) => window.clearTimeout(t))
  }, [])

  const value = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className={styles.region} aria-live="polite" aria-atomic="false">
          {toasts.map((toast) => (
            <div key={toast.id} className={cx(styles.toast, styles[toast.tone])} role={toast.tone === 'error' ? 'alert' : 'status'}>
              {toast.tone === 'success' && <CheckIcon className={styles.icon} />}
              <span className={styles.message}>{toast.message}</span>
              {toast.actionLabel && (
                <button
                  type="button"
                  className={styles.action}
                  onClick={() => {
                    toast.onAction?.()
                    dismiss(toast.id)
                  }}
                >
                  {toast.actionLabel}
                </button>
              )}
              <button type="button" className={styles.dismiss} onClick={() => dismiss(toast.id)} aria-label="Dismiss notification">
                <CloseIcon className={styles.dismissIcon} />
              </button>
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}
