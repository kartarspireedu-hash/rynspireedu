import { COUNTRIES_WORLD, isoToFlag } from "@/lib/world";

export { isoToFlag };

// Phone country/dial codes for every country (core markets first).
// The ISO code — not the dial code — is the unique key, because many
// countries share a code (e.g. +1 for the US and Canada).
export const DIAL_CODES = COUNTRIES_WORLD.map((c) => ({ iso: c.iso, dial: c.dial, name: c.name }));
