/**
 * Fetch book metadata from external APIs.
 */

export interface BookMetadata {
  isbn: string;
  title: string | null;
  authors: string[];
  publisher: string | null;
  publishedDate: string | null;
  description: string | null;
  cover: string | null;
  pages: number | null;
  language: string | null;
  source: "open_library" | "google_books";
}

export type LookupSource = "open_library" | "google_books";

/**
 * Fetch book metadata from Open Library or Google Books.
 */
export async function lookup(
  isbn: string,
  source: LookupSource = "open_library"
): Promise<BookMetadata> {
  const digits = isbn.replace(/[^0-9Xx]/g, "").toUpperCase();

  switch (source) {
    case "open_library":
      return fetchOpenLibrary(digits);
    case "google_books":
      return fetchGoogleBooks(digits);
    default:
      throw new Error(`Unknown source: ${source}`);
  }
}

async function fetchOpenLibrary(isbn: string): Promise<BookMetadata> {
  const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;
  const res = await fetch(url);

  if (!res.ok) throw new Error(`Open Library returned ${res.status}`);

  const data = await res.json();
  const book = data[`ISBN:${isbn}`];

  if (!book) return emptyResult(isbn, "open_library");

  return {
    isbn,
    title: book.title ?? null,
    authors: (book.authors ?? []).map((a: { name: string }) => a.name),
    publisher: book.publishers?.[0]?.name ?? null,
    publishedDate: book.publish_date ?? null,
    description: book.notes ?? book.excerpts?.[0]?.text ?? null,
    cover: book.cover?.large ?? book.cover?.medium ?? null,
    pages: book.number_of_pages ?? null,
    language: book.languages?.[0]?.key?.replace("/languages/", "") ?? null,
    source: "open_library",
  };
}

async function fetchGoogleBooks(isbn: string): Promise<BookMetadata> {
  const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
  const res = await fetch(url);

  if (!res.ok) throw new Error(`Google Books returned ${res.status}`);

  const data = await res.json();
  if (!data.totalItems) return emptyResult(isbn, "google_books");

  const info = data.items?.[0]?.volumeInfo ?? {};

  return {
    isbn,
    title: info.title ?? null,
    authors: info.authors ?? [],
    publisher: info.publisher ?? null,
    publishedDate: info.publishedDate ?? null,
    description: info.description ?? null,
    cover: info.imageLinks?.thumbnail ?? null,
    pages: info.pageCount ?? null,
    language: info.language ?? null,
    source: "google_books",
  };
}

function emptyResult(isbn: string, source: LookupSource): BookMetadata {
  return {
    isbn,
    title: null,
    authors: [],
    publisher: null,
    publishedDate: null,
    description: null,
    cover: null,
    pages: null,
    language: null,
    source,
  };
}
