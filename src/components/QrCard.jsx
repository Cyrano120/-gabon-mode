import { QRCodeCanvas } from 'qrcode.react'

export default function QrCard({ value }) {
  if (!value) return null
  return (
    <div className="qr-card">
      <QRCodeCanvas value={value} size={140} bgColor="#ffffff" fgColor="#111111" level="M" />
      <small>{value}</small>
    </div>
  )
}

