"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ImageWithFallback } from "@/lib/imageWithFallback";
import { SpotlightNews } from "@/types/api.types";
import DOMPurify from 'dompurify';
import { ArrowRight, Search, Filter, Calendar } from "lucide-react";

// Mock data actualités (même que dans SectionNews)
const mockNews: SpotlightNews[] = [
  {
    id: "1",
    title: "Lancement du nouveau programme de formation pour les OSC",
    slug: "nouveau-programme-formation-osc",
    content: "Le CRASC annonce le lancement d'un nouveau programme de formation destiné aux organisations de la société civile. Ce programme vise à renforcer les capacités en gestion de projets.",
    thumbnail_url: "/images/actualites/formation-osc.jpg",
    crasc: {
      id: "1",
      name: "CRASC SUD",
      slug: "crasc-sud",
      osc_count: 150
    }
  },
  {
    id: "2",
    title: "Atelier de renforcement des capacités organisationnelles",
    slug: "atelier-renforcement-capacites",
    content: "Un atelier de trois jours pour améliorer les compétences organisationnelles des membres des OSC. Formation sur la gouvernance, la planification stratégique et la mobilisation de ressources.",
    thumbnail_url: "/images/actualites/atelier-capacites.jpg",
    crasc: {
      id: "2",
      name: "CRASC CENTRE",
      slug: "crasc-centre",
      osc_count: 120
    }
  },
  {
    id: "3",
    title: "Assemblée générale annuelle 2025",
    slug: "assemblee-generale-2025",
    content: "Convocation à l'assemblée générale ordinaire pour faire le bilan des activités de l'année écoulée et définir les orientations stratégiques pour 2025.",
    thumbnail_url: "/images/actualites/assemblee-generale.jpg",
    crasc: {
      id: "3",
      name: "CRASC NORD",
      slug: "crasc-nord",
      osc_count: 80
    }
  },
  {
    id: "4",
    title: "Forum régional sur le développement durable",
    slug: "forum-regional-developpement-durable",
    content: "Le CRASC organise un forum régional réunissant les acteurs du développement durable pour échanger sur les bonnes pratiques et renforcer les synergies d'action.",
    thumbnail_url: "/images/actualites/formation-osc.jpg",
    crasc: {
      id: "4",
      name: "CRASC EST",
      slug: "crasc-est",
      osc_count: 95
    }
  },
  {
    id: "5",
    title: "Campagne de sensibilisation sur les droits humains",
    slug: "campagne-sensibilisation-droits-humains",
    content: "Lancement d'une vaste campagne de sensibilisation aux droits humains dans les communautés locales, avec l'appui des OSC membres du réseau CRASC.",
    thumbnail_url: "/images/actualites/atelier-capacites.jpg",
    crasc: {
      id: "5",
      name: "CRASC OUEST",
      slug: "crasc-ouest",
      osc_count: 110
    }
  },
  {
    id: "6",
    title: "Séminaire sur la gouvernance locale et participation citoyenne",
    slug: "seminaire-gouvernance-locale",
    content: "Un séminaire de deux jours réunissant les élus locaux, les OSC et les leaders communautaires pour discuter de la gouvernance participative et du renforcement de la démocratie locale.",
    thumbnail_url: "/images/actualites/formation-osc.jpg",
    crasc: {
      id: "1",
      name: "CRASC SUD",
      slug: "crasc-sud",
      osc_count: 150
    }
  },
  {
    id: "7",
    title: "Atelier de formation sur la mobilisation de ressources",
    slug: "atelier-mobilisation-ressources",
    content: "Formation intensive sur les techniques de fundraising, la rédaction de propositions de projets et la gestion de partenariats stratégiques pour les OSC.",
    thumbnail_url: "/images/actualites/atelier-capacites.jpg",
    crasc: {
      id: "2",
      name: "CRASC CENTRE",
      slug: "crasc-centre",
      osc_count: 120
    }
  },
  {
    id: "8",
    title: "Lancement du réseau des jeunes leaders OSC",
    slug: "reseau-jeunes-leaders",
    content: "Initiative visant à créer un réseau dynamique de jeunes leaders des organisations de la société civile pour favoriser l'innovation et le mentorat intergénérationnel.",
    thumbnail_url: "/images/actualites/assemblee-generale.jpg",
    crasc: {
      id: "3",
      name: "CRASC NORD",
      slug: "crasc-nord",
      osc_count: 80
    }
  }
];

