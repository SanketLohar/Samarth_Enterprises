import { useState } from 'react'

/**
 * ProductImage — renders the real product photo with a multi-stage fallback chain.
 * Fallback order: primary imagePath → extension swap → logo.png
 * Shows a branded shimmer skeleton while loading.
 */
export default function ProductImage({ product, className = '', alt }) {
  const cleanImagePath = product?.image ? decodeURIComponent(product.image) : '/images/company_logo.png';

  // Build the fallback chain defensively to handle irregular physical disk layouts
  let initialFallbacks = [cleanImagePath];
  
  if (product?.image && product.image.includes('scalefree')) {
    const filename = product.image.split('/').pop();
    const baseName = filename.replace('.jpg', '');
    
    // Target known irregular spaces dynamically based on the disk layout discrepancies
    if (baseName === 'org-scalefree-tank') initialFallbacks.push('/images/org-scalefree-tan k.jpg');
    if (baseName === 'org-scalefree-appliances') initialFallbacks.push('/images/org-scalefree-ap liances.jpg');
    if (baseName === 'org-scalefree-antiscalant-bag') initialFallbacks.push('/images/org-scalefree-ant iscalant-bag.jpg');
  }
  
  initialFallbacks.push('/images/company_logo.png');

  const fallbacks = product?.imageFallbacks || initialFallbacks;

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
