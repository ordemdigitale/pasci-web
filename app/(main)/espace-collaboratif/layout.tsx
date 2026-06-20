import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Espace Collaboratif — Offres d'Emploi et Pôles de Concertation OSC",
  description: "Accédez à l'espace collaboratif des OSC de Côte d'Ivoire : offres d'emploi dans le secteur de la société civile, pôles de concertation thématiques et espaces d'échange entre organisations.",
  keywords: [
    "offres emploi OSC Côte d'Ivoire", "emploi ONG Côte d'Ivoire", "recrutement société civile",
    "pôles concertation OSC", "espace collaboratif OSC", "forum OSC",
    "emploi développement Côte d'Ivoire", "offres poste ONG Abidjan",
  ],
  alternates: { canonical: "https://plateforme-osci.org/espace-collaboratif" },
  openGraph: {
    title: "Espace Collaboratif — Emploi & Concertation OSC | PDOC",
    description: "Offres d'emploi et pôles de concertation pour les OSC de Côte d'Ivoire.",
    url: "https://plateforme-osci.org/espace-collaboratif",
  },
};

export default function EspaceCollaboratifLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
