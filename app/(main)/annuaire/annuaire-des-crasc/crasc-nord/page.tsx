"use client";

import { useState } from 'react';
import { ImageWithFallback } from "@/lib/imageWithFallback"

interface IActivityCard {
  id: number;
  image: string;
  title: string;
  description: string;
}

const activityCards: IActivityCard[] = [
  {
    id: 1,
    image: "/images/page-annuaire-crasc/mplci.jpg",
    title: "Mouvement Pour Lutte contre l'injustice (MPLCI)",
    description: "Bacon description nes Vico. Salut adipiop unde vel qili temporis possimus lequatur adipon Salut ndo quisquam tempora possimus"
  },
  {
    id: 2,
    image: "/images/page-annuaire-crasc/fefab.jpg",
    title: "Fédération des femmes d'Anyama et de Brofodoumé (FEFAB)",
    description: "Bacon description nes Vico. Salut adipiop unde vel qili temporis possimus lequatur adipon Salut ndo quisquam tempora possimus"
  },
  {
    id: 3,
    image: "/images/page-annuaire-crasc/fondation-vie.jpg",
    title: "Fondation Vie",
    description: "Bacon description nes Vico. Salut adipiop unde vel qili temporis possimus lequatur adipon Salut ndo quisquam tempora possimus"
  },
  {
    id: 4,
    image: "/images/page-annuaire-crasc/asso-femme-soutra.jpg",
    title: "Association des Femmes Soutra",
    description: "Bacon description nes Vico. Salut adipiop unde vel qili temporis possimus lequatur adipon Salut ndo quisquam tempora possimus"
  },
  {
    id: 5,
    image: "/images/page-annuaire-crasc/5.jpg",
    title: "Nom de l'OSC",
    description: "Bacon description nes Vico. Salut adipiop unde vel qili temporis possimus lequatur adipon Salut ndo quisquam tempora possimus"
  },
  {
    id: 6,
    image: "/images/page-annuaire-crasc/6.jpg",
    title: "Nom de l'OSC",
    description: "Bacon description nes Vico. Salut adipiop unde vel qili temporis possimus lequatur adipon Salut ndo quisquam tempora possimus"
  }
];

const recentlyAdded: IActivityCard[] = [
  {
    id: 1,
    image: "/images/page-annuaire-crasc/fefab.jpg",
    title: "Nom de l'OSC",
    description: "Bacon description nes Vico. Salut adipiop unde vel qili temporis possimus lequatur adipon Salut ndo quisquam tempora possimus"
  },
  {
    id: 2,
    image: "/images/page-annuaire-crasc/rec-add-2.jpg",
    title: "Nom de l'OSC",
    description: "Bacon description nes Vico. Salut adipiop unde vel qili temporis possimus lequatur adipon Salut ndo quisquam tempora possimus"
  },
  {
    id: 3,
    image: "/images/page-annuaire-crasc/rec-add-3.jpg",
    title: "Nom de l'OSC",
    description: "Bacon description nes Vico. Salut adipiop unde vel qili temporis possimus lequatur adipon Salut ndo quisquam tempora possimus"
  }
];

const tabs = [
  { id: 0, label: 'Tous des CRASC' },
  { id: 1, label: 'CRASC Nord' },
  { id: 2, label: 'CRASC Sud' },
  { id: 3, label: 'CRASC Centre' },
  { id: 4, label: 'CRASC Ouest' },
  { id: 5, label: 'CRASC Est' }
];

const regions = [
  "Poro",
  "Tchologo",
  "Folon",
  "Bagoué",
  "Kabadougou",
  "Worodougou",
  "Béré",
];

const activities = [
  'Education',
  'Santé',
  'Agriculture'
];

export default function PageCrascNord() {
const [activeTab, setActiveTab] = useState(1);

  return (
    <section className="py-10 lg:pb-32 lg:pt-10 font-poppins">

      {/* Map Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="">
          {/* Map Section */}
          <section className="w-full h-[400px] lg:h-[500px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.295136436129!2d-3.4955533260418927!3d6.733802620685887!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc415005f79c8bf%3A0xfae5469ab23e18a7!2sCRASC%20EST!5e0!3m2!1sen!2sci!4v1767650438985!5m2!1sen!2sci"
              width="100%" height="100%" style={{ border: 0 }}
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"/>
          </section>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Organizations Count */}
          <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
            <h3 className="text-sm text-gray-900 font-bold mb-2">ORGANISATIONS DE LA SOCIÉTÉ CIVILE</h3>
            <div className="text-5xl text-[#2a591d] font-bold">394</div>
          </div>

          {/* Regions List */}
          <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
            <h3 className="text-sm text-gray-900 font-bold mb-4">LES REGIONS DU CRASC NORD</h3>
            <div className="grid grid-cols-2 gap-2">
              {regions.map((region, index) => (
                <div key={index} className="text-sm text-[#2a591d] font-bold">
                  {region}
                </div>
              ))}
            </div>
          </div>

          {/* Activities */}
          <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
            <h3 className="text-sm text-gray-900 font-bold mb-4">NOS DOMAINES D&apos;ACTIVITÉ</h3>
            <div className="space-y-2">
              {activities.map((activity, index) => (
                <div key={index} className="text-sm text-[#2a591d] font-bold">
                  {activity}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* OSC Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className='font-bold text-2xl'>OSC membres</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {activityCards.map((card) => (
            <div key={card.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-3 text-center font-bold">{card.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {card.description}
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

      {/* News section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className='font-bold text-2xl'>Nos actualités</h2>
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
