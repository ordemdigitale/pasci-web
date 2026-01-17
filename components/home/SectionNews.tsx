"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { ImageWithFallback } from "@/lib/imageWithFallback"
import { fetchSpotlightNews } from "@/lib/fetch-crasc"
import { SpotlightNews } from "@/types/api.types"
import DOMPurify from 'dompurify';

export default function SectionNews() {
  const [spotlightNewsData, setSpotlightNewsData] = useState<SpotlightNews[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //const spotlightNews = await fetchSpotlightNews();
  const newsArticles = [
    {
      id: 1,
      date: '23 septembre 2025',
      title: 'Tournées d\'information',
      description: "Processus de soumission et les conditions d'éligibilité aux microfinancements et aux subventions",
      image: '/images/actualites/eda7c908-6e5a-4137-9b1e-ae6754146371.jpg',
      link: '#',
      crasc: "CRASC NORD"
    },
    {
      id: 2,
      date: '3 septembre 2025',
      title: "Activités de supervision conjointe OCD",
      description: "Dans le cadre des activités de supervision conjointe OCD pour l'appui aux CRASC",
      image: '/images/actualites/359a7b7d-c126-4fdf-934d-9038c01df7e0.jpg',
      link: '#',
      crasc: "CRASC OUEST"
    },
    {
      id: 3,
      date: '4 juillet 2025',
      title: "Rapport préliminaire sur l'observation du scrutin présidentiel",
      description: "rapport préliminaire dans le cadre du projet d'observation citoyenne des élections",
      image: '/images/actualites/433ece92-1b86-441e-b78a-8382fcf60a00.jpg',
      link: '#',
      crasc: "CRASC CENTRE"
    },
    {
      id: 4,
      date: '23 septembre 2025',
      title: "Atelier des membres du CRASC-Est",
      description: "L'élaboration de stratégies cohérentes s'inscrit dans une logique de professionnalisation de l'action des OSC",
      image: '/images/actualites/99aff270-1397-4fe0-97df-b9c49415ceb1.jpg',
      link: '#',
      crasc: "CRASC EST"
    },
    {
      id: 5,
      date: '3 septembre 2025',
      title: "Formation des OSC",
      description: "Ce fut une rencontre riche en partage, orientation et proposition",
      image: '/images/actualites/13bf15a5-0f87-415a-a05d-e3775879560d.jpg',
      link: '#',
      crasc: "CRASC SUD"
    },
    {
      id: 6,
      date: '4 juillet 2025',
      title: "Séance de simulation des formateurs ce jour",
      description: "Lors de la formation des pools formateurs",
      image: '/images/actualites/4a89463f-f2e9-466f-93bd-03a25b381999.jpg',
      link: '#',
      crasc: "RI-CRASC"
    },
  ];
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
        setSpotlightNewsData(result);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpotlightNewsData();
  }, []);

  console.log("Spot light news: ", spotlightNewsData);

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

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spotlightNewsData?.map((news) => (
            <div 
              key={news.id} 
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative"
            >
              
              <div className="aspect-video overflow-hidden">
                <ImageWithFallback
                  src={news.thumbnail_url}
                  alt={news.id}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              
              <div className="p-4">
                <p className="text-sm text-gray-800 mb-2">{news.crasc?.name}</p>
                <h3 className="text-gray-900 mb-3 font-bold">{news.title}</h3>
                <p className="text-gray-600 text-sm mb-8 line-clamp-2" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.content ?? '') }}></p>
                <a 
                  href="#"
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
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
