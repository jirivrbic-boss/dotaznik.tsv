"use client";

import type { AggregateSection, QuestionSummary } from "@/lib/questionAggregates";
import { ratingScaleHint } from "@/lib/questionAggregates";
import { Card } from "@/components/ui/Card";

function DistBar({ label, pct }: { label: string; pct: number }) {
  return (
    <div className="mt-2">
      <div className="flex justify-between gap-2 text-[0.7rem] text-arena-muted sm:text-xs">
        <span className="min-w-0 flex-1 leading-snug text-white">{label}</span>
        <span className="shrink-0 tabular-nums">{pct}%</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-arena-neon/80 transition-all"
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
    </div>
  );
}

function SummaryBlock({ s }: { s: QuestionSummary }) {
  switch (s.kind) {
    case "rating": {
      const hint = ratingScaleHint(s.avg);
      return (
        <div className="text-sm text-arena-muted">
          <p>
            <span className="font-mono text-lg font-bold text-arena-neon">
              {s.avg}
            </span>
            <span className="text-white"> / 5</span>
            {hint ? (
              <span className="ml-2 text-arena-muted">({hint})</span>
            ) : null}
          </p>
          <p className="mt-1 text-xs">
            Hodnocení: <span className="text-white">{s.count}</span> z{" "}
            <span className="text-white">{s.rowCount}</span> odpovědí
          </p>
        </div>
      );
    }
    case "rating_skip":
      return (
        <div className="text-sm text-arena-muted">
          {s.avg !== null ? (
            <p>
              <span className="font-mono text-lg font-bold text-arena-neon">
                {s.avg}
              </span>
              <span className="text-white"> / 5</span>
              <span className="ml-2 text-xs">
                ({ratingScaleHint(s.avg)})
              </span>
            </p>
          ) : (
            <p className="text-xs">Číselné hodnocení: nikdo nevyplnil</p>
          )}
          <p className="mt-1 text-xs">
            Počet hodnocení:{" "}
            <span className="text-white">{s.numericCount}</span>,{" "}
            <span className="text-white">{s.skipLabel}</span>:{" "}
            <span className="text-white">{s.skipCount}</span> (celkem{" "}
            {s.rowCount} odpovědí)
          </p>
        </div>
      );
    case "radio":
      return (
        <div>
          <p className="text-xs text-arena-muted">
            Vyplnilo <span className="text-white">{s.answered}</span> z{" "}
            <span className="text-white">{s.rowCount}</span>
          </p>
          {s.rows.map((row) => (
            <DistBar key={row.label} label={row.label} pct={row.pct} />
          ))}
        </div>
      );
    case "radio_other":
      return (
        <div>
          <p className="text-xs text-arena-muted">
            Vyplnilo <span className="text-white">{s.answered}</span> z{" "}
            <span className="text-white">{s.rowCount}</span>
            {s.otherFilled > 0 ? (
              <>
                , doplnění u „Jiné“:{" "}
                <span className="text-white">{s.otherFilled}</span>
              </>
            ) : null}
          </p>
          {s.rows.map((row) => (
            <DistBar key={row.label} label={row.label} pct={row.pct} />
          ))}
        </div>
      );
    case "checkbox":
      return (
        <div>
          <p className="text-xs text-arena-muted">
            Alespoň jednu možnost zvolilo{" "}
            <span className="text-white">{s.withAnswer}</span> z{" "}
            <span className="text-white">{s.rowCount}</span> — podíl z těch, kteří
            odpověděli:
          </p>
          {s.rows.map((row) => (
            <DistBar key={row.label} label={row.label} pct={row.pct} />
          ))}
        </div>
      );
    case "textarea":
      return (
        <p className="text-sm text-arena-muted">
          Text vyplnilo{" "}
          <span className="font-mono text-arena-neon">{s.filled}</span> z{" "}
          <span className="text-white">{s.rowCount}</span>
        </p>
      );
    default:
      return null;
  }
}

function odpovediSlovo(n: number): string {
  if (n === 1) return "odpověď";
  if (n >= 2 && n <= 4) return "odpovědi";
  return "odpovědí";
}

export function QuestionAggregatesSection({
  sections,
}: {
  sections: AggregateSection[];
}) {
  if (sections.length === 0) {
    return (
      <p className="text-sm text-arena-muted">
        Pro tento filtr nejsou žádná data k souhrnu.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      {sections.map((sec) => (
        <div key={sec.pathType}>
          <h3 className="text-sm font-bold uppercase tracking-wider text-arena-orange">
            {sec.pathLabel}
            <span className="ml-2 font-normal normal-case text-arena-muted">
              ({sec.rowCount} {odpovediSlovo(sec.rowCount)})
            </span>
          </h3>
          <div className="mt-4 space-y-4">
            {sec.summaries.map((s) => (
              <Card key={s.id} className="p-4 sm:p-5">
                <h4 className="text-sm font-semibold leading-snug text-white sm:text-base">
                  {s.title}
                </h4>
                <div className="mt-3">
                  <SummaryBlock s={s} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
