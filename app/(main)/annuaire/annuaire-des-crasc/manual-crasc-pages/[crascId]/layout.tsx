import { getCrascRegionById } from "@/localdata/helper/data";
import { notFound } from "next/navigation";

interface CrascRegionLayoutProps {
  children: React.ReactNode;
  params: Promise<{ crascId: string }>;
}

export default async function CrascRegionLayout({
  children,
  params
}: CrascRegionLayoutProps) {
  const { crascId } = await params;
  const region = getCrascRegionById(crascId);
  console.log("CrascRegionLayout - region:", region);

  if (!region) {
    notFound();
  }

  return (
    <div className="region-layout">
      {/* Region-specific header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">{region.crasc_region_name}</h1>
          <p className="mt-2 opacity-90">
            Manage and explore civilizations in the {region.crasc_region_name} region
          </p>
        </div>
      </header>
      
      {/* Shared content area */}
      <div className="container mx-auto px-4">
        {children}
      </div>
    </div>
  );
}