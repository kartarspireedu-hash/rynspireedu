import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COUNTRIES_WORLD, ALL_TIMEZONES, isoToFlag } from "@/lib/world";

/** Every country, with flag. Typing a name jumps to it. */
export function WorldCountrySelect({ value, onChange, testId }) {
  const cur = COUNTRIES_WORLD.find((c) => c.iso === value);
  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger className="mt-2 rounded-xl" data-testid={testId} aria-label="Choose your country">
        <SelectValue placeholder="Select your country">{cur ? `${isoToFlag(cur.iso)} ${cur.name}` : null}</SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-72">
        {COUNTRIES_WORLD.map((c) => (
          <SelectItem key={c.iso} value={c.iso} textValue={c.name}>{isoToFlag(c.iso)} {c.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** Every timezone in the world as "flag Country · City (UTC+x)". `value` is "ISO|Zone". */
export function WorldTimezoneSelect({ value, onChange, testId }) {
  const cur = ALL_TIMEZONES.find((t) => t.key === value);
  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger className="mt-2 rounded-xl" data-testid={testId} aria-label="Choose your timezone">
        <SelectValue placeholder="Select your timezone">{cur ? cur.label : null}</SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-72">
        {ALL_TIMEZONES.map((t) => (
          <SelectItem key={t.key} value={t.key} textValue={`${t.country} ${t.zone.split("/").pop().replace(/_/g, " ")}`}>{t.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
