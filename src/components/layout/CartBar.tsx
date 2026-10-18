import { Link } from 'react-router-dom'
import { cartCount, cartSubtotal } from '../../lib/pricing'
import { rupees } from '../../lib/format'
import { useApp } from '../../state/AppState'
import { ArrowRightIcon, CloseIcon } from '../icons'
import { useToast } from '../ui/Toast'
import styles from './CartBar.module.css'

/** Floating summary of the current order; hidden while the cart is empty. */
export function CartBar() {
  const { state, actions } = useApp()
  const toast = useToast()
  const count = cartCount(state.cart)
  if (count === 0) return null

  const cancelOrder = () => {
    const previous = state.cart
    actions.clearCart()
    toast.show('Order cancelled', {
      actionLabel: 'Undo',
      onAction: () => previous.forEach((line) => actions.addToCart(line.dishId, { qty: line.qty, addOnIds: line.addOnIds, options: line.options })),
    })
  }

  return (
    <div className={styles.bar}>
      <button type="button" className={styles.cancel} onClick={cancelOrder} aria-label="Cancel order" title="Cancel order">
        <CloseIcon className={styles.cancelIcon} />
      </button>
      <Link to="/checkout" className={styles.link} aria-label={`View order: ${count} ${count === 1 ? 'item' : 'items'}, ${rupees(cartSubtotal(state.cart))}`}>
        <span className={styles.summary}>
          <span className={styles.count}>
            {count} {count === 1 ? 'item' : 'items'}
          </span>
          <span className={styles.total}>{rupees(cartSubtotal(state.cart))}</span>
        </span>
        <span className={styles.cta}>
          View order
          <ArrowRightIcon className={styles.icon} />
        </span>
      </Link>
    </div>
  )
}
