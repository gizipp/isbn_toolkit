/**
 * MCP (Model Context Protocol) server for isbn-toolkit.
 *
 * Exposes ISBN tools for AI agents:
 * - validate_isbn: Validate an ISBN
 * - parse_isbn: Parse ISBN and get all formats
 * - lookup_isbn: Lookup book metadata by ISBN
 * - convert_isbn: Convert between ISBN-10 and ISBN-13
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ISBN } from "./isbn.js";
import { isValidISBN, isValidISBN10, isValidISBN13 } from "./validator.js";
import { isbn10to13, isbn13to10, formatISBN13, formatISBN10 } from "./converter.js";
import { lookup } from "./lookup.js";
import type { LookupSource } from "./lookup.js";

const server = new McpServer({
  name: "isbn-toolkit",
  version: "0.1.0",
  description: "ISBN toolkit. Validate, convert, and lookup book metadata.",
});

server.tool(
  "validate_isbn",
  "Validasi ISBN. Mengembalikan true/false beserta detail format ISBN-10 dan ISBN-13.",
  {
    isbn: z.string().describe("ISBN yang akan divalidasi. Contoh: '978-0-13-235088-4' atau '0132350882'"),
  },
  async ({ isbn }) => {
    const obj = new ISBN(isbn);
    const result = {
      valid: obj.valid,
      input: isbn,
      isbn10: obj.toISBN10() ?? null,
      isbn13: obj.toISBN13() ?? null,
      format: obj.valid ? (obj.isISBN13 ? "ISBN-13" : "ISBN-10") : "unknown",
    };
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "parse_isbn",
  "Parse ISBN string menjadi semua format (ISBN-10, ISBN-13, EAN-13, formatted).",
  {
    isbn: z.string().describe("ISBN yang akan di-parse. Contoh: '978-0-13-235088-4'"),
  },
  async ({ isbn }) => {
    const obj = new ISBN(isbn);
    if (!obj.valid) {
      return { content: [{ type: "text", text: JSON.stringify({ error: "Invalid ISBN", input: isbn }) }] };
    }
    const result = {
      input: isbn,
      valid: true,
      isbn10: obj.toISBN10(),
      isbn13: obj.toISBN13(),
      formatted13: formatISBN13(obj.toISBN13()!),
      formatted10: formatISBN10(obj.toISBN10()!),
    };
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "lookup_isbn",
  "Cari metadata buku berdasarkan ISBN. Mengembalikan judul, penulis, penerbit, tahun, sampul.",
  {
    isbn: z.string().describe("ISBN buku. Contoh: '9780132350884'"),
    source: z.enum(["open_library", "google_books"]).optional().describe("Sumber data: 'open_library' atau 'google_books'. Default: open_library"),
  },
  async ({ isbn, source }) => {
    try {
      const metadata = await lookup(isbn, (source ?? "open_library") as LookupSource);
      return { content: [{ type: "text", text: JSON.stringify(metadata, null, 2) }] };
    } catch (error) {
      return { content: [{ type: "text", text: JSON.stringify({ error: String(error), isbn }) }] };
    }
  }
);

server.tool(
  "convert_isbn",
  "Konversi ISBN antara format ISBN-10 dan ISBN-13.",
  {
    isbn: z.string().describe("ISBN yang akan dikonversi"),
    to: z.enum(["10", "13"]).describe("Target format: '10' atau '13'"),
  },
  async ({ isbn, to }) => {
    const obj = new ISBN(isbn);
    if (!obj.valid) {
      return { content: [{ type: "text", text: JSON.stringify({ error: "Invalid ISBN", input: isbn }) }] };
    }
    let result: string | null;
    if (to === "13") {
      result = obj.toISBN13() ?? isbn10to13(isbn);
    } else {
      result = obj.toISBN10() ?? isbn13to10(isbn);
    }
    return { content: [{ type: "text", text: JSON.stringify({ input: isbn, converted: result, format: `ISBN-${to}` }) }] };
  }
);

export { server };

// Run if executed directly
const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const transport = new StdioServerTransport();
  server.connect(transport).catch(console.error);
}
