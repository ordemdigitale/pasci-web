import SectionHero from "@/components/home/SectionHero";
import SectionCrascSlider from "@/components/home/SectionCrascSlider";
import SectionNews from "@/components/home/SectionNews";
import SectionPartners from "@/components/home/SectionPartners";
import SectionStats from "@/components/home/SectionStats";
import SectionFormations from "@/components/home/SectionFormations";

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
