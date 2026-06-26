import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offres de Projets — Appels à Projets OSC Côte d'Ivoire",
  description: "Consultez les offres et appels à projets disponibles pour les Organisations de la Société Civile (OSC) de Côte d'Ivoire. Opportunités de financement, partenariats et collaborations pour les OSC ivoiriennes.",
  keywords: [
    "offres projets OSC Côte d'Ivoire", "appels à projets ONG", "financement OSC Côte d'Ivoire",
    "opportunités financement société civile", "appel à candidatures OSC",
    "projets développement Côte d'Ivoire", "financement ONG Abidjan",
    "subventions OSC", "partenariats OSC PTF",
  ],
  alternates: { canonical: "https://plateforme-osci.org/offre-projets" },
  openGraph: {
    title: "Offres de Projets — Appels à Projets OSC | PdoC",
    description: "Appels à projets et opportunités de financement pour les OSC de Côte d'Ivoire.",
    url: "https://plateforme-osci.org/offre-projets",
  },
};

export default function OffreProjetsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
