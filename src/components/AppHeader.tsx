import { BrandLogo } from './BrandLogo'
import styles from './AppHeader.module.css'

interface AppHeaderProps {
  title: string
  subtitle: string
  initial: string
  onProfile: () => void
}

export function AppHeader({ title, subtitle, initial, onProfile }: AppHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <BrandLogo className={styles.logo} />
        <div className={styles.brandText}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
      </div>

      <button type="button" className={styles.avatar} onClick={onProfile} aria-label="Open profile" aria-haspopup="dialog">
        {initial}
      </button>
    </header>
  )
}
