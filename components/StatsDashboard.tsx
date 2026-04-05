"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, type Timestamp } from "firebase/firestore";
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
    <Card className="p-5">
      <p className="text-xs uppercase tracking-widest text-arena-muted">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </Card>
  );
}

export function StatsDashboard() {
  const [rows, setRows] = useState<SurveyDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [detail, setDetail] = useState<SurveyDoc | null>(null);

  useEffect(() => {
    const db = getDb();
    if (!db) {
      setErr(
        "Firebase není nakonfigurováno — doplň NEXT_PUBLIC_FIREBASE_* v .env.local.",
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

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-arena-muted">
        Načítám data…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <header className="flex flex-col gap-4 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-arena-neon">
            ESPORTARENA_TSV
          </p>
          <h1 className="mt-2 text-3xl font-black uppercase italic text-white sm:text-4xl">
            Admin přehled
          </h1>
          <p className="mt-2 max-w-xl text-sm text-arena-muted">
            Čtení dat z kolekce <code className="text-arena-orange">survey_responses</code>.
            Pro produkci doporučujeme omezit čtení ve Firestore pravidlech (např. přes Auth).
          </p>
        </div>
        <Link
          href="/"
          className="text-sm text-arena-orange underline-offset-4 hover:underline"
        >
          ← Zpět na dotazník
        </Link>
      </header>

      {err && (
        <p className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {err}
        </p>
      )}

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Odpovědí (filtr)" value={kpis.totalFiltered} />
        <Kpi label="Hráči (celkem)" value={kpis.players} />
        <Kpi label="Diváci (celkem)" value={kpis.viewers} />
        <Kpi label="Budoucí hráči" value={kpis.future} />
      </section>

      <section className="mt-8 flex flex-wrap items-center gap-3">
        <span className="text-xs uppercase tracking-widest text-arena-muted">
          Filtr cesty
        </span>
        {filters.map((f) => (
          <Button
            key={f.id}
            variant={filter === f.id ? "primary" : "ghost"}
            className="!py-2 !text-xs"
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </Button>
        ))}
        <Button
          variant="secondary"
          className="ml-auto !py-2"
          onClick={() => downloadCsv("esportarena_survey.csv", toCsv(filtered))}
        >
          Export CSV
        </Button>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white">
            Průměrné hodnocení (1–5)
          </h2>
          <p className="mt-1 text-xs text-arena-muted">
            Grafika napříč cestami; admini jen u hráčů; LAN z hodnocení arény (hráči) a
            diváckého LAN (diváci).
          </p>
          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingBars}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" tick={{ fill: "#D1D1D1", fontSize: 11 }} />
                <YAxis domain={[0, 5]} tick={{ fill: "#D1D1D1", fontSize: 11 }} />
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

        <Card className="p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white">
            Kde se o turnaji řeklo
          </h2>
          <div className="mt-4 h-72 w-full">
            {heardPie.length === 0 ? (
              <p className="text-sm text-arena-muted">Žádná data.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={heardPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
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
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white">
            Discord vs WhatsApp (hráči + budoucí hráči)
          </h2>
          <div className="mt-4 h-64 w-full">
            {commBar.length === 0 ? (
              <p className="text-sm text-arena-muted">Žádná data pro tento filtr.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={commBar}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" tick={{ fill: "#D1D1D1", fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fill: "#D1D1D1", fontSize: 11 }} />
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

      <section className="mt-12">
        <h2 className="text-lg font-black uppercase italic text-white">
          Jednotlivé odpovědi
        </h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <Card className="max-h-[85vh] w-full max-w-2xl overflow-y-auto p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-arena-neon">
                  Detail odpovědi
                </p>
                <p className="mt-1 font-mono text-xs text-arena-muted">{detail.id}</p>
              </div>
              <Button variant="ghost" onClick={() => setDetail(null)}>
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
