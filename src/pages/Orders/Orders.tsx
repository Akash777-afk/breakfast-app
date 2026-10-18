import { Link, useNavigate } from 'react-router-dom'
import { ReceiptIcon } from '../../components/icons'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { useToast } from '../../components/ui/Toast'
import { formatDeliveryDay, formatOrderStamp, isoDateForOffset, rupees } from '../../lib/format'
import { useApp } from '../../state/AppState'
import type { Order } from '../../types'
import styles from './Orders.module.css'

function summary(order: Order): string {
  return order.lines.map((l) => `${l.qty} ${l.name.toLowerCase()}`).join(' + ')
}

export function Orders() {
  const navigate = useNavigate()
  const toast = useToast()
  const { state, actions } = useApp()
  const today = isoDateForOffset(0)

  const reorder = (order: Order) => {
    order.lines.forEach((line) => actions.addToCart(line.dishId, { qty: line.qty, addOnIds: line.addOnIds }))
    toast.show(`Added ${order.lines.length} ${order.lines.length === 1 ? 'item' : 'items'} from #${order.id}`)
    navigate('/checkout')
  }

  return (
    <>
      <TopBar title="My orders" />
      {state.orders.length === 0 ? (
        <EmptyState
          icon={<ReceiptIcon />}
          title="No orders yet"
          text="Your breakfast orders will appear here once you place one."
          action={
            <Button variant="pill" onClick={() => navigate('/')}>
              Explore breakfast
            </Button>
          }
        />
      ) : (
        <ul className={styles.list}>
          {state.orders.map((order) => {
            const delivered = order.deliveryDate < today
            return (
              <li key={order.id} className={styles.card}>
                <div className={styles.top}>
                  <span className={styles.id}>#{order.id}</span>
                  <span className={`${styles.status} ${delivered ? styles.delivered : styles.scheduled}`}>{delivered ? 'Delivered' : 'Scheduled'}</span>
                </div>
                <p className={styles.items}>{summary(order)}</p>
                <p className={styles.meta}>
                  {formatDeliveryDay(order.deliveryDate).replace(/^./, (c) => c.toUpperCase())}, {order.slot.time} · placed {formatOrderStamp(order.createdAt)}
                </p>
                <div className={styles.bottom}>
                  <strong className={styles.total}>{rupees(order.totals.total)}</strong>
                  <div className={styles.actions}>
                    <Link to={`/order/${order.id}`} className={styles.link}>
                      View details
                    </Link>
                    <Button variant="pill" onClick={() => reorder(order)}>
                      Reorder
                    </Button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
