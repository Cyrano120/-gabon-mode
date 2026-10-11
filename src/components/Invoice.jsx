import { useState } from 'react'
import { SHOP, formatPrice } from '../data/constants'
import { useAppContext } from '../context/useAppContext'
import QrCard from './QrCard'

export default function Invoice() {
  const { cart, customer } = useAppContext()
  const [reservationId] = useState(() => `GM-${Date.now().toString().slice(-6)}`)
  const total = cart.reduce((sum, item) => sum + item.price, 0)
  const qrPayload = `${reservationId}|${SHOP.address}|${cart.map((item) => item.id).join(',')}`

  return (
    <div className="invoice" id="invoice">
      <div className="invoice-head">
        <div>
          <img src="/images/gm-logo-clean.jpeg" alt="Logo Gabon Mode" className="logo-img" />
          <p>{SHOP.address} &middot; {SHOP.phoneDisplay}</p>
        </div>
        <strong>Pro-forma</strong>
      </div>
      <div className="invoice-meta"><span>Reservation</span><strong>{reservationId}</strong></div>
      {cart.map((item) => (
        <div className="invoice-row" key={item.id}>
          <span>{item.name}</span>
          <strong>{formatPrice(item.price)}</strong>
        </div>
      ))}
      <div className="invoice-total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
      <QrCard value={qrPayload} />
      <button className="secondary full" type="button" onClick={() => window.print()}>Telecharger / imprimer PDF</button>
    </div>
  )
}
