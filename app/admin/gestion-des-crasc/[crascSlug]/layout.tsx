import {
  getCrascRegionBySlug,
  //fetchAllCrascRegionsFromApi, fetchSpecificCrascRegionbySlugFromApi, fetchCrascRegionBySlugWithOscsFromApi
} from "@/localdata/helper/data";

import { getCrascRegionBySlugWithOscsFromApi } from "@/lib/fetch-crasc";
import { notFound } from "next/navigation";

interface CrascRegionLayoutProps {
  children: React.ReactNode;
  params: Promise<{ crascSlug: string }>;
}

export default async function CrascRegionLayout({
  children,
  params
}: CrascRegionLayoutProps) {
  const { crascSlug } = await params;
  const crascRegion = getCrascRegionBySlug(crascSlug);
/*   console.log("CrascRegionLayout - Specific Crasc Region by Slug:", crascRegion);
  const specificCrascRegionBySlugFromApi = await fetchSpecificCrascRegionbySlugFromApi(crascSlug);
  console.log("CrascRegionLayout - Specific Crasc Region by slug from API: ", specificCrascRegionBySlugFromApi);
  const allCrascRegionsFromApi = await fetchAllCrascRegionsFromApi();
  console.log("CrascRegionLayout - All Crasc Regions from API:", allCrascRegionsFromApi); */

  if (!crascRegion) {
    notFound();
  }

  return (
    <div className="region-layout">      
      {/* Shared content area */}
      <div className="container mx-auto px-4">
        {children}
      </div>
    </div>
  );
}