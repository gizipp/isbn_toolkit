/**
 * Convert between ISBN-10, ISBN-13, and EAN-13 formats.
 */

/**
 * Calculate ISBN-13 check digit (first 12 digits -> check digit).
 */
export function calculateISBN13Check(prefix: string): string {
  const digits = prefix.replace(/[^0-9]/g, "");
  if (digits.length !== 12) throw new Error("Need 12 digits for ISBN-13 check");

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const weight = i % 2 === 0 ? 1 : 3;
    sum += parseInt(digits[i], 10) * weight;
  }

  return ((10 - (sum % 10)) % 10).toString();
}

/**
 * Calculate ISBN-10 check digit (first 9 digits -> check digit).
 */
export function calculateISBN10Check(base: string): string {
  const digits = base.replace(/[^0-9]/g, "");
  if (digits.length !== 9) throw new Error("Need 9 digits for ISBN-10 check");

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i], 10) * (10 - i);
  }

  const check = (11 - (sum % 11)) % 11;
  return check === 10 ? "X" : check.toString();
}

/**
 * Convert ISBN-10 to ISBN-13.
 */
export function isbn10to13(isbn10: string): string {
  const digits = isbn10.replace(/[^0-9Xx]/g, "").toUpperCase();
  if (digits.length !== 10) throw new Error(`Invalid ISBN-10 length: ${digits.length}`);

  const prefix = `978${digits.slice(0, 9)}`;
  const check = calculateISBN13Check(prefix);
  return `${prefix}${check}`;
}

/**
 * Convert ISBN-13 to ISBN-10 (only works for 978-prefix).
 */
export function isbn13to10(isbn13: string): string {
  const digits = isbn13.replace(/[^0-9]/g, "");
  if (digits.length !== 13) throw new Error(`Invalid ISBN-13 length: ${digits.length}`);
  if (!digits.startsWith("978")) throw new Error("979-prefix ISBNs cannot be converted to ISBN-10");

  const base = digits.slice(3, 12);
  const check = calculateISBN10Check(base);
  return `${base}${check}`;
}

/**
 * Format ISBN-13 with hyphens.
 */
export function formatISBN13(isbn13: string): string {
  const digits = isbn13.replace(/[^0-9]/g, "");
  if (digits.length !== 13) throw new Error("Invalid ISBN-13 length");

  return `${digits.slice(0, 3)}-${digits[3]}-${digits.slice(4, 6)}-${digits.slice(6, 12)}-${digits[12]}`;
}

/**
 * Format ISBN-10 with hyphens.
 */
export function formatISBN10(isbn10: string): string {
  const digits = isbn10.replace(/[^0-9Xx]/g, "").toUpperCase();
  if (digits.length !== 10) throw new Error("Invalid ISBN-10 length");

  return `${digits[0]}-${digits.slice(1, 3)}-${digits.slice(3, 9)}-${digits[9]}`;
}
