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
    image: 'https://images.unsplash.com/photo-1554103210-26d928978fb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGlja3klMjBub3RlcyUyMGNvbG9yZnVsfGVufDF8fHx8MTc2NDE3NjIwNnww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Comptabilité et finances',
    description: 'Découvrez les principes fondamentaux de la comptabilité, des techniques de gestion financière et les outils pour améliorer la santé financière de votre organisation.',
    duration: '6 semaines',
    type: 'formation'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1603351130949-476794ec3dff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb2RpbmclMjBzY3JlZW58ZW58MXx8fHwxNzY0MTE2OTA0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Ressources Humaines',
    description: 'Apprenez à construire des pratiques RH modernes et efficaces : du recrutement à la gestion des talents en passant par la culture d\'entreprise.',
    duration: '4 semaines',
    type: 'formation'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1717700299591-470e043edc9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXR3b3JrJTIwZGlhZ3JhbSUyMGJsdWV8ZW58MXx8fHwxNzY0MDgxNTUyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Juridique et administratif',
    description: 'Maîtrisez les contrats, les bases du droit, stratégies réglementaires, la navigation dans les processus administratifs, et la conformité organisationnelle.',
    duration: '5 semaines',
    type: 'formation'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1758599879065-46fd59235166?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHR1dG9yaWFsJTIwc2NyZWVufGVufDF8fHx8MTc2NDEzNjU1OXww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Tutoriel Vidéo : Créer un Portfolio Professionnel',
    description: 'Suivez ce tutoriel détaillé pour construire votre portfolio professionnel en ligne et présenter efficacement vos compétences.',
    duration: '45 min',
    type: 'tutorial'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1617791160536-598cf32026fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFpbiUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY0MTc2MjA3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Webinaire : Les Tendances Tech 2024',
    description: 'Rejoignez notre webinaire pour discuter des tendances principales pour l\'intelligence artificielle en 2024, avec des experts du domaine.',
    duration: '1h 30min',
    type: 'webinar'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1543269866-5a654716de64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBjb3VjaCUyMGxhcHRvcHxlbnwxfHx8fDE3NjQxNzYyMDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Interview : Le Futur du Travail Hybride',
    description: 'Écoutez cette interview captivante pour étudier des défis et des opportunités du travail à distance dans le monde post-pandémie.',
    duration: '30 min',
    type: 'interview'
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1580236176063-bea7f16aec30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzJTIwbWluaW1hbHxlbnwxfHx8fDE3NjQxNzYyMDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Podcast : Gérer le Stress et Burn-Out',
    description: 'Des techniques et des conseils stratégiques pour identifier, prévenir et surmonter l\'épuisement professionnel.',
    duration: '25 min',
    type: 'podcast'
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1682258370582-377d685156bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwbWljcm9waG9uZXN8ZW58MXx8fHwxNzY0MTc2MjA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Conférence Audio : Leadership Inclusif',
    description: 'Écoutez une conférence inspirante sur la qualité et les bienfaits d\'un style de leadership qui valorise la diversité.',
    duration: '1h',
    type: 'conference'
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1691617051177-bcc71d95ec76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwb3V0ZG9vciUyMG5hdHVyZXxlbnwxfHx8fDE3NjQxNzYyMDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Méditation Guidée pour la Concentration',
    description: 'Une séance de méditation guidée pour améliorer votre concentration et réduire le stress au quotidien.',
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
                  src="/images/formation-page-thumb.png"
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
                      <h4 className="text-gray-800 mb-3">{program.title}</h4>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {program.description}
                      </p>
                      {program.duration && (
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                          <Clock className="w-4 h-4" />
                          <span>{program.duration}</span>
                        </div>
                      )}
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
