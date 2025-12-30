"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button'
import { ImageWithFallback } from '@/lib/imageWithFallback'
import {
  Search,
  ChevronDown,
  Briefcase,
  MapPin
} from "lucide-react";

interface IJobItem {
  id: number;
  title: string;
  description: string;
  location: string;
  type: string;
}

const jobOffers: IJobItem[] = [
  {
    id: 1,
    title: 'Développeur Full Stack Senior',
    description: 'Rejoignez notre équipe dynamique pour concevoir et développer des applications web complexes. Vous serez responsable de l\'architecture et de l\'implémentation des solutions front-end et back-end, en utilisant les dernières technologies.',
    location: 'Paris, France',
    type: 'CDI',
  },
  {
    id: 2,
    title: 'Chef de Projet IT',
    description: 'En tant que Chef de Projet IT, vous gérerez le cycle de vie complet de projets technologiques, de la planification à la livraison. Vous travaillerez en étroite collaboration avec les équipes techniques et les parties prenantes pour assurer le succès des projets.',
    location: 'Lyon, France',
    type: 'CDI',
  },
  {
    id: 3,
    title: 'Stagiaire en Marketing Digital',
    description: 'Nous recherchons un stagiaire motivé pour nous aider à développer et à exécuter nos stratégies de marketing digital. Une opportunité unique d\'apprendre et de contribuer à des campagnes innovantes.',
    location: 'Bordeaux, France',
    type: 'Stage',
  },
  {
    id: 4,
    title: 'Analyste de Données Junior',
    description: 'Contribuez à l\'analyse de grandes quantités de données pour identifier des tendances et des insights exploitables. Vous travaillerez avec des outils d\'analyse avancés et présenterez vos conclusions aux équipes opérationnelles.',
    location: 'Toulouse, France',
    type: 'CDD',
  },
  {
    id: 5,
    title: 'Designer UX/UI',
    description: 'Créez des expériences utilisateur intuitives et esthétiques pour nos produits numériques. Vous serez en charge de la recherche utilisateur, de la conception de wireframes, de prototypes et de l\'interface finale.',
    location: 'Nantes, France',
    type: 'CDI',
  },
  {
    id: 6,
    title: 'Ingénieur DevOps',
    description: 'Optimisez et maintenez nos infrastructures de déploiement et d\'intégration continue. Vous contribuerez à l\'automatisation des processus et à l\'amélioration de la fiabilité de nos systèmes.',
    location: 'Lille, France',
    type: 'CDI',
  },
];

const faqCategories = [
  { id: 1, title: 'Comment puis-je postuler à une offre d\'emploi ?', answer: "Pour postuler à une offre d'emploi, veuillez consulter les offres disponibles sur notre site et cliquez sur le bouton Postuler", isOpen: false },
  { id: 2, title: 'Quel est le processus de recrutement chez PASCI ?', answer: "Le processus de recrutement chez PASCI comprend plusieurs étapes : l\'analyse de votre profil, un entretien technique, un entretien RH et enfin une proposition d\'embauche.", isOpen: false },
  { id: 3, title: 'Puis-je envoyer une candidature spontanée ?', answer: "Oui, vous pouvez envoyer une candidature spontanée à travers notre formulaire en ligne ou par email à contact@pasci.fr.", isOpen: false },
  { id: 4, title: 'Proposez-vous des stages ou des alternances ?', answer: "Oui, PASCI propose des stages et des alternances dans divers domaines techniques et administratifs. Consultez nos offres spécifiques pour plus d'informations.", isOpen: false },
  { id: 5, title: 'Comment savoir si ma candidature a été reçue ?', answer: "Vous recevrez un email de confirmation dès que votre candidature aura été reçue. Si vous ne recevez pas cet email dans les 24 heures suivantes, veuillez nous contacter.", isOpen: false },
  { id: 6, title: 'Quelles sont les valeurs du projet PASCI ?', answer: "Les valeurs du projet PASCI incluent l'innovation technologique, la collaboration interdisciplinaire et le respect de l'environnement.", isOpen: false }
];

export default function PageOffreEmploi() {
  const [openFaqs, setOpenFaqs] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  /* Categories data */
  const categories = [
    "Gestion de projet",
    "Administration",
    "Développement",
    "Marketing",
    "Desing",
    "Ressources Humaines"
  ];

  const toggleFaq = (id: number) => {
    setOpenFaqs(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="mx-auto pt-12 pb-6 font-poppins">
      <div className="max-w-5xl mx-auto sm:px-6 lg:px-6 p-8 mb-10 grid lg:grid-cols-2 gap-6">
        {/* Left content */}
        <div className="">
          <h2 className="text-[#2a591d] font-bold text-4xl">Rejoignez l'équipe</h2>
          <p className="text-gray-600 text-md max-w-xl mt-6">
            Découvrez les opportunités de carrière passionnantes et faites partie de notre mission de transformer l'avenir. Chez PASCI, nous construisons des solutions innovantes avec des talents exceptionnels.
          </p>
        </div>
        
        {/* Right content */}
        <div className="space-y-12">
          <div className="">
            <ImageWithFallback
              src="/images/offre-emploi-page/4c9598b7-96fa-4ba1-bae8-5be6202c4bd6.jpg"
              alt="image"
              className="w-full h-[300px] object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center mb-2">
        <h2 className="text-gray-900 font-bold text-3xl">Nos Offres d'Emploi</h2>
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
                <option value="">Type de contrat</option>
                <option value="type1">Tous</option>
                <option value="type2">CDI</option>
                <option value="type3">CDD</option>
                <option value="type4">Stage</option>
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

      <div className="max-w-5xl mx-auto">
        {/* Section offres d'emploi */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {jobOffers.map((job) => (
              <div key={job.id} className="p-6 bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="">
                  <h4 className="font-bold text-lg mb-2">{job.title}</h4>
                  <p className="text-gray-600 text-sm mb-4">{job.description.substring(0, 200)}...</p>
                  <div className="flex flex-row items-center gap-2 text-gray-700 text-sm mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className='text-sm'>{job.location}</span>
                  </div>
                  
                  <div className="flex flex-row items-center gap-2 text-gray-700 text-sm">
                    <Briefcase className="w-4 h-4" />
                    <span className='inline-block px-3 py-1 rounded-full text-xs text-white bg-[#E05017]'>{job.type}</span>
                  </div>
                </div>
                <Button className="w-full rounded-xl bg-[#E05017] hover:bg-orange-600 text-white mt-6">Postuler</Button>
              </div>
            ))}
          </div>
        </div>

        {/* Section FAQ */}
        <div>
          <div className="flex justify-center items-center mb-8">
            <h2 className="text-gray-900 font-bold text-3xl mb-2">Foire Aux Questions</h2>
          </div>
          {/* search bar */}
          <div className="relative max-w-3xl mx-auto mb-10">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-sm w-full pl-12 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent"
            />
          </div>

          <div className="max-w-4xl mx-auto mb-26">
            {/* FAQ content */}
            {faqCategories.map((category) => (
              <div key={category.id} className="border-b border-b-gray-300 mb-4">
                <button
                  onClick={() => toggleFaq(category.id)}
                  className="w-full flex items-center justify-between pb-4 text-left cursor-pointer"
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
                    {category.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
