import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Formations pour les OSC — Renforcement de Capacités",
  description: "Découvrez les programmes de formation destinés aux Organisations de la Société Civile (OSC) de Côte d'Ivoire : gestion de projets, communication digitale, genre, mobilisation des ressources, formalisation et gouvernance.",
  keywords: [
    "formations OSC Côte d'Ivoire", "renforcement capacités OSC", "formation gestion projet",
    "formation société civile", "formation ONG Côte d'Ivoire", "formation gouvernance associative",
    "formation mobilisation ressources", "formation genre développement", "formation PASCI",
    "formation gratuite OSC", "formation présentiel Abidjan", "formation en ligne OSC",
    "formation formalisation organisation",
  ],
  alternates: { canonical: "https://plateforme-osci.org/formations" },
  openGraph: {
    title: "Formations OSC — Renforcement de Capacités | PdoC",
    description: "Programmes de formation pour les OSC de Côte d'Ivoire : gestion de projets, genre, gouvernance et plus.",
    url: "https://plateforme-osci.org/formations",
  },
};

export default function FormationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
