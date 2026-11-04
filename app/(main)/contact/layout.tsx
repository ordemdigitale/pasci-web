import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — PdoC, Plateforme Digitale des OSC",
  description: "Contactez l'équipe de la PdoC (Plateforme Digitale de la Société Civile Ivoirienne). Nous sommes disponibles pour répondre à vos questions.",
  keywords: [
    "contact PASCI", "contact PdoC", "contacter CRASC", "support OSC Côte d'Ivoire",
    "équipe PASCI", "nous contacter société civile",
  ],
  alternates: { canonical: "https://plateforme-osci.org/contact" },
  openGraph: {
    title: "Contact — PdoC | Société Civile Côte d'Ivoire",
    description: "Contactez l'équipe de la PdoC pour toute question sur la société civile ivoirienne.",
    url: "https://plateforme-osci.org/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
