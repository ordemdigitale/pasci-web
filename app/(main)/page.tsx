import SectionHero from "@/components/home/SectionHero";
import SectionNews from "@/components/home/SectionNews";
import SectionPartners from "@/components/home/SectionPartners";
import SectionStats from "@/components/home/SectionStats";

export default function Home() {
  return (
    <div className="w-full">
      <SectionHero />
      <SectionNews />
      <SectionStats />
      <SectionPartners />
    </div>
  );
}
