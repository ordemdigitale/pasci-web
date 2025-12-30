"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button'
import { ImageWithFallback } from '@/lib/imageWithFallback'


interface IPTFCard {
  id: number;
  image: string;
  title: string;
  description: string;
}

const ptfCards: IPTFCard[] = [
  {
    id: 1,
    image: "/images/page-annuaire-ptf/a7a90ecc-482f-4606-9e82-86fb773560aa.png",
    title: "Banque Mondiale",
    description: "Brève description du PTF. Sint aliquip nulla ad cillum ex eiusmod proident cupidatat aliqua."
  },
  {
    id: 2,
    image: "/images/page-annuaire-ptf/UE.jpg",
    title: "Union Européenne",
    description: "Brève description du PTF. Sint aliquip nulla ad cillum ex eiusmod proident cupidatat aliqua."
  },
  {
    id: 3,
    image: "/images/page-annuaire-ptf/29d51a2a-3756-44db-9e75-3d8c61652f4d.png",
    title: "UNICEF",
    description: "Brève description du PTF. Sint aliquip nulla ad cillum ex eiusmod proident cupidatat aliqua."
  },
  {
    id: 4,
    image: "/images/page-annuaire-ptf/2746342a-7359-4f73-898a-3b8fa8d761f9.png",
    title: "USAID",
    description: "Brève description du PTF. Sint aliquip nulla ad cillum ex eiusmod proident cupidatat aliqua."
  },
  {
    id: 5,
    image: "/images/page-annuaire-ptf/f8c9521c-aa8e-4a00-bb7b-071434afdbf0.png",
    title: "AFD",
    description: "Brève description du PTF. Sint aliquip nulla ad cillum ex eiusmod proident cupidatat aliqua."
  },
  {
    id: 6,
    image: "/images/page-annuaire-ptf/694553e7-88e6-4485-8e81-d88acd6ca331.png",
    title: "GIZ",
    description: "Brève description du PTF. Sint aliquip nulla ad cillum ex eiusmod proident cupidatat aliqua."
  }
];

const recentlyAdded: IPTFCard[] = [
  {
    id: 1,
    image: "/images/page-annuaire-ptf/8d2511a1-f70c-4d1f-97b8-6ff62895cf30.jpg",
    title: "KOICA",
    description: "Bacon description nes Vico. Salut adipiop unde vel qili temporis possimus lequatur adipon Salut ndo quisquam tempora possimus"
  },
  {
    id: 2,
    image: "/images/page-annuaire-ptf/cf750268-9a0a-40dc-8d8c-c5f5d029cb3b.png",
    title: "PNUD",
    description: "Bacon description nes Vico. Salut adipiop unde vel qili temporis possimus lequatur adipon Salut ndo quisquam tempora possimus"
  },
  {
    id: 3,
    image: "/images/page-annuaire-ptf/8d4eaaa8-44ac-46ce-b966-2e0f4fa89570.png",
    title: "JICA",
    description: "Bacon description nes Vico. Salut adipiop unde vel qili temporis possimus lequatur adipon Salut ndo quisquam tempora possimus"
  }
];

export default function PageAnnuairePTF() {
  return (
    <section className="py-10 lg:pb-32 lg:pt-10 font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-[#2a591d] font-bold text-4xl text-center mx-auto w-180 pb-[50px]">Annuaire des Partenaires Techniques et Financiers (PTF)</p>
      </div>
      <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 p-8 mb-10 grid lg:grid-cols-2 gap-12">
        {/* Left content */}
        <div className="">
          <h2 className="text-[#E05017] font-bold text-4xl">Ensemble, nous pouvons renforcer l&apos;impact</h2>
          <p className="text-gray-600 text-md max-w-xl mt-6">
            Notre communauté open source est dédiée à la promotion de l'innovation et à la collaboration à travers des projets transformateurs. Nous croyons au pouvoir du partage des connaissances et des ressources pour résoudre des défis complexes.
          </p>
          <p className='font-bold text-2xl mt-6'>Notre Mission</p>
          <p className="text-gray-600 text-md max-w-xl mt-2">
            Nous nous engageons à créer des solutions durables et accessibles qui ont un impact positif sur le monde. En favorisant un environnement inclusif, nous permettons aux développeurs et aux contributeurs de tous horizons de s'épanouir, en créant des outils et des technologies qui façonnent un avenir meilleur pour tous.
          </p>
        </div>
        
        {/* Right content */}
        <div className="space-y-12">
          <div className="">
            <ImageWithFallback
              src="/images/page-annuaire-ptf/5b35a95d-42c6-4b6b-8747-0ad82731174d.jpg"
              alt="image"
              className="w-full h-[300px] object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Activity Cards Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {ptfCards.map((ptf) => (
            <div key={ptf.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src={ptf.image}
                  alt={ptf.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-3 text-center font-bold">{ptf.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {ptf.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Buttons */}
        <div className="flex flex-wrap gap-3 justify-end">
          <button
            className="px-6 py-2 border border-[#E05107] text-[#E05107] rounded-lg transition-colors"
          >
            Voir plus
          </button>
        </div>
      </div>

      {/* Recently added section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className='font-bold text-2xl'>PTF récemment ajoutés</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentlyAdded.map((card) => (
            <div key={card.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-3">{card.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
