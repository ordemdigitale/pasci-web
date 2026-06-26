import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rejoindre le CRASC — Adhésion des OSC de Côte d'Ivoire",
  description: "Rejoignez le réseau des Organisations de la Société Civile (OSC) membres du CRASC en Côte d'Ivoire. Déposez votre demande d'adhésion et bénéficiez des services de la plateforme PdoC.",
  keywords: [
    "adhésion CRASC Côte d'Ivoire", "rejoindre OSC réseau", "devenir membre CRASC",
    "inscription OSC plateforme", "adhésion société civile", "enregistrement OSC PdoC",
    "demande adhésion OSC", "intégrer réseau OSC Côte d'Ivoire",
  ],
  alternates: { canonical: "https://plateforme-osci.org/rejoindre" },
  openGraph: {
    title: "Rejoindre le CRASC — Adhésion OSC | PdoC",
    description: "Déposez votre demande d'adhésion et rejoignez le réseau des OSC membres du CRASC.",
    url: "https://plateforme-osci.org/rejoindre",
  },
};

export default function RejoindreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
