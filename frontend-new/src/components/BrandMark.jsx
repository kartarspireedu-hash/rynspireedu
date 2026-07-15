import { Sparkles } from "lucide-react";

/**
 * BrandMark renders "RynSpireEdu" with:
 *   - "Ryn" in sparkling gold gradient (animated shimmer)
 *   - "SpireEdu" in purple
 * Optional logo image on the left.
 */
export default function BrandMark({ size = "md", withLogo = true, className = "" }) {
  const logoUrl = import.meta.env.VITE_LOGO_URL || "/logo.png";
  const sizes = {
    xs: { logo: "h-8 w-11", text: "text-base", spark: 10 },
    sm: { logo: "h-10 w-14", text: "text-lg", spark: 12 },
    md: { logo: "h-12 w-16", text: "text-xl", spark: 12 },
    lg: { logo: "h-16 w-[5.5rem]", text: "text-3xl", spark: 16 },
    xl: { logo: "h-20 w-28", text: "text-4xl sm:text-5xl", spark: 22 },
  };
  const s = sizes[size] || sizes.md;

  return (
    <span className={`inline-flex items-center gap-2 ${className}`} data-testid="brand-mark">
      {withLogo && logoUrl && (
        <span className={`${s.logo} shrink-0`}>
          <img src={logoUrl} alt="RynSpireEdu logo" className="h-full w-full object-contain" />
        </span>
      )}
      <span className={`font-display tracking-tight ${s.text}`}>
        <span className="brand-ryn">Ryn</span>
        <Sparkles size={s.spark} className="brand-sparkle inline -mt-1 mx-0.5" aria-hidden />
        <span className="brand-spire">SpireEdu</span>
      </span>
    </span>
  );
}
