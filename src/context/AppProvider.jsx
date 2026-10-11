import { useState, useEffect, useCallback } from 'react'
import { AppContext } from './AppContext'
import { productsSeed, reservationsSeed } from '../data/seedData'

const API = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || ''

const loadStored = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

const mapApiProduct = (p) => ({
  id: String(p.id),
  name: p.name,
  category: p.category_name || '',
  price: Number(p.price),
  sizes: typeof p.sizes === 'string' ? (p.sizes ? p.sizes.split(',') : []) : (Array.isArray(p.sizes) ? p.sizes : []),
  status: p.stock > 5 ? 'Disponible' : p.stock > 0 ? 'Stock faible' : 'Sur demande',
  image: p.image_url || '',
  description: p.description || '',
  visible: Boolean(p.active),
  stock: p.stock,
})

export default function AppProvider({ children }) {
  const [products, setProducts] = useState(() => loadStored('gm-products', productsSeed))
  const [reservations, setReservations] = useState(() => loadStored('gm-reservations', reservationsSeed))
  const [cart, setCart] = useState(() => loadStored('gm-cart', []))
  const [customer, setCustomer] = useState(() => loadStored('gm-customer', { name: '', phone: '' }))

  useEffect(() => {
    localStorage.setItem('gm-cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem('gm-customer', JSON.stringify(customer))
  }, [customer])

  useEffect(() => {
    localStorage.setItem('gm-reservations', JSON.stringify(reservations))
  }, [reservations])

  useEffect(() => {
    if (!API) return
    fetch(`${API}/api/products`)
      .then((r) => r.json())
      .then((data) => {
        if (data.products?.length) {
          const mapped = data.products.map(mapApiProduct)
          setProducts(mapped)
          localStorage.setItem('gm-products', JSON.stringify(mapped))
        }
      })
      .catch(() => {})
  }, [])

  const addToCart = useCallback((product) => {
    setCart((prev) => (prev.some((item) => item.id === product.id) ? prev : [...prev, product]))
  }, [])

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const confirmReservation = useCallback(async () => {
    if (!cart.length) return null
    const localId = `GM-${Date.now().toString().slice(-6)}`
    const total = cart.reduce((sum, item) => sum + item.price, 0)

    const reservation = {
      id: localId,
      client: customer.name || 'Client sans nom',
      total,
      items: cart.length,
      status: 'En attente',
      date: new Date().toISOString().slice(0, 10),
    }
    setReservations((prev) => [reservation, ...prev])

    if (API) {
      try {
        const body = {
          customer_name: customer.name,
          customer_phone: customer.phone,
          notes: '',
          items: cart.map((item) => ({
            product_id: parseInt(item.id) || 0,
            name: item.name,
            price: item.price,
            quantity: 1,
            size: item.selectedSize || null,
          })),
        }
        const res = await fetch(`${API}/api/orders/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        const data = await res.json()
        if (data.success) {
          reservation.id = data.reference
          reservation.serverId = data.order_id
        }
      } catch (e) {}
    }

    return { id: reservation.id, total }
  }, [cart, customer])

  const value = {
    products, setProducts,
    reservations, setReservations,
    cart, setCart,
    customer, setCustomer,
    addToCart, removeFromCart, confirmReservation,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
