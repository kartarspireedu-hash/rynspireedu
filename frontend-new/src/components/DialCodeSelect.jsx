import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DIAL_CODES, isoToFlag } from "@/lib/dialCodes";

/** Phone country-code picker for every country. Closed it shows "🇹🇿 +255";
 *  open, each row shows flag, country and code, and typing a country name jumps to it. */
export default function DialCodeSelect({ value, onChange, testId }) {
  const cur = DIAL_CODES.find((d) => d.iso === value) || DIAL_CODES[0];
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="rounded-xl w-[6.75rem] shrink-0" data-testid={testId} aria-label="Phone country code">
        <SelectValue>{isoToFlag(cur.iso)} {cur.dial}</SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-72">
        {DIAL_CODES.map((d) => (
          <SelectItem key={d.iso} value={d.iso} textValue={d.name}>
            {isoToFlag(d.iso)} {d.name} <span className="text-muted-foreground">{d.dial}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
