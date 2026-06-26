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

const FALLBACK_FORMATION_IMAGES = [
  "/images/page-formation/0cd2210f-3c2d-4036-9e65-e993265c441c.jpg",
  "/images/page-formation/0b84a30a040801f8886da2a298f7333b7d390fa11d6ff0950895cc6356a72b41.png",
  "/images/page-formation/325089b925013d8e1c19e49d60c060af5b15d40202bdaef5187ed1e44c67cedc.png",
  "/images/page-formation/387d668c67b16d2201d39b5519f434cd019a4cdab4c7fd9f99c3456c0d6d40ec.png",
  "/images/page-formation/423dccc165037227487e63cd4a3c3daac3c77689b23dab692da976de13b1cc9f.png",
  "/images/page-formation/506ee6b1647fb568e2b4112507471561d4c817eec4dd9fb76a49a7473b19b4f5.png",
];

function getFormationImage(formation: Formation, index: number) {
  if (formation.thumbnail_url && !formation.thumbnail_url.endsWith("/default.png")) {
    return formation.thumbnail_url;
  }

  const key = formation.slug || formation.title || String(index);
  const hash = Array.from(key).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return FALLBACK_FORMATION_IMAGES[hash % FALLBACK_FORMATION_IMAGES.length];
}

export default function SectionFormations() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/formations?limit=6&published_only=true`)
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
                {formations.map((formation, index) => (
                  <div
                    key={formation.id}
                    className="flex-shrink-0 px-3"
                    style={{ width: `${100 / itemsPerView}%` }}
                  >
                    <div className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-[#E05017]/30 transition-all duration-300 hover:shadow-xl h-full">
                      <div className="relative h-48 overflow-hidden">
                        <ImageWithFallback
                          src={getFormationImage(formation, index)}
                          alt={formation.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
                        {formation.type && (
                          <div className="absolute top-3 right-3">
                            <span className="bg-[#E05017] text-white text-xs font-bold px-3 py-1 rounded-full">
                              {formation.type}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 p-4">
                          <p className="text-white text-lg font-extrabold leading-tight line-clamp-2 drop-shadow">
                            {formation.title}
                          </p>
                        </div>
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
