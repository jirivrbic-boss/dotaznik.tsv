import type { PathType, SurveyStep } from "./surveyTypes";

export const GATEWAY_STEP: SurveyStep = {
  id: "gateway_role",
  kind: "radio",
  title:
    "Ahoj! Jaká byla tvá role ve 3. sezóně turnaje ESPORTARENA_TSV?",
  options: [
    { value: "player_path", label: "Hráč (hrál jsem 3. sezónu)" },
    { value: "viewer_path", label: "Divák (sledoval jsem stream nebo byl na LANce)" },
    {
      value: "future_player_path",
      label: "Budoucí hráč (chci se zapojit až do 4. ročníku)",
    },
  ],
};

const PLAYER_STEPS: SurveyStep[] = [
  {
    id: "p_where_heard",
    kind: "checkbox",
    title: "Kde ses o turnaji dozvěděl?",
    options: [
      { value: "instagram", label: "Instagram" },
      { value: "tiktok", label: "TikTok" },
      { value: "facebook", label: "Facebook" },
      { value: "friend", label: "Od kamaráda / spolužáka" },
      { value: "stream", label: "Viděl jsem stream" },
      { value: "other", label: "Jinak" },
    ],
  },
  {
    id: "p_graphics_rating",
    kind: "rating",
    title:
      "Jak na tebe působila naše grafika a vizuální prezentace turnaje (příspěvky, pavouk, stream)?",
  },
  {
    id: "p_propaganda_feedback",
    kind: "textarea",
    title: "Co ti v naší propagaci chybělo nebo co bys změnil?",
    placeholder: "Tvůj názor…",
  },
  {
    id: "p_registration_rating",
    kind: "rating",
    title:
      "Jak hodnotíš proces registrace a dokládání potvrzení o studiu?",
  },
  {
    id: "p_auto_registration",
    kind: "radio",
    title:
      "Chtěli bychom proces registrace zautomatizovat. Po splnění podmínek na webu by tě systém automaticky pozval do komunikační skupiny (WhatsApp/Discord). Uvítal bys to?",
    options: [
      { value: "yes_time", label: "Rozhodně ano, ušetří to čas" },
      { value: "neutral", label: "Je mi to jedno" },
      { value: "old_way", label: "Ne, vyhovuje mi to postaru" },
    ],
  },
  {
    id: "p_team_school_rule",
    kind: "radio",
    title:
      "Aktuálně musí být v týmu min. 3 hráči z jedné školy, kterou reprezentují, a zbytek mix. Vyhovuje ti to?",
    options: [
      { value: "ideal", label: "Ano, je to ideální" },
      { value: "full_school", label: "Ne, chci full tým z jedné školy" },
      { value: "free", label: "Mělo by to být úplně volné" },
    ],
  },
  {
    id: "p_zs_inclusion",
    kind: "radio",
    title:
      "Zvažujeme, že bychom do 4. ročníku zapojili i Základní školy. Co si o tom myslíš?",
    options: [
      { value: "great", label: "Skvělý nápad" },
      { value: "own_league", label: "Nevadí mi to, ale ať hrají svoji vlastní ligu" },
      { value: "against", label: "Jsem proti, jen pro SŠ a VŠ" },
    ],
  },
  {
    id: "p_parent_consent",
    kind: "radio",
    title:
      "Byla byrokracie kolem souhlasu zákonných zástupců pro nezletilé přehledná?",
    options: [
      { value: "ok", label: "Ano, v pohodě" },
      { value: "slow", label: "Ne, bylo to zdlouhavé" },
      { value: "na", label: "Netýkalo se mě to" },
    ],
  },
  {
    id: "p_match_format",
    kind: "radio_other",
    title:
      "Jak ti vyhovoval herní formát – BO1 v kvalifikacích a BO3 v Play-off?",
    otherValue: "other",
    otherPlaceholder: "Upřesni prosím…",
    options: [
      { value: "ideal", label: "Ideální stav" },
      {
        value: "bo3_qual",
        label: "Uvítal bych BO3 i v rozhodujících zápasech kvalifikace",
      },
      { value: "other", label: "Jiné" },
    ],
  },
  {
    id: "p_match_time",
    kind: "radio",
    title:
      "Zápasy začínaly obvykle v 18:00. Vyhovoval ti tento čas?",
    options: [
      { value: "yes", label: "Ano naprosto" },
      { value: "earlier", label: "Ne, raději dříve" },
      { value: "later", label: "Ne, raději později" },
      { value: "weekend", label: "Raději o víkendu" },
    ],
  },
  {
    id: "p_communication",
    kind: "radio",
    title:
      "Komunikace probíhala přes WhatsApp skupinu a částečně Discord. Jak by to bylo do budoucna nejlepší?",
    options: [
      { value: "discord", label: "Jen Discord" },
      { value: "whatsapp", label: "Jen WhatsApp" },
      { value: "mix", label: "Aktuální mix mi vyhovoval" },
    ],
  },
  {
    id: "p_admin_rating",
    kind: "rating",
    title:
      "Jak hodnotíš práci našich adminů (rychlost reakcí, řešení problémů, férovost, dodávání dem/screenů)?",
  },
  {
    id: "p_admin_notes",
    kind: "textarea",
    title: "Chceš k práci adminů a organizaci cokoliv dodat?",
    placeholder: "Volitelný komentář…",
  },
  {
    id: "p_watched_streams",
    kind: "radio",
    title:
      "Sledoval jsi streamy ze zápasů (od anthonyspooner nebo spajkk)?",
    options: [
      { value: "regular", label: "Ano, pravidelně" },
      { value: "our_team", label: "Jen když hrál náš tým" },
      { value: "no", label: "Ne" },
    ],
  },
  {
    id: "p_stream_quality",
    kind: "rating",
    title: "Jak jsi byl spokojený s komentářem a kvalitou vysílání?",
  },
  {
    id: "p_official_twitch",
    kind: "radio",
    title:
      "Uvítal bys do budoucna raději jeden hlavní OFICIÁLNÍ Twitch kanál turnaje, než přenosy u streamerů?",
    options: [
      { value: "official", label: "Ano, oficiální by byl lepší" },
      { value: "neutral", label: "Je mi to jedno" },
      { value: "influencers", label: "Ne, baví mě influenceři" },
    ],
  },
  {
    id: "p_prizepool",
    kind: "radio",
    title:
      "Hrálo se o prizepool v hodnotě 120 000 Kč (hotovost, hardware Cougar, XP Boost). Jak hodnotíš ceny?",
    options: [
      { value: "great", label: "Jsou super, obrovská motivace" },
      {
        value: "more_cash",
        label: "Ocenil bych příště víc peněz na úkor hardwaru",
      },
      { value: "fun", label: "Šlo mi spíš o turnaj než o ceny" },
    ],
  },
  {
    id: "p_lan_venue",
    kind: "radio",
    title:
      "Jak celkově hodnotíš zázemí v EsportArena Plzeň na LAN finále (herní PC, 240Hz monitory, židle)?",
    options: [
      { value: "5", label: "5 hvězd" },
      { value: "4", label: "4 hvězdy" },
      { value: "3", label: "3 hvězdy" },
      { value: "2", label: "2 hvězdy" },
      { value: "1", label: "1 hvězda" },
      { value: "not_lan", label: "Nebyl jsem na LANce" },
    ],
  },
  {
    id: "p_lan_missing",
    kind: "checkbox",
    title: "Chybělo ti na offline finále něco?",
    options: [
      { value: "catering", label: "Catering a občerstvení" },
      { value: "side", label: "Doprovodný program např. 1v1 turnaje" },
      { value: "nothing", label: "Nic, bylo to fajn" },
      { value: "not_there", label: "Nebyl jsem tam" },
    ],
  },
  {
    id: "p_season4_team",
    kind: "radio",
    title:
      "Zúčastní se tvůj tým 4. ročníku (registrace od 1. září 2026)?",
    options: [
      { value: "yes", label: "Rozhodně ano" },
      { value: "unknown", label: "Nevíme" },
      { value: "no", label: "Spíše ne" },
    ],
  },
];

