import { describe, it, expect } from "vitest";
import { ISBN } from "../src/isbn";

describe("ISBN", () => {
  describe("constructor", () => {
    it("parses clean digits", () => {
      const isbn = new ISBN("9780132350884");
      expect(isbn.digits).toBe("9780132350884");
    });

    it("strips hyphens and spaces", () => {
      const isbn = new ISBN("978-0-13-235088-4");
      expect(isbn.digits).toBe("9780132350884");
    });

    it("throws for null", () => {
      expect(() => new ISBN(null as unknown as string)).toThrow();
    });

    it("throws for empty string", () => {
      expect(() => new ISBN("")).toThrow();
    });
  });

  describe("valid", () => {
    it("returns true for valid ISBN-13", () => {
      expect(new ISBN("9780132350884").valid).toBe(true);
    });

    it("returns true for valid ISBN-13 with hyphens", () => {
      expect(new ISBN("978-0-13-235088-4").valid).toBe(true);
    });

    it("returns true for valid ISBN-10", () => {
      expect(new ISBN("0132350882").valid).toBe(true);
    });

    it("returns true for ISBN-10 with X check", () => {
      expect(new ISBN("080442957X").valid).toBe(true);
    });

    it("returns false for invalid checksum", () => {
      expect(new ISBN("9780132350885").valid).toBe(false);
    });

    it("returns false for wrong length", () => {
      expect(new ISBN("12345").valid).toBe(false);
    });
  });

  describe("isISBN13 / isISBN10", () => {
    it("detects ISBN-13", () => {
      const isbn = new ISBN("9780132350884");
      expect(isbn.isISBN13).toBe(true);
      expect(isbn.isISBN10).toBe(false);
    });

    it("detects ISBN-10", () => {
      const isbn = new ISBN("0132350882");
      expect(isbn.isISBN10).toBe(true);
      expect(isbn.isISBN13).toBe(false);
    });
  });

  describe("toISBN13", () => {
    it("converts ISBN-10 to ISBN-13", () => {
      expect(new ISBN("0132350882").toISBN13()).toBe("9780132350884");
    });

    it("returns self if already ISBN-13", () => {
      expect(new ISBN("9780132350884").toISBN13()).toBe("9780132350884");
    });
  });

  describe("toISBN10", () => {
    it("converts ISBN-13 to ISBN-10", () => {
      expect(new ISBN("9780132350884").toISBN10()).toBe("0132350882");
    });

    it("returns self if already ISBN-10", () => {
      expect(new ISBN("0132350882").toISBN10()).toBe("0132350882");
    });

    it("throws for 979-prefix", () => {
      expect(() => new ISBN("9791234567896").toISBN10()).toThrow(/979/);
    });
  });

  describe("formatted", () => {
    it("formats ISBN-13 with hyphens", () => {
      expect(new ISBN("9780132350884").formatted()).toBe("978-0-13-235088-4");
    });
  });

  describe("toString", () => {
    it("returns clean digits", () => {
      expect(new ISBN("978-0-13-235088-4").toString()).toBe("9780132350884");
    });
  });

  describe("valueOf", () => {
    it("returns numeric ISBN-13", () => {
      expect(new ISBN("0132350882").valueOf()).toBe(9780132350884);
    });
  });
});
