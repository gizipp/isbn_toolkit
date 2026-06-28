/**
 * Core ISBN object.
 */

import { isValidISBN13, isValidISBN10 } from "./validator.js";
import { isbn10to13, isbn13to10, formatISBN13, formatISBN10 } from "./converter.js";

export class ISBN {
  readonly raw: string;
  readonly digits: string;

  constructor(isbn: string) {
    if (isbn === null || isbn === undefined) {
      throw new Error("ISBN cannot be null");
    }
    const trimmed = isbn.toString().trim();
    if (trimmed === "") {
      throw new Error("ISBN cannot be empty");
    }

    this.raw = trimmed;
    this.digits = sanitize(trimmed);
  }

  /** Whether the ISBN passes checksum validation. */
  get valid(): boolean {
    if (this.digits.length === 13) return isValidISBN13(this.digits);
    if (this.digits.length === 10) return isValidISBN10(this.digits);
    return false;
  }

  /** Whether this is an ISBN-13. */
  get isISBN13(): boolean {
    return (
      this.digits.length === 13 &&
      (this.digits.startsWith("978") || this.digits.startsWith("979"))
    );
  }

  /** Whether this is an ISBN-10. */
  get isISBN10(): boolean {
    return this.digits.length === 10;
  }

  /** Convert to ISBN-13 string. */
  toISBN13(): string {
    if (this.isISBN13) return this.digits;
    return isbn10to13(this.digits);
  }

  /** Convert to ISBN-10 string. */
  toISBN10(): string {
    if (this.isISBN10) return this.digits;
    return isbn13to10(this.digits);
  }

  /** EAN-13 (same as ISBN-13 for 978/979 prefix). */
  toEAN13(): string {
    return this.toISBN13();
  }

  /** Format with hyphens. */
  formatted(): string {
    try {
      const digits = this.isISBN13 ? this.digits : this.toISBN13();
      return formatISBN13(digits);
    } catch {
      return formatISBN10(this.digits);
    }
  }

  /** Clean digits only. */
  toString(): string {
    return this.digits;
  }

  /** Numeric representation (ISBN-13). */
  valueOf(): number {
    return parseInt(this.toISBN13(), 10);
  }
}

function sanitize(str: string): string {
  return str.replace(/[^0-9Xx]/g, "").toUpperCase();
}
