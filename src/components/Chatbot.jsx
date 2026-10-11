import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SHOP } from '../data/constants'
import { useAppContext } from '../context/useAppContext'

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Bonjour, je peux vous aider a trouver un article, reserver ou contacter Gabon Mode.' },
  ])
  const navigate = useNavigate()
  const { cart } = useAppContext()

  const quickReply = (intent) => {
    const replies = {
      catalogue: 'Je vous ouvre le catalogue. Vous pouvez filtrer par categorie, taille et disponibilite.',
      reservation: cart.length
        ? `Vous avez ${cart.length} article(s) dans la reservation. Completez votre nom et envoyez sur WhatsApp.`
        : 'Ajoutez d abord un article depuis le catalogue, puis la facture pro-forma sera generee.',
      location: `La boutique est situee a ${SHOP.address}. Contact WhatsApp: ${SHOP.phoneDisplay}.`,
    }
    setMessages([...messages, { from: 'user', text: intent }, { from: 'bot', text: replies[intent] }])
    if (intent === 'catalogue') navigate('/catalogue')
    if (intent === 'reservation') navigate('/reservation')
  }

  return (
    <div className={`chatbot ${open ? 'open' : ''}`}>
      {open && (
        <div className="chat-window">
          <div className="chat-head">
            <strong>Assistant GM</strong>
            <button type="button" onClick={() => setOpen(false)}>Fermer</button>
          </div>
          <div className="chat-messages">
            {messages.map((message, index) => (
              <p className={message.from} key={`${message.from}-${index}`}>{message.text}</p>
            ))}
          </div>
          <div className="chat-actions">
            <button type="button" onClick={() => quickReply('catalogue')}>Catalogue</button>
            <button type="button" onClick={() => quickReply('reservation')}>Reservation</button>
            <button type="button" onClick={() => quickReply('location')}>Adresse</button>
            <a href={`https://wa.me/${SHOP.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
        </div>
      )}
      <button className="chat-toggle" type="button" onClick={() => setOpen(!open)}>
        {open ? 'GM' : 'Besoin d aide ?'}
      </button>
    </div>
  )
}
