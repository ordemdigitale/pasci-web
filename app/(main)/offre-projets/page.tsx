"use client";

import { useState } from 'react';
import { ImageWithFallback } from "@/lib/imageWithFallback";
import {
  CircleCheckBig,
  Handshake,
  DollarSign,
  Search
} from 'lucide-react';
import { offreProjet } from '@/localdata/offreProjetData';
import { Button } from '@/components/ui/button';

  /* Categories data */
  const categories = [
    "Gestion de projet",
    "Administration",
    "Développement",
    "Marketing",
    "Desing",
    "Ressources Humaines"
  ];

export default function PageOffreProjet() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  return (
    <section className="py-10 lg:pb-32 lg:pt-10 font-poppins">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-200 rounded-lg p-8 mb-10 bg-[#f0f9ff] grid lg:grid-cols-2 gap-12">
        {/* Left content */}
        <div className="">
          <h2 className="font-bold text-4xl text-[#2a591d] leading-tight">Offre de projets</h2>
          <p className="text-gray-600 text-md max-w-xl mt-6">
            Nous mettons en lumière des initiatives à fort impact social portées par les Organisations de la Société Civile en Côte d’Ivoire. Elle constitue un pont entre les OSC et les partenaires techniques et financiers, en facilitant l’accès à des projets structurés, transparents et alignés sur les priorités de développement durable.
          </p>
        </div>
        
        {/* Right content */}
        <div className="space-y-12">
          <div className="">
            <ImageWithFallback
              src="/images/process-formalisation-page.png"
              alt="image"
              className="w-full h-[300px] object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Search bar + filters area*/}
      <div className="p-6 mb-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="grid grid-cols-6 md:grid-cols-6 gap-4 items-end">
            {/* search bar */}
            <div className="relative col-span-3">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un projet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-sm w-full pl-12 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent"
              />
            </div>

            {/* filters */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(e.target.value)
                }
                className="text-xs w-full px-2 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent"
              >
                <option value="">
                  Catégorie
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedType}
                onChange={(e) =>
                  setSelectedType(e.target.value)
                }
                className="text-xs w-full px-2 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent"
              >
                <option value="">Type</option>
                <option value="type1">Tous</option>
                {/* <option value="type2">CDI</option>
                <option value="type3">CDD</option>
                <option value="type4">Stage</option> */}
              </select>
            </div>

            <div>
              <select
                value={selectedDate}
                onChange={(e) =>
                  setSelectedDate(e.target.value)
                }
                className="text-xs w-full px-2 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent"
              >
                <option value="">Date</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>

          </div>
        </div>
      </div>

      {/* Projets disponibles */}
      <div className="max-w-5xl mx-auto">
        <h2 className='font-bold'>Projets disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {offreProjet.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden p-4 relative">
              <div className="relative h-48">
                <ImageWithFallback
                  src={item.image}
                  alt={item.nom}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="mt-4">    
                <div key={item.nom} className="mb-4">
                  <h2 className="text-xl font-bold">{item.nom}</h2>
                </div>
              </div>
              <div className='flex flex-col gap-2 mb-8'>
                <p><span className="font-bold">OSC:</span> {item.osc}</p>
                <p><span className="font-bold">Domaine:</span> {item.domaine}</p>
                <p><span className="font-bold">Zone:</span> {item.zone}</p>
                <p><span className="font-bold">Durée:</span> {item.durée}</p>
                <p><span className="font-bold">Budget:</span> {item.budget}</p>
                <p><span className="font-bold">Objectif:</span> {item.objectif}</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <Button className="border border-transparent hover:border-[#E05017] text-white hover:text-[#E05017] bg-white hover:bg-transparent bg-[#E05017] rounded-lg px-6">
                  Voir le projet
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pourquoi être membre du CRASC ? */}
      <div className="py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 rounded-lg py-8 space-y-6 text-center shadow-md border border-gray-200">
          <p className="font-bold text-4xl text-black">Pourquoi être membre du CRASC ?</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex flex-col items-center justify-between gap-2">
              <div className="p-2 bg-orange-100 rounded-full">
                <CircleCheckBig size={24} color="#E05017" />
              </div>
              <h2 className="font-bold">Visibilité accrue</h2>
              <p>
                Augmentez la portée de vos projets auprès d'un large réseau de partenaires et de financeurs potentiels, au niveau local et international.
              </p>
            </div>

            <div className="flex flex-col items-center justify-between gap-2">
              <div className="p-2 bg-orange-100 rounded-full">
                <DollarSign size={24} color="#E05017" />
              </div>
              <h2 className="font-bold">Accès aux ressources</h2>
              <p>
                Bénéficiez d'une plateforme centralisée pour soumettre vos initiatives et trouver les ressources nécessaires à leur concrétisation.
              </p>
            </div>
            
            <div className="flex flex-col items-center justify-between gap-2">
              <div className="p-2 bg-orange-100 rounded-full">
                <Handshake size={24} color="#E05017" />
              </div>
              <h2 className="font-bold">Partenariats stratégiques</h2>
              <p>
                Connectez-vous avec des organisations partageant les mêmes valeurs et construisez des collaborations solides pour un impact plus grand.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}
