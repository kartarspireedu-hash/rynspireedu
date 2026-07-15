import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "@/lib/api";

/**
 * Currency context — USD is the base. Fixed FX table (updated periodically).
 * IP-based country detection sets the default; user can override manually.
 */

// Snapshot rates (Feb 2026, from USD). Round-off in UI presentation.
export const FX = {
  USD: { rate: 1.0,   symbol: "$",    label: "US Dollar",           locale: "en-US", flag: "🇺🇸" },
  AUD: { rate: 1.55,  symbol: "$",    label: "Australian Dollar",   locale: "en-AU", flag: "🇦🇺" },
  NZD: { rate: 1.68,  symbol: "$",    label: "New Zealand Dollar",  locale: "en-NZ", flag: "🇳🇿" },
  GBP: { rate: 0.79,  symbol: "£",    label: "British Pound",       locale: "en-GB", flag: "🇬🇧" },
  EUR: { rate: 0.92,  symbol: "€",    label: "Euro",                locale: "en-IE", flag: "🇪🇺" },
  CAD: { rate: 1.36,  symbol: "$",    label: "Canadian Dollar",     locale: "en-CA", flag: "🇨🇦" },
  INR: { rate: 83.5,  symbol: "₹",    label: "Indian Rupee",        locale: "en-IN", flag: "🇮🇳" },
  AED: { rate: 3.67,  symbol: "AED ", label: "UAE Dirham",          locale: "en-AE", flag: "🇦🇪" },
  SGD: { rate: 1.34,  symbol: "$",    label: "Singapore Dollar",    locale: "en-SG", flag: "🇸🇬" },
  CNY: { rate: 7.20,  symbol: "¥",    label: "Chinese Yuan",        locale: "zh-CN", flag: "🇨🇳" },
};

export const COUNTRY_TO_CURRENCY = {
  US: "USD", AU: "AUD", NZ: "NZD", GB: "GBP", UK: "GBP",
  IE: "EUR", DE: "EUR", FR: "EUR", ES: "EUR", IT: "EUR", NL: "EUR", PT: "EUR",
  CA: "CAD", IN: "INR", AE: "AED", SG: "SGD", CN: "CNY",
};

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("rynspireedu.currency");
      if (saved && FX[saved]) return saved;
    }
    return "AUD"; // primary market default
  });
  const [country, setCountry] = useState(null);

  // Attempt geo-detect once
  useEffect(() => {
    const saved = typeof window !== "undefined" && window.localStorage.getItem("rynspireedu.currency");
    if (saved) return;
    (async () => {
      try {
        const { data } = await api.get("/geo");
        if (data?.country) {
          setCountry(data.country);
          const c = COUNTRY_TO_CURRENCY[data.country];
          if (c && FX[c]) setCurrency(c);
        }
      } catch (err) {
        // Geo lookup is best-effort; default currency remains AUD
        if (process.env.NODE_ENV !== "production") {
          console.debug("[currency] geo lookup failed:", err?.message);
        }
      }
    })();
  }, []);

  const change = (c) => {
    if (!FX[c]) return;
    setCurrency(c);
    window.localStorage.setItem("rynspireedu.currency", c);
  };

  const format = (usdAmount, { showDecimals = false } = {}) => {
    const fx = FX[currency];
    const val = usdAmount * fx.rate;
    const rounded = showDecimals
      ? val.toFixed(2)
      : Math.round(val).toLocaleString(fx.locale);
    return `${fx.symbol}${rounded}`;
  };

  const value = useMemo(() => ({ currency, country, change, format, FX }), [currency, country]);
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be inside CurrencyProvider");
  return ctx;
}
