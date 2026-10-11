import { useNavigate } from 'react-router-dom'
import { SHOP } from '../data/constants'

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <img src="/images/gm-logo-clean.jpeg" alt="Gabon Mode" className="logo-img" />
        <p>Boutique Gabon Mode &middot; {SHOP.address}</p>
        <span>Vitrine officielle, reservations et retrait boutique.</span>
      </div>
      <div className="footer-block">
        <h3>Contact</h3>
        <strong>{SHOP.phoneDisplay}</strong>
        <a href={`https://wa.me/${SHOP.whatsapp}`} target="_blank" rel="noreferrer">Contacter sur WhatsApp</a>
        <span>{SHOP.email}</span>
      </div>
      <div className="footer-block">
        <h3>Boutique</h3>
        <span>{SHOP.address}</span>
        <span>{SHOP.hours}</span>
        <button type="button" onClick={() => navigate('/catalogue')}>Voir le catalogue</button>
      </div>
      <div className="footer-block">
        <h3>Gestion</h3>
        <span>Stock, reservations, validation QR</span>
        <button type="button" onClick={() => navigate('/admin')}>Espace gestionnaire</button>
      </div>
    </footer>
  )
}
