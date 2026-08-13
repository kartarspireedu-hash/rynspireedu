export function isoToFlag(iso2) {
  if (!iso2 || iso2.length !== 2) return "🌐";
  return String.fromCodePoint(...[...iso2.toUpperCase()].map((c) => 127397 + c.charCodeAt(0)));
}

// Phone country/dial codes — default falls back to Australia (+61)
export const DIAL_CODES = [
  { iso: "AU", dial: "+61", name: "Australia" },
  { iso: "NZ", dial: "+64", name: "New Zealand" },
  { iso: "US", dial: "+1", name: "United States" },
  { iso: "GB", dial: "+44", name: "United Kingdom" },
  { iso: "CA", dial: "+1", name: "Canada" },
  { iso: "IN", dial: "+91", name: "India" },
  { iso: "SG", dial: "+65", name: "Singapore" },
  { iso: "AE", dial: "+971", name: "United Arab Emirates" },
  { iso: "IE", dial: "+353", name: "Ireland" },
  { iso: "DE", dial: "+49", name: "Germany" },
  { iso: "CN", dial: "+86", name: "China" },
  { iso: "FR", dial: "+33", name: "France" },
  { iso: "ZA", dial: "+27", name: "South Africa" },
  { iso: "MY", dial: "+60", name: "Malaysia" },
  { iso: "PH", dial: "+63", name: "Philippines" },
  { iso: "PK", dial: "+92", name: "Pakistan" },
  { iso: "SA", dial: "+966", name: "Saudi Arabia" },
];
