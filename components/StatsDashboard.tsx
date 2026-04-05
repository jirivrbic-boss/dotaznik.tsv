"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, type Timestamp } from "firebase/firestore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getDb } from "@/lib/firebase";
import type { PathType } from "@/lib/surveyTypes";
import {
  aggregateCommunication,
  aggregateWhereHeard,
  avgAdminRating,
  avgGraphicsRating,
  avgLanRating,
  downloadCsv,
  formatTimestamp,
  PATH_LABELS,
  toCsv,
  type SurveyDoc,
} from "@/lib/statsHelpers";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

const NEON = "#88FF00";
const ORANGE = "#F5832B";
const PIE_COLORS = [NEON, ORANGE, "#39FF14", "#FF6600", "#D1D1D1", "#4ade80"];

type Filter = "all" | PathType;

function Kpi({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <Card className="p-4 sm:p-5">
      <p className="text-[0.65rem] uppercase tracking-wider text-arena-muted sm:text-xs sm:tracking-widest">
        {label}
      </p>
      <p className="mt-1.5 text-2xl font-black text-white sm:mt-2 sm:text-3xl">{value}</p>
    </Card>
  );
}

export function StatsDashboard() {
  const [rows, setRows] = useState<SurveyDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [detail, setDetail] = useState<SurveyDoc | null>(null);
  const isNarrow = useMediaQuery("(max-width: 639px)");
  const isTablet = useMediaQuery("(max-width: 1023px)");

  useEffect(() => {
    const db = getDb();
    if (!db) {
      setErr(
        "Firebase není nakonfigurováno. Lokálně: .env.local s NEXT_PUBLIC_FIREBASE_*. Na Vercelu: Settings → Environment Variables — stejné klíče a zaškrtni Production i Preview, pak Redeploy.",
      );
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDocs(collection(db, "survey_responses"));
        if (cancelled) return;
        const list: SurveyDoc[] = snap.docs.map((d) => {
          const data = d.data() as {
            path_type: PathType;
            timestamp?: Timestamp;
            answers?: Record<string, unknown>;
          };
          return {
            id: d.id,
            path_type: data.path_type,
            timestamp: data.timestamp ?? null,
            answers: data.answers ?? {},
          };
        });
        list.sort((a, b) => {
          const ma = a.timestamp?.toMillis?.() ?? 0;
          const mb = b.timestamp?.toMillis?.() ?? 0;
          return mb - ma;
        });
        setRows(list);
      } catch (e) {
        console.error(e);
        setErr("Nepodařilo se načíst data. Zkontroluj Firestore pravidla a indexy.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return rows;
    return rows.filter((r) => r.path_type === filter);
  }, [rows, filter]);

  const kpis = useMemo(() => {
    const totalFiltered = filtered.length;
    const players = rows.filter((r) => r.path_type === "player_path").length;
    const viewers = rows.filter((r) => r.path_type === "viewer_path").length;
    const future = rows.filter((r) => r.path_type === "future_player_path").length;
    return { totalFiltered, players, viewers, future };
  }, [rows, filtered]);

  const ratingBars = useMemo(() => {
    const g = avgGraphicsRating(filtered);
    const a = avgAdminRating(filtered);
    const l = avgLanRating(filtered);
    return [
      { name: "Grafika", průměr: g !== null ? Number(g.toFixed(2)) : null },
      { name: "Admini (hráči)", průměr: a !== null ? Number(a.toFixed(2)) : null },
      { name: "LAN / aréna", průměr: l !== null ? Number(l.toFixed(2)) : null },
    ].map((x) => ({
      ...x,
      průměr: x.průměr === null ? 0 : x.průměr,
      hasData: x.průměr !== null,
    }));
  }, [filtered]);

  const heardPie = useMemo(() => aggregateWhereHeard(filtered), [filtered]);
  const commBar = useMemo(() => aggregateCommunication(filtered), [filtered]);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "Vše" },
    { id: "player_path", label: PATH_LABELS.player_path },
    { id: "viewer_path", label: PATH_LABELS.viewer_path },
    { id: "future_player_path", label: PATH_LABELS.future_player_path },
  ];

  const pieRadius = isNarrow ? 52 : isTablet ? 72 : 92;
  const chartBottom = isNarrow ? 8 : 12;
  const axisTick = isNarrow ? 9 : 11;

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4 text-arena-muted">
        Načítám data…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-10 md:px-6">
      <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between sm:pb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-arena-neon">
            ESPORTARENA_TSV
          </p>
          <h1 className="mt-2 text-2xl font-black uppercase italic text-white sm:text-3xl md:text-4xl">
            Admin přehled
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-arena-muted">
            Čtení dat z kolekce <code className="text-arena-orange">survey_responses</code>.
            Pro produkci doporučujeme omezit čtení ve Firestore pravidlech (např. přes Auth).
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center text-sm text-arena-orange underline-offset-4 hover:underline"
        >
          ← Zpět na dotazník
        </Link>
      </header>

      {err && (
        <p className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {err}
        </p>
      )}

      <section className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <Kpi label="Odpovědí (filtr)" value={kpis.totalFiltered} />
        <Kpi label="Hráči (celkem)" value={kpis.players} />
        <Kpi label="Diváci (celkem)" value={kpis.viewers} />
        <Kpi label="Budoucí hráči" value={kpis.future} />
      </section>

      <section className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
        <span className="text-[0.65rem] uppercase tracking-wider text-arena-muted sm:text-xs sm:tracking-widest">
          Filtr cesty
        </span>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2">
          {filters.map((f) => (
            <Button
              key={f.id}
              variant={filter === f.id ? "primary" : "ghost"}
              className="!min-h-[44px] w-full !py-2 !text-[0.7rem] sm:!min-h-0 sm:w-auto sm:!text-xs"
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </Button>
          ))}
        </div>
        <Button
          variant="secondary"
          className="w-full !min-h-[48px] sm:ml-auto sm:w-auto sm:!min-h-0"
          onClick={() => downloadCsv("esportarena_survey.csv", toCsv(filtered))}
        >
          Export CSV
        </Button>
      </section>

      <section className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 lg:grid-cols-2">
        <Card className="p-4 sm:p-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white sm:text-sm sm:tracking-widest">
            Průměrné hodnocení (1–5)
          </h2>
          <p className="mt-1 text-[0.7rem] leading-relaxed text-arena-muted sm:text-xs">
            Grafika napříč cestami; admini jen u hráčů; LAN z hodnocení arény (hráči) a
            diváckého LAN (diváci).
          </p>
          <div className="mt-3 h-56 w-full sm:mt-4 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingBars} margin={{ top: 8, right: 4, left: isNarrow ? -8 : 0, bottom: chartBottom }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={isNarrow ? -20 : 0}
                  textAnchor={isNarrow ? "end" : "middle"}
                  height={isNarrow ? 52 : 32}
                  tick={{ fill: "#D1D1D1", fontSize: axisTick }}
                />
                <YAxis domain={[0, 5]} width={isNarrow ? 28 : 36} tick={{ fill: "#D1D1D1", fontSize: axisTick }} />
                <Tooltip
                  contentStyle={{
                    background: "#0a0a0a",
                    border: "1px solid #333",
                    borderRadius: 8,
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="průměr" fill={NEON} radius={[6, 6, 0, 0]} name="Průměr" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white sm:text-sm sm:tracking-widest">
            Kde se o turnaji řeklo
          </h2>
          <div className="mt-3 h-56 w-full sm:mt-4 sm:h-72">
            {heardPie.length === 0 ? (
              <p className="text-sm text-arena-muted">Žádná data.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 4, right: 4, bottom: isNarrow ? 4 : 8, left: 4 }}>
                  <Pie
                    data={heardPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={pieRadius}
                    label={!isNarrow}
                  >
                    {heardPie.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#0a0a0a",
                      border: "1px solid #333",
                      borderRadius: 8,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: isNarrow ? 10 : 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="p-4 sm:p-6 lg:col-span-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white sm:text-sm sm:tracking-widest">
            Discord vs WhatsApp (hráči + budoucí hráči)
          </h2>
          <div className="mt-3 h-52 w-full sm:mt-4 sm:h-64">
            {commBar.length === 0 ? (
              <p className="text-sm text-arena-muted">Žádná data pro tento filtr.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={commBar} margin={{ top: 8, right: 4, left: isNarrow ? -8 : 0, bottom: isNarrow ? 48 : 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    angle={isNarrow ? -25 : 0}
                    textAnchor={isNarrow ? "end" : "middle"}
                    height={isNarrow ? 64 : 36}
                    tick={{ fill: "#D1D1D1", fontSize: axisTick }}
                  />
                  <YAxis allowDecimals={false} width={isNarrow ? 28 : 36} tick={{ fill: "#D1D1D1", fontSize: axisTick }} />
                  <Tooltip
                    contentStyle={{
                      background: "#0a0a0a",
                      border: "1px solid #333",
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="value" fill={ORANGE} radius={[6, 6, 0, 0]} name="Počet" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </section>

      <section className="mt-10 sm:mt-12">
        <h2 className="text-base font-black uppercase italic text-white sm:text-lg">
          Jednotlivé odpovědi
        </h2>

        <div className="mt-4 space-y-3 md:hidden">
          {filtered.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setDetail(r)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition-colors active:bg-white/[0.06]"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium text-white">
                  {PATH_LABELS[r.path_type] ?? r.path_type}
                </span>
                <span className="shrink-0 text-xs text-arena-orange">Detail →</span>
              </div>
              <p className="mt-2 text-[0.7rem] text-arena-muted">
                {formatTimestamp(r.timestamp)}
              </p>
              <p className="mt-1 truncate font-mono text-[0.65rem] text-arena-muted/80">
                {r.id}
              </p>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-arena-muted">Žádné záznamy.</p>
          )}
        </div>

        <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-white/10 md:block">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-wider text-arena-muted">
              <tr>
                <th className="px-4 py-3">Čas</th>
                <th className="px-4 py-3">Cesta</th>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3 text-right">Akce</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className="border-t border-white/10 hover:bg-white/[0.03]"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-arena-muted">
                    {formatTimestamp(r.timestamp)}
                  </td>
                  <td className="px-4 py-3 text-white">
                    {PATH_LABELS[r.path_type] ?? r.path_type}
                  </td>
                  <td className="max-w-[120px] truncate px-4 py-3 font-mono text-xs text-arena-muted">
                    {r.id}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setDetail(r)}
                      className="text-arena-orange hover:underline"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {detail && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
        >
          <Card className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border-white/20 p-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:rounded-2xl sm:p-6 sm:pb-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[0.65rem] uppercase tracking-wider text-arena-neon sm:text-xs sm:tracking-widest">
                  Detail odpovědi
                </p>
                <p className="mt-1 break-all font-mono text-[0.65rem] text-arena-muted sm:text-xs">
                  {detail.id}
                </p>
              </div>
              <Button variant="ghost" className="shrink-0" onClick={() => setDetail(null)}>
                Zavřít
              </Button>
            </div>
            <dl className="mt-6 space-y-3 text-sm">
              <div>
                <dt className="text-arena-muted">Cesta</dt>
                <dd className="text-white">
                  {PATH_LABELS[detail.path_type] ?? detail.path_type}
                </dd>
              </div>
              <div>
                <dt className="text-arena-muted">Čas</dt>
                <dd className="text-white">{formatTimestamp(detail.timestamp)}</dd>
              </div>
            </dl>
            <h3 className="mt-8 text-xs font-bold uppercase tracking-widest text-arena-orange">
              Textové a ostatní odpovědi
            </h3>
            <ul className="mt-3 space-y-4 text-sm">
              {Object.entries(detail.answers).map(([k, v]) => {
                if (typeof v === "string" && v.trim()) {
                  return (
                    <li key={k}>
                      <span className="font-mono text-xs text-arena-neon">{k}</span>
                      <p className="mt-1 whitespace-pre-wrap text-white">{v}</p>
                    </li>
                  );
                }
                if (Array.isArray(v) && v.length) {
                  return (
                    <li key={k}>
                      <span className="font-mono text-xs text-arena-neon">{k}</span>
                      <p className="mt-1 text-white">{v.join(", ")}</p>
                    </li>
                  );
                }
                return null;
              })}
            </ul>
            <h3 className="mt-8 text-xs font-bold uppercase tracking-widest text-arena-orange">
              Všechna pole (JSON)
            </h3>
            <pre className="mt-2 max-h-48 overflow-auto rounded-lg bg-black/60 p-3 text-xs text-arena-muted">
              {JSON.stringify(detail.answers, null, 2)}
            </pre>
          </Card>
        </div>
      )}
    </div>
  );
}
