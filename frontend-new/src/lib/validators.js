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
 * real country phone number lengths).
 */
export function validatePhone(phone) {
  const v = String(phone || "").trim();
  if (!v) return "Phone number is required.";
  const digits = v.replace(/[^\d]/g, "");
  if (digits.length < 7 || digits.length > 15) return "Please enter a valid phone number (7-15 digits, with country code).";
  return "";
}
