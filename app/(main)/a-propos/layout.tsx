import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À Propos — PdoC, Plateforme Digitale de la Société Civile",
  description: "Découvrez la PdoC (Plateforme Digitale de la Société Civile) et les CRASC. Notre mission : renforcer les capacités des organisations de la société civile en Côte d'Ivoire.",
  keywords: [
    "PASCI", "Programme Appui Société Civile Ivoirienne", "PdoC", "CRASC",
    "histoire société civile Côte d'Ivoire", "mission PASCI", "gouvernance OSC",
    "appui institutionnel OSC", "développement société civile Côte d'Ivoire",
  ],
  alternates: { canonical: "https://plateforme-osci.org/a-propos" },
  openGraph: {
    title: "À Propos — PdoC | Société Civile Côte d'Ivoire",
    description: "Découvrez la PdoC et sa mission d'appui aux OSC de Côte d'Ivoire.",
    url: "https://plateforme-osci.org/a-propos",
  },
};

export default function AProposLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
