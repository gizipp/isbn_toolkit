import { describe, it, expect } from "vitest";
import { valid, parse, ISBN } from "../src/index";

describe("index exports", () => {
  describe("valid()", () => {
    it("returns true for valid ISBN-13", () => {
      expect(valid("9780132350884")).toBe(true);
    });

    it("returns true for valid ISBN-10", () => {
      expect(valid("0132350882")).toBe(true);
    });

    it("returns false for invalid", () => {
      expect(valid("12345")).toBe(false);
    });
  });

  describe("parse()", () => {
    it("returns an ISBN instance", () => {
      const isbn = parse("9780132350884");
      expect(isbn).toBeInstanceOf(ISBN);
      expect(isbn.valid).toBe(true);
    });
  });
});
