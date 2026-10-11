import { useMemo, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/useAppContext'
import { categories, statuses, formatPrice } from '../data/constants'
import ProductCard from '../components/ProductCard'
import SafeImage from '../components/SafeImage'

export default function CataloguePage() {
  const { products, addToCart } = useAppContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [filters, setFilters] = useState({ category: 'Tous', status: 'Tous', size: 'Tous' })

  const publicProducts = products.filter((p) => p.visible)
  const sizeOptions = useMemo(
    () => ['Tous', ...new Set(publicProducts.flatMap((p) => p.sizes))],
    [publicProducts],
  )

  const filteredProducts = publicProducts.filter((product) => {
    const categoryMatch = filters.category === 'Tous' || product.category === filters.category
    const statusMatch = filters.status === 'Tous' || product.status === filters.status
    const sizeMatch = filters.size === 'Tous' || product.sizes.includes(filters.size)
    return categoryMatch && statusMatch && sizeMatch
  })

  const selectedId = searchParams.get('product')
  const selectedProduct = publicProducts.find((p) => p.id === selectedId) || filteredProducts[0]

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }))

  const selectProduct = (product) => {
    const params = new URLSearchParams(searchParams)
    params.set('product', product.id)
    setSearchParams(params, { replace: true })
  }

  return (
    <section className="page-shell page-catalogue">
      <div className="section-heading">
        <p className="eyebrow">Catalogue public</p>
        <h2>Choisir un article</h2>
        <p className="page-intro">
          Filtrez la selection, ouvrez une fiche, puis reservez.
        </p>
      </div>
      <div className="filters">
        <label>Categorie
          <select value={filters.category} onChange={(e) => updateFilter('category', e.target.value)}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>Taille
          <select value={filters.size} onChange={(e) => updateFilter('size', e.target.value)}>
            {sizeOptions.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>Disponibilite
          <select value={filters.status} onChange={(e) => updateFilter('status', e.target.value)}>
            {statuses.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>

      {selectedProduct && (
        <div className="product-hero">
          <div className="product-hero-image">
            <SafeImage src={selectedProduct.image} alt={selectedProduct.name} />
          </div>
          <div className="product-hero-info">
            <span className="pill">{selectedProduct.status}</span>
            <h2>{selectedProduct.name}</h2>
            <p className="hero-price">{formatPrice(selectedProduct.price)}</p>
            <p>{selectedProduct.description}</p>
            <dl>
              <div><dt>Tailles</dt><dd>{selectedProduct.sizes.join(', ')}</dd></div>
              <div><dt>Reference</dt><dd>{selectedProduct.id}</dd></div>
            </dl>
            <button className="primary full" type="button" onClick={() => {
              addToCart(selectedProduct)
              navigate('/reservation')
            }}>
              Reserver cet article
            </button>
          </div>
        </div>
      )}

      <div className="section-heading" style={{ marginTop: 48 }}>
        <p className="eyebrow">Tous les articles</p>
        <h3>Catalogue ({filteredProducts.length})</h3>
      </div>
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={() => selectProduct(product)}
            onReserve={addToCart}
          />
        ))}
      </div>
    </section>
  )
}
