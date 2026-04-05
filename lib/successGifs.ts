import angryPunching from "@/foto/Angry Punching GIF by Aurora Gaming.gif";
import birdKiss from "@/foto/Bird Kiss GIF by G2 Esports.gif";
import confusedGta from "@/foto/Confused Gta V GIF.gif";
import csCross from "@/foto/Counter Strike Cross GIF by BLAST.gif";
import funnycs2 from "@/foto/funnycs2.gif";
import gif2 from "@/foto/gif-2.gif";
import gif from "@/foto/gif.gif";
import lookLol from "@/foto/Look Lol GIF by BLAST.gif";
import workPc from "@/foto/Work Pc GIF by Fotověci.gif";

export const SUCCESS_GIFS = [
  angryPunching,
  birdKiss,
  confusedGta,
  csCross,
  funnycs2,
  gif2,
  gif,
  lookLol,
  workPc,
] as const;

export type SuccessGifSrc = (typeof SUCCESS_GIFS)[number];

export function pickRandomSuccessGif(): SuccessGifSrc {
  const i = Math.floor(Math.random() * SUCCESS_GIFS.length);
  return SUCCESS_GIFS[i];
}
