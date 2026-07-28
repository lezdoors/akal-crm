import { describe, expect, it } from "vitest";

import { formatMoney, revenueByCurrency } from "./orderUtils";

/** French Intl separates the amount from the mark with U+202F, not a space. */
const plain = (value: string) => value.replace(/\s/gu, " ");

describe("formatMoney", () => {
  it("formats every currency in the interface locale, not the currency's own", () => {
    // The register is read as a column: one set of separators per screen.
    expect(formatMoney(68000, "EUR", "en")).toBe("€680.00");
    expect(formatMoney(68000, "GBP", "en")).toBe("£680.00");
    expect(formatMoney(68000, "USD", "en")).toBe("$680.00");

    expect(plain(formatMoney(68000, "EUR", "fr"))).toBe("680,00 €");
    expect(plain(formatMoney(68000, "GBP", "fr"))).toBe("680,00 £");
    expect(plain(formatMoney(68000, "USD", "fr"))).toBe("680,00 $");
  });

  it("keeps foreign currencies on their bare mark in French", () => {
    // Intl's default `currencyDisplay` renders these as "£GB" / "$US".
    expect(formatMoney(1000, "GBP", "fr")).not.toContain("GB");
    expect(formatMoney(1000, "USD", "fr")).not.toContain("US");
  });

  it("reads minor units", () => {
    expect(formatMoney(1, "USD", "en")).toBe("$0.01");
    expect(formatMoney(123456, "USD", "en")).toBe("$1,234.56");
  });

  it("shows a missing amount as a dash rather than zero", () => {
    expect(formatMoney(null, "USD", "en")).toBe("—");
    expect(formatMoney(undefined, "USD", "en")).toBe("—");
    expect(formatMoney(0, "USD", "en")).toBe("$0.00");
  });

  it("falls back to USD when the row carries no currency", () => {
    expect(formatMoney(1000, null, "en")).toBe("$10.00");
    expect(formatMoney(1000, "", "en")).toBe("$10.00");
  });
});

describe("revenueByCurrency", () => {
  it("totals per ISO code and never across them", () => {
    const totals = revenueByCurrency([
      { total: 1000, currency: "EUR" },
      { total: 2000, currency: "EUR" },
      { total: 500, currency: "GBP" },
    ] as never);
    expect(totals).toEqual({ EUR: 3000, GBP: 500 });
  });

  it("counts a currency-less order as USD", () => {
    expect(revenueByCurrency([{ total: 100 }] as never)).toEqual({ USD: 100 });
  });
});
