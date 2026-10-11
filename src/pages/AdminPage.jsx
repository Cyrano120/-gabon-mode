import { useState } from 'react'
import { useAppContext } from '../context/useAppContext'
import { API_URL, emptyProduct, formatPrice } from '../data/constants'

function AdminLogin({ onLogin, loginError }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  return (
    <section className="login-page page-shell">
      <div className="login-card">
        <img src="/images/gm-logo-clean.jpeg" alt="Logo Gabon Mode" className="logo-img" />
        <p className="eyebrow">Acces securise</p>
        <h2>Espace gestionnaire</h2>
        <p className="muted">Connectez-vous pour gerer le stock, l'affichage des articles et les reservations.</p>
        <form onSubmit={(e) => { e.preventDefault(); onLogin(credentials) }}>
          <input
            placeholder="Identifiant"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          />
          <input
            placeholder="Mot de passe"
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
          {loginError && <span className="login-error">{loginError}</span>}
          <button className="primary full" type="submit">Se connecter</button>
        </form>
      </div>
    </section>
  )
}

export default function AdminPage() {
  const { products, setProducts, reservations, setReservations } = useAppContext()
  const [form, setForm] = useState(emptyProduct)
  const [editingId, setEditingId] = useState(null)
  const [scanValue, setScanValue] = useState('')
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    () => sessionStorage.getItem('gm-admin-auth') === 'yes',
  )
  const [loginError, setLoginError] = useState('')

  const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'gerant'
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'GM-PK12'

  const loginAdmin = ({ username, password }) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem('gm-admin-auth', 'yes')
      setIsAdminAuthenticated(true)
      setLoginError('')
      return
    }
    setLoginError('Identifiants incorrects.')
  }

  const logoutAdmin = () => {
    sessionStorage.removeItem('gm-admin-auth')
    setIsAdminAuthenticated(false)
  }

  const handleImage = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm((current) => ({ ...current, image: reader.result }))
    reader.readAsDataURL(file)
  }

  const resetForm = () => {
    setForm(emptyProduct)
    setEditingId(null)
  }

  const saveProduct = (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      id: editingId || `GM-NEW-${Date.now().toString().slice(-5)}`,
      price: Number(form.price || 0),
      sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      image: form.image || '/images/product-clothes.svg',
      visible: Boolean(form.visible),
    }

    if (editingId) {
      setProducts(products.map((p) => (p.id === editingId ? payload : p)))
    } else {
      setProducts([payload, ...products])
    }
    resetForm()
  }

  const editProduct = (product) => {
    setEditingId(product.id)
    setForm({ ...product, price: String(product.price), sizes: product.sizes.join(', ') })
  }

  const deleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const toggleProductVisibility = (id) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, visible: !p.visible } : p)))
  }

  const validateScan = () => {
    setReservations(reservations.map((r) => (
      scanValue.includes(r.id) || scanValue === r.id ? { ...r, status: 'Validee' } : r
    )))
  }

  if (!isAdminAuthenticated) {
    return <AdminLogin onLogin={loginAdmin} loginError={loginError} />
  }

  return (
    <section className="admin page-shell page-admin">
      <div className="section-heading admin-heading">
        <div>
          <p className="eyebrow">Espace gestionnaire</p>
          <h2>Stock et reservations</h2>
        </div>
        <button className="secondary logout-btn" type="button" onClick={logoutAdmin}>Se deconnecter</button>
      </div>
      <div className="admin-layout">
        <form className="admin-card product-form" onSubmit={saveProduct}>
          <h3>{editingId ? 'Modifier le produit' : 'Ajouter un produit'}</h3>
          <input
            required placeholder="Nom article"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option>Chaussures</option><option>Vetements</option><option>Accessoires</option>
          </select>
          <input
            required type="number" placeholder="Prix FCFA"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            required placeholder="Tailles: 40, 41, M, L..."
            value={form.sizes}
            onChange={(e) => setForm({ ...form, sizes: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option>Disponible</option><option>Stock faible</option><option>Sur demande</option>
          </select>
          <label className="checkbox">
            <input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} />
            Afficher dans le catalogue
          </label>
          <label className="file-input">
            Image du produit
            <input type="file" accept="image/*" onChange={handleImage} />
          </label>
          {form.image && <img className="image-preview" src={form.image} alt="Apercu produit" />}
          <button className="primary full" type="submit">
            {editingId ? 'Enregistrer les modifications' : 'Ajouter au stock'}
          </button>
          {editingId && (
            <button className="secondary full" type="button" onClick={resetForm}>Annuler</button>
          )}
        </form>

        <a href={`${API_URL}/admin/index.html`} target="_blank" rel="noreferrer" style={{display:'block',background:'#1a1a2e',color:'#c9a84c',padding:'12px 16px',borderRadius:8,textDecoration:'none',fontWeight:600,marginBottom:16,textAlign:'center'}}>
          ⚡ Accéder au Panel Admin Complet (stats, stocks, commandes, WhatsApp)
        </a>

        <div className="admin-card stock-list">
          <h3>Catalogue gestionnaire ({products.length} articles)</h3>
          {products.map((product) => (
            <div className="stock-row" key={product.id}>
              <img src={product.image} alt="" />
              <div>
                <strong>{product.name}</strong>
                <span>{product.category} &middot; {formatPrice(product.price)} &middot; {product.visible ? 'Affiche' : 'Masque'}</span>
              </div>
              <button type="button" onClick={() => editProduct(product)}>Modifier</button>
              <button type="button" onClick={() => toggleProductVisibility(product.id)}>
                {product.visible ? 'Masquer' : 'Afficher'}
              </button>
              <button className="danger" type="button" onClick={() => deleteProduct(product.id)}>Supprimer</button>
            </div>
          ))}
        </div>

        <div className="admin-card">
          <h3>Reservations ({reservations.length})</h3>
          {reservations.map((r) => (
            <div className="reservation-row" key={r.id}>
              <div>
                <strong>{r.id}</strong>
                <span>{r.client} &middot; {r.items} article(s) &middot; {formatPrice(r.total)}</span>
              </div>
              <span className={`status ${r.status.toLowerCase().replace(' ', '-')}`}>{r.status}</span>
            </div>
          ))}
          <div className="scanner-box">
            <h3>Validation QR</h3>
            <input
              placeholder="Coller la reference ou le QR"
              value={scanValue}
              onChange={(e) => setScanValue(e.target.value)}
            />
            <button className="secondary full" type="button" onClick={validateScan}>
              Valider le passage PK12
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
