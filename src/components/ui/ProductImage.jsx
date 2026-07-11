import { useState } from 'react'

/**
 * ProductImage — renders the real product photo with a multi-stage fallback chain.
 * Fallback order: primary imagePath → extension swap → logo.png
 * Shows a branded shimmer skeleton while loading.
 */
export default function ProductImage({ product, className = '', alt }) {
  const fallbacks = product?.imageFallbacks || [
    product?.imagePath || `/images/${product?.category}/${product?.image}`,
    '/images/company_logo.png',
  ]

  const [idx, setIdx] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const handleError = () => {
    if (idx < fallbacks.length - 1) {
      setIdx(idx + 1)
    }
  }

  return (
    <span className="relative block w-full h-full">
      {/* Shimmer skeleton shown until image loads */}
      {!loaded && (
        <span
          className="absolute inset-0 animate-shimmer rounded-lg"
          aria-hidden="true"
        />
      )}
      <img
        key={fallbacks[idx]}
        src={fallbacks[idx]}
        alt={alt || product?.name || 'Product'}
        className={className}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={handleError}
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
      />
    </span>
  )
}
