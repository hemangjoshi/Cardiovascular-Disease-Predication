import { NavLink } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  return (
    <header className={styles.nav}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.logo}>
          <HeartIcon />
          CardioPredict
        </NavLink>

        <nav className={styles.links}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            About
          </NavLink>
          <NavLink
            to="/predict"
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            Predict
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

function HeartIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 21s-8.5-5.3-8.5-11a5 5 0 0 1 8.5-3.4A5 5 0 0 1 20.5 10c0 5.7-8.5 11-8.5 11Z" />
    </svg>
  )
}
