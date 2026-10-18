import { useLocation, useNavigate } from 'react-router-dom'
import { BackIcon, MenuIcon } from '../icons'
import { useShell } from './ShellContext'
import styles from './TopBar.module.css'

interface TopBarProps {
  title: string
  /** Where "back" goes when there is no history to return to (e.g. the page was opened directly). */
  backFallback?: string
}

export function TopBar({ title, backFallback = '/' }: TopBarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { openMenu } = useShell()

  const goBack = () => {
    if (location.key !== 'default') navigate(-1)
    else navigate(backFallback, { replace: true })
  }

  return (
    <header className={styles.wrap}>
      <div className={styles.bar}>
        <button type="button" className={styles.circle} onClick={goBack} aria-label="Go back">
          <BackIcon className={styles.icon} />
        </button>
        <h1 className={styles.title}>{title}</h1>
        <button type="button" className={styles.circle} onClick={openMenu} aria-label="Open menu" aria-haspopup="dialog">
          <MenuIcon className={styles.icon} />
        </button>
      </div>
    </header>
  )
}
