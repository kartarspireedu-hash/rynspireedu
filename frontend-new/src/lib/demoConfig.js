// Shared by the Book-a-Demo page and the guided chat assistant, so both use
// exactly the same options, slots and date rules.

export const COUNTRIES = ["Australia", "New Zealand", "United States", "Canada"];

export const CITIES_BY_COUNTRY = {
  "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Canberra", "Gold Coast", "Hobart", "Darwin", "Other"],
  "New Zealand": ["Auckland", "Wellington", "Christchurch", "Hamilton", "Tauranga", "Dunedin", "Palmerston North", "Other"],
  "United States": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "San Francisco", "Seattle", "Boston", "Austin", "Denver", "Other"],
  "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton", "Winnipeg", "Other"],
};

export const CLASSES = [
  "Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
  "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12", "Other",
];

export const SUBJECTS = [
  "Mathematics", "English", "Science", "Physics", "Chemistry", "Biology",
  "Computer Science", "Coding & AI", "Economics", "Business Studies",
  "Social Studies", "IELTS", "PTE", "SAT", "ACT", "Other",
];

export const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
];

// Default timezone for each supported country (the family's HOME timezone).
export const DEFAULT_TZ_BY_COUNTRY = {
  "Australia": "Australia/Sydney",
  "New Zealand": "Pacific/Auckland",
  "United States": "America/New_York",
  "Canada": "America/Toronto",
};

// More exact per-city timezones (used by the chat, which doesn't show a tz picker).
export const TZ_BY_CITY = {
  Sydney: "Australia/Sydney", Melbourne: "Australia/Melbourne", Brisbane: "Australia/Brisbane",
  Perth: "Australia/Perth", Adelaide: "Australia/Adelaide", Canberra: "Australia/Sydney",
  "Gold Coast": "Australia/Brisbane", Hobart: "Australia/Hobart", Darwin: "Australia/Darwin",
  Auckland: "Pacific/Auckland", Wellington: "Pacific/Auckland", Christchurch: "Pacific/Auckland",
  Hamilton: "Pacific/Auckland", Tauranga: "Pacific/Auckland", Dunedin: "Pacific/Auckland",
  "Palmerston North": "Pacific/Auckland",
  "New York": "America/New_York", Boston: "America/New_York",
  Chicago: "America/Chicago", Houston: "America/Chicago", Austin: "America/Chicago",
  Denver: "America/Denver", Phoenix: "America/Phoenix",
  "Los Angeles": "America/Los_Angeles", "San Francisco": "America/Los_Angeles", Seattle: "America/Los_Angeles",
  Toronto: "America/Toronto", Montreal: "America/Toronto", Ottawa: "America/Toronto",
  Vancouver: "America/Vancouver", Calgary: "America/Edmonton", Edmonton: "America/Edmonton",
  Winnipeg: "America/Winnipeg",
};

export const tzForLocation = (country, city) =>
  TZ_BY_CITY[city] || DEFAULT_TZ_BY_COUNTRY[country] || "Australia/Sydney";

// Demos are not offered on Sundays. This is a rule about the CALENDAR DATE in
// the family's own country (the date they pick is already in their timezone),
// so it's simply "is this calendar date a Sunday?" — never convert via UTC.
export const isClosedDay = (d) => d.getDay() === 0;

// "YYYY-MM-DD" from the date's LOCAL parts. (toISOString() is UTC, which shifts
// the date by a day for anyone east of UTC — e.g. every Australian visitor — and
// was sending Monday bookings to the server as Sunday.)
export function ymd(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Wall-clock "now" in the given timezone as a plain local Date.
export function nowInTz(tz) {
  try {
    return new Date(new Date().toLocaleString("en-US", { timeZone: tz }));
  } catch {
    return new Date();
  }
}

// Today's CALENDAR date in the family's timezone, at local midnight.
export function todayInTz(tz) {
  const n = nowInTz(tz);
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

export function maxBookableDate(tz) {
  const t = todayInTz(tz);
  const m = new Date(t);
  m.setMonth(m.getMonth() + 2);
  return m;
}

export const isBookableDate = (d, tz) => {
  const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return day >= todayInTz(tz) && day <= maxBookableDate(tz) && !isClosedDay(day);
};

// First `count` bookable dates starting today (in the family's timezone).
export function nextOpenDays(tz, count = 6) {
  const out = [];
  const d = todayInTz(tz);
  for (let i = 0; i < 40 && out.length < count; i++) {
    if (!isClosedDay(d)) out.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

// Slots that start less than 60 minutes from now in the family's timezone.
export function slotsTooSoon(tz, dateKey) {
  const n = nowInTz(tz);
  if (ymd(n) !== dateKey) return [];
  const nowMin = n.getHours() * 60 + n.getMinutes();
  return TIME_SLOTS.filter((t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m - nowMin < 60;
  });
}
