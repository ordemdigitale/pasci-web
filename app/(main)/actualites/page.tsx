"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { newsService } from "@/lib/services/news.service";
import { INews, ICrasc } from "@/types/api.types";
import { fetchAllCrasc } from "@/lib/fetch-crasc";
import NewsCard from "@/components/ui/NewsCard";
import { ArrowRight, Search, Filter, Calendar, Loader2 } from "lucide-react";

export default function PageActualites() {
  const [allNews, setAllNews] = useState<INews[]>([]);
  const [filteredNews, setFilteredNews] = useState<INews[]>([]);
  const [crascList, setCrascList] = useState<ICrasc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCrasc, setSelectedCrasc] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(9);

  // Charger les actualités et les CRASC
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Charger les actualités et les CRASC en parallèle
        const [newsData, crascData] = await Promise.all([
          newsService.getAll({ limit: 100, sort_order: "desc" }),
          fetchAllCrasc()
        ]);

        setAllNews(newsData);
        setFilteredNews(newsData);
        setCrascList(crascData);
      } catch (err: any) {
        console.error("Erreur lors du chargement:", err);
        setError(err.message || "Impossible de charger les actualités");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrer les actualités
  useEffect(() => {
    let filtered = allNews;

    // Filtrer par CRASC
    if (selectedCrasc !== "all") {
      const crascId = parseInt(selectedCrasc);
      filtered = filtered.filter(news => news.crasc_id === crascId);
    }

    // Filtrer par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(news =>
        news.title.toLowerCase().includes(term) ||
        news.content?.toLowerCase().includes(term)
      );
    }

    setFilteredNews(filtered);
    setVisibleCount(9); // Réinitialiser le compteur
  }, [searchTerm, selectedCrasc, allNews]);

  const loadMore = () => {
    setVisibleCount(prev => prev + 9);
  };

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Toutes nos <span className="text-[#E05017]">Actualités</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Suivez les dernières nouvelles et événements du réseau CRASC
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#E05017] to-[#2a591d] mx-auto mt-6 rounded-full" />
        </div>

        {/* Filtres */}
        <div className="mb-10">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Recherche */}
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

            {/* Filtre CRASC */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedCrasc}
                onChange={(e) => setSelectedCrasc(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E05017] focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="all">Tous les CRASC</option>
                {crascList.map(crasc => (
                  <option key={crasc.id} value={crasc.id}>
                    {crasc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Compteur de résultats */}
          <div className="mt-4 text-sm text-gray-600">
            {filteredNews.length} {filteredNews.length > 1 ? 'actualités trouvées' : 'actualité trouvée'}
          </div>
        </div>

        {/* État de chargement */}
        {loading && (
          <div className="text-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-[#E05017] mx-auto mb-4" />
            <p className="text-gray-600">Chargement des actualités...</p>
          </div>
        )}

        {/* État d'erreur */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-medium mb-2">⚠️ Erreur de chargement</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Grille d'actualités */}
        {!loading && !error && filteredNews.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {filteredNews.slice(0, visibleCount).map((news) => (
                <NewsCard key={news.id} news={news} variant="default" />
              ))}
            </div>

            {/* Bouton Charger plus */}
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

        {/* État vide */}
        {!loading && !error && filteredNews.length === 0 && (
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-12 text-center border-2 border-orange-100">
            <div className="max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-[#E05017]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Aucune actualité trouvée
              </h3>
              <p className="text-gray-600 mb-8">
                {searchTerm || selectedCrasc !== "all"
                  ? "Aucune actualité ne correspond à vos critères de recherche."
                  : "Aucune actualité n'est disponible pour le moment."}
              </p>
              {(searchTerm || selectedCrasc !== "all") && (
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
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
