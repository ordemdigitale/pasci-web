import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services — Appui aux OSC de Côte d'Ivoire",
  description: "Découvrez les services offerts aux Organisations de la Société Civile (OSC) de Côte d'Ivoire : accompagnement à la formalisation, renforcement de capacités, accès aux financements et mise en réseau.",
  keywords: [
    "services OSC Côte d'Ivoire", "accompagnement formalisation OSC", "mise en réseau OSC",
    "accès financement OSC", "appui technique OSC", "services PASCI",
    "accompagnement institutionnel OSC", "développement organisationnel OSC",
  ],
  alternates: { canonical: "https://plateforme-osci.org/services" },
  openGraph: {
    title: "Services aux OSC — PDOC | Côte d'Ivoire",
    description: "Services d'accompagnement, de formalisation et de renforcement pour les OSC ivoiriennes.",
    url: "https://plateforme-osci.org/services",
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
