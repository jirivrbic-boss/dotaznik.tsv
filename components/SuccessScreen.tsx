"use client";

import { Countdown } from "@/components/Countdown";

/** Tenor embed — CS2 / hype téma (můžeš ID kdykoliv vyměnit v konzoli Tenor). */
const TENOR_EMBED =
  "https://tenor.com/embed/22094125?autoplay=true";

export function SuccessScreen() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center">
      <h1 className="text-4xl font-black uppercase italic tracking-tight text-white sm:text-5xl">
        GG! Tvoje odpovědi letí k nám na server.
      </h1>
      <p className="mt-4 text-lg text-arena-muted">
        Těšíme se na tebe ve 4. ročníku!
      </p>

      <div className="mt-10 w-full max-w-lg overflow-hidden rounded-2xl border border-arena-neon/30 shadow-neon">
        <iframe
          title="CS2 hype"
          src={TENOR_EMBED}
          className="aspect-video w-full bg-black"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
        />
      </div>

      <h2 className="mt-12 text-sm font-bold uppercase tracking-[0.25em] text-arena-neon">
        Otevření registrací — 1. září 2026
      </h2>
      <Countdown />
    </div>
  );
}
