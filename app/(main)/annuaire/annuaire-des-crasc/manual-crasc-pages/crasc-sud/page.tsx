"use client";

import { useState, useEffect } from 'react';
import { ImageWithFallback } from "@/lib/imageWithFallback"
import Spinner from '@/components/ui/spinner';

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

const regions = [
  'Gbôklê',
  'Gôh',
  'Sud Comoé',
  'Grand-ponts',
  'La Mé',
  'San Pédro',
  'Nawa',
  'Lôh Djiboua',
  'Agneby Tiassa',
  'Abidjan'
];

const activities = [
  'Education',
  'Santé',
  'Agriculture'
];

/* For server fetching */
interface IOscs {
  id: string;
  name: string;
  description: string;
}

export default function PageCrascSud() {
  const [activeTab, setActiveTab] = useState(2);
  const [oscsSud, setOScsSud] = useState<IOscs[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    // Fetch all OSC for Crasc Sud
    async function fetchOscsSud() {
      const response = await fetch("http://localhost:8000/api/v1/crasc/osc-with-region-and-type?skip=0&limit=100&region_id=1", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        });
        const oscs_sud: IOscs[] = await response.json();
        console.log("Oscs fetched from API using useEffect: ", oscs_sud);
        setOScsSud(oscs_sud);
      }
      fetchOscsSud();
    }, []);
  
    return (
      <section className="py-10 lg:pb-32 lg:pt-10 font-poppins">
        <p>All OSC for Crasc Sud</p>
        <div>
          {oscsSud.map((osc) => (
            <div key={osc.id}>
              <h3>{osc.name}</h3>
            </div>
          ))}
        </div>

        {/* Map Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="">
            {/* Map Section */}
            <section className="w-full h-[400px] lg:h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15904.342598404442!2d-6.663088693746229!3d4.755139038876891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xf961300358df441%3A0x5939d6eb97423c5d!2sCRASC%20SUD!5e0!3m2!1sen!2sci!4v1765409873752!5m2!1sen!2sci"
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
              {/* Display the count of osc for Crasc Sud */}
              {oscsSud.length === 0 ? (
                <Spinner size="md" color="green" />
              ) : (
                <div className="text-5xl text-[#2a591d] font-bold">{oscsSud.length}</div>
              )}
              {/* <div className="text-5xl text-[#2a591d] font-bold">486</div> */}
            </div>
  
            {/* Regions List */}
            <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
              <h3 className="text-sm text-gray-900 font-bold mb-4">LES REGIONS DU CRASC SUD</h3>
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
  
        {/* Les OSCs du CRASC Sud */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {oscsSud.map((osc) => (
              <div key={osc.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] overflow-hidden">
                  <ImageWithFallback
                    src="/images/page-annuaire-crasc/mplci.jpg"
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
            <h2 className='font-bold text-2xl'>OSC récemment ajouté</h2>
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
