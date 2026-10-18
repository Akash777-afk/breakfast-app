import { CloseIcon, MicIcon, SearchIcon } from './icons'
import styles from './SearchRow.module.css'

interface SearchRowProps {
  example: string
  value: string
  onChange: (value: string) => void
  onVoice: () => void
  listening?: boolean
}

export function SearchRow({ example, value, onChange, onVoice, listening }: SearchRowProps) {
  return (
    <div className={styles.row} role="search">
      <label className={styles.search}>
        <SearchIcon className={styles.searchIcon} />
        <input
          type="search"
          className={styles.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={listening ? 'Listening…' : `Search "${example}"`}
          aria-label="Search breakfast"
          enterKeyHint="search"
        />
        {value && (
          <button type="button" className={styles.clear} onClick={() => onChange('')} aria-label="Clear search">
            <CloseIcon className={styles.clearIcon} />
          </button>
        )}
      </label>

      <button
        type="button"
        className={`${styles.mic} ${listening ? styles.micListening : ''}`}
        onClick={onVoice}
        aria-pressed={listening}
        aria-label={listening ? 'Stop listening' : 'Search by voice'}
      >
        <MicIcon className={styles.micIcon} />
      </button>
      <span className={styles.srOnly} role="status">
        {listening ? 'Listening for your search' : ''}
      </span>
    </div>
  )
}
