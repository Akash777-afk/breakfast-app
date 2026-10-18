import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AddressSheet } from '../../components/features/AddressSheet'
import { EditOrderSheet } from '../../components/features/EditOrderSheet'
import { PaymentSheet, type PaidInfo } from '../../components/features/PaymentSheet'
import { SlotSheet } from '../../components/features/SlotSheet'
import { ArrowRightIcon, ReceiptIcon } from '../../components/icons'
import { ActionBar } from '../../components/layout/ActionBar'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/Button'
import { SlotChip } from '../../components/ui/Chip'
import { EmptyState } from '../../components/ui/EmptyState'
import { RadioCard } from '../../components/ui/RadioCard'
import { useToast } from '../../components/ui/Toast'
import { SLOTS_ROW_MAJOR } from '../../data/checkout'
import { ADDON_BY_ID } from '../../data/addons'
import { DISH_BY_ID } from '../../data/dishes'
import { formatDeliveryDay, isoDateForOffset, rupees } from '../../lib/format'
import { cartSummary, computeTotals, servingPrice, addOnsPrice } from '../../lib/pricing'
import { makeOrderId, useApp } from '../../state/AppState'
import type { Coupon, Order } from '../../types'
import styles from './Checkout.module.css'

export function Checkout() {
  const navigate = useNavigate()
  const toast = useToast()
  const { state, actions } = useApp()

  const [coupon, setCoupon] = useState<Coupon | null>(null)
  const [editOrderOpen, setEditOrderOpen] = useState(false)
  const [addressSheet, setAddressSheet] = useState<{ open: boolean; editing: boolean }>({ open: false, editing: false })
  const [slotSheetOpen, setSlotSheetOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [errors, setErrors] = useState<{ address?: string; slot?: string }>({})
  const addressRef = useRef<HTMLElement>(null)
  const slotRef = useRef<HTMLElement>(null)

  const subscribed = Boolean(state.subscription)
  const totals = computeTotals(state.cart, { subscribed, coupon })
  const selectedAddress = state.addresses.find((a) => a.id === state.selectedAddressId) ?? null
  const dayOffset = state.slot?.dayOffset ?? 1
  const dayLabel = formatDeliveryDay(isoDateForOffset(dayOffset))
  const customSlot = state.slot && !SLOTS_ROW_MAJOR.includes(state.slot.time) ? state.slot.time : null

  const chooseSlot = (time: string) => {
    actions.setSlot({ dayOffset, time })
    setErrors((e) => ({ ...e, slot: undefined }))
  }

  const proceed = () => {
    const next: typeof errors = {}
    if (!selectedAddress) next.address = 'Add a delivery address to continue.'
    if (!state.slot) next.slot = 'Pick a delivery time to continue.'
    setErrors(next)
    if (next.address || next.slot) {
      toast.show(next.address ?? next.slot ?? '', { tone: 'error' })
      const target = next.address ? addressRef.current : slotRef.current
      target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' })
      return
    }
    setPaymentOpen(true)
  }

  const onPaid = ({ method }: PaidInfo) => {
    if (!selectedAddress || !state.slot) return
    const now = new Date()
    const order: Order = {
      id: makeOrderId(),
      createdAt: now.toISOString(),
      lines: state.cart.map((line) => {
        const dish = DISH_BY_ID[line.dishId]
        return {
          dishId: line.dishId,
          name: dish?.name ?? line.dishId,
          qty: line.qty,
          addOns: line.addOnIds.map((id) => ADDON_BY_ID[id]?.name ?? id),
          addOnIds: line.addOnIds,
          unitPrice: servingPrice(line) + addOnsPrice(line),
        }
      }),
      address: selectedAddress,
      slot: state.slot,
      deliveryDate: isoDateForOffset(state.slot.dayOffset, now),
      totals,
      coupon: coupon && totals.discount > 0 ? { code: coupon.code, name: coupon.name } : null,
      payment: method,
    }
    setPaymentOpen(false)
    actions.placeOrder(order)
    navigate(`/order/${order.id}`, { replace: true, state: { fresh: true } })
  }

  if (state.cart.length === 0) {
    return (
      <>
        <TopBar title="Checking out" />
        <EmptyState
          icon={<ReceiptIcon />}
          title="Your order is empty"
          text="Add a few breakfast items and they’ll show up here, ready for checkout."
          action={
            <Button variant="pill" onClick={() => navigate('/')}>
              Browse breakfast
            </Button>
          }
        />
      </>
    )
  }

  return (
    <>
      <TopBar title="Checking out" />

      <div className={styles.content}>
        <section aria-labelledby="order-title">
          <h2 id="order-title" className={styles.heading}>
            Confirm your order
          </h2>
          <RadioCard
            selected
            actions={
              <>
                <Link to="/" className={styles.link}>
                  Add Items
                </Link>
                <button type="button" className={styles.link} onClick={() => setEditOrderOpen(true)} aria-haspopup="dialog">
                  Edit Order
                </button>
              </>
            }
          >
            {cartSummary(state.cart)}
          </RadioCard>
        </section>

        <section ref={addressRef} aria-labelledby="address-title">
          <h2 id="address-title" className={styles.heading}>
            Confirm your address
          </h2>
          {state.addresses.length > 0 ? (
            <div className={styles.stack} role="radiogroup" aria-label="Delivery address">
              {state.addresses.map((address) => (
                <RadioCard
                  key={address.id}
                  selected={address.id === state.selectedAddressId}
                  onSelect={() => {
                    actions.selectAddress(address.id)
                    setErrors((e) => ({ ...e, address: undefined }))
                  }}
                >
                  <span className={styles.addressLabel}>{address.label}</span>
                  {address.line1}, {address.city} - {address.pincode}.
                </RadioCard>
              ))}
            </div>
          ) : (
            <p className={styles.none}>You haven’t saved an address yet.</p>
          )}
          {errors.address && (
            <p className={styles.error} role="alert">
              {errors.address}
            </p>
          )}
          <div className={styles.links}>
            <button type="button" className={styles.link} onClick={() => setAddressSheet({ open: true, editing: false })} aria-haspopup="dialog">
              Add address
            </button>
            {selectedAddress && (
              <button type="button" className={styles.link} onClick={() => setAddressSheet({ open: true, editing: true })} aria-haspopup="dialog">
                Edit address
              </button>
            )}
          </div>
        </section>

        <section ref={slotRef} aria-labelledby="slot-title">
          <div className={styles.slotHeading}>
            <h2 id="slot-title" className={styles.heading}>
              Preferred delivery slot
            </h2>
            <Button variant="pill" onClick={() => setSlotSheetOpen(true)} aria-haspopup="dialog" className={styles.other}>
              Other Timings
            </Button>
          </div>
          <div className={styles.slotCard}>
            <p className={styles.slotLead}>Your order is scheduled for {dayLabel} by</p>
            <div className={styles.slots} role="radiogroup" aria-label="Delivery time">
              {SLOTS_ROW_MAJOR.map((time) => (
                <SlotChip key={time} selected={state.slot?.time === time} onSelect={() => chooseSlot(time)}>
                  {time.replace(' ', ' ')}
                </SlotChip>
              ))}
              {customSlot && (
                <SlotChip selected onSelect={() => setSlotSheetOpen(true)}>
                  {customSlot.replace(' ', ' ')}
                </SlotChip>
              )}
            </div>
          </div>
          {errors.slot && (
            <p className={styles.error} role="alert">
              {errors.slot}
            </p>
          )}
        </section>

        <Link to="/plans" className={styles.smart}>
          <span className={styles.smartText}>
            <span className={styles.smartTitle}>Cut your cost, choose smart</span>
            <span className={styles.smartSub}>{subscribed ? 'Your plan includes free delivery' : 'Subscribe for free delivery & weekly savings'}</span>
          </span>
          <ArrowRightIcon className={styles.smartIcon} />
        </Link>

        <section className={styles.bill} aria-label="Bill details">
          <div className={styles.billLine}>
            <span>Item total</span>
            <span>{rupees(totals.subtotal)}</span>
          </div>
          <div className={styles.billLine}>
            <span>Delivery</span>
            <span className={totals.delivery === 0 ? styles.free : undefined}>{totals.delivery === 0 ? 'Free' : rupees(totals.delivery)}</span>
          </div>
          {totals.discount > 0 && coupon && (
            <div className={`${styles.billLine} ${styles.free}`}>
              <span>Coupon {coupon.code}</span>
              <span>−{rupees(totals.discount)}</span>
            </div>
          )}
          <div className={`${styles.billLine} ${styles.billTotal}`}>
            <span>Total</span>
            <span>{rupees(totals.total)}</span>
          </div>
        </section>
      </div>

      <ActionBar>
        <Button onClick={proceed}>Proceed to payment · {rupees(totals.total)}</Button>
      </ActionBar>

      <EditOrderSheet open={editOrderOpen} onClose={() => setEditOrderOpen(false)} />
      <AddressSheet open={addressSheet.open} onClose={() => setAddressSheet((s) => ({ ...s, open: false }))} address={addressSheet.editing ? selectedAddress : null} />
      <SlotSheet
        open={slotSheetOpen}
        onClose={() => setSlotSheetOpen(false)}
        value={state.slot}
        onSave={(slot) => {
          actions.setSlot(slot)
          setErrors((e) => ({ ...e, slot: undefined }))
        }}
      />
      <PaymentSheet
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        subtotal={totals.subtotal}
        delivery={totals.delivery}
        coupon={coupon}
        onCouponChange={setCoupon}
        onPaid={onPaid}
      />
    </>
  )
}
