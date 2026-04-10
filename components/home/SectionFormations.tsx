"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ImageWithFallback } from "@/lib/imageWithFallback";
import { ChevronLeft, ChevronRight, ArrowRight, Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/api-config";

interface Formation {
  id: number;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  slug: string;
  type?: string;
}

export default function SectionFormations() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/formations?limit=6&is_published=true`)
      .then((r) => r.json())
      .then((data) => setFormations(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || formations.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev >= formations.length - itemsPerView ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, itemsPerView, formations.length]);

  const nextSlide = () =>
    setCurrentIndex((prev) =>
      prev >= formations.length - itemsPerView ? 0 : prev + 1
    );

  const prevSlide = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, formations.length - itemsPerView) : prev - 1
    );

  return (
    <section className="py-12 bg-white font-poppins">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-gray-900 font-extrabold text-3xl mb-3">Nos Formations</h2>
          <p className="text-gray-600 text-lg mb-6">
            Développez vos compétences avec nos programmes de formation
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#E05017] to-[#2a591d] mx-auto rounded-full" />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#E05017]" />
          </div>
        ) : formations.length === 0 ? (
          <p className="text-center text-gray-400 py-8">Aucune formation disponible.</p>
        ) : (
          <div
            className="relative"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white hover:bg-[#E05017] text-gray-800 hover:text-white rounded-full p-3 shadow-lg transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white hover:bg-[#E05017] text-gray-800 hover:text-white rounded-full p-3 shadow-lg transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
              >
                {formations.map((formation) => (
                  <div
                    key={formation.id}
                    className="flex-shrink-0 px-3"
                    style={{ width: `${100 / itemsPerView}%` }}
                  >
                    <div className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-[#E05017]/30 transition-all duration-300 hover:shadow-xl h-full">
                      <div className="relative h-48 overflow-hidden">
                        <ImageWithFallback
                          src={formation.thumbnail_url || "/images/placeholder.jpg"}
                          alt={formation.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {formation.type && (
                          <div className="absolute top-3 right-3">
                            <span className="bg-[#E05017] text-white text-xs font-bold px-3 py-1 rounded-full">
                              {formation.type}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#E05017] transition-colors">
                          {formation.title}
                        </h3>
                        {formation.description && (
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {formation.description}
                          </p>
                        )}
                        <Link
                          href={`/formations/${formation.slug}`}
                          className="inline-flex items-center gap-2 text-[#E05017] font-semibold text-sm group-hover:gap-3 transition-all"
                        >
                          Découvrir
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {formations.length > itemsPerView && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: formations.length - itemsPerView + 1 }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`transition-all duration-300 rounded-full ${
                      currentIndex === index
                        ? "w-8 h-2 bg-[#E05017]"
                        : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/formations"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#E05017] to-[#d04010] text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Voir toutes les formations
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
