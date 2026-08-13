// Shared form validation helpers used across Checkout, Contact, and BookDemo forms.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Common disposable/temporary email providers. Not exhaustive, but covers the
// overwhelming majority of throwaway-email services people actually use.
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "tempmail.com", "temp-mail.org", "10minutemail.com",
  "guerrillamail.com", "guerrillamail.info", "guerrillamail.biz", "guerrillamail.de",
  "yopmail.com", "throwawaymail.com", "getnada.com", "trashmail.com",
  "fakeinbox.com", "sharklasers.com", "dispostable.com", "mailnesia.com",
  "maildrop.cc", "mintemail.com", "mytemp.email", "moakt.com",
  "emailondeck.com", "spamgourmet.com", "mailcatch.com", "tempinbox.com",
  "discard.email", "tempr.email", "example.com", "test.com",
]);

export function isValidEmailFormat(email) {
  return EMAIL_RE.test(String(email || "").trim());
}

export function isDisposableEmail(email) {
  const at = String(email || "").trim().toLowerCase().split("@");
  if (at.length !== 2) return false;
  return DISPOSABLE_DOMAINS.has(at[1]);
}

/**
 * Full email check combining format + disposable-domain rejection.
 * Returns an error string, or "" if valid.
 */
export function validateEmail(email) {
  const v = String(email || "").trim();
  if (!v) return "Email is required.";
  if (!isValidEmailFormat(v)) return "Please enter a valid email address.";
  if (isDisposableEmail(v)) return "Please use a permanent email address (temporary/disposable emails aren't accepted).";
  return "";
}

/**
 * Validates a phone number: digits only after stripping spaces/dashes/+,
 * must be between 7 and 15 digits (E.164-ish range covers virtually all
 * real country phone number lengths). Generic fallback for countries
 * without a specific rule below.
 */
export function validatePhone(phone) {
  const v = String(phone || "").trim();
  if (!v) return "Phone number is required.";
  const digits = v.replace(/[^\d]/g, "");
  if (digits.length < 7 || digits.length > 15) return "Please enter a valid phone number (7-15 digits, with country code).";
  return "";
}

// Local (national, after the dial code/leading 0) number length rules for
// our priority markets. Exact rather than the generic 7-15 range.
const PHONE_RULES = {
  "+61": { name: "Australian", lengths: [9] },        // Australia: 9 digits after leading 0 (e.g. 4XX XXX XXX)
  "+64": { name: "New Zealand", lengths: [8, 9] },      // NZ: mobiles 8-9 digits after leading 0
  "+1":  { name: "US/Canadian", lengths: [10] },        // NANP (US & Canada): always 10 digits
  "+91": { name: "Indian", lengths: [10] },             // India: always 10 digits
};

/**
 * Validates a phone number given a separate dial code (from a country-code
 * selector) and the local number the person typed. Falls back to the
 * generic 7-15 digit rule for countries without a specific rule above.
 */
export function validatePhoneForCountry(dialCode, localNumber) {
  const local = String(localNumber || "").trim();
  if (!local) return "Phone number is required.";
  const digits = local.replace(/[^\d]/g, "");
  const rule = PHONE_RULES[dialCode];
  if (rule) {
    if (!rule.lengths.includes(digits.length)) {
      const expected = rule.lengths.join(" or ");
      return `Please enter a valid ${rule.name} phone number (${expected} digits).`;
    }
    return "";
  }
  if (digits.length < 6 || digits.length > 14) return "Please enter a valid phone number.";
  return "";
}
