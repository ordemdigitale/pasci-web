/* Page d'accueil ou Layout pour les régions CRASC */
//"use client";

//import { useState, useEffect } from 'react';
import { ImageWithFallback } from "@/lib/imageWithFallback";
import { fetchAllCrascRegions } from "@/lib/fetch-crasc";

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
  "L'Assemblée Générale",
  "Le Conseil d'Administration",
  "La Direction Exécutive",
  "Délégations Régionales",
  "Le Commissariat Aux Comptes"
];


export default async function PageAnnuaireCrasc() {
  const allCrascRegions = await fetchAllCrascRegions();
  console.log("All CRASC Regions Data: ", allCrascRegions);
  //const [crascRegions, setCrascRegions] = useState<any[]>([]);

  // Fetch CRASC regions data on component mount
/*   useEffect(() => {
    const fetchData = async () => {
      try {
        const regionsData = await fetchAllCrascRegions();
        console.log(regionsData);
        setCrascRegions(regionsData);
      }
      catch (error) {
        console.error("Error fetching CRASC regions data: ", error);
      }
    }
    fetchData();
  }, []); */

  return (
    <section className="py-10 lg:pb-32 lg:pt-10 font-poppins">

      {/* Statistics Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Organizations Count */}
          <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
            <h3 className="text-sm text-gray-900 font-bold mb-2">ORGANISATIONS DE LA SOCIÉTÉ CIVILE</h3>
            <div className="text-5xl text-[#2a591d] font-bold">3176</div>
          </div>

          {/* Regions List */}
          <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
            <h3 className="text-sm text-gray-900 font-bold mb-4">LES 5 CRASC</h3>
            <div className="space-y-2">
              {allCrascRegions.map((crasc) => (
                <div key={crasc.order} className="text-sm text-[#2a591d] font-bold">
                  {crasc.name}
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
