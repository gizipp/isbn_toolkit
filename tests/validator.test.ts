import { describe, it, expect } from "vitest";
import { isValidISBN, isValidISBN10, isValidISBN13 } from "../src/validator";

describe("isValidISBN13", () => {
  it("returns true for valid ISBN-13", () => {
    expect(isValidISBN13("9780132350884")).toBe(true);
  });

  it("returns false for wrong check digit", () => {
    expect(isValidISBN13("9780132350885")).toBe(false);
  });

  it("returns false for non-13-digit string", () => {
    expect(isValidISBN13("12345")).toBe(false);
  });

  it("returns false for non-numeric string", () => {
    expect(isValidISBN13("abcdefghijklm")).toBe(false);
  });
});

describe("isValidISBN10", () => {
  it("returns true for valid ISBN-10", () => {
    expect(isValidISBN10("0132350882")).toBe(true);
  });

  it("returns true for ISBN-10 with X check", () => {
    expect(isValidISBN10("080442957X")).toBe(true);
  });

  it("returns false for wrong check digit", () => {
    expect(isValidISBN10("0132350883")).toBe(false);
  });

  it("returns false for non-10-digit string", () => {
    expect(isValidISBN10("12345")).toBe(false);
  });
});

describe("isValidISBN", () => {
  it("auto-detects ISBN-13", () => {
    expect(isValidISBN("9780132350884")).toBe(true);
  });

  it("auto-detects ISBN-10", () => {
    expect(isValidISBN("0132350882")).toBe(true);
  });

  it("handles hyphens", () => {
    expect(isValidISBN("978-0-13-235088-4")).toBe(true);
  });

  it("returns false for unknown format", () => {
    expect(isValidISBN("12345")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isValidISBN("")).toBe(false);
  });
});
