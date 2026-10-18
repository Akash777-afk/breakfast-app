import { useEffect, useRef, useState, type ComponentType, type FormEvent, type SVGProps } from 'react'
import { COUPONS } from '../../data/checkout'
import { rupees } from '../../lib/format'
import { couponDiscount } from '../../lib/pricing'
import { PaymentError, pay, validateCoupon } from '../../services/api'
import type { Coupon, PaymentMethod } from '../../types'
import { CardIcon, CashIcon, PhoneIcon, TagIcon } from '../icons'
import { Button } from '../ui/Button'
import { TextField } from '../ui/Field'
import { Sheet } from '../ui/Overlay'
import styles from './PaymentSheet.module.css'

export interface PaidInfo {
  method: PaymentMethod
  total: number
  transactionId: string
}

interface PaymentSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  itemLabel?: string
  subtotal: number
  delivery?: number
  /** When provided, the coupon section is shown. */
  coupon?: Coupon | null
  onCouponChange?: (coupon: Coupon | null) => void
  /** Cash on delivery makes no sense for e.g. subscription charges. */
  allowCod?: boolean
  onPaid: (info: PaidInfo) => void
}

const METHODS: { id: PaymentMethod; label: string; hint: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { id: 'upi', label: 'UPI', hint: 'GPay, PhonePe, Paytm…', Icon: PhoneIcon },
  { id: 'card', label: 'Card', hint: 'Credit or debit card', Icon: CardIcon },
  { id: 'cod', label: 'Cash on delivery', hint: 'Pay when breakfast arrives', Icon: CashIcon },
]

type FieldErrors = Partial<Record<'upiId' | 'cardNumber' | 'expiry' | 'cvv' | 'cardName', string>>

export function validateUpi(value: string): string | null {
  return /^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$/.test(value.trim()) ? null : 'Enter a valid UPI ID, like name@upi.'
}

export function validateExpiry(value: string, now: Date = new Date()): string | null {
  const match = /^(\d{2})\/(\d{2})$/.exec(value)
  if (!match) return 'Use MM/YY.'
  const month = Number(match[1])
  const year = 2000 + Number(match[2])
  if (month < 1 || month > 12) return 'Enter a valid month (01–12).'
  if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) return 'This card has expired.'
  return null
}

const groupCard = (digits: string) => digits.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

