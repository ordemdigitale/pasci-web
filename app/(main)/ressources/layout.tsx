import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ressources Documentaires — OSC Côte d'Ivoire",
  description: "Accédez à la bibliothèque de ressources documentaires pour les OSC de Côte d'Ivoire : guides, manuels, rapports, outils de gestion et références juridiques pour les organisations de la société civile.",
  keywords: [
    "ressources OSC Côte d'Ivoire", "bibliothèque documentaire OSC", "guides formalisation OSC",
    "manuels gestion associative", "rapports société civile", "outils OSC",
    "documentation PASCI", "référentiels OSC", "textes juridiques associations Côte d'Ivoire",
  ],
  alternates: { canonical: "https://plateforme-osci.org/ressources" },
  openGraph: {
    title: "Ressources Documentaires OSC — PDOC | Côte d'Ivoire",
    description: "Guides, manuels et outils pour les OSC de Côte d'Ivoire.",
    url: "https://plateforme-osci.org/ressources",
  },
};

export default function RessourcesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
