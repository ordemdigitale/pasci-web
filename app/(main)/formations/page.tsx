"use client";

import { useState } from 'react';
import { Search, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button'
import { ImageWithFallback } from "@/lib/imageWithFallback"
import illustrationImage from 'figma:asset/e64e574db940281630010d12290bbd99ac5f9f9e.png';

interface Program {
  id: number;
  image: string;
  title: string;
  description: string;
  duration?: string;
  type: 'formation' | 'tutorial' | 'webinar' | 'interview' | 'podcast' | 'conference' | 'meditation';
}

const programs: Program[] = [
  {
    id: 1,
    image: "/images/page-formation/423dccc165037227487e63cd4a3c3daac3c77689b23dab692da976de13b1cc9f.png",
    title: 'Notions essentielles de comptabilité financière',
    description: 'Découvrez les principes fondamentaux et les méthodologies Agile pour optimiser la gestion de vos projets et améliorer la collaboration en équipe.',
    duration: '6 semaines',
    type: 'formation'
  },
  {
    id: 2,
    image: '/images/page-formation/325089b925013d8e1c19e49d60c060af5b15d40202bdaef5187ed1e44c67cedc.png',
    title: 'Pilotage efficace des ressources humaines',
    description: 'Au-delà des aspects administratifs, les ressources humaines jouent un rôle stratégique dans la performance et la pérennité des organisations.',
    duration: '4 semaines',
    type: 'formation'
  },
  {
    id: 3,
    image: '/images/page-formation/941bc7751a5e05e80271f1fdd72f88921040ea5d290167224c8cc6a973ab760d.png',
    title: 'Gestion juridique et administrative',
    description: 'Au-delà de la conformité, cette fonction joue un rôle clé dans la structuration et la pérennité des organisations. Elle facilite la prise de décision.',
    duration: '5 semaines',
    type: 'formation'
  },
  {
    id: 4,
    image: '/images/page-formation/325089b925013d8e1c19e49d60c060af5b15d40202bdaef5187ed1e44c67cedc.png',
    title: 'Tutoriel Vidéo: Créer un Portfolio Professionnel',
    description: 'Suivez ce tutoriel détaillé pour construire votre portfolio professionnel en ligne et présenter efficacement vos compétences.',
    duration: '45 min',
    type: 'tutorial'
  },
  {
    id: 5,
    image: "/images/page-formation/0b84a30a040801f8886da2a298f7333b7d390fa11d6ff0950895cc6356a72b41.png",
    title: 'Webinaire: Les Tendances IA en 2024',
    description: "Explorez les dernières avancées et les prévisions pour l'intelligence artificielle en 2024, avec des experts du domaine.",
    duration: '1h 30min',
    type: 'webinar'
  },
  {
    id: 6,
    image: "/images/page-formation/f8ee35757b6c218aa4724bfdee2fa16fd2ec88a459ab7a9fc9de5402ade555eb.png",
    title: 'Interview: Le Futur du Travail à Distance',
    description: "Écoutez des leaders d'opinion discuter des défis et des opportunités du travail à distance dans le monde post-pandémique.",
    duration: '30 min',
    type: 'interview'
  },
  {
    id: 7,
    image: "/images/page-formation/595dfe83bf5a4b4ad09f8085f8ca47cad6958a0c0b343a4a071badac87db203f.png",
    title: 'Podcast: Gérer le Stress au Travail',
    description: 'Des techniques et des conseils pratiques pour identifier, prévenir et gérer le stress en milieu professionnel.',
    duration: '25 min',
    type: 'podcast'
  },
  {
    id: 8,
    image: "/images/page-formation/387d668c67b16d2201d39b5519f434cd019a4cdab4c7fd9f99c3456c0d6d40ec.png",
    title: 'Conférence Audio: Leadership et Motivation',
    description: "Écoutez une conférence inspirante sur les qualités d'un bon leader et les stratégies pour motiver son équipe.",
    duration: '1h',
    type: 'conference'
  },
  {
    id: 9,
    image: "/images/page-formation/506ee6b1647fb568e2b4112507471561d4c817eec4dd9fb76a49a7473b19b4f5.png",
    title: 'Méditation Guidée pour la Concentration',
    description: "Une séance de méditation guidée pour améliorer votre concentration et votre clarté mentale.",
    duration: '15 min',
    type: 'meditation'
  }
];

const sidebarItems = [
  { id: 1, label: 'Santé', active: true },
  { id: 2, label: 'Jeunesse', active: false },
  { id: 3, label: 'Politique', active: false },
  { id: 4, label: 'Agriculture', active: false },
  { id: 5, label: 'Éducation', active: false },
  { id: 6, label: 'Suivi-évaluation', active: false }
];

export default function FormationsPage() {
  const [activeCategory, setActiveCategory] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [visiblePrograms, setVisiblePrograms] = useState(6);

  const loadMorePrograms = () => {
    setVisiblePrograms(prev => Math.min(prev + 3, programs.length));
  };

  return (
    <section className="py-16 px-4 bg-white font-poppins">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {sidebarItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setActiveCategory(item.id)}
                  className={`w-full text-left px-6 py-4 transition-colors ${
                    item.active
                      ? 'text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  } ${index === 0 ? 'rounded-t-lg' : ''}`}
                  style={item.active ? { backgroundColor: '#E05017' } : {}}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-sm">{index + 1}</span>
                    <span>{item.label}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header Section */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-200 rounded-lg p-8 mb-10 bg-[#f0f9ff] grid lg:grid-cols-2 gap-12">
            {/* Left content */}
            <div className="">
              <h2 className="text-[#2a591d] font-bold text-4xl">Explorez nos programmes de formation</h2>
              <p className="text-gray-600 text-md max-w-xl mt-6">
                Découvrez une bibliothèque complète de cours, formations, vidéos, audios et tutoriels conçus pour enrichir vos connaissances et développer vos compétences.
              </p>

            </div>
            
            {/* Right content */}
            <div className="space-y-12">
              <div className="">
                <ImageWithFallback
                  src="/images/page-formation/0cd2210f-3c2d-4036-9e65-e993265c441c.jpg"
                  alt="image"
                  className="w-full h-[300px] object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une formation (ex: Rédaction d'appel à Projets, Rédaction de statut, Formalisation...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

            {/* Programs Section */}
            <div className="mb-8">
              <h3 className="text-gray-800 text-3xl font-bold my-6">Programmes de Formations</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {programs.slice(0, visiblePrograms).map((program) => (
                  <div
                    key={program.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-48">
                      <ImageWithFallback
                        src={program.image}
                        alt={program.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <h4 className="text-gray-800 text-xl font-semibold mb-3">{program.title}</h4>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {program.description}
                      </p>
                      
                      <button
                        className="px-4 py-2 text-white rounded-full text-sm"
                        style={{ backgroundColor: '#E05107' }}
                      >
                        Voir plus
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Buttons */}
              <div className="flex flex-wrap gap-3 justify-end">
                {visiblePrograms < programs.length && (
                  <>
                    <button className="px-6 py-2 border border-[#E05107] text-[#E05107] rounded-lg transition-colors">
                      Sélectionner un thème
                    </button>
                    <button
                      onClick={loadMorePrograms}
                      className="px-6 py-2 border border-[#E05107] text-[#E05107] rounded-lg transition-colors"
                    >
                      Voir plus
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Prêt à se faire accompagner */}
        <div className="py-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#E05017] rounded-lg py-8 space-y-6 text-center text-white">
            <p className="font-bold text-4xl">Prêt à se faire accompagner ?</p>
            <p className="max-w-2xl mx-auto">Contactez-nous dès aujourd'hui pour discuter de vos besoins et découvrir comment nous pouvons vous aider à atteindre vos objectifs.</p>
            <Button className="border border-transparent hover:border-white text-[#E05017] hover:text-white bg-white hover:bg-transparent rounded-lg px-6">
              Prendre Contact
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
