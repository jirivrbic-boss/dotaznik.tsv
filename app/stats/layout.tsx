import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin přehled | ESPORTARENA_TSV",
  description: "Statistiky a export odpovědí z dotazníku",
};

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
