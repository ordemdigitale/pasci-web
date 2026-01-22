"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ImageWithFallback } from "@/lib/imageWithFallback";
import { ChevronLeft, ChevronRight, Clock, ArrowRight } from "lucide-react";

interface Formation {
  id: number;
  image: string;
  title: string;
  description: string;
  duration?: string;
  type: string;
  slug: string;
}

// Données des formations (même que dans la page formations)
const formations: Formation[] = [
  {
    id: 1,
    image: "/images/page-formation/423dccc165037227487e63cd4a3c3daac3c77689b23dab692da976de13b1cc9f.png",
    title: 'Notions essentielles de comptabilité financière',
    description: 'Découvrez les principes fondamentaux et les méthodologies Agile pour optimiser la gestion de vos projets.',
    duration: '6 semaines',
    type: 'Formation',
    slug: 'comptabilite-financiere'
  },
  {
    id: 2,
    image: '/images/page-formation/325089b925013d8e1c19e49d60c060af5b15d40202bdaef5187ed1e44c67cedc.png',
    title: 'Pilotage efficace des ressources humaines',
    description: 'Au-delà des aspects administratifs, les ressources humaines jouent un rôle stratégique dans la performance.',
    duration: '4 semaines',
    type: 'Formation',
    slug: 'ressources-humaines'
  },
  {
    id: 3,
    image: '/images/page-formation/941bc7751a5e05e80271f1fdd72f88921040ea5d290167224c8cc6a973ab760d.png',
    title: 'Gestion juridique et administrative',
    description: 'Cette fonction joue un rôle clé dans la structuration et la pérennité des organisations.',
    duration: '5 semaines',
    type: 'Formation',
    slug: 'gestion-juridique'
  },
  {
    id: 4,
    image: '/images/page-formation/0b84a30a040801f8886da2a298f7333b7d390fa11d6ff0950895cc6356a72b41.png',
    title: 'Les Tendances IA en 2024',
    description: "Explorez les dernières avancées et les prévisions pour l'intelligence artificielle en 2024.",
    duration: '1h 30min',
    type: 'Webinaire',
    slug: 'tendances-ia-2024'
  },
  {
    id: 5,
    image: "/images/page-formation/f8ee35757b6c218aa4724bfdee2fa16fd2ec88a459ab7a9fc9de5402ade555eb.png",
    title: 'Le Futur du Travail à Distance',
    description: "Discutez des défis et des opportunités du travail à distance dans le monde post-pandémique.",
    duration: '30 min',
    type: 'Interview',
    slug: 'travail-a-distance'
  },
  {
    id: 6,
    image: "/images/page-formation/595dfe83bf5a4b4ad09f8085f8ca47cad6958a0c0b343a4a071badac87db203f.png",
    title: 'Gérer le Stress au Travail',
    description: 'Des techniques et des conseils pratiques pour identifier, prévenir et gérer le stress.',
    duration: '25 min',
    type: 'Podcast',
    slug: 'gerer-stress-travail'
  }
];

export default function SectionFormations() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(3);

  // Responsive: ajuster le nombre d'items visibles selon la taille d'écran
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, itemsPerView]);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev >= formations.length - itemsPerView ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? formations.length - itemsPerView : prev - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-12 bg-white font-poppins">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-gray-900 font-extrabold text-4xl mb-3">Nos Formations</h2>
          <p className="text-gray-600 text-lg mb-6">
            Développez vos compétences avec nos programmes de formation
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#E05017] to-[#2a591d] mx-auto rounded-full"></div>
        </div>

        {/* Carousel Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white hover:bg-[#E05017] text-gray-800 hover:text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 group"
            aria-label="Formation précédente"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white hover:bg-[#E05017] text-gray-800 hover:text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 group"
            aria-label="Formation suivante"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Carousel Track */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
              }}
            >
              {formations.map((formation) => (
                <div
                  key={formation.id}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <div className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-[#E05017]/30 transition-all duration-300 hover:shadow-xl h-full">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <ImageWithFallback
                        src={formation.image}
                        alt={formation.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="bg-[#E05017] text-white text-xs font-bold px-3 py-1 rounded-full">
                          {formation.type}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#E05017] transition-colors">
                        {formation.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {formation.description}
                      </p>

                      {/* Duration */}
                      {formation.duration && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                          <Clock className="w-4 h-4" />
                          <span>{formation.duration}</span>
                        </div>
                      )}

                      {/* CTA */}
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

          {/* Dots Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: formations.length - itemsPerView + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === index
                    ? 'w-8 h-2 bg-[#E05017]'
                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Aller à la formation ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA Button */}
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
