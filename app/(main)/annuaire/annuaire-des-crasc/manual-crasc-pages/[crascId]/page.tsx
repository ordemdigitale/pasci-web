/* app/(main)/annuaire/annuaire-des-crasc/[crascId]/page.tsx: Page detail d'une Région CRASC */
import React from 'react'
import { getCrascRegionWithCivs } from "@/localdata/helper/data"
import { getCrascRegionOscs } from "@/localdata/helper/data"
import { notFound } from "next/navigation";

interface CrascRegionPageProps {
  params: Promise<{ crascId: string }>
}

export default async function CrascRegionPage({ params }: CrascRegionPageProps) {
  const { crascId } = await params;
  const crascRegionData = getCrascRegionWithCivs(crascId);
  console.log("CrascRegionPage - Crasc Region Data:", crascRegionData);
  const regionCivs = crascRegionData?.civs || [];
  console.log("CrascRegionPage - Region de la CIV:", regionCivs);
  const oscsData = getCrascRegionOscs(crascId);
  console.log("CrascRegionPage - oscsData:", oscsData);
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
            <div className="text-5xl text-[#2a591d] font-bold">{oscsData?.oscs.length || 0}</div>
          </div>
          {/* Liste des régions qui composent le CRASC */}
          <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
            <h3 className="text-sm text-gray-900 font-bold mb-4 uppercase">les régions du {crascRegionData?.crasc_region_name}</h3>
            <div className="grid grid-cols-2 gap-2">
              {regionCivs.map((civ) => (
                <div key={civ.id} className="text-sm text-[#2a591d] font-bold">
                  {civ.region_name}
                </div>
              ))}
            </div>
          </div>
          {/* Domaines d'activité */}
          <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
            <h3 className="text-sm text-gray-900 font-bold mb-4">NOS DOMAINES D&apos;ACTIVITÉ</h3>
            <div className="space-y-2">Liste des domaines d'activities ici</div>
          </div>
        </div>
      </div>


      <p>{crascRegionData.crasc_region_name}</p>
      {regionCivs.length === 0 ? (
        <p>Nothing found</p>
      ) : (
        <ul>
          {regionCivs.map((civ) => (
            <li key={civ.id}>{civ.region_name}</li>
          ))}
        </ul>
      )}
    </section>
  )
}
