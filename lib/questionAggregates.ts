import { pathFlow } from "@/lib/surveySteps";
import type { PathType } from "@/lib/surveyTypes";
import type { SurveyStep } from "@/lib/surveyTypes";
import { PATH_LABELS, type SurveyDoc } from "@/lib/statsHelpers";

export type PathFilter = "all" | PathType;

const RATING_WORD: Record<number, string> = {
  1: "Nedostatečně",
  2: "Dostatečně",
  3: "Dobře",
  4: "Chvalitebně",
  5: "Výborně",
};

export function ratingScaleHint(avg: number): string {
  const n = Math.round(avg);
  const clamped = Math.min(5, Math.max(1, n));
  return RATING_WORD[clamped] ?? "";
}

function pct(part: number, whole: number): number {
  if (whole === 0) return 0;
  return Math.round((part / whole) * 1000) / 10;
}

export type QuestionSummary =
  | {
      kind: "rating";
      id: string;
      title: string;
      avg: number;
      count: number;
      rowCount: number;
    }
  | {
      kind: "rating_skip";
      id: string;
      title: string;
      avg: number | null;
      numericCount: number;
      skipCount: number;
      skipLabel: string;
      rowCount: number;
    }
  | {
      kind: "radio";
      id: string;
      title: string;
      answered: number;
      rowCount: number;
      rows: { label: string; count: number; pct: number }[];
    }
  | {
      kind: "radio_other";
      id: string;
      title: string;
      answered: number;
      rowCount: number;
      otherFilled: number;
      otherTexts: string[];
      rows: { label: string; count: number; pct: number }[];
    }
  | {
      kind: "checkbox";
      id: string;
      title: string;
      rowCount: number;
      withAnswer: number;
      rows: { label: string; count: number; pct: number }[];
    }
  | {
      kind: "textarea";
      id: string;
      title: string;
      filled: number;
      rowCount: number;
      texts: string[];
    };

