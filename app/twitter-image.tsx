// CHANGE: 2026-10-12 — Twitter/X card image. Re-exports the Open Graph image so the two
// cannot drift; Next picks this up as twitter:image for summary_large_image cards.
export { default, alt, size, contentType } from './opengraph-image'
