"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { ImageWithFallback } from "@/lib/imageWithFallback"
import { fetchSpotlightNews } from "@/lib/fetch-crasc"
import { SpotlightNews } from "@/types/api.types"
import DOMPurify from 'dompurify';

// Mock data de fallback si l'API ne répond pas
const mockNews: SpotlightNews[] = [
  {
    id: "1",
    title: "Lancement du nouveau programme de formation pour les OSC",
    slug: "nouveau-programme-formation-osc",
    content: "Le CRASC annonce le lancement d'un nouveau programme de formation destiné aux organisations de la société civile. Ce programme vise à renforcer les capacités en gestion de projets.",
    thumbnail_url: "/images/actualites/formation-osc.jpg",
    crasc: {
      id: "1",
      name: "CRASC Abidjan",
      slug: "crasc-abidjan",
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
      id: "1",
      name: "CRASC Bouaké",
      slug: "crasc-bouake",
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
      id: "2",
      name: "CRASC Yamoussoukro",
      slug: "crasc-yamoussoukro",
      osc_count: 80
    }
  }
];

export default function SectionNews() {
  const [spotlightNewsData, setSpotlightNewsData] = useState<SpotlightNews[]>(mockNews);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fetch all crasc data
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

  return (
    <section className="py-10 bg-white font-poppins">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-gray-900 font-bold text-3xl">Actualités</h2>
          {/* <Button 
            variant="outline" 
            className="border border-[#E05017] text-[#E05017] hover:bg-[#E05017] hover:text-white rounded-lg px-6"
          >
            Voir plus
          </Button> */}
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
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spotlightNewsData?.map((news) => (
              <div
                key={news.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative"
              >

                <div className="aspect-video overflow-hidden">
                  <ImageWithFallback
                    src={news.thumbnail_url}
                    alt={news.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>


                <div className="p-4 pb-16">
                  <p className="text-sm text-gray-800 mb-2">{news.crasc?.name}</p>
                  <h3 className="text-gray-900 mb-3 font-bold">{news.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.content ?? '') }}></p>
                </div>
                <Link
                  href={`/actualites/${news.slug}`}
                  className="absolute bottom-0 left-0 right-0 p-4 text-[#2a591d] underline text-sm transition-colors inline-flex items-center group"
                >
                  Lire l'article
                  <svg
                    className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* No Data State */}
        {!loading && spotlightNewsData?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Aucune actualité disponible pour le moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
