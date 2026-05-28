/**
 * Format a price string to a localized currency string.
 * Usage: formatPrice('12.50') → '12.50 TMT'
 */
export function formatPrice(price: string | number): string {
  const num = typeof price === 'string' ? parseFloat(price) : price
  return num.toLocaleString() + ' TMT'
}

/**
 * Validate a Turkmen phone number.
 * Accepts: +99361..., +99362..., +99363..., +99364..., +99365..., +99371...
 */
export function isValidPhone(phone: string): boolean {
  return /^\+993\s?[0-9]{2}\s?[0-9]{2}\s?[0-9]{2}\s?[0-9]{2}$/.test(phone.trim())
}
