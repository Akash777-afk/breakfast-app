import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cx } from '../../lib/cx'
import styles from './Field.module.css'

interface BaseProps {
  label: string
  error?: string
  hint?: string
}

type TextFieldProps = BaseProps & InputHTMLAttributes<HTMLInputElement>

export function TextField({ label, error, hint, className, ...input }: TextFieldProps) {
  const id = useId()
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  return (
    <div className={cx(styles.field, className)}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input id={id} className={cx(styles.input, error && styles.invalid)} aria-invalid={error ? true : undefined} aria-describedby={describedBy} {...input} />
      {error ? (
        <p id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className={styles.hint}>
            {hint}
          </p>
        )
      )}
    </div>
  )
}

type TextAreaProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>

export function TextArea({ label, error, hint, className, ...input }: TextAreaProps) {
  const id = useId()
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  return (
    <div className={cx(styles.field, className)}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <textarea id={id} className={cx(styles.input, styles.textarea, error && styles.invalid)} aria-invalid={error ? true : undefined} aria-describedby={describedBy} {...input} />
      {error ? (
        <p id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className={styles.hint}>
            {hint}
          </p>
        )
      )}
    </div>
  )
}
