import { Sparkles } from "lucide-react";

/**
 * BrandMark renders "RynSpireEdu" with:
 *   - "Ryn" in sparkling gold gradient (animated shimmer)
 *   - "SpireEdu" in purple
 * Optional logo image on the left.
 */
export default function BrandMark({ size = "md", withLogo = true, className = "" }) {
  const logoUrl = import.meta.env.VITE_LOGO_URL || "";
  const sizes = {
    xs: { logo: "h-6 w-6", text: "text-base", spark: 10 },
    sm: { logo: "h-8 w-8", text: "text-lg", spark: 12 },
    md: { logo: "h-9 w-9", text: "text-xl", spark: 12 },
    lg: { logo: "h-12 w-12", text: "text-3xl", spark: 16 },
    xl: { logo: "h-16 w-16", text: "text-4xl sm:text-5xl", spark: 22 },
  };
  const s = sizes[size] || sizes.md;

  return (
    <span className={`inline-flex items-center gap-2 ${className}`} data-testid="brand-mark">
      {withLogo && logoUrl && (
        <span className={`${s.logo} rounded-xl overflow-hidden`}>
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
