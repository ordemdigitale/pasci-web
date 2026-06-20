import type { Metadata } from "next";
import SectionHero from "@/components/home/SectionHero";
import SectionCrascSlider from "@/components/home/SectionCrascSlider";
import SectionNews from "@/components/home/SectionNews";
import SectionPartners from "@/components/home/SectionPartners";
import SectionStats from "@/components/home/SectionStats";
import SectionFormations from "@/components/home/SectionFormations";

export const metadata: Metadata = {
  title: "Accueil — PDOC, Plateforme Digitale des OSC de Côte d'Ivoire",
  description: "Bienvenue sur PDOC, la plateforme officielle des Organisations de la Société Civile (OSC) de Côte d'Ivoire. Annuaire des OSC, formations, actualités, offres de projets et espace collaboratif.",
  keywords: [
    "OSC Côte d'Ivoire", "société civile ivoirienne", "CRASC", "PDOC", "PASCI",
    "plateforme OSC", "ONG Côte d'Ivoire", "ONG Abidjan", "organisations société civile",
    "renforcement capacités OSC", "développement communautaire Côte d'Ivoire",
  ],
  alternates: { canonical: "https://plateforme-osci.org" },
  openGraph: {
    title: "PDOC — Plateforme Digitale des OSC de Côte d'Ivoire",
    description: "La plateforme officielle des OSC membres des CRASC en Côte d'Ivoire : annuaire, formations, actualités et offres de projets.",
    url: "https://plateforme-osci.org",
  },
};

export default function Home() {
  return (
    <div className="w-full">
      <SectionHero />
      <SectionCrascSlider />
      <SectionNews />
      <SectionStats />
      <SectionFormations />
      <SectionPartners />
    </div>
  );
}
