import { useEffect, useState, type FormEvent } from 'react'
import { makeAddressId, useApp } from '../../state/AppState'
import type { Address, AddressLabel } from '../../types'
import { Button } from '../ui/Button'
import { OptionChip } from '../ui/Chip'
import { TextField } from '../ui/Field'
import { Sheet } from '../ui/Overlay'
import { useToast } from '../ui/Toast'
import styles from './AddressSheet.module.css'

const LABELS: AddressLabel[] = ['Home', 'Work', 'Other']

interface AddressSheetProps {
  open: boolean
  onClose: () => void
  /** The address being edited, or null to add a new one. */
  address: Address | null
}

type Errors = Partial<Record<'line1' | 'city' | 'pincode', string>>

export function validateAddress(values: { line1: string; city: string; pincode: string }): Errors {
  const errors: Errors = {}
  if (values.line1.trim().length < 8) errors.line1 = 'Enter your full address (house no., street, area).'
  if (values.city.trim().length < 2) errors.city = 'Enter your city.'
  if (!/^[1-9]\d{5}$/.test(values.pincode)) errors.pincode = 'Enter a valid 6-digit pincode.'
  return errors
}

export function AddressSheet({ open, onClose, address }: AddressSheetProps) {
  const { state, actions } = useApp()
  const toast = useToast()
  const [label, setLabel] = useState<AddressLabel>('Home')
  const [line1, setLine1] = useState('')
  const [city, setCity] = useState('')
  const [pincode, setPincode] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (!open) return
    setLabel(address?.label ?? 'Home')
    setLine1(address?.line1 ?? '')
    setCity(address?.city ?? '')
    setPincode(address?.pincode ?? '')
    setErrors({})
    setConfirmDelete(false)
  }, [open, address])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const found = validateAddress({ line1, city, pincode })
    setErrors(found)
    if (Object.keys(found).length > 0) return
    actions.saveAddress({ id: address?.id ?? makeAddressId(), label, line1: line1.trim(), city: city.trim(), pincode })
    toast.show(address ? 'Address updated' : 'Address added')
    onClose()
  }

  const remove = () => {
    if (!address) return
    actions.deleteAddress(address.id)
    toast.show('Address deleted')
    onClose()
  }

  const canDelete = Boolean(address) && state.addresses.length > 1

  return (
    <Sheet open={open} onClose={onClose} title={address ? 'Edit address' : 'Add address'}>
      <form className={styles.form} onSubmit={submit} noValidate>
        <fieldset className={styles.group}>
          <legend className={styles.legend}>Save as</legend>
          <div className={styles.chips} role="radiogroup" aria-label="Save address as">
            {LABELS.map((l) => (
              <OptionChip key={l} selected={label === l} onSelect={() => setLabel(l)}>
                {l}
              </OptionChip>
            ))}
          </div>
        </fieldset>

        <TextField
          label="Address"
          value={line1}
          onChange={(e) => setLine1(e.target.value)}
          error={errors.line1}
          placeholder="No.14, 10th cross street, Lakshmi Nagar"
          autoComplete="street-address"
          data-autofocus
        />
        <div className={styles.row}>
          <TextField label="City" value={city} onChange={(e) => setCity(e.target.value)} error={errors.city} autoComplete="address-level2" />
          <TextField
            label="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            error={errors.pincode}
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={6}
          />
        </div>

        <Button type="submit" block>
          {address ? 'Save address' : 'Add address'}
        </Button>

        {address && (
          <div className={styles.danger}>
            {confirmDelete ? (
              <div className={styles.confirm} role="alert">
                <span>Delete this address?</span>
                <Button variant="link" onClick={() => setConfirmDelete(false)}>
                  Keep it
                </Button>
                <Button variant="link" onClick={remove} className={styles.deleteLink}>
                  Delete
                </Button>
              </div>
            ) : (
              <Button variant="link" onClick={() => setConfirmDelete(true)} disabled={!canDelete} className={styles.deleteLink}>
                Delete address
              </Button>
            )}
            {!canDelete && <p className={styles.hint}>You need at least one saved address.</p>}
          </div>
        )}
      </form>
    </Sheet>
  )
}
