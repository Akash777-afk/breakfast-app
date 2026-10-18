import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { PLANS } from '../../data/plans'
import { useApp } from '../../state/AppState'
import { Button } from '../ui/Button'
import { TextField } from '../ui/Field'
import { Sheet } from '../ui/Overlay'
import { useToast } from '../ui/Toast'
import styles from './ProfileSheet.module.css'

interface ProfileSheetProps {
  open: boolean
  onClose: () => void
  onReset: () => void
}

export function validateName(value: string): string | null {
  const name = value.trim()
  if (name.length < 2) return 'Enter at least 2 characters.'
  if (name.length > 40) return 'Keep your name under 40 characters.'
  return null
}

export function ProfileSheet({ open, onClose, onReset }: ProfileSheetProps) {
  const { state, actions } = useApp()
  const toast = useToast()
  const [name, setName] = useState(state.profile.name)
  const [error, setError] = useState<string | null>(null)
  const plan = state.subscription ? PLANS.find((p) => p.id === state.subscription?.planId) : undefined

  useEffect(() => {
    if (open) {
      setName(state.profile.name)
      setError(null)
    }
  }, [open, state.profile.name])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const problem = validateName(name)
    setError(problem)
    if (problem) return
    actions.setProfileName(name.trim())
    toast.show('Profile updated')
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title="Your profile">
      <form className={styles.form} onSubmit={submit} noValidate>
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} error={error ?? undefined} autoComplete="name" data-autofocus maxLength={60} />
        <TextField label="Phone" value="+91 98765 43210" readOnly hint="Demo account — there is no real sign-in in this build." />

        <div className={styles.plan}>
          <span className={styles.planLabel}>Plan</span>
          <span className={styles.planValue}>
            {plan ? `${plan.name} · ${state.subscription?.status === 'trial' ? 'free trial' : 'active'}` : 'No active plan'}
          </span>
          <Link to="/plans" className={styles.planLink} onClick={onClose}>
            {plan ? 'Manage' : 'See plans'}
          </Link>
        </div>

        <Button type="submit" block>
          Save changes
        </Button>
        <div className={styles.links}>
          <Link to="/orders" className={styles.link} onClick={onClose}>
            My orders
          </Link>
          <button type="button" className={`${styles.link} ${styles.danger}`} onClick={onReset}>
            Reset demo data
          </button>
        </div>
      </form>
    </Sheet>
  )
}