export function PaymentSheet({
  open,
  onClose,
  title = 'Payment',
  itemLabel = 'Item total',
  subtotal,
  delivery,
  coupon = null,
  onCouponChange,
  allowCod = true,
  onPaid,
}: PaymentSheetProps) {
  const methods = allowCod ? METHODS : METHODS.filter((m) => m.id !== 'cod')
  const [method, setMethod] = useState<PaymentMethod>('upi')
  const [upiId, setUpiId] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardName, setCardName] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [code, setCode] = useState('')
  const [couponMessage, setCouponMessage] = useState<string | null>(null)
  const [applying, setApplying] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [failure, setFailure] = useState<string | null>(null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    if (!open) return
    setErrors({})
    setFailure(null)
    setCouponMessage(null)
    setCode('')
    setProcessing(false)
  }, [open])

  const discount = couponDiscount(subtotal, coupon)
  const total = Math.max(0, subtotal - discount + (delivery ?? 0))

  const applyCoupon = async (raw: string) => {
    if (!onCouponChange) return
    setApplying(true)
    setCouponMessage(null)
    const result = await validateCoupon(raw, subtotal)
    if (!mounted.current) return
    setApplying(false)
    if (result.ok) {
      onCouponChange(result.coupon)
      setCode('')
    } else {
      setCouponMessage(result.reason)
    }
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (processing) return
    const found: FieldErrors = {}
    if (method === 'upi') {
      const problem = validateUpi(upiId)
      if (problem) found.upiId = problem
    }
    if (method === 'card') {
      if (cardNumber.replace(/\s/g, '').length !== 16) found.cardNumber = 'Enter the 16-digit card number.'
      const expiryProblem = validateExpiry(expiry)
      if (expiryProblem) found.expiry = expiryProblem
      if (!/^\d{3}$/.test(cvv)) found.cvv = '3 digits.'
      if (cardName.trim().length < 2) found.cardName = 'Enter the name on the card.'
    }
    setErrors(found)
    setFailure(null)
    if (Object.keys(found).length > 0) return

    setProcessing(true)
    try {
      const { transactionId } = await pay({ method, amount: total, upiId, cardNumber })
      if (!mounted.current) return
      setProcessing(false)
      onPaid({ method, total, transactionId })
    } catch (err) {
      if (!mounted.current) return
      setProcessing(false)
      setFailure(err instanceof PaymentError ? err.message : 'Something went wrong while processing your payment. Please try again.')
    }
  }

  return (
    <Sheet
      open={open}
      onClose={processing ? () => undefined : onClose}
      title={title}
      footer={
        <Button type="submit" form="payment-form" block loading={processing}>
          {processing ? 'Processing…' : failure ? `Try again · ${rupees(total)}` : method === 'cod' ? `Place order · ${rupees(total)}` : `Pay ${rupees(total)}`}
        </Button>
      }
    >
      <form id="payment-form" className={styles.form} onSubmit={submit} noValidate>
        <section className={styles.bill} aria-label="Price details">
          <div className={styles.line}>
            <span>{itemLabel}</span>
            <span>{rupees(subtotal)}</span>
          </div>
          {delivery !== undefined && (
            <div className={styles.line}>
              <span>Delivery</span>
              <span className={delivery === 0 ? styles.free : undefined}>{delivery === 0 ? 'Free' : rupees(delivery)}</span>
            </div>
          )}
          {discount > 0 && coupon && (
            <div className={`${styles.line} ${styles.free}`}>
              <span>Coupon {coupon.code}</span>
              <span>−{rupees(discount)}</span>
            </div>
          )}
          <div className={`${styles.line} ${styles.total}`}>
            <span>To pay</span>
            <span>{rupees(total)}</span>
          </div>
        </section>

        {onCouponChange && (
          <section className={styles.coupons} aria-label="Coupons">
            {coupon ? (
              <div className={styles.applied}>
                <TagIcon className={styles.tag} />
                <span className={styles.appliedText}>
                  <strong>{coupon.code}</strong> applied · {coupon.description}
                </span>
                <Button variant="link" onClick={() => onCouponChange(null)} disabled={processing}>
                  Remove
                </Button>
              </div>
            ) : (
              <>
                <div className={styles.couponRow}>
                  <TextField
                    label="Have a coupon?"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.toUpperCase())
                      setCouponMessage(null)
                    }}
                    error={couponMessage ?? undefined}
                    placeholder="Enter code"
                    autoCapitalize="characters"
                    spellCheck={false}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        void applyCoupon(code)
                      }
                    }}
                  />
                  <Button variant="pill" onClick={() => void applyCoupon(code)} loading={applying} disabled={!code.trim()} className={styles.apply}>
                    Apply
                  </Button>
                </div>
                <ul className={styles.suggestions}>
                  {COUPONS.map((c) => (
                    <li key={c.code}>
                      <button type="button" className={styles.suggestion} onClick={() => void applyCoupon(c.code)} disabled={applying}>
                        <span className={styles.suggestionCode}>{c.code}</span>
                        <span className={styles.suggestionText}>{c.description}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        )}

        <fieldset className={styles.methods} disabled={processing}>
          <legend className={styles.legend}>Pay with</legend>
          <div role="radiogroup" aria-label="Payment method" className={styles.methodList}>
            {methods.map(({ id, label, hint, Icon }) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={method === id}
                className={`${styles.method} ${method === id ? styles.methodOn : ''}`}
                onClick={() => {
                  setMethod(id)
                  setErrors({})
                  setFailure(null)
                }}
              >
                <Icon className={styles.methodIcon} />
                <span className={styles.methodText}>
                  <span className={styles.methodLabel}>{label}</span>
                  <span className={styles.methodHint}>{hint}</span>
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        {method === 'upi' && (
          <TextField
            label="UPI ID"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            error={errors.upiId}
            placeholder="name@upi"
            autoCapitalize="none"
            autoComplete="off"
            spellCheck={false}
            disabled={processing}
            hint="Demo: any valid ID works. Try fail@upi to see a declined payment."
          />
        )}

        {method === 'card' && (
          <div className={styles.card}>
            <TextField
              label="Card number"
              value={cardNumber}
              onChange={(e) => setCardNumber(groupCard(e.target.value))}
              error={errors.cardNumber}
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="1234 5678 9012 3456"
              disabled={processing}
              hint="Demo: a card ending in 0000 is declined."
            />
            <div className={styles.cardRow}>
              <TextField
                label="Expiry"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                error={errors.expiry}
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                disabled={processing}
              />
              <TextField
                label="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                error={errors.cvv}
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="123"
                type="password"
                disabled={processing}
              />
            </div>
            <TextField label="Name on card" value={cardName} onChange={(e) => setCardName(e.target.value)} error={errors.cardName} autoComplete="cc-name" disabled={processing} />
          </div>
        )}

        {method === 'cod' && <p className={styles.codNote}>Keep {rupees(total)} ready. Our delivery partner accepts cash or UPI at your door.</p>}

        {failure && (
          <p className={styles.failure} role="alert">
            {failure}
          </p>
        )}

        <p className={styles.demo}>Demo checkout — no real payment is taken and no card or UPI details are stored or sent anywhere.</p>
      </form>
    </Sheet>
  )
}
