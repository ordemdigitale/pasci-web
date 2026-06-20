import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Annuaire des OSC, CRASC et PTF de Côte d'Ivoire",
  description: "Consultez l'annuaire complet des Organisations de la Société Civile (OSC), des Cadres Régionaux d'Appui à la Société Civile (CRASC) et des Partenaires Techniques et Financiers (PTF) actifs en Côte d'Ivoire.",
  keywords: [
    "annuaire OSC Côte d'Ivoire", "liste ONG Côte d'Ivoire", "annuaire CRASC",
    "partenaires techniques financiers Côte d'Ivoire", "PTF Côte d'Ivoire",
    "répertoire organisations société civile", "OSC Abidjan", "OSC Bouaké",
    "OSC San-Pédro", "OSC Korhogo", "annuaire associations Côte d'Ivoire",
    "ONG développement Côte d'Ivoire",
  ],
  alternates: { canonical: "https://plateforme-osci.org/annuaire" },
  openGraph: {
    title: "Annuaire des OSC, CRASC et PTF — Côte d'Ivoire | PDOC",
    description: "Répertoire complet des OSC, CRASC et partenaires techniques actifs en Côte d'Ivoire.",
    url: "https://plateforme-osci.org/annuaire",
  },
};

export default function AnnuaireLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
