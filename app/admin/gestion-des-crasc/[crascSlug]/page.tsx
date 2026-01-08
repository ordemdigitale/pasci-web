/* app/admin/les-crasc/[crascSlug]/page.tsx: Page detail d'une Région CRASC */
import { getCrascRegionWithCivsBySlug } from "@/localdata/helper/data"
import { getCrascRegionOscsBySlug, fetchCrascRegionBySlugWithOscsFromApi } from "@/localdata/helper/data"
import { getCrascRegionBySlugWithOscsFromApi } from "@/lib/fetch-crasc";
import { notFound } from "next/navigation";
import { ImageWithFallback } from '@/lib/imageWithFallback';

interface CrascRegionPageProps {
  params: Promise<{ crascSlug: string }>
}

export default async function CrascRegionPage({ params }: CrascRegionPageProps) {
  const { crascSlug } = await params;
  const crascRegionData = getCrascRegionWithCivsBySlug(crascSlug);
  console.log("CrascRegionPage - Crasc Region Data:", crascRegionData);
  const regionCivs = crascRegionData?.civs || [];
  console.log("CrascRegionPage - Region de la CIV:", regionCivs);
  const oscsData = getCrascRegionOscsBySlug(crascSlug);
  console.log("CrascRegionPage - oscsData:", oscsData);
  const crascOscsDataFromApi = await fetchCrascRegionBySlugWithOscsFromApi(crascSlug);
  console.log("CrascRegionPage - Fetch Crasc Region by slug with OSCs from API:", crascOscsDataFromApi);
  const crascRegionOscsDataFromApi = crascOscsDataFromApi.oscs;
  console.log("CrascRegionPage - OSCs for this Crasc Region:", crascRegionOscsDataFromApi);
  const crascRegionWithOscsAndRegionCivs = await getCrascRegionBySlugWithOscsFromApi(crascSlug);

  if (!crascRegionData) {
    notFound();
  }
  return (
    <section className="py-10 lg:pb-32 lg:pt-10 font-poppins">

      {/* Section statistiques */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Nombre de OSCs */}
          <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
            <h3 className="text-sm text-gray-900 font-bold mb-2">ORGANISATIONS DE LA SOCIÉTÉ CIVILE</h3>
            <div className="text-5xl text-[#2a591d] font-bold">{crascRegionWithOscsAndRegionCivs?.osc_count}</div>
          </div>
          {/* Liste des régions qui composent le CRASC */}
          <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
            <h3 className="text-sm text-gray-900 font-bold mb-4 uppercase">les régions du {crascRegionWithOscsAndRegionCivs?.name}</h3>
            <div className="grid grid-cols-2 gap-2">
              {crascRegionWithOscsAndRegionCivs?.regions_civ.map((civ) => (
                <div key={civ.id} className="text-sm text-[#2a591d] font-bold">
                  {civ.name}
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
      
      <p>Liste des OSCs du {crascRegionData?.crasc_region_name}: données venant de "crasc.json" file</p>
      {oscsData?.oscs.length === 0 ? (
        <p>Nothing found</p>
      ) : (
        <ul>
          {oscsData?.oscs.map((osc) => (
            <li key={osc.id}>{osc.name}</li>
          ))}
        </ul>
      )}

      <div className="mt-10 p-6 border-t border-gray-300"> 
        <p>Liste des OSCs du {crascRegionData?.crasc_region_name}: données venant de l'API</p>
        {crascRegionOscsDataFromApi?.length === 0 ? (
          <p>Aucune OSC trouvée</p>
        ) : (
          <ul>
            {crascRegionOscsDataFromApi?.map((osc: any) => (
              <li key={osc.id}>{osc.name}</li>
            ))}
          </ul>
        )}
      </div>

      {/* OSCs Card Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {crascOscsDataFromApi?.oscs.length === 0 ? (
            <p className="font-semibold text-4xl text-center pb-8">Aucune OSC trouvée.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {crascOscsDataFromApi?.oscs.map((osc: any) => (
                <div key={osc.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-[4/3] overflow-hidden">
                    <ImageWithFallback
                      alt={osc.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="mb-3 text-center font-bold">{osc.name}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {osc.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </section>
  )
}
