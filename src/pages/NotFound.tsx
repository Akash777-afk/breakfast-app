import { Link } from 'react-router-dom'
import { TopBar } from '../components/layout/TopBar'
import { SearchIcon } from '../components/icons'
import { EmptyState } from '../components/ui/EmptyState'
import styles from './NotFound.module.css'

export function NotFound({ title = 'Page not found', text = 'The page you’re looking for doesn’t exist or has moved.' }: { title?: string; text?: string }) {
  return (
    <>
      <TopBar title="Oops" />
      <EmptyState
        icon={<SearchIcon />}
        title={title}
        text={text}
        action={
          <Link to="/" className={styles.home}>
            Back to home
          </Link>
        }
      />
    </>
  )
}
