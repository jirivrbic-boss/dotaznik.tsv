"use client";

import { Countdown } from "@/components/Countdown";

/** Tenor embed — CS2 / hype téma (můžeš ID kdykoliv vyměnit v konzoli Tenor). */
const TENOR_EMBED =
  "https://tenor.com/embed/22094125?autoplay=true";

export function SuccessScreen() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center px-3 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(3rem,env(safe-area-inset-top))] text-center sm:min-h-0 sm:px-4 sm:py-16">
      <h1 className="text-[1.35rem] font-black uppercase italic leading-tight tracking-tight text-white min-[400px]:text-2xl sm:text-4xl md:text-5xl">
        GG! Tvoje odpovědi letí k nám na server.
      </h1>
      <p className="mt-3 text-base text-arena-muted sm:mt-4 sm:text-lg">
        Těšíme se na tebe ve 4. ročníku!
      </p>

      <div className="mt-8 w-full max-w-lg overflow-hidden rounded-xl border border-arena-neon/30 shadow-neon sm:mt-10 sm:rounded-2xl">
        <iframe
          title="CS2 hype"
          src={TENOR_EMBED}
          className="aspect-video w-full min-h-[180px] bg-black"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
        />
      </div>

      <h2 className="mt-8 px-1 text-[0.65rem] font-bold uppercase leading-relaxed tracking-[0.2em] text-arena-neon sm:mt-12 sm:text-sm sm:tracking-[0.25em]">
        Otevření registrací — 1. září 2026
      </h2>
      <Countdown />
    </div>
  );
}
