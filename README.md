# isbn-toolkit

[![npm version](https://badge.fury.io/js/isbn-toolkit.svg)](https://www.npmjs.com/package/isbn-toolkit)
[![CI](https://github.com/gizipp/isbn_toolkit/actions/workflows/ci.yml/badge.svg)](https://github.com/gizipp/isbn_toolkit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

All-in-one ISBN toolkit for JavaScript and TypeScript. Validate, convert, and lookup book metadata.

## Installation

```bash
npm install isbn-toolkit
# or
yarn add isbn-toolkit
# or
pnpm add isbn-toolkit
```

## Quick Start

```ts
import { ISBN, valid, lookup } from "isbn-toolkit";

// Validate
valid("978-0-13-235088-4");  // true
valid("1234567890");          // false

// Parse
const isbn = new ISBN("978-0-13-235088-4");
isbn.valid;        // true
isbn.isISBN13;     // true
isbn.toISBN13();   // "9780132350884"
isbn.toISBN10();   // "0132350882"
isbn.formatted();  // "978-0-13-235088-4"

// Convert
const isbn10 = new ISBN("0132350882");
isbn10.toISBN13();  // "9780132350884"

// Lookup metadata (async)
const book = await lookup("9780132350884");
book.title;    // "Clean Code"
book.authors;  // ["Robert C. Martin"]
book.cover;    // "https://..."
```

## Features

### Validate ISBNs

```ts
import { isValidISBN, isValidISBN10, isValidISBN13 } from "isbn-toolkit";

isValidISBN13("9780132350884");  // true
isValidISBN10("0132350882");     // true
isValidISBN("978-0-13-235088-4"); // true (auto-detect)
```

### Convert Between Formats

```ts
import { isbn10to13, isbn13to10 } from "isbn-toolkit";

isbn10to13("0132350882");  // "9780132350884"
isbn13to10("9780132350884");  // "0132350882"
```

### Lookup Book Metadata

```ts
import { lookup } from "isbn-toolkit";

// From Open Library (default, free, no API key)
const book = await lookup("9780132350884");

// From Google Books
const book = await lookup("9780132350884", "google_books");

book.title;       // "Clean Code"
book.authors;     // ["Robert C. Martin"]
book.publisher;   // "Prentice Hall"
book.pages;       // 464
book.cover;       // "https://..."
```

## ISBN Formats

| Format | Length | Example | Check |
|--------|--------|---------|-------|
| ISBN-10 | 10 digits | `0132350882` | Mod 11 |
| ISBN-13 | 13 digits | `9780132350884` | Mod 10 |
| EAN-13 | 13 digits | `9780132350884` | Same as ISBN-13 |

- All modern books use ISBN-13
- ISBN-10 is legacy but still common in older systems
- Only `978`-prefix ISBNs can convert to ISBN-10
- `979`-prefix ISBNs are ISBN-13 only

## TypeScript

Full type definitions included. No `@types` package needed.

```ts
import type { BookMetadata, LookupSource } from "isbn-toolkit";
```

## Development

```bash
git clone https://github.com/gizipp/isbn_toolkit.git
cd isbn_toolkit
npm install
npm test
```

## Related

- [isbn-toolkit-ruby](https://github.com/gizipp/isbn-toolkit-ruby) — Ruby version (RubyGems)
- [isbn-toolkit-php](https://github.com/gizipp/isbn-toolkit-php) — PHP version (Composer)

## License

[MIT](LICENSE)
