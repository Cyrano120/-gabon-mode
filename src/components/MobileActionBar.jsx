import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/useAppContext'

export default function MobileActionBar() {
  const navigate = useNavigate()
  const { cart } = useAppContext()

  return (
    <nav className="mobile-action-bar" aria-label="Actions rapides">
      <button type="button" onClick={() => navigate('/')}>Accueil</button>
      <button type="button" onClick={() => navigate('/catalogue')}>Catalogue</button>
      <button className="highlight" type="button" onClick={() => navigate('/reservation')}>
        Reserver {cart.length ? `(${cart.length})` : ''}
      </button>
    </nav>
  )
}
