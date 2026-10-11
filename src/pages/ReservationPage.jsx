import { useAppContext } from '../context/useAppContext'
import { SHOP, formatPrice } from '../data/constants'
import SafeImage from '../components/SafeImage'
import Invoice from '../components/Invoice'

export default function ReservationPage() {
  const { cart, customer, setCustomer, removeFromCart, confirmReservation } = useAppContext()
  const total = cart.reduce((sum, item) => sum + item.price, 0)
  const reservationId = cart.length ? `GM-${Date.now().toString().slice(-6)}` : ''

  const whatsappUrl = () => {
    const message = [
      `Bonjour ${SHOP.name}, je souhaite reserver la commande ${reservationId}.`,
      `Nom: ${customer.name || 'A completer'}`,
      `Telephone: ${customer.phone || 'A completer'}`,
      `Articles: ${cart.map((item) => item.name).join(', ') || 'Aucun article'}`,
      `Total estime: ${formatPrice(total)}`,
      `Retrait: ${SHOP.address}.`,
    ].join('\n')
    return `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(message)}`
  }

  return (
    <section className="reservation page-shell page-reservation">
      <div className="section-heading">
        <p className="eyebrow">Reservation</p>
        <h2>Facture pro-forma et retrait boutique</h2>
        <p className="page-intro">Votre reservation sert a bloquer les articles avant votre passage au PK12.</p>
      </div>
      <div className="reservation-layout">
        <div className="cart-panel">
          <h3>Articles selectionnes</h3>
          {cart.length === 0 ? (
            <p className="muted">Le panier est vide. Ajoutez des articles depuis le catalogue.</p>
          ) : (
            cart.map((item) => (
              <div className="cart-row" key={item.id}>
                <SafeImage src={item.image} alt="" />
                <div>
                  <strong>{item.name}</strong>
                  <span>{formatPrice(item.price)}</span>
                </div>
                <button type="button" onClick={() => removeFromCart(item.id)}>Retirer</button>
              </div>
            ))
          )}
          {cart.length > 0 && (
            <>
              <div className="customer-form">
                <input
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  placeholder="Nom du client"
                />
                <input
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  placeholder="Telephone"
                />
              </div>
              <button className="primary full" type="button" onClick={confirmReservation}>Confirmer la reservation</button>
              <a className="whatsapp" href={whatsappUrl()} target="_blank" rel="noreferrer">Envoyer sur WhatsApp</a>
            </>
          )}
        </div>
        {cart.length > 0 && (
          <div className="invoice-wrap">
            <Invoice />
          </div>
        )}
      </div>
    </section>
  )
}
