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
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
