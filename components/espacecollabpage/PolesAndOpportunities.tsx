"use client";

import { ImageWithFallback } from "@/lib/imageWithFallback"
import { mockPoleConcert } from '@/localdata/poleConcertationData';

export default function PolesAndOpportunities() {
  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* PÔLES DE CONCERTATION Section */}
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-gray-900 font-bold text-3xl mb-2">PÔLES DE CONCERTATION</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {mockPoleConcert.map((pole) => (
              <div key={pole.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 flex flex-col">
                {/* Image */}
                <div className="relative h-44">
                  <ImageWithFallback
                    src={pole.image}
                    alt={pole.poleName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Category Badge */}
                  <div className="inline-block px-3 py-1 rounded-md text-xs font-semibold text-white mb-4 bg-[#E05017] self-start">
                    {pole.category}
                  </div>

                  {/* Objectifs annuels du pôle */}
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-gray-900 mb-2">
                      Objectifs annuels du pôle
                    </h3>
                    {pole.objectifs.length > 0 ? (
                      <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                        {pole.objectifs.map((objectif, idx) => (
                          <li key={idx}>{objectif}</li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="list-disc pl-5 text-gray-400 text-sm">
                        <li></li>
                        <li></li>
                      </ul>
                    )}
                  </div>

                  {/* Nombre d'OSC membres */}
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-gray-900 mb-2">
                      Nombre d&apos;OSC membres :
                    </h3>
                    {pole.membres.length > 0 ? (
                      <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                        {pole.membres.map((membre, idx) => (
                          <li key={idx}>{membre}</li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="list-disc pl-5 text-gray-400 text-sm">
                        <li></li>
                      </ul>
                    )}
                  </div>

                  {/* Régions d'influence */}
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-gray-900 mb-2">
                      Régions d&apos;influence
                    </h3>
                    {pole.regions.length > 0 ? (
                      <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                        {pole.regions.map((region, idx) => (
                          <li key={idx}>{region}</li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="list-disc pl-5 text-gray-400 text-sm">
                        <li></li>
                      </ul>
                    )}
                  </div>

                  {/* Nos réalisations */}
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-gray-900 mb-2">
                      Nos réalisations
                    </h3>
                    {pole.realisations.length > 0 ? (
                      <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                        {pole.realisations.map((realisation, idx) => (
                          <li key={idx}>{realisation}</li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="list-disc pl-5 text-gray-400 text-sm">
                        <li></li>
                      </ul>
                    )}
                  </div>

                  {/* Agenda */}
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-gray-900 mb-2">
                      Agenda
                    </h3>
                    {pole.agenda.length > 0 ? (
                      <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                        {pole.agenda.map((event, idx) => (
                          <li key={idx}>{event}</li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="list-disc pl-5 text-gray-400 text-sm">
                        <li></li>
                      </ul>
                    )}
                  </div>

                  {/* Rejoindre Button */}
                  <div className="mt-auto flex justify-center">
                    <button className="px-8 py-2 bg-[#E05017] text-white rounded-full text-sm font-semibold hover:bg-[#C54415] transition-colors">
                      Rejoindre
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button className="px-6 py-2 text-[#E05017] text-sm font-semibold hover:underline transition-all">
              Voir plus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
