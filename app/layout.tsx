import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { ClientAnalytics } from "@/components/ClientAnalytics";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-montserrat",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050505",
};

export const metadata: Metadata = {
  title: "ESPORTARENA_TSV — Dotazník",
  description: "Zpětná vazba k 3. sezóně turnaje ESPORTARENA_TSV",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className={montserrat.variable}>
      <body className="min-h-dvh min-h-screen font-sans">
        <ClientAnalytics />
        {children}
      </body>
    </html>
  );
}
