import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Actualités — Société Civile Côte d'Ivoire",
  description: "Suivez toutes les actualités des Organisations de la Société Civile (OSC) et des CRASC de Côte d'Ivoire. Informations, événements, annonces et communiqués des OSC ivoiriennes.",
  keywords: [
    "actualités OSC Côte d'Ivoire", "nouvelles société civile", "CRASC actualités",
    "news ONG Côte d'Ivoire", "événements OSC", "communiqués société civile ivoirienne",
    "actualités PDOC", "informations PASCI",
  ],
  alternates: { canonical: "https://plateforme-osci.org/actualites" },
  openGraph: {
    title: "Actualités — Société Civile Côte d'Ivoire | PDOC",
    description: "Toutes les actualités des OSC et CRASC de Côte d'Ivoire.",
    url: "https://plateforme-osci.org/actualites",
  },
};

export default function ActualitesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
