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
    <div className="mt-6 grid w-full max-w-2xl grid-cols-2 gap-2 sm:mt-8 sm:grid-cols-4 sm:gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-lg border border-arena-neon/40 bg-black/60 px-2 py-3 text-center shadow-neon sm:rounded-xl sm:px-3 sm:py-4"
        >
          <div className="font-mono text-2xl font-black tabular-nums text-arena-neon min-[400px]:text-3xl sm:text-4xl">
            {item.pad ? pad(item.value) : item.value}
          </div>
          <div className="mt-1 text-[0.6rem] uppercase tracking-wider text-arena-muted sm:text-xs sm:tracking-widest">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
