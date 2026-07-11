import { categoryMeta } from './categories'

/**
 * Build the image path. Handles folder names with spaces (like "Ro purifiers",
 * "alkaline water solutions") by NOT encoding them here — the browser handles
 * serving from /public as-is.
 */
export function normalizeProduct(p) {
  // Only use the explicitly provided filename string, no SVG fallbacks
  const imageFile = p.image || 'company_logo.png'

  // Primary path: /images/<category>/<filename>
  const imagePath = imageFile === 'company_logo.png' 
    ? '/images/company_logo.png'
    : `/images/${p.category}/${imageFile}`

  return {
    ...p,
    image: imageFile,
    imagePath,
    // Fallback paths tried in order by ProductImage component
    imageFallbacks: buildFallbacks(p.category, imageFile),
    hidden: p.hidden ?? false,
    tag: p.tag || null,
    featured: p.featured ?? false,
    specifications: p.specifications || [],
  }
}

/**
 * Returns an ordered array of fallback src strings for ProductImage.
 */
function buildFallbacks(category, imageFile) {
  const base = `/images/${category}/${imageFile}`
  // Try swapping extension if the primary fails
  const altExt = imageFile.endsWith('.jpg')
    ? imageFile.replace(/\.jpg$/i, '.png')
    : imageFile.replace(/\.(png|svg)$/i, '.jpg')
  return [
    base,
    `/images/${category}/${altExt}`,
    '/images/company_logo.png',
  ]
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function getCategories(products) {
  const cats = [...new Set(products.map((p) => p.category))]
  return cats.map((id) => ({
    id,
    ...(categoryMeta[id] || { label: id, shortLabel: id, description: '', icon: 'Package' }),
    count: products.filter((p) => p.category === id && !p.hidden).length,
  }))
}

export function getProductById(products, id) {
  return products.find((p) => p.id === id)
}

export function getFeaturedProducts(products, limit = 6) {
  return products.filter((p) => p.featured && !p.hidden).slice(0, limit)
}

export function filterProducts(products, { category, search, includeHidden = false }) {
  return products.filter((p) => {
    if (!includeHidden && p.hidden) return false
    if (category && category !== 'all' && p.category !== category) return false
    if (search) {
      const q = search.toLowerCase()
      const hay = `${p.name} ${p.description} ${p.category}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
}
