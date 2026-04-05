"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Countdown } from "@/components/Countdown";
import {
  pickRandomSuccessGif,
  type SuccessGifSrc,
} from "@/lib/successGifs";

export function SuccessScreen() {
  const [gifSrc, setGifSrc] = useState<SuccessGifSrc | null>(null);

  useEffect(() => {
    setGifSrc(pickRandomSuccessGif());
  }, []);

  return (
    <div className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center px-3 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(3rem,env(safe-area-inset-top))] text-center sm:min-h-0 sm:px-4 sm:py-16">
      <h1 className="text-[1.35rem] font-black uppercase italic leading-tight tracking-tight text-white min-[400px]:text-2xl sm:text-4xl md:text-5xl">
        GG! Tvoje odpovědi letí k nám na server.
      </h1>
      <p className="mt-3 text-base text-arena-muted sm:mt-4 sm:text-lg">
        Těšíme se na tebe ve 4. ročníku!
      </p>

      <div className="mt-8 w-full max-w-lg overflow-hidden rounded-xl border border-arena-neon/30 bg-black shadow-neon sm:mt-10 sm:rounded-2xl">
        {gifSrc ? (
          <Image
            src={gifSrc}
            alt="GG"
            width={800}
            height={450}
            unoptimized
            className="h-auto w-full object-contain"
            priority
          />
        ) : (
          <div
            className="aspect-video w-full animate-pulse bg-white/5"
            aria-hidden
          />
        )}
      </div>

      <h2 className="mt-8 px-1 text-[0.65rem] font-bold uppercase leading-relaxed tracking-[0.2em] text-arena-neon sm:mt-12 sm:text-sm sm:tracking-[0.25em]">
        Otevření registrací — 1. září 2026
      </h2>
      <Countdown />
    </div>
  );
}
