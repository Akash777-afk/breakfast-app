import { useEffect, useMemo, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../../state/AppState'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { useToast } from '../ui/Toast'
import { BottomNav } from './BottomNav'
import { CartBar } from './CartBar'
import { MenuSheet } from './MenuSheet'
import { ProfileSheet } from './ProfileSheet'
import { ShellContext } from './ShellContext'
import styles from './AppShell.module.css'

const TAB_ROUTES = new Set(['/', '/health', '/favorites'])

const TITLES: [prefix: string, title: string][] = [
  ['/health/insights', "Dietician's insight"],
  ['/health/recommendations', 'Recommendations'],
  ['/health', 'Health Tracker'],
  ['/favorites', 'Favorites'],
  ['/dish/', 'Customize your order'],
  ['/checkout', 'Checking out'],
  ['/plans', 'Subscription plans'],
  ['/orders', 'My orders'],
  ['/order/', 'Order status'],
]

function titleFor(pathname: string): string {
  const match = TITLES.find(([prefix]) => pathname === prefix || pathname.startsWith(prefix.endsWith('/') ? prefix : `${prefix}/`))
  return match ? `${match[1]} · BreakFit` : 'BreakFit · India’s first breakfast app'
}

export function AppShell() {
  const { pathname } = useLocation()
  const { actions } = useApp()
  const toast = useToast()
  const mainRef = useRef<HTMLElement>(null)
  const firstRender = useRef(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)

  // New page: scroll to the top, move focus into the content, and update the tab title.
  useEffect(() => {
    document.title = titleFor(pathname)
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    window.scrollTo(0, 0)
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname])

  const shell = useMemo(
    () => ({
      openMenu: () => setMenuOpen(true),
      openProfile: () => setProfileOpen(true),
      requestReset: () => setResetOpen(true),
    }),
    [],
  )

  const showDock = TAB_ROUTES.has(pathname)

  return (
    <ShellContext.Provider value={shell}>
      <div className={styles.frame}>
        <main ref={mainRef} className={styles.main} tabIndex={-1}>
          <div key={pathname} className={styles.page}>
            <Outlet />
          </div>
        </main>
        {showDock && (
          <footer className={styles.dock}>
            <CartBar />
            <BottomNav />
          </footer>
        )}
      </div>

      <MenuSheet
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onProfile={() => {
          setMenuOpen(false)
          setProfileOpen(true)
        }}
        onReset={() => {
          setMenuOpen(false)
          setResetOpen(true)
        }}
      />
      <ProfileSheet
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        onReset={() => {
          setProfileOpen(false)
          setResetOpen(true)
        }}
      />
      <ConfirmDialog
        open={resetOpen}
        title="Reset demo data?"
        text="This clears your order, favorites, addresses, plan and order history on this device and starts fresh."
        confirmLabel="Reset"
        danger
        onCancel={() => setResetOpen(false)}
        onConfirm={() => {
          actions.resetAll()
          setResetOpen(false)
          toast.show('Demo data reset')
        }}
      />
    </ShellContext.Provider>
  )
}
