import type { Timestamp } from "firebase/firestore";
import type { PathType } from "@/lib/surveyTypes";

export type SurveyDoc = {
  id: string;
  path_type: PathType;
  timestamp: Timestamp | null;
  answers: Record<string, unknown>;
};

function num(v: unknown): number | null {
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string" && /^[1-5]$/.test(v)) return Number(v);
  return null;
}

export function avgGraphicsRating(rows: SurveyDoc[]): number | null {
  const vals: number[] = [];
  for (const r of rows) {
    const a = r.answers;
    const x = num(a.p_graphics_rating ?? a.v_graphics_rating ?? a.f_graphics_rating);
    if (x !== null) vals.push(x);
  }
  if (!vals.length) return null;
  return vals.reduce((s, n) => s + n, 0) / vals.length;
}

export function avgAdminRating(rows: SurveyDoc[]): number | null {
  const vals: number[] = [];
  for (const r of rows) {
    const x = num(r.answers.p_admin_rating);
    if (x !== null) vals.push(x);
  }
  if (!vals.length) return null;
  return vals.reduce((s, n) => s + n, 0) / vals.length;
}

export function avgLanRating(rows: SurveyDoc[]): number | null {
  const vals: number[] = [];
  for (const r of rows) {
    const a = r.answers;
    const p = num(a.p_lan_venue);
    if (p !== null) vals.push(p);
    const v = num(a.v_lan_experience);
    if (v !== null) vals.push(v);
  }
  if (!vals.length) return null;
  return vals.reduce((s, n) => s + n, 0) / vals.length;
}

const HEARD_LABELS: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
  friend: "Od kamaráda",
  stream: "Stream",
  other: "Jinak",
};

export function aggregateWhereHeard(rows: SurveyDoc[]): { name: string; value: number }[] {
  const counts: Record<string, number> = {};
  for (const r of rows) {
    const a = r.answers;
    const src = (a.p_where_heard ?? a.v_where_heard ?? a.f_where_heard) as unknown;
    if (!Array.isArray(src)) continue;
    for (const key of src) {
      if (typeof key !== "string") continue;
      counts[key] = (counts[key] ?? 0) + 1;
    }
  }
  return Object.entries(counts).map(([k, value]) => ({
    name: HEARD_LABELS[k] ?? k,
    value,
  }));
}

const COMM_LABELS: Record<string, string> = {
  discord: "Jen Discord",
  whatsapp: "Jen WhatsApp",
  mix: "Mix (hráči)",
  both: "Obojí (budoucí hráči)",
};

export function aggregateCommunication(rows: SurveyDoc[]): { name: string; value: number }[] {
  const counts: Record<string, number> = {};
  for (const r of rows) {
    const a = r.answers;
    const p = a.p_communication;
    const f = a.f_communication_pref;
    if (typeof p === "string") {
      const k = p === "mix" ? "mix" : p;
      counts[k] = (counts[k] ?? 0) + 1;
    }
    if (typeof f === "string") {
      const k = f === "both" ? "both" : f;
      counts[k] = (counts[k] ?? 0) + 1;
    }
  }
  return Object.entries(counts).map(([k, value]) => ({
    name: COMM_LABELS[k] ?? k,
    value,
  }));
}

function cellValue(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.join("; ");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

export function toCsv(rows: SurveyDoc[]): string {
  const answerKeys = new Set<string>();
  for (const r of rows) {
    Object.keys(r.answers).forEach((k) => answerKeys.add(k));
  }
  const sortedKeys = [...answerKeys].sort();
  const header = ["id", "path_type", "timestamp", ...sortedKeys.map((k) => `answer_${k}`)];
  const lines = [header.join(",")];
  for (const r of rows) {
    const ts =
      r.timestamp && typeof r.timestamp.toDate === "function"
        ? r.timestamp.toDate().toISOString()
        : "";
    const cells = [
      r.id,
      r.path_type,
      ts,
      ...sortedKeys.map((k) => {
        const raw = cellValue(r.answers[k]);
        const escaped = raw.replace(/"/g, '""');
        return raw.includes(",") || raw.includes("\n") || raw.includes('"')
          ? `"${escaped}"`
          : escaped;
      }),
    ];
    lines.push(cells.join(","));
  }
  return lines.join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function formatTimestamp(ts: SurveyDoc["timestamp"]): string {
  if (!ts || typeof ts.toDate !== "function") return "—";
  try {
    return ts.toDate().toLocaleString("cs-CZ");
  } catch {
    return "—";
  }
}

export const PATH_LABELS: Record<PathType, string> = {
  player_path: "Hráči",
  viewer_path: "Diváci",
  future_player_path: "Budoucí hráči",
};
