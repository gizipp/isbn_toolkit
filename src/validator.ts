/**
 * ISBN checksum validation.
 */

/**
 * Validate ISBN-13 checksum (mod 10).
 */
export function isValidISBN13(digits: string): boolean {
  if (!/^\d{13}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 13; i++) {
    const weight = i % 2 === 0 ? 1 : 3;
    sum += parseInt(digits[i], 10) * weight;
  }

  return sum % 10 === 0;
}

/**
 * Validate ISBN-10 checksum (mod 11).
 */
export function isValidISBN10(digits: string): boolean {
  if (!/^\d{9}[\dX]$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 10; i++) {
    const value = digits[i] === "X" ? 10 : parseInt(digits[i], 10);
    sum += value * (10 - i);
  }

  return sum % 11 === 0;
}

/**
 * Auto-detect format and validate.
 */
export function isValidISBN(isbn: string): boolean {
  const digits = sanitize(isbn);

  if (digits.length === 13) return isValidISBN13(digits);
  if (digits.length === 10) return isValidISBN10(digits);

  return false;
}

function sanitize(isbn: string): string {
  return isbn.replace(/[^0-9Xx]/g, "").toUpperCase();
}
