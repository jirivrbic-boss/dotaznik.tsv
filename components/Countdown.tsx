"use client";

import { useEffect, useState } from "react";

const TARGET = new Date("2026-09-01T00:00:00+02:00");

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function Countdown() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = Math.max(0, TARGET.getTime() - now);
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((diff % (60 * 1000)) / 1000);

  const items = [
    { label: "Dny", value: days, pad: false },
    { label: "Hodiny", value: hours, pad: true },
    { label: "Minuty", value: minutes, pad: true },
    { label: "Sekundy", value: seconds, pad: true },
  ] as const;

  return (
    <div className="mt-8 grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-arena-neon/40 bg-black/60 px-3 py-4 text-center shadow-neon"
        >
          <div className="font-mono text-3xl font-black tabular-nums text-arena-neon sm:text-4xl">
            {item.pad ? pad(item.value) : item.value}
          </div>
          <div className="mt-1 text-xs uppercase tracking-widest text-arena-muted">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