const crascFilters = [
  { id: "all", name: "Tous les CRASC" },
  { id: "sud", name: "CRASC SUD" },
  { id: "centre", name: "CRASC CENTRE" },
  { id: "nord", name: "CRASC NORD" },
  { id: "est", name: "CRASC EST" },
  { id: "ouest", name: "CRASC OUEST" }
];

export default function PageActualites() {
  const [spotlightNewsData, setSpotlightNewsData] = useState<SpotlightNews[]>(mockNews);
  const [filteredNews, setFilteredNews] = useState<SpotlightNews[]>(mockNews);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCrasc, setSelectedCrasc] = useState("all");
  const [visibleCount, setVisibleCount] = useState(6);

  // Fetch spotlight news data
  useEffect(() => {
    const fetchSpotlightNewsData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:8000/api/v1/crasc/news-spotlight-crasc");
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }
        const result = await response.json();
        if (result && result.length > 0) {
          setSpotlightNewsData(result);
          setFilteredNews(result);
        }
      } catch (err: any) {
        console.log("Erreur lors du chargement des actualités:", err);
        setError(err.message);
        // On garde les données mock en cas d'erreur
      } finally {
        setLoading(false);
      }
    };
    fetchSpotlightNewsData();
  }, []);

  // Filter news based on search term and CRASC selection
  useEffect(() => {
    let filtered = spotlightNewsData;

    // Filter by CRASC
    if (selectedCrasc !== "all") {
      filtered = filtered.filter(news =>
        news.crasc?.name.toLowerCase().includes(selectedCrasc)
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(news =>
        news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        news.content?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNews(filtered);
  }, [searchTerm, selectedCrasc, spotlightNewsData]);

  const loadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white font-poppins">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Toutes nos <span className="text-[#E05017]">Actualités</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Suivez les dernières nouvelles et événements du réseau CRASC
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#E05017] to-[#2a591d] mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Search and Filters */}
        <div className="mb-10">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une actualité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E05017] focus:border-transparent"
              />
            </div>

            {/* CRASC Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedCrasc}
                onChange={(e) => setSelectedCrasc(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E05017] focus:border-transparent appearance-none cursor-pointer"
              >
                {crascFilters.map(filter => (
                  <option key={filter.id} value={filter.id}>
                    {filter.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            {filteredNews.length} {filteredNews.length > 1 ? 'actualités trouvées' : 'actualité trouvée'}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E05017] mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des actualités...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              ⚠️ Impossible de charger les actualités depuis le serveur. Affichage des données de démonstration.
            </p>
          </div>
        )}

        {/* News Grid */}
        {!loading && filteredNews.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {filteredNews.slice(0, visibleCount).map((news) => (
                <div
                  key={news.id}
                  className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
                >
                  {/* Image */}
                  <div className="aspect-video overflow-hidden relative">
                    <ImageWithFallback
                      src={news.thumbnail_url}
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* CRASC Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#E05017] text-white text-xs font-bold px-3 py-1 rounded-full">
                        {news.crasc?.name}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 pb-16">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#E05017] transition-colors">
                      {news.title}
                    </h3>
                    <p
                      className="text-gray-600 text-sm line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.content ?? '') }}
                    />
                  </div>

                  {/* Read More Link */}
                  <Link
                    href={`/actualites/${news.slug}`}
                    className="absolute bottom-0 left-0 right-0 p-5 text-[#2a591d] font-semibold text-sm transition-colors inline-flex items-center group/link"
                  >
                    Lire l'article
                    <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {visibleCount < filteredNews.length && (
              <div className="text-center">
                <button
                  onClick={loadMore}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#E05017] to-[#d04010] text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Charger plus d'actualités
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && filteredNews.length === 0 && (
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-12 text-center border-2 border-orange-100">
            <div className="max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-[#E05017]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Aucune actualité trouvée
              </h3>
              <p className="text-gray-600 mb-8">
                Aucune actualité ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCrasc("all");
                }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#E05017] to-[#d04010] text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Réinitialiser les filtres
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
