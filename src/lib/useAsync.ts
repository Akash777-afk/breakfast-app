import { useCallback, useEffect, useRef, useState } from 'react'

interface AsyncState<T> {
  data: T | undefined
  loading: boolean
  error: Error | null
  reload: () => void
}

/** Runs `fn` on mount and whenever `deps` change; ignores results from superseded requests. */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []): AsyncState<T> {
  const [data, setData] = useState<T | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [tick, setTick] = useState(0)
  const requestId = useRef(0)

  useEffect(() => {
    const id = ++requestId.current
    setLoading(true)
    setError(null)
    fn().then(
      (result) => {
        if (id !== requestId.current) return
        setData(result)
        setLoading(false)
      },
      (err: unknown) => {
        if (id !== requestId.current) return
        setError(err instanceof Error ? err : new Error('Something went wrong'))
        setLoading(false)
      },
    )
    return () => {
      requestId.current++
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick])

  const reload = useCallback(() => setTick((t) => t + 1), [])
  return { data, loading, error, reload }
}
