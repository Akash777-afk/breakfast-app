import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { DeliveryMap } from '../../components/features/DeliveryMap'
import { BackIcon, CheckIcon, LocateIcon, ReceiptIcon, TagIcon } from '../../components/icons'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { Dialog } from '../../components/ui/Overlay'
import { useToast } from '../../components/ui/Toast'
import { formatDeliveryDay, kitchenStartLabel, rupees } from '../../lib/format'
import { useApp } from '../../state/AppState'
import styles from './OrderSuccess.module.css'

const PAYMENT_LABEL = { upi: 'UPI', card: 'Card', cod: 'Cash on delivery' } as const

export function OrderSuccess() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const toast = useToast()
  const { state } = useApp()
  const order = state.orders.find((o) => o.id === id)

  const fresh = (location.state as { fresh?: boolean } | null)?.fresh === true
  const [dialogOpen, setDialogOpen] = useState(fresh)
  const wasFresh = useRef(fresh)

  // The celebration is shown once: drop the flag right away so refresh, back and forward never replay it.
  useEffect(() => {
    if (fresh) navigate(location.pathname, { replace: true, state: null })
  }, [fresh, location.pathname, navigate])
  const [expanded, setExpanded] = useState(true)
  const [zoomed, setZoomed] = useState(false)

  if (!order) {
    return (
      <>
        <TopBar title="Order status" backFallback="/orders" />
        <EmptyState
          icon={<ReceiptIcon />}
          title="Order not found"
          text="We couldn’t find that order. It may have been cleared from this device."
          action={
            <Link to="/orders" className={styles.emptyLink}>
              See my orders
            </Link>
          }
        />
      </>
    )
  }

  const day = formatDeliveryDay(order.deliveryDate)
  const kitchenAt = kitchenStartLabel(order.slot.time)
  const itemCount = order.lines.reduce((sum, line) => sum + line.qty, 0)

  const closeDialog = () => setDialogOpen(false)

  const goBack = () => {
    if (wasFresh.current || location.key === 'default') navigate('/', { replace: true })
    else navigate(-1)
  }

  const locate = () => {
    setZoomed((z) => !z)
    toast.show(zoomed ? 'Showing the full delivery route' : 'Centered on your delivery address', { tone: 'info' })
  }

  return (
    <div className={styles.screen}>
      <DeliveryMap zoomed={zoomed} />

      <div className={styles.topRow}>
        <button type="button" className={styles.back} onClick={goBack}>
          <BackIcon className={styles.backIcon} />
          Back
        </button>
        <button type="button" className={styles.locate} onClick={locate} aria-pressed={zoomed} aria-label={zoomed ? 'Show full route' : 'Center on my delivery address'}>
          <LocateIcon className={styles.locateIcon} />
        </button>
      </div>

      <section className={styles.panel} aria-label="Order details">
        <button type="button" className={styles.handle} onClick={() => setExpanded((e) => !e)} aria-expanded={expanded} aria-label={expanded ? 'Collapse order details' : 'Expand order details'}>
          <span className={styles.grab} aria-hidden="true" />
        </button>

        <div className={styles.summaryRow}>
          <div>
            <p className={styles.status}>Preparing from {kitchenAt}</p>
            <p className={styles.orderId}>
              Order #{order.id} · {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </p>
          </div>
          <span className={styles.time}>
            {order.slot.time}
            <span className={styles.day}>{day}</span>
          </span>
        </div>

        {expanded && (
          <div className={styles.details}>
            {order.coupon && (
              <div className={styles.coupon}>
                <TagIcon className={styles.couponIcon} />
                <span className={styles.couponLabel}>Coupon name</span>
                <span className={styles.couponCode}>{order.coupon.code}</span>
              </div>
            )}

            <div className={styles.row}>
              <span className={styles.rowLabel}>Delivery time</span>
              <span className={styles.rowValue}>
                {order.slot.time}, {day}
              </span>
            </div>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Deliver to</span>
              <span className={styles.rowValue}>
                {order.address.line1}, {order.address.city} - {order.address.pincode}
              </span>
            </div>

            <table className={styles.items}>
              <thead>
                <tr>
                  <th scope="col">Food items</th>
                  <th scope="col" className={styles.qtyHead}>
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.lines.map((line) => (
                  <tr key={line.dishId}>
                    <td>
                      {line.name}
                      {line.addOns.length > 0 && <span className={styles.extras}> + {line.addOns.join(', ')}</span>}
                    </td>
                    <td className={styles.qty}>x{line.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.paid}>
              <span>
                Paid via {PAYMENT_LABEL[order.payment]}
                {order.payment === 'cod' && ' (on delivery)'}
              </span>
              <strong>{rupees(order.totals.total)}</strong>
            </div>

            <div className={styles.footer}>
              <Button variant="outline" onClick={() => navigate('/orders')} className={styles.footerBtn}>
                My orders
              </Button>
              <Button onClick={() => navigate('/', { replace: true })} className={styles.footerBtn}>
                Back to home
              </Button>
            </div>
          </div>
        )}
      </section>

      <Dialog open={dialogOpen} onClose={closeDialog} label="Order successful" tone="success">
        <div className={styles.dialog}>
          <span className={styles.badge} aria-hidden="true">
            <CheckIcon className={styles.badgeIcon} />
          </span>
          <h2 className={styles.dialogTitle}>Order Successful</h2>
          <p className={styles.dialogText}>
            Our kitchen will begin preparing breakfast {day} at {kitchenAt}.
          </p>
          <Button block onClick={closeDialog} data-autofocus>
            Done
          </Button>
        </div>
      </Dialog>
    </div>
  )
}
