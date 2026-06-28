import { describe, it, expect } from "vitest";
import {
  isbn10to13,
  isbn13to10,
  calculateISBN13Check,
  calculateISBN10Check,
  formatISBN13,
  formatISBN10,
} from "../src/converter";

describe("isbn10to13", () => {
  it("converts ISBN-10 to ISBN-13", () => {
    expect(isbn10to13("0132350882")).toBe("9780132350884");
  });

  it("converts ISBN-10 with X check digit", () => {
    const result = isbn10to13("080442957X");
    expect(result).toHaveLength(13);
    expect(result).toMatch(/^978/);
  });

  it("throws for invalid length", () => {
    expect(() => isbn10to13("123")).toThrow();
  });
});

describe("isbn13to10", () => {
  it("converts ISBN-13 to ISBN-10", () => {
    expect(isbn13to10("9780132350884")).toBe("0132350882");
  });

  it("throws for 979-prefix", () => {
    expect(() => isbn13to10("9791234567896")).toThrow(/979/);
  });
});

describe("calculateISBN13Check", () => {
  it("calculates correct check digit", () => {
    expect(calculateISBN13Check("978013235088")).toBe("4");
  });

  it("returns a single digit", () => {
    const result = calculateISBN13Check("978000000000");
    expect(result).toMatch(/^\d$/);
  });
});

describe("calculateISBN10Check", () => {
  it("calculates correct check digit", () => {
    expect(calculateISBN10Check("013235088")).toBe("2");
  });

  it("calculates X check digit", () => {
    expect(calculateISBN10Check("080442957")).toBe("X");
  });
});

describe("formatISBN13", () => {
  it("formats with hyphens", () => {
    expect(formatISBN13("9780132350884")).toBe("978-0-13-235088-4");
  });
});

describe("formatISBN10", () => {
  it("formats with hyphens", () => {
    expect(formatISBN10("0132350882")).toBe("0-13-235088-2");
  });
});
