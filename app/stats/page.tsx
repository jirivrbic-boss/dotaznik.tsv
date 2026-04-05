import { StatsDashboard } from "@/components/StatsDashboard";

export default function StatsPage() {
  return (
    <div className="min-h-dvh min-h-screen bg-neutral-950 pb-[env(safe-area-inset-bottom)] text-white">
      <StatsDashboard />
    </div>
  );
}