const VIEWER_STEPS: SurveyStep[] = [
  {
    id: "v_where_heard",
    kind: "checkbox",
    title: "Kde ses o turnaji dozvěděl?",
    options: [
      { value: "instagram", label: "Instagram" },
      { value: "tiktok", label: "TikTok" },
      { value: "facebook", label: "Facebook" },
      { value: "friend", label: "Od kamaráda" },
      { value: "stream", label: "Viděl jsem stream" },
    ],
  },
  {
    id: "v_graphics_rating",
    kind: "rating",
    title:
      "Jak na tebe působila naše grafika a vizuální prezentace turnaje?",
  },
  {
    id: "v_where_watched",
    kind: "radio",
    title: "Kde jsi turnaj sledoval?",
    options: [
      { value: "twitch", label: "Jen online na Twitchi" },
      { value: "lan", label: "Byl jsem osobně v EsportArena Plzeň" },
      { value: "both", label: "Obojí" },
    ],
  },
  {
    id: "v_stream_satisfaction",
    kind: "rating",
    title:
      "Jak jsi byl spokojený s komentářem a kvalitou vysílání online u streamerů?",
  },
  {
    id: "v_official_twitch",
    kind: "radio",
    title:
      "Uvítal bys do budoucna raději jeden hlavní OFICIÁLNÍ Twitch kanál turnaje?",
    options: [
      { value: "official", label: "Ano, oficiální by byl lepší" },
      { value: "neutral", label: "Je mi to jedno" },
      { value: "influencers", label: "Ne, baví mě influenceři" },
    ],
  },
  {
    id: "v_lan_experience",
    kind: "rating_or_skip",
    title:
      "Jak na tebe působilo LAN finále v EsportArena Plzeň jako na diváka?",
    skipLabel: "Nebyl jsem tam",
    skipValue: "not_there",
  },
  {
    id: "v_lan_missing",
    kind: "checkbox",
    title: "Co ti na offline finále chybělo?",
    options: [
      { value: "catering", label: "Catering a jídlo" },
      { value: "program", label: "Doprovodný program pro diváky" },
      { value: "merch", label: "Merch stánek" },
      { value: "nothing", label: "Nic" },
      { value: "not_there", label: "Nebyl jsem tam" },
    ],
  },
  {
    id: "v_season4_player_intent",
    kind: "radio",
    title:
      "Plánuješ se do 4. ročníku (registrace od 1. 9. 2026) zapojit rovnou jako hráč?",
    options: [
      { value: "building_team", label: "Ano, skládám tým" },
      { value: "no_people", label: "Rád bych, ale nemám lidi" },
      { value: "viewer_only", label: "Ne, chci jen sledovat" },
    ],
  },
];

