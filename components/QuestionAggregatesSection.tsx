"use client";

import { useRef, useState } from "react";
import type { AggregateSection, QuestionSummary } from "@/lib/questionAggregates";
import { ratingScaleHint } from "@/lib/questionAggregates";
import { Button } from "@/components/ui/Button";
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

function ExpandableAnswerList({ texts }: { texts: string[] }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      requestAnimationFrame(() => {
        panelRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  };

  if (texts.length === 0) return null;

  return (
    <div className="mt-3">
      <Button
        variant="secondary"
        type="button"
        className="!min-h-[40px] !px-4 !py-2 !text-xs"
        onClick={toggle}
        aria-expanded={open}
      >
        {open ? "Skrýt odpovědi" : "Zobrazit odpovědi"}
      </Button>
      {open ? (
        <div
          ref={panelRef}
          className="mt-4 max-h-[min(70vh,32rem)] space-y-4 overflow-y-auto rounded-xl border border-arena-neon/25 bg-black/50 p-4"
        >
          {texts.map((t, i) => (
            <figure key={i} className="border-l-2 border-arena-orange/70 pl-3">
              <figcaption className="mb-1 text-[0.65rem] uppercase tracking-wider text-arena-muted">
                Odpověď {i + 1} / {texts.length}
              </figcaption>
              <blockquote className="whitespace-pre-wrap text-sm leading-relaxed text-white">
                {t}
              </blockquote>
            </figure>
          ))}
        </div>
      ) : null}
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
          {s.otherTexts.length > 0 ? (
            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="text-xs font-medium text-arena-orange">
                Doplňující texty (možnost „Jiné“)
              </p>
              <ExpandableAnswerList texts={s.otherTexts} />
            </div>
          ) : null}
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
        <div>
          <p className="text-sm text-arena-muted">
            Text vyplnilo{" "}
            <span className="font-mono text-arena-neon">{s.filled}</span> z{" "}
            <span className="text-white">{s.rowCount}</span>
          </p>
          <ExpandableAnswerList texts={s.texts} />
        </div>
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
              <Card
                key={`${sec.pathType}-${s.id}`}
                className="p-4 sm:p-5"
              >
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
