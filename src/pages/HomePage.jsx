import { useNavigate, useSearchParams } from 'react-router-dom'
import { SHOP } from '../data/constants'
import { useAppContext } from '../context/useAppContext'
import SafeImage from '../components/SafeImage'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'

export default function HomePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { products, addToCart } = useAppContext()
  const featuredProducts = products.filter((p) => p.visible).slice(0, 5)

  return (
    <>
      <section className="hero-page page-home">
        <div className="hero-copy">
          <p className="eyebrow">{SHOP.address}</p>
          <h1>{SHOP.name}</h1>
          <p>
            Boutique mode au PK12. Selectionnez vos articles, reservez-les en ligne, puis passez en boutique avec votre
            reference de reservation.
          </p>
          <div className="hero-actions">
            <button className="primary" type="button" onClick={() => navigate('/catalogue')}>Voir le catalogue</button>
            <a className="secondary" href={`https://wa.me/${SHOP.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
          <div className="hero-proof">
            <span>Reservation rapide</span>
            <span>Retrait au PK12</span>
            <span>Confirmation WhatsApp</span>
          </div>
        </div>
        <div className="brand-showcase">
          <img src="/images/gm-logo-clean.jpeg" alt="Logo Gabon Mode" className="logo-img" />
          <div className="brand-note">
            <strong>Retrait au PK12</strong>
            <span>Reservation rapide, confirmation WhatsApp, facture pro-forma.</span>
          </div>
        </div>
      </section>

      <section className="store-section">
        <div className="section-heading">
          <p className="eyebrow">Selection boutique</p>
          <h2>Articles mis en avant</h2>
          <button className="section-cta" type="button" onClick={() => navigate('/catalogue')}>Tout voir</button>
        </div>
        <div className="product-grid compact">
          {featuredProducts.map((product) => {
            const selectProduct = () => {
              const params = new URLSearchParams(searchParams)
              params.set('product', product.id)
              navigate(`/catalogue?${params.toString()}`)
            }
            return <ProductCard key={product.id} product={product} onSelect={selectProduct} onReserve={addToCart} />
          })}
        </div>
      </section>

      <section className="info-strip">
        <div className="info-card">
          <span className="info-icon">&#9758;</span>
          <h3>Sélection &amp; Réservation</h3>
          <p>Parcourez notre catalogue, choisissez vos pièces préférées et réservez-les en ligne. Votre facture pro-forma est générée instantanément.</p>
        </div>
        <div className="info-card">
          <span className="info-icon">&#9993;</span>
          <h3>Confirmation sur WhatsApp</h3>
          <p>Un récapitulatif détaillé de votre commande est automatiquement préparé. Envoyez-le directement au gérant pour valider votre réservation.</p>
        </div>
        <div className="info-card">
          <span className="info-icon">&#9733;</span>
          <h3>Essayage &amp; Retrait</h3>
          <p>Passez à la boutique au PK12 avec votre code de réservation. Essayez les articles, confirmez votre choix et repartez avec votre tenue.</p>
        </div>
      </section>

      <section className="editorial-section">
        <div className="editorial-image">
          <SafeImage src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85" alt="Selection Gabon Mode" />
        </div>
        <div className="editorial-copy">
          <p className="eyebrow">Style Gabon Mode</p>
          <h2>Une silhouette pensee pour Libreville.</h2>
          <p>
            Des pieces habillees, urbaines et faciles a reserver avant de passer au PK12. L'idee est simple :
            voir, choisir, confirmer sur WhatsApp, puis venir essayer en boutique.
          </p>
          <button className="primary" type="button" onClick={() => navigate('/catalogue')}>Explorer les pieces</button>
        </div>
      </section>

      <section className="lookbook">
        <div>
          <SafeImage src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=85" alt="Look sortie Gabon Mode" />
          <span>Sortie</span>
        </div>
        <div>
          <SafeImage src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85" alt="Look ceremonie Gabon Mode" />
          <span>Ceremonie</span>
        </div>
        <div>
          <SafeImage src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85" alt="Accessoires Gabon Mode" />
          <span>Accessoires</span>
        </div>
      </section>

      <section className="collection-strip">
        <div>
          <p className="eyebrow">Selections PK12</p>
          <h2>Des looks pour sortir, travailler et marquer sa presence.</h2>
          <button className="section-cta light" type="button" onClick={() => navigate('/catalogue')}>Reserver une piece</button>
        </div>
        <div className="collection-cards">
          <article>
            <SafeImage src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85" alt="Tenue de sortie Gabon Mode" />
            <span>Tenues de sortie</span>
          </article>
          <article>
            <SafeImage src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=85" alt="Selection elegante Gabon Mode" />
            <span>Pieces habillees</span>
          </article>
          <article>
            <SafeImage src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=85" alt="Mode urbaine Gabon Mode" />
            <span>Mode urbaine</span>
          </article>
          <article>
            <SafeImage src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85" alt="Look boutique Gabon Mode" />
            <span>Coordonnes boutique</span>
          </article>
        </div>
      </section>

      <section className="store-info">
        <div>
          <span>Adresse</span>
          <strong>{SHOP.address}</strong>
        </div>
        <div>
          <span>Contact</span>
          <strong>{SHOP.phoneDisplay}</strong>
          <a className="secondary" href={`https://wa.me/${SHOP.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
        <div>
          <span>Horaires</span>
          <strong>{SHOP.hours}</strong>
        </div>
      </section>

      <ProductModal />
    </>
  )
}
