import type { HTMLAttributes } from "react";

export function Card({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-neutral-950/80 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
