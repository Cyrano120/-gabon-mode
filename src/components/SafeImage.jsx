import { useState } from 'react'

export default function SafeImage({ src, alt, className }) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  return (
    <div className={`img-wrap ${loaded ? 'loaded' : ''} ${className || ''}`}>
      {!loaded && !errored && <div className="img-skeleton" />}
      <img
        src={errored ? '/images/product-clothes.svg' : src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        style={{ opacity: loaded || errored ? 1 : 0 }}
      />
    </div>
  )
}
