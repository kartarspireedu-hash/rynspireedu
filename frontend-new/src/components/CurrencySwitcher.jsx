import { useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCurrency, FX } from "@/context/CurrencyContext";

export default function CurrencySwitcher({ compact = false }) {
  const { currency, change } = useCurrency();
  const [open, setOpen] = useState(false);
  const fx = FX[currency];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        data-testid="currency-switcher"
        className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm hover:border-accent transition-colors"
      >
        <Globe size={13} className="text-primary" />
        <span className="font-medium">{fx.flag} {currency}</span>
        {!compact && <span className="text-muted-foreground hidden md:inline">· {fx.symbol.trim() || fx.symbol}</span>}
        <ChevronDown size={12} className="opacity-70" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 max-h-80 overflow-y-auto">
        {Object.entries(FX).map(([code, meta]) => (
          <DropdownMenuItem
            key={code}
            data-testid={`currency-option-${code}`}
            onClick={() => { change(code); setOpen(false); }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-lg">{meta.flag}</span>
            <span className="flex-1">
              <span className="font-medium">{code}</span>
              <span className="block text-xs text-muted-foreground">{meta.label}</span>
            </span>
            {code === currency && <Check size={14} className="text-accent" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
