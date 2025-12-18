"use client";

import { useState } from 'react';
import { Mail, ChevronDown } from 'lucide-react';
import { ImageWithFallback } from "@/lib/imageWithFallback"
import {
  Search,
  Calendar,
  Grid3x3,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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

const jobOffers: CardItem[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1762952805560-130ccc74c3fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwc3RhZ2UlMjBzZXR1cHxlbnwxfHx8fDE3NjQxNjkwNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Offre de stage: Chargé(e) de communication digitale',
    category: 'Stage',
    description: 'Dynamiser notre présence en ligne et créer des contenus engageants. Excellente opportunité d\'apprentissage et de contribution à notre mission.',
    email: 'Contact:comm@ligueenvolee.org'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1709715357520-5e1047a2b691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmclMjB0ZWFtfGVufDF8fHx8MTc2NDE0MTU1NHww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Appel à candidatures: Experts en développement local',
    category: 'Appel à candidatures',
    description: 'Nous recherchons des consultants expérimentés pour évaluer des projets dans le cadre du FASEP. Expérience préalable exigée dans',
    email: 'Contact:rh.oceanos@oscer.org'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1669286211114-9f17251fd0e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGZvbGRlcnMlMjBzdGFja3xlbnwxfHx8fDE3NjQxNjkwNzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Recherche: Bénévoles pour soutien scolaire',
    category: 'Recherche',
    description: 'Cherche d\'auteur ! Cherche bénévoles pour accompagner des enfants en difficulté scolaire une fois par semaine. Tous niveaux et matières sont',
    email: 'Contact:bene@ligueenvolee.org'
  }
];

const faqCategories = [
  { id: 1, title: 'Inscriptions', isOpen: false },
  { id: 2, title: 'Formalisation OSC', isOpen: false },
  { id: 3, title: 'Financement', isOpen: false },
  { id: 4, title: 'Gestion de projet', isOpen: false }
];

const frequentQuestions = [
  'Quel est le rôle du RASCO ?',
  'Quelles sont les missions du RASCO ?',
  'Comment s\'inscrire sur votre RASCO ?',
  'Peut-on trouver un financement ?',
  'Comment soumettre une demande de financement ?',
  'Est-ce qu\'il existe une catégorie pour trouvetiers ?'
];

export default function OffreEmploiFAQ() {
  const [openFaqs, setOpenFaqs] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

   /* Categories data */
  const categories = [
    "Rapport",
    "Guide",
    "Étude",
    "Manuel",
    "PV",
    "Infographie",
    "Politique",
    "Récit",
    "Plan",
  ];

  const toggleFaq = (id: number) => {
    setOpenFaqs(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="py-10 lg:pb-32 lg:pt-10 px-4 bg-gray-50">
      <h2 className="text-gray-900 font-bold text-3xl text-center mb-2">Nos Offres d'Emploi</h2>

      {/* Search bar + filters area*/}
      <div className="p-6 mb-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="grid grid-cols-6 md:grid-cols-6 gap-4 items-end">
            {/* search bar */}
            <div className="relative col-span-3">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un emploi..."
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
                  Sélectionner une catégorie
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
                <option value="">Sélectionner un type</option>
                <option value="type1">Type 1</option>
                <option value="type2">Type 2</option>
                <option value="type3">Type 3</option>
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
                <option value="">Sélectionner une date</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">

        {/* OFFRES D'EMPLOI Section */}
        <div className="mb-20">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {jobOffers.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="relative h-48">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-gray-800 mb-2">{item.title}</h4>
                  <div className="inline-block px-3 py-1 rounded text-xs text-white mb-3 bg-[#E05017]">
                    {item.category}
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  <div className="flex items-center gap-2 text-gray-700 text-sm">
                    <Mail className="w-4 h-4" />
                    <span>{item.email}</span>
                  </div>
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

        {/* FOIRE AUX QUESTIONS Section */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-gray-900 font-bold text-3xl">Foire Aux Questions</h2>
            <button className="px-6 py-3 text-white rounded bg-[#E05017]">
              Poser une question
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - FAQ Categories */}
            <div className="space-y-3">
              {faqCategories.map((category) => (
                <div key={category.id} className="bg-white rounded-lg shadow-sm">
                  <button
                    onClick={() => toggleFaq(category.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-800">{category.title}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-600 transition-transform ${
                        openFaqs.includes(category.id) ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaqs.includes(category.id) && (
                    <div className="p-4 pt-0 text-gray-600 text-sm">
                      Contenu de la section {category.title}...
                    </div>
                  )}
                </div>
              ))}
              
              <div className="pt-4">
                <button className="px-6 py-2 border border-orange-500 text-orange-500 rounded hover:bg-orange-50 transition-colors">
                  VOIR PLUS
                </button>
              </div>
            </div>

            {/* Right Column - Frequent Questions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-gray-800 mb-6">Questions fréquentes</h3>
              <ul className="space-y-4">
                {frequentQuestions.map((question, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-orange-500 mt-1">›</span>
                    <a href="#" className="text-gray-700 hover:text-orange-500 transition-colors text-sm">
                      {question}
                    </a>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8">
                <button className="w-full py-3 text-white rounded bg-[#E05017]">
                  Voir toutes les FAQ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
