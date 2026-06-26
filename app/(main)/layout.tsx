import type { Metadata } from "next";
import { Karla, Poppins } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import SubMenu from "@/components/layout/SubMenu";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";
import PageTracker from "@/components/analytics/PageTracker";
import TextReader from "@/components/accessibility/TextReader";
import MainLayoutShell from "./MainLayoutShell";

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"]
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: {
    default: "PdoC — Plateforme Digitale des OSC de Côte d'Ivoire",
    template: "%s | PdoC",
  },
  description: "PdoC est la plateforme officielle des Organisations de la Société Civile (OSC) membres des CRASC en Côte d'Ivoire. Annuaire des OSC, formations, actualités, offres de projets et espace collaboratif.",
  keywords: [
    "OSC Côte d'Ivoire", "société civile ivoirienne", "CRASC", "PdoC", "PASCI",
    "organisations société civile", "annuaire OSC", "formations OSC", "appui société civile",
    "partenaires techniques financiers", "offres de projets", "espace collaboratif OSC",
    "plateforme digitale OSC", "société civile Abidjan", "ONG Côte d'Ivoire",
    "développement communautaire", "formalisation OSC", "renforcement capacités",
  ],
  authors: [{ name: "PASCI — Programme d'Appui à la Société Civile Ivoirienne" }],
  creator: "PASCI",
  publisher: "PASCI",
  metadataBase: new URL("https://plateforme-osci.org"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_CI",
    url: "https://plateforme-osci.org",
    siteName: "PdoC — Plateforme Digitale des OSC de Côte d'Ivoire",
    title: "PdoC — Plateforme Digitale des OSC de Côte d'Ivoire",
    description: "La plateforme officielle des OSC membres des CRASC en Côte d'Ivoire : annuaire, formations, actualités et offres de projets.",
    images: [{ url: "/images/og-default.jpg", width: 1200, height: 630, alt: "PdoC — Plateforme Digitale des OSC" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PdoC — Plateforme Digitale des OSC de Côte d'Ivoire",
    description: "La plateforme officielle des OSC membres des CRASC en Côte d'Ivoire.",
    images: ["/images/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${karla.variable} ${poppins.variable} antialiased`}>
      <body suppressHydrationWarning>
        <Navbar />
        <SubMenu />
        <MainLayoutShell>{children}</MainLayoutShell>
        <Footer />
        <TextReader />
        <PageTracker />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
