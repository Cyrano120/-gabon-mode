import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/useAppContext'
import SafeImage from './SafeImage'
import { formatPrice, SHOP } from '../data/constants'

export default function ProductModal() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { products, addToCart } = useAppContext()
  const productId = searchParams.get('product')
  const product = products.find((p) => p.id === productId)

  if (!product) return null

  const close = () => {
    const params = new URLSearchParams(searchParams)
    params.delete('product')
    setSearchParams(params, { replace: true })
  }

  const handleReserve = () => {
    addToCart(product)
    navigate('/reservation')
  }

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" type="button" onClick={close}>&times;</button>
        <div className="modal-layout">
          <SafeImage src={product.image} alt={product.name} />
          <div className="modal-info">
            <span className="pill">{product.status}</span>
            <h2>{product.name}</h2>
            <p className="modal-price">{formatPrice(product.price)}</p>
            <p className="modal-desc">{product.description}</p>
            <dl>
              <div><dt>Reference</dt><dd>{product.id}</dd></div>
              <div><dt>Categorie</dt><dd>{product.category}</dd></div>
              <div><dt>Tailles disponibles</dt><dd>{product.sizes.join(', ')}</dd></div>
            </dl>
            <p className="modal-contact">
              Retrait a {SHOP.address} &middot; {SHOP.hours}
            </p>
            <button className="primary full" type="button" onClick={handleReserve}>Reserver cet article</button>
          </div>
        </div>
      </div>
    </div>
  )
}
