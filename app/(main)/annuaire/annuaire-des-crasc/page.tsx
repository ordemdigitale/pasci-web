/* Page d'accueil ou Layout pour les régions CRASC */
"use client";

import { useState, useEffect } from 'react';
import { ImageWithFallback } from "@/lib/imageWithFallback";
import { fetchAllCrasc } from "@/lib/fetch-crasc";
import { ICrasc, IKeyStats } from "@/types/api.types";

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
  { id: 1, label: 'CRASC Sud' },
  { id: 2, label: 'CRASC Centre' },
  { id: 3, label: 'CRASC Nord' },
  { id: 4, label: 'CRASC Ouest' },
  { id: 5, label: 'CRASC Est' }
];

const activities = [
  "L'Assemblée Générale",
  "Le Conseil d'Administration",
  "La Direction Exécutive",
  "Délégations Régionales",
  "Le Commissariat Aux Comptes"
];

export const domainesIntervention = [
  "Gouvernance",
  "Développement durable",
  "Développement local",
  "Bien-être social",
  "Cohésion social"
];


export default function PageAnnuaireCrasc() {
  const [keyStats, setKeyStats] = useState<IKeyStats[] | null>([]);
  const [crascData, setCrascData] = useState<ICrasc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch CRASC data on component mount
   useEffect(() => {
    const fetchCrascData = async () => {
      try {
        const crasc = await fetchAllCrasc();
        console.log("Page annuaire des CRASC: ", crasc);
        setCrascData(crasc);
      }
      catch (error) {
        console.error("Error fetching CRASC regions data: ", error);
      }
    }
    fetchCrascData();
  }, []);

  // fetch key stats data
  useEffect(() => {
    const fetchKeyStatsData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/key-stats`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }
        const result = await response.json();
        setKeyStats(result);
        console.log("Key Stats ", keyStats);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchKeyStatsData();
  }, []);

  const firstKeyStat = keyStats?.find(item => item.name === "osc");

  return (
    <section className="py-10 lg:pb-32 lg:pt-10 font-poppins">

      {/* Statistics Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Organizations Count */}
          <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
            <h3 className="text-sm text-gray-900 font-bold mb-2">ORGANISATIONS DE LA SOCIÉTÉ CIVILE</h3>
            <div className="text-5xl text-[#2a591d] font-bold">{firstKeyStat?.number}</div>
          </div>

          {/* Regions List */}
          <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
            <h3 className="text-sm text-gray-900 font-bold mb-4">LES 5 CRASC</h3>
            <div className="space-y-2">
              {crascData.map((crasc) => (
                <div key={crasc.id} className="text-sm text-[#2a591d] font-bold">
                  {crasc.name}
                </div>
              ))}
            </div>
          </div>

          {/* Domaines d'intervention */}
          <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
            <h3 className="text-sm text-gray-900 font-bold mb-4">NOS DOMAINES D&apos;INTERVENTION</h3>
            <div className="space-y-2">
              {domainesIntervention.map((domaine, index) => (
                <div key={index} className="text-sm text-[#2a591d] font-bold">
                  {domaine}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section OSC membres */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-2xl">OSC membres</h2>
        </div>
        <p className="text-2xl text-center pb-8">Aucune OSC ajoutée pour le moment.</p>

        {/* Load More Buttons */}
        {/* <div className="flex flex-wrap gap-3 justify-end">
          <button
            className="px-6 py-2 border border-[#E05107] text-[#E05107] rounded-lg transition-colors"
          >
            Voir plus
          </button>
        </div> */}
      </div>

      {/* Section actualités des Oscs */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-2xl">Nos actualités</h2>
        </div>
        <p className="text-2xl text-center pb-8">Aucune actualité ajoutée pour le moment.</p>
      </div>

    </section>
  )
}
