import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — PdoC, Plateforme Digitale des OSC",
  description: "Contactez l'équipe de la Plateforme Digitale des OSC (PdoC) et du Programme d'Appui à la Société Civile Ivoirienne (PASCI). Nous sommes disponibles pour répondre à vos questions.",
  keywords: [
    "contact PASCI", "contact PdoC", "contacter CRASC", "support OSC Côte d'Ivoire",
    "équipe PASCI", "nous contacter société civile",
  ],
  alternates: { canonical: "https://plateforme-osci.org/contact" },
  openGraph: {
    title: "Contact — PdoC | PASCI",
    description: "Contactez l'équipe PdoC/PASCI pour toute question sur la société civile ivoirienne.",
    url: "https://plateforme-osci.org/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
