"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, FileText, Users, Building, Briefcase, Calendar } from 'lucide-react';
import { ImageWithFallback } from '@/lib/imageWithFallback';

interface SearchResult {
  id: number;
  type: 'actualite' | 'osc' | 'crasc' | 'formation' | 'emploi';
  title: string;
  description: string;
  link: string;
  image?: string;
  date?: string;
  location?: string;
}

// Mock data - À remplacer par un vrai fetch API
const mockResults: SearchResult[] = [
  {
    id: 1,
    type: 'actualite',
    title: 'Lancement du nouveau programme de formation',
    description: 'Le CRASC annonce le lancement d\'un nouveau programme de renforcement des capacités pour les OSC...',
    link: '/actualites/nouveau-programme-formation',
    image: '/images/page-annuaire-crasc/mplci.jpg',
    date: '2025-01-15'
  },
  {
    id: 2,
    type: 'osc',
    title: 'Mouvement Pour Lutte contre l\'injustice (MPLCI)',
    description: 'Organisation engagée dans la promotion de la justice sociale et la défense des droits humains...',
    link: '/annuaire/annuaire-des-osc/mplci',
    image: '/images/page-annuaire-crasc/mplci.jpg',
    location: 'Abidjan'
  },
  {
    id: 3,
    type: 'formation',
    title: 'Notions essentielles de comptabilité financière',
    description: 'Découvrez les principes fondamentaux de la comptabilité financière...',
    link: '/formations',
    image: '/images/page-formation/423dccc165037227487e63cd4a3c3daac3c77689b23dab692da976de13b1cc9f.png',
    date: '2025-02-01'
  },
  {
    id: 4,
    type: 'emploi',
    title: 'Chargé(e) de projet - ONG HOPE',
    description: 'Nous recherchons un(e) chargé(e) de projet expérimenté(e) pour coordonner nos activités...',
    link: '/espace-collaboratif/offres-emploi',
    location: 'Bouaké',
    date: '2025-01-10'
  }
];

const typeLabels = {
  actualite: 'Actualité',
  osc: 'OSC',
  crasc: 'CRASC',
  formation: 'Formation',
  emploi: 'Emploi'
};

const typeIcons = {
  actualite: FileText,
  osc: Users,
  crasc: Building,
  formation: FileText,
  emploi: Briefcase
};

const typeColors = {
  actualite: 'bg-blue-100 text-blue-800',
  osc: 'bg-green-100 text-green-800',
  crasc: 'bg-purple-100 text-purple-800',
  formation: 'bg-yellow-100 text-yellow-800',
  emploi: 'bg-orange-100 text-orange-800'
};

export default function RecherchePage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery);
    }
  }, [searchQuery, activeFilter]);

  const performSearch = (query: string) => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      let filtered = mockResults;

      // Filter by type
      if (activeFilter !== 'all') {
        filtered = filtered.filter(r => r.type === activeFilter);
      }

      // Filter by search query
      if (query) {
        filtered = filtered.filter(r =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.description.toLowerCase().includes(query.toLowerCase())
        );
      }

      setResults(filtered);
      setLoading(false);
    }, 500);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const filters = [
    { id: 'all', label: 'Tout' },
    { id: 'actualite', label: 'Actualités' },
    { id: 'osc', label: 'OSC' },
    { id: 'formation', label: 'Formations' },
    { id: 'emploi', label: 'Emplois' }
  ];

  return (
    <section className="py-10 bg-gray-50 font-poppins min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h1 className="text-3xl font-bold text-[#2a591d] mb-4">Recherche</h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher des actualités, OSC, formations, emplois..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E05017] focus:border-transparent text-lg"
            />
          </form>

          {searchQuery && (
            <p className="text-gray-600 mt-4">
              Résultats pour : <strong>"{searchQuery}"</strong>
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-[#E05017] text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-700">
            <strong>{results.length}</strong> résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E05017] mx-auto"></div>
            <p className="mt-4 text-gray-600">Recherche en cours...</p>
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div className="space-y-4">
            {results.map((result) => {
              const Icon = typeIcons[result.type];
              return (
                <Link key={result.id} href={result.link}>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex gap-4">
                      {/* Image */}
                      {result.image && (
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                            <ImageWithFallback
                              src={result.image}
                              alt={result.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Type Badge */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${typeColors[result.type]}`}>
                            <Icon className="w-3.5 h-3.5" />
                            {typeLabels[result.type]}
                          </span>

                          {result.date && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(result.date).toLocaleDateString('fr-FR')}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#E05017] transition-colors">
                          {result.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                          {result.description}
                        </p>

                        {/* Location */}
                        {result.location && (
                          <p className="text-sm text-gray-500">
                            📍 {result.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* No Results */}
        {!loading && results.length === 0 && searchQuery && (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Aucun résultat trouvé</h3>
            <p className="text-gray-600 mb-6">
              Essayez de modifier vos critères de recherche ou utilisez d'autres mots-clés.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
                setResults([]);
              }}
              className="px-6 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-semibold"
            >
              Effacer la recherche
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && !searchQuery && (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Commencez votre recherche</h3>
            <p className="text-gray-600 mb-6">
              Entrez des mots-clés pour rechercher des actualités, OSC, formations ou emplois.
            </p>

            <div className="max-w-md mx-auto">
              <h4 className="font-semibold text-gray-900 mb-3">Suggestions de recherche :</h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Formation', 'Gouvernance', 'Droits humains', 'Emploi', 'CRASC Sud'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setSearchQuery(suggestion)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-[#E05017] hover:text-white transition-colors text-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
