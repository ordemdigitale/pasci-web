import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À Propos — PASCI et PDOC, Programme d'Appui à la Société Civile Ivoirienne",
  description: "Découvrez le Programme d'Appui à la Société Civile Ivoirienne (PASCI) et la Plateforme Digitale des OSC (PDOC). Notre mission : renforcer les capacités des organisations de la société civile en Côte d'Ivoire.",
  keywords: [
    "PASCI", "Programme Appui Société Civile Ivoirienne", "PDOC", "CRASC",
    "histoire société civile Côte d'Ivoire", "mission PASCI", "gouvernance OSC",
    "appui institutionnel OSC", "développement société civile Côte d'Ivoire",
  ],
  alternates: { canonical: "https://plateforme-osci.org/a-propos" },
  openGraph: {
    title: "À Propos — PASCI & PDOC | Société Civile Côte d'Ivoire",
    description: "Découvrez le PASCI et sa mission d'appui aux OSC de Côte d'Ivoire.",
    url: "https://plateforme-osci.org/a-propos",
  },
};

export default function AProposLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
