import { useCallback, useEffect, useRef, useState } from 'react'

/** Minimal slice of the Web Speech API that we use (not in lib.dom). */
interface SpeechRecognitionLike {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

type RecognitionCtor = new () => SpeechRecognitionLike

function getCtor(): RecognitionCtor | undefined {
  if (typeof window === 'undefined') return undefined
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

interface Options {
  onResult: (transcript: string) => void
  /** Called with a user-facing message when voice search can't run or fails. */
  onProblem: (message: string) => void
}

/** Voice search via the browser's Web Speech API, with graceful fallbacks. */
export function useVoiceSearch({ onResult, onProblem }: Options) {
  const [listening, setListening] = useState(false)
  const recognition = useRef<SpeechRecognitionLike | null>(null)
  const handlers = useRef({ onResult, onProblem })
  handlers.current = { onResult, onProblem }

  useEffect(() => () => recognition.current?.abort(), [])

  const start = useCallback(() => {
    const Ctor = getCtor()
    if (!Ctor) {
      handlers.current.onProblem('Voice search isn’t supported in this browser. Type your search instead.')
      return
    }
    if (recognition.current) {
      recognition.current.stop()
      return
    }
    const rec = new Ctor()
    rec.lang = 'en-IN'
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim()
      if (transcript) handlers.current.onResult(transcript.replace(/[.!?]+$/, ''))
    }
    rec.onerror = (event) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        handlers.current.onProblem('Microphone access is blocked. Allow it in your browser settings to search by voice.')
      } else if (event.error === 'no-speech') {
        handlers.current.onProblem('I didn’t hear anything. Tap the mic and try again.')
      } else if (event.error !== 'aborted') {
        handlers.current.onProblem('Voice search hit a problem. Please type your search instead.')
      }
    }
    rec.onend = () => {
      recognition.current = null
      setListening(false)
    }
    recognition.current = rec
    try {
      rec.start()
      setListening(true)
    } catch {
      recognition.current = null
      handlers.current.onProblem('Voice search couldn’t start. Please try again.')
    }
  }, [])

  return { listening, start, supported: Boolean(getCtor()) }
}
