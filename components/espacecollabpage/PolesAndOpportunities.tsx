"use client";

import { useState } from 'react';
import { Mail, ChevronDown } from 'lucide-react';
import { ImageWithFallback } from "@/lib/imageWithFallback"

interface CardItem {
  id: number;
  image: string;
  title: string;
  category: string;
  description: string;
  email: string;
}

const consultationPoles: CardItem[] = [
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
    image: 'https://images.unsplash.com/photo-1717414477663-a5f5384499b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwcm9vbSUyMGNoYWlyc3xlbnwxfHx8fDE3NjQxNjkwNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Vente: Bureau et chaises de conférence (occasion)',
    category: 'Vente',
    description: 'Un grand bureau de directions et 6 chaises de conférence en excellent état. Prix raisonnable. Disponibles immédiatement.',
    email: 'Contact:vente.web@lesoceanos.fr'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1669286211114-9f17251fd0e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGZvbGRlcnMlMjBzdGFja3xlbnwxfHx8fDE3NjQxNjkwNzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Recherche: Bénévoles pour soutien scolaire',
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

export default function PolesAndOpportunities() {
  const [openFaqs, setOpenFaqs] = useState<number[]>([]);

  const toggleFaq = (id: number) => {
    setOpenFaqs(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* PÔLES DE CONCERTATION Section */}
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-gray-900 font-bold text-3xl mb-2">PÔLES DE CONCERTATION</h2>
              <p className="text-gray-600 text-sm">Nos dernières annonces de pole</p>
            </div>
            <div className="flex gap-3 text-sm">
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
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {consultationPoles.map((item) => (
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

        {/* OFFRES D'EMPLOI Section */}
        <div className="mb-20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-gray-900 font-bold text-3xl">Offres d'emploi</h2>
            <button className="px-6 py-3 text-white rounded bg-[#E05017]">
              Publier une annonce
            </button>
          </div>

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
