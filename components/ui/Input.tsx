import type { InputHTMLAttributes } from "react";

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-white placeholder:text-arena-muted/70 outline-none transition-[border,box-shadow] focus:border-arena-neon/70 focus:ring-1 focus:ring-arena-neon/40 ${className}`}
      {...props}
    />
  );
}
