export const API_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || ''

export const SHOP = {
  name: 'Gabon Mode',
  address: 'PK12 Libreville Gabon',
  phoneDisplay: '076304877',
  whatsapp: '24176304877',
  email: 'contact@gabonmode.com',
  hours: 'Lundi - Samedi, 9h00 - 19h00',
}

export const categories = ['Tous', 'Chaussures', 'Vetements', 'Accessoires']
export const statuses = ['Tous', 'Disponible', 'Stock faible', 'Sur demande']

export const formatPrice = (amount) => new Intl.NumberFormat('fr-FR').format(Number(amount || 0)) + ' FCFA'

export const emptyProduct = {
  name: '',
  category: 'Chaussures',
  price: '',
  sizes: '',
  status: 'Disponible',
  image: '',
  description: '',
  visible: true,
}
