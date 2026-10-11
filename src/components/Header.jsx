import { useLocation, useNavigate } from 'react-router-dom'
import { SHOP } from '../data/constants'
import { useAppContext } from '../context/useAppContext'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { cart } = useAppContext()

  const isActive = (path) => location.pathname === path ? 'active' : ''

  return (
    <header className="topbar">
      <button className="brand" type="button" onClick={() => navigate('/')} aria-label="Accueil Gabon Mode">
        <img src="/images/gm-logo-clean.jpeg" alt="" className="logo-img" />
        <span>{SHOP.name}</span>
      </button>
      <nav className="navlinks">
        <button className={isActive('/')} type="button" onClick={() => navigate('/')}>Accueil</button>
        <button className={isActive('/catalogue')} type="button" onClick={() => navigate('/catalogue')}>Catalogue</button>
        <button className={isActive('/reservation')} type="button" onClick={() => navigate('/reservation')}>
          Reservation {cart.length ? `(${cart.length})` : ''}
        </button>
      </nav>
    </header>
  )
}