function summarizeStep(
  step: SurveyStep,
  rows: SurveyDoc[],
): QuestionSummary | null {
  const rowCount = rows.length;
  if (rowCount === 0) return null;

  switch (step.kind) {
    case "rating": {
      const max = step.max ?? 5;
      const vals: number[] = [];
      for (const r of rows) {
        const v = r.answers[step.id];
        if (typeof v === "number" && v >= 1 && v <= max) vals.push(v);
      }
      if (vals.length === 0) return null;
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      return {
        kind: "rating",
        id: step.id,
        title: step.title,
        avg: Math.round(avg * 100) / 100,
        count: vals.length,
        rowCount,
      };
    }
    case "rating_or_skip": {
      const max = step.max ?? 5;
      const nums: number[] = [];
      let skip = 0;
      for (const r of rows) {
        const v = r.answers[step.id];
        if (v === step.skipValue) skip++;
        else if (typeof v === "number" && v >= 1 && v <= max) nums.push(v);
      }
      if (nums.length === 0 && skip === 0) return null;
      const avg =
        nums.length > 0
          ? Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 100) /
            100
          : null;
      return {
        kind: "rating_skip",
        id: step.id,
        title: step.title,
        avg,
        numericCount: nums.length,
        skipCount: skip,
        skipLabel: step.skipLabel,
        rowCount,
      };
    }
    case "radio": {
      const counts = new Map<string, number>();
      let answered = 0;
      for (const r of rows) {
        const v = r.answers[step.id];
        if (typeof v === "string" && v.length > 0) {
          answered++;
          counts.set(v, (counts.get(v) ?? 0) + 1);
        }
      }
      if (answered === 0) return null;
      const known = new Set(step.options.map((o) => o.value));
      const rowsOut: { label: string; count: number; pct: number }[] =
        step.options.map((o) => ({
          label: o.label,
          count: counts.get(o.value) ?? 0,
          pct: pct(counts.get(o.value) ?? 0, answered),
        }));
      for (const [val, count] of counts) {
        if (!known.has(val) && count > 0) {
          rowsOut.push({ label: val, count, pct: pct(count, answered) });
        }
      }
      return {
        kind: "radio",
        id: step.id,
        title: step.title,
        answered,
        rowCount,
        rows: rowsOut,
      };
    }
    case "radio_other": {
      const otherKey = `${step.id}_other`;
      const counts = new Map<string, number>();
      const otherTexts: string[] = [];
      let answered = 0;
      let otherFilled = 0;
      for (const r of rows) {
        const v = r.answers[step.id];
        if (typeof v === "string" && v.length > 0) {
          answered++;
          counts.set(v, (counts.get(v) ?? 0) + 1);
        }
        const ot = r.answers[otherKey];
        if (typeof ot === "string" && ot.trim()) {
          otherFilled++;
          otherTexts.push(ot.trim());
        }
      }
      if (answered === 0 && otherFilled === 0) return null;
      const known = new Set(step.options.map((o) => o.value));
      const rowsOut: { label: string; count: number; pct: number }[] =
        answered > 0
          ? step.options.map((o) => ({
              label: o.label,
              count: counts.get(o.value) ?? 0,
              pct: pct(counts.get(o.value) ?? 0, answered),
            }))
          : step.options.map((o) => ({
              label: o.label,
              count: counts.get(o.value) ?? 0,
              pct: 0,
            }));
      if (answered > 0) {
        for (const [val, count] of counts) {
          if (!known.has(val) && count > 0) {
            rowsOut.push({ label: val, count, pct: pct(count, answered) });
          }
        }
      }
      return {
        kind: "radio_other",
        id: step.id,
        title: step.title,
        answered,
        rowCount,
        otherFilled,
        otherTexts,
        rows: rowsOut,
      };
    }
    case "checkbox": {
      const counts = new Map<string, number>();
      let withAnswer = 0;
      for (const r of rows) {
        const v = r.answers[step.id];
        if (!Array.isArray(v) || v.length === 0) continue;
        withAnswer++;
        for (const x of v) {
          if (typeof x === "string") {
            counts.set(x, (counts.get(x) ?? 0) + 1);
          }
        }
      }
      if (withAnswer === 0) return null;
      const rowsOut = step.options.map((o) => ({
        label: o.label,
        count: counts.get(o.value) ?? 0,
        pct: pct(counts.get(o.value) ?? 0, withAnswer),
      }));
      return {
        kind: "checkbox",
        id: step.id,
        title: step.title,
        rowCount,
        withAnswer,
        rows: rowsOut,
      };
    }
    case "textarea": {
      const texts: string[] = [];
      for (const r of rows) {
        const v = r.answers[step.id];
        if (typeof v === "string" && v.trim()) texts.push(v.trim());
      }
      if (texts.length === 0) return null;
      return {
        kind: "textarea",
        id: step.id,
        title: step.title,
        filled: texts.length,
        rowCount,
        texts,
      };
    }
    default:
      return null;
  }
}

export type AggregateSection = {
  pathType: PathType;
  pathLabel: string;
  rowCount: number;
  summaries: QuestionSummary[];
};

export function buildAggregateSections(
  filteredRows: SurveyDoc[],
  filter: PathFilter,
): AggregateSection[] {
  const paths: PathType[] =
    filter === "all"
      ? ["player_path", "viewer_path", "future_player_path"]
      : [filter];

  const out: AggregateSection[] = [];

  for (const path of paths) {
    const rows =
      filter === "all"
        ? filteredRows.filter((r) => r.path_type === path)
        : filteredRows;

    if (rows.length === 0) continue;

    const steps = pathFlow(path);
    const summaries: QuestionSummary[] = [];
    for (const step of steps) {
      if (step.id === "gateway_role") continue;
      const s = summarizeStep(step, rows);
      if (s) summaries.push(s);
    }

    out.push({
      pathType: path,
      pathLabel: PATH_LABELS[path],
      rowCount: rows.length,
      summaries,
    });
  }

  return out;
}
