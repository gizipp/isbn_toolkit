/**
 * isbn-toolkit: All-in-one ISBN toolkit for JavaScript/TypeScript.
 *
 * @example
 * ```ts
 * import { ISBN, valid, lookup } from "isbn-toolkit";
 *
 * // Validate
 * valid("978-0-13-235088-4"); // true
 *
 * // Parse
 * const isbn = new ISBN("978-0-13-235088-4");
 * isbn.valid;      // true
 * isbn.toISBN13();  // "9780132350884"
 * isbn.toISBN10();  // "0132350882"
 *
 * // Lookup
 * const book = await lookup("9780132350884");
 * book.title;   // "Clean Code"
 * book.authors; // ["Robert C. Martin"]
 * ```
 *
 * @packageDocumentation
 */

export { ISBN } from "./isbn.js";
export { isValidISBN, isValidISBN10, isValidISBN13 } from "./validator.js";
export {
  isbn10to13,
  isbn13to10,
  calculateISBN13Check,
  calculateISBN10Check,
  formatISBN13,
  formatISBN10,
} from "./converter.js";
export { lookup } from "./lookup.js";
export type { BookMetadata, LookupSource } from "./lookup.js";

import { ISBN } from "./isbn.js";
import { isValidISBN } from "./validator.js";
import { lookup } from "./lookup.js";

/**
 * Quick validation. Returns true if the ISBN is valid.
 */
export function valid(isbn: string): boolean {
  return isValidISBN(isbn);
}

/**
 * Parse an ISBN string into an ISBN object.
 */
export function parse(isbn: string): ISBN {
  return new ISBN(isbn);
}
