import { ChevronRightIcon } from './icons'
import styles from './HeroBanner.module.css'

interface HeroBannerProps {
  topRightImage: string
  bottomLeftImage: string
  onExplore?: () => void
}

export function HeroBanner({ topRightImage, bottomLeftImage, onExplore }: HeroBannerProps) {
  return (
    <section className={styles.hero} aria-label="Healthy breakfast subscriptions">
      <img className={styles.foodTopRight} src={topRightImage} alt="" />
      <img className={styles.foodBottomLeft} src={bottomLeftImage} alt="" />

      <div className={styles.copy}>
        <span className={styles.kicker}>Healthy breakfast</span>
        <h2 className={styles.title}>subscriptions</h2>
        <button type="button" className={styles.cta} onClick={onExplore}>
          Explore now
          <ChevronRightIcon className={styles.ctaIcon} />
        </button>
      </div>
    </section>
  )
}
