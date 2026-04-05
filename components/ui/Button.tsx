import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-arena-neon text-black font-bold uppercase tracking-wide shadow-neon hover:bg-[#39FF14] hover:shadow-[0_0_28px_rgba(57,255,20,0.45)] transition-all duration-200",
  secondary:
    "bg-arena-orange text-black font-bold uppercase tracking-wide shadow-orange hover:bg-[#FF6600] transition-all duration-200",
  ghost:
    "border border-white/20 text-white hover:border-arena-neon/60 hover:text-arena-neon transition-colors",
};

export function Button({
  variant = "primary",
  className = "",
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-lg px-5 py-3 text-sm sm:min-h-0 sm:min-w-0 sm:py-2.5 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] sm:active:scale-100 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
