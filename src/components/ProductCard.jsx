import SafeImage from './SafeImage'
import { formatPrice } from '../data/constants'

export default function ProductCard({ product, onSelect, onReserve }) {
  return (
    <article className="product-card">
      <button type="button" onClick={onSelect || (() => {})}>
        <SafeImage src={product.image} alt={product.name} />
        <span className="pill">{product.status}</span>
        <h3>{product.name}</h3>
        <p>{product.category} &middot; {product.sizes.join(' / ')}</p>
        <strong className="price">{formatPrice(product.price)}</strong>
      </button>
      <button className="reserve-mini" type="button" onClick={() => onReserve(product)}>Reserver</button>
    </article>
  )
}
