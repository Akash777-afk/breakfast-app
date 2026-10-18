import { Link } from 'react-router-dom'
import { ADDON_BY_ID } from '../../data/addons'
import { DISH_BY_ID } from '../../data/dishes'
import { rupees } from '../../lib/format'
import { lineTotal } from '../../lib/pricing'
import { useApp } from '../../state/AppState'
import { Button } from '../ui/Button'
import { Sheet } from '../ui/Overlay'
import { Stepper } from '../ui/Stepper'
import styles from './EditOrderSheet.module.css'

interface EditOrderSheetProps {
  open: boolean
  onClose: () => void
}

export function EditOrderSheet({ open, onClose }: EditOrderSheetProps) {
  const { state, actions } = useApp()

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Edit order"
      footer={
        <Button block onClick={onClose}>
          Done
        </Button>
      }
    >
      {state.cart.length === 0 ? (
        <p className={styles.empty}>
          Your order is empty.{' '}
          <Link to="/" className={styles.link} onClick={onClose}>
            Browse breakfast
          </Link>
        </p>
      ) : (
        <ul className={styles.list}>
          {state.cart.map((line) => {
            const dish = DISH_BY_ID[line.dishId]
            if (!dish) return null
            const extras = line.addOnIds.map((id) => ADDON_BY_ID[id]?.name).filter(Boolean)
            return (
              <li key={line.dishId} className={styles.item}>
                <img className={styles.photo} src={dish.image} alt="" />
                <div className={styles.body}>
                  <span className={styles.name}>{dish.name}</span>
                  <span className={styles.meta}>
                    {line.options.portion === 'large' ? 'Large' : 'Regular'} · {line.options.spice}
                    {extras.length > 0 && ` · ${extras.join(', ')}`}
                  </span>
                  <span className={styles.price}>{rupees(lineTotal(line))}</span>
                </div>
                <Stepper value={line.qty} onChange={(qty) => actions.setQty(line.dishId, qty)} label={dish.name} removable size="sm" />
              </li>
            )
          })}
        </ul>
      )}
    </Sheet>
  )
}
