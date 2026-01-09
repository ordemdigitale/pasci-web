import {
  getCrascRegionBySlug,
  fetchAllCrascRegionsFromApi, fetchSpecificCrascRegionbySlugFromApi, fetchCrascRegionBySlugWithOscsFromApi
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
  
  const specificCrascRegionBySlugFromApi = await fetchSpecificCrascRegionbySlugFromApi(crascSlug);
  
  const allCrascRegionsFromApi = await fetchAllCrascRegionsFromApi();
  
  const crascRegionOscsFromApi = await fetchCrascRegionBySlugWithOscsFromApi(crascSlug);

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