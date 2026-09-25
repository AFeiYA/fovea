import type { Metadata } from "next";
import { AppProvider } from "@/context/AppContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "FOVEA.SI — Superintelligence, in focus.",
  description:
    "A curated stream of news and signals shaping the path from AI to superintelligence. Less noise. More signal.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "FOVEA.SI — Superintelligence, in focus.",
    description:
      "Not everything that happens in AI matters. Fovea tracks what might.",
    url: "https://fovea.si",
    siteName: "FOVEA.SI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full flex flex-col antialiased selection:bg-amber-500/20 selection:text-amber-200">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
