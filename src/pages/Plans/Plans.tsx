import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ComboSheet } from '../../components/features/ComboSheet'
import { PaymentSheet } from '../../components/features/PaymentSheet'
import { RefreshIcon } from '../../components/icons'
import { ActionBar } from '../../components/layout/ActionBar'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { EmptyState } from '../../components/ui/EmptyState'
import { RadioCard } from '../../components/ui/RadioCard'
import { Skeleton } from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'
import { TRIAL_DAYS } from '../../data/plans'
import { rupees } from '../../lib/format'
import { useAsync } from '../../lib/useAsync'
import { getPlans } from '../../services/api'
import { useApp } from '../../state/AppState'
import type { PlanId } from '../../types'
import styles from './Plans.module.css'

type Dialogs = 'none' | 'upgrade' | 'trial' | 'cancel'

function trialEnds(startedAt: string): string {
  const end = new Date(startedAt)
  end.setDate(end.getDate() + TRIAL_DAYS)
  return end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export function Plans() {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const { state, actions } = useApp()
  const { data: plans, loading, error, reload } = useAsync(getPlans)

  const [selectedId, setSelectedId] = useState<PlanId>(state.subscription?.planId ?? 'basic-weekly')
  const [dialog, setDialog] = useState<Dialogs>('none')
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [comboFor, setComboFor] = useState<PlanId | null>(null)

  const subscription = state.subscription
  const selected = plans?.find((p) => p.id === selectedId)
  const comboPlan = plans?.find((p) => p.id === comboFor)
  const isCurrentActive = subscription?.status === 'active' && subscription.planId === selectedId
  const comboOf = (id: PlanId, fallback: string[]) => state.combos[id] ?? fallback

  const leave = () => {
    if (location.key !== 'default') navigate(-1)
    else navigate('/', { replace: true })
  }

  const startTrial = () => {
    if (!selected) return
    actions.setSubscription({ planId: selected.id, status: 'trial', startedAt: new Date().toISOString() })
    setDialog('none')
    toast.show(`Free trial started — ${selected.name}`)
  }

  return (
    <>
      <TopBar title="Subscription plans" />

      <div className={styles.content}>
        {subscription && (
          <div className={styles.banner} role="status">
            <div>
              <strong>{plans?.find((p) => p.id === subscription.planId)?.name ?? 'Your plan'}</strong>
              <span className={styles.bannerSub}>
                {subscription.status === 'trial' ? `Free trial · ends ${trialEnds(subscription.startedAt)}` : 'Active · free delivery on every order'}
              </span>
            </div>
            <Button variant="link" onClick={() => setDialog('cancel')} className={styles.cancel}>
              Cancel plan
            </Button>
          </div>
        )}

        <div className={styles.heading}>
          <h2 className={styles.title}>Check our plans</h2>
          {!subscription && (
            <Button variant="link" onClick={() => setDialog('trial')} disabled={!selected} aria-haspopup="dialog">
              Free Trial
            </Button>
          )}
        </div>

        {error ? (
          <EmptyState
            tone="error"
            icon={<RefreshIcon />}
            title="Couldn’t load plans"
            text="Check your connection and try again."
            action={<Button variant="pill" onClick={reload}>Try again</Button>}
          />
        ) : loading ? (
          <div className={styles.stack} role="status" aria-label="Loading plans">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className={styles.skeleton} />
            ))}
          </div>
        ) : (
          <div className={styles.stack} role="radiogroup" aria-label="Subscription plans">
            {plans?.map((plan) => {
              const isCurrent = subscription?.planId === plan.id
              return (
                <RadioCard
                  key={plan.id}
                  selected={selectedId === plan.id}
                  onSelect={() => setSelectedId(plan.id)}
                  aside={<span className={styles.price}>{rupees(plan.price)}/{plan.period}</span>}
                  actions={
                    <Button variant="link" onClick={() => setComboFor(plan.id)} aria-haspopup="dialog" className={styles.edit}>
                      Edit combo
                    </Button>
                  }
                >
                  <span className={styles.planName}>
                    {plan.name}
                    {isCurrent && <span className={styles.current}>{subscription?.status === 'trial' ? 'Trial' : 'Current'}</span>}
                  </span>
                  <ul className={styles.combo}>
                    {comboOf(plan.id, plan.combo).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </RadioCard>
              )
            })}
          </div>
        )}
      </div>

      <ActionBar>
        <Button variant="outline" onClick={leave}>
          Not this time
        </Button>
        <Button onClick={() => setDialog('upgrade')} disabled={!selected || isCurrentActive}>
          {isCurrentActive ? 'Current plan' : subscription ? 'Upgrade' : 'Subscribe'}
        </Button>
      </ActionBar>

      <ConfirmDialog
        open={dialog === 'upgrade'}
        title={`Get the ${selected?.name.toLowerCase() ?? 'plan'}?`}
        text={`You’ll pay ${selected ? rupees(selected.price) : ''} per ${selected?.period ?? 'period'}. Delivery is free while you’re subscribed, and you can cancel anytime.`}
        confirmLabel="Continue to payment"
        onCancel={() => setDialog('none')}
        onConfirm={() => {
          setDialog('none')
          setPaymentOpen(true)
        }}
      />
      <ConfirmDialog
        open={dialog === 'trial'}
        title={`Start your ${TRIAL_DAYS}-day free trial?`}
        text={`Try the ${selected?.name.toLowerCase() ?? 'plan'} free for ${TRIAL_DAYS} days. Nothing is charged now, and you can cancel before it ends.`}
        confirmLabel="Start free trial"
        onCancel={() => setDialog('none')}
        onConfirm={startTrial}
      />
      <ConfirmDialog
        open={dialog === 'cancel'}
        title="Cancel your plan?"
        text="You’ll go back to paying delivery fees on orders under ₹250. You can subscribe again anytime."
        confirmLabel="Cancel plan"
        cancelLabel="Keep plan"
        danger
        onCancel={() => setDialog('none')}
        onConfirm={() => {
          actions.setSubscription(null)
          setDialog('none')
          toast.show('Plan cancelled')
        }}
      />

      {selected && (
        <PaymentSheet
          open={paymentOpen}
          onClose={() => setPaymentOpen(false)}
          title="Subscribe"
          itemLabel={`${selected.name} (1 ${selected.period})`}
          subtotal={selected.price}
          allowCod={false}
          onPaid={() => {
            actions.setSubscription({ planId: selected.id, status: 'active', startedAt: new Date().toISOString() })
            setPaymentOpen(false)
            toast.show(`You’re on the ${selected.name.toLowerCase()}`)
          }}
        />
      )}

      {comboPlan && (
        <ComboSheet
          open
          onClose={() => setComboFor(null)}
          plan={comboPlan}
          value={comboOf(comboPlan.id, comboPlan.combo)}
          onSave={(items) => {
            actions.setCombo(comboPlan.id, items)
            toast.show('Combo updated')
          }}
        />
      )}
    </>
  )
}
