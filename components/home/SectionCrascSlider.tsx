"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "@/lib/imageWithFallback";

const slides = [
  {
    src: "/images/actualites/13bf15a5-0f87-415a-a05d-e3775879560d.jpg",
    caption: "Renforcement des capacités des OSC",
  },
  {
    src: "/images/actualites/359a7b7d-c126-4fdf-934d-9038c01df7e0.jpg",
    caption: "Activités des CRASC en régions",
  },
  {
    src: "/images/actualites/433ece92-1b86-441e-b78a-8382fcf60a00.jpg",
    caption: "Ateliers de formation et d'échanges",
  },
  {
    src: "/images/actualites/99aff270-1397-4fe0-97df-b9c49415ceb1.jpg",
    caption: "Partenariats et coopération",
  },
  {
    src: "/images/page-annuaire-crasc/09d92f51-b85c-4581-be51-d5333472e74d.jpg",
    caption: "Réseau des organisations de la société civile",
  },
  {
    src: "/images/b81daf7f-c015-4a68-942f-ce602fdf5542.jpg",
    caption: "Pôles de concertation des OSC",
  },
];

export default function SectionCrascSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [paused, next]);

  return (
    <section className="w-full bg-gray-100 py-8 font-poppins">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative rounded-xl overflow-hidden shadow-lg"
          style={{ height: "420px" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Slides */}
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === current ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <ImageWithFallback
                src={slide.src}
                alt={slide.caption}
                className="w-full h-full object-cover"
              />
              {/* Overlay gradient + caption */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-6 py-5">
                <p className="text-white font-semibold text-lg drop-shadow">{slide.caption}</p>
              </div>
            </div>
          ))}

          {/* Prev button */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow transition-all"
            aria-label="Précédent"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>

          {/* Next button */}
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow transition-all"
            aria-label="Suivant"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
