import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — PDOC, Plateforme Digitale des OSC",
  description: "Contactez l'équipe de la Plateforme Digitale des OSC (PDOC) et du Programme d'Appui à la Société Civile Ivoirienne (PASCI). Nous sommes disponibles pour répondre à vos questions.",
  keywords: [
    "contact PASCI", "contact PDOC", "contacter CRASC", "support OSC Côte d'Ivoire",
    "équipe PASCI", "nous contacter société civile",
  ],
  alternates: { canonical: "https://plateforme-osci.org/contact" },
  openGraph: {
    title: "Contact — PDOC | PASCI",
    description: "Contactez l'équipe PDOC/PASCI pour toute question sur la société civile ivoirienne.",
    url: "https://plateforme-osci.org/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