const FUTURE_STEPS: SurveyStep[] = [
  {
    id: "f_where_heard",
    kind: "checkbox",
    title: "Kde ses o turnaji dozvěděl?",
    options: [
      { value: "instagram", label: "Instagram" },
      { value: "tiktok", label: "TikTok" },
      { value: "facebook", label: "Facebook" },
      { value: "friend", label: "Od kamaráda" },
      { value: "stream", label: "Viděl jsem stream" },
    ],
  },
  {
    id: "f_graphics_rating",
    kind: "rating",
    title:
      "Jak na tebe působila naše grafika a vizuální prezentace turnaje?",
  },
  {
    id: "f_why_not_season3",
    kind: "radio",
    title: "Proč ses nezúčastnil už 3. ročníku?",
    options: [
      { value: "unknown", label: "Nevěděl jsem o něm" },
      { value: "no_team", label: "Neměl jsem tým" },
      { value: "bureaucracy", label: "Bylo to pro mě moc složité byrokraticky" },
      { value: "no_time", label: "Nebyl čas" },
    ],
  },
  {
    id: "f_team_school_rule",
    kind: "radio",
    title:
      "Aktuálně musí být v týmu min. 3 hráči z jedné školy. Vyhovovalo by ti to na podzim?",
    options: [
      { value: "ideal", label: "Ano, je to ideální" },
      { value: "full_school", label: "Ne, chci full tým z jedné školy" },
      { value: "free", label: "Mělo by to být úplně volné" },
    ],
  },
  {
    id: "f_zs_inclusion",
    kind: "radio",
    title:
      "Zvažujeme, že bychom do 4. ročníku zapojili i Základní školy. Co si o tom myslíš?",
    options: [
      { value: "great", label: "Skvělý nápad" },
      { value: "own_league", label: "Nevadí mi to, ale ať hrají svoji ligu" },
      { value: "against", label: "Jsem proti, jen pro SŠ a VŠ" },
    ],
  },
  {
    id: "f_qualification_times",
    kind: "checkbox",
    title:
      "Které dny a časy ti nejvíce vyhovují pro hraní online kvalifikací?",
    options: [
      { value: "weekday_16", label: "Všední dny od 16:00" },
      { value: "weekday_18", label: "Všední dny od 18:00" },
      { value: "weekend_am", label: "Víkendy dopoledne" },
      { value: "weekend_pm", label: "Víkendy večer" },
    ],
  },
  {
    id: "f_prizepool_motivation",
    kind: "radio",
    title: "Jaký prizepool by tě nejvíc motivoval k účasti ve 4. ročníku?",
    options: [
      { value: "hardware", label: "Hardware (židle, periferie)" },
      { value: "cash", label: "Peníze v hotovosti" },
      { value: "fun", label: "Turnaj hraju pro zábavu a prestiž" },
    ],
  },
  {
    id: "f_communication_pref",
    kind: "radio",
    title: "Uvítal bys komunikaci s adminy raději přes WhatsApp nebo Discord?",
    options: [
      { value: "discord", label: "Jen Discord" },
      { value: "whatsapp", label: "Jen WhatsApp" },
      { value: "both", label: "Obojí je mi jedno" },
    ],
  },
];

export const FINAL_STEP: SurveyStep = {
  id: "final_extra_feedback",
  kind: "textarea",
  title:
    "Máš jakýkoliv další nápad, kritiku nebo pochvalu, která v dotazníku nezazněla? Napiš nám to sem!",
  placeholder: "Sem můžeš napsat cokoliv…",
};

export const PLAYER_FLOW: SurveyStep[] = [...PLAYER_STEPS, FINAL_STEP];
export const VIEWER_FLOW: SurveyStep[] = [...VIEWER_STEPS, FINAL_STEP];
export const FUTURE_FLOW: SurveyStep[] = [...FUTURE_STEPS, FINAL_STEP];

export function pathFlow(path: PathType): SurveyStep[] {
  if (path === "player_path") return PLAYER_FLOW;
  if (path === "viewer_path") return VIEWER_FLOW;
  return FUTURE_FLOW;
}

/** Po výběru cesty: počet kroků včetně závěrečné otázky */
export function pathStepCount(path: PathType): number {
  return pathFlow(path).length;
}

/** Max. celkový počet obrazovek (brána + nejdelší cesta) pro progress bar před výběrem */
export const MAX_SURVEY_STEPS =
  1 + Math.max(PLAYER_FLOW.length, VIEWER_FLOW.length, FUTURE_FLOW.length);
