"use client";

import { useState } from 'react';
import { Mail, ChevronDown } from 'lucide-react';
import { ImageWithFallback } from "@/lib/imageWithFallback"
import { mockPoleConcert } from '@/localdata/poleConcertationData';

interface CardItem {
  id: number;
  image: string;
  title: string;
  category: string;
  description: string;
  email: string;
 // objectifs: [];
}

const consultationPoles: CardItem[] = [
  {
    id: 1,
    image: '/images/espace-collabo/2d5632f9-ac11-4f20-8029-a58de61ba137.jpg',
    title: 'Offre de stage: Chargé(e) de communication digitale',
    category: 'Agriculture, Sylviculture et Pêche',
    description: 'Dynamiser notre présence en ligne et créer des contenus engageants. Excellente opportunité d\'apprentissage et de contribution à notre mission.',
    email: 'Contact:comm@ligueenvolee.org'
  },
  {
    id: 2,
    image: '/images/espace-collabo/63ac2eed-9ce3-4108-bad4-c7cf536795da.jpg',
    title: 'Vente: Bureau et chaises de conférence (occasion)',
    category: 'Education',
    description: 'Un grand bureau de directions et 6 chaises de conférence en excellent état. Prix raisonnable. Disponibles immédiatement.',
    email: 'Contact:vente.web@lesoceanos.fr'
  },
  {
    id: 3,
    image: '/images/espace-collabo/d24228b8-f1e2-4943-a058-124e90667f40.jpg',
    title: 'Commerce et Tourisme',
    category: 'Recherche',
    description: 'Cherche bénévoles pour accompagner des enfants en difficulté scolaire une fois par semaine. Tous niveaux et matières sont concernés.',
    email: 'Contact:bene@ligueenvolee.org'
  }
];

export default function PolesAndOpportunities() {
  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* PÔLES DE CONCERTATION Section */}
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-gray-900 font-bold text-3xl mb-2">PÔLES DE CONCERTATION</h2>
              {/*<p className="text-gray-600 text-sm">Nos dernières annonces de pole</p>*/}
            </div>
            {/*<div className="flex gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Catégorie: Toutes</span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Type: Tous</span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Zone: Toutes</span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </div>
            </div>*/}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {mockPoleConcert.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden p-4">
                <div className="relative h-48">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.poleName}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="mt-4">
                  <div className="inline-block px-3 py-1 rounded-full text-sm text-white mb-3 bg-[#E05017]">
                    {item.poleName}
                  </div>
                  {item.sections.length >= 0 ? (
                    <div>
                    {item.sections && item.sections.map((section) => (
                      <div key={section.id} className="mb-4">
                        <h2 className="text-xl font-bold">{section.sectionTitle}</h2>
                        <ul className="list-disc pl-5">
                          {section.contents.map((item) => (
                            <li key={item.id} className="text-gray-700 py-1">
                              {item.content}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    </div>
                  ) : (
                    <p>not found</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button className="px-6 py-2 border border-orange-500 text-orange-500 rounded hover:bg-orange-50 transition-colors">
              VOIR PLUS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
