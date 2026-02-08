"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { ImageWithFallback } from "@/lib/imageWithFallback"
import { fetchSpotlightNews } from "@/lib/fetch-crasc"
import { SpotlightNews } from "@/types/api.types"
import DOMPurify from 'dompurify';
import { Loader2 } from "lucide-react";

// Mock data de fallback si l'API ne répond pas
/* const mockNews: SpotlightNews[] = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
  }
]; */

export default function SectionNews() {
  const [spotlightNewsData, setSpotlightNewsData] = useState<SpotlightNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fetch all spotlight news
  useEffect(() => {
    const fetchSpotlightNewsData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Updated to use dedicated /news/spotlight endpoint
        const response = await fetch("https://api.plateforme-osci.org/api/v1/news/spotlight");
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
    <section className="py-8 bg-white font-poppins">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-gray-900 font-bold text-3xl">Actualités</h2>
            <Link href="/actualites">
         <Button 
            variant="outline"
            className="border border-[#E05017] text-[#E05017] hover:bg-[#E05017] hover:text-white rounded-lg px-6"
          >
            Voir plus
          </Button>
            </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-[#E05017] animate-spin mx-auto mb-4" />
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
