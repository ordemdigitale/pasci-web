"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from "@/lib/imageWithFallback"
import Link from "next/link";
//import SvgComponent from "../ui/svgComponent";
import { CrascMapSvg } from "../ui/CrascMapSvg";

const FALLBACK_SLIDES = [
  "/images/de715dfa-b501-4ea4-9532-9d32d85c10e0.png",
  "/images/actualites/13bf15a5-0f87-415a-a05d-e3775879560d.jpg",
  "/images/actualites/359a7b7d-c126-4fdf-934d-9038c01df7e0.jpg",
  "/images/actualites/433ece92-1b86-441e-b78a-8382fcf60a00.jpg",
  "/images/page-annuaire-crasc/09d92f51-b85c-4581-be51-d5333472e74d.jpg",
];

const FALLBACK_TITLE = "Centre Régional d'Appui à la Société Civile (CRASC)";
const FALLBACK_DESC = "Cette Plateforme digitale est la résultante d'une démarche alliant à la fois, inclusivité, représentativité, accessibilité et pérennité. Multifonctionnelle et dynamique, elle vise à accroître la visibilité des OSC, la synergie d'action, le partage d'expérience et la professionnalisation.";

export default function SectionHero() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [slides, setSlides] = useState<string[]>(FALLBACK_SLIDES);
  const [heroTitle, setHeroTitle] = useState(FALLBACK_TITLE);
  const [heroDesc, setHeroDesc] = useState(FALLBACK_DESC);

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${API_BASE}/api/v1/hero-slides?active_only=true&type=haut`)
      .then((r) => r.ok ? r.json() : [])
      .then((data) => {
        if (Array.isArray(data) && data.length > 0)
          setSlides(data.map((s: { image_url: string }) => s.image_url));
      })
      .catch(() => {});

    fetch(`${API_BASE}/api/v1/config`)
      .then((r) => r.ok ? r.json() : {})
      .then((cfg: Record<string, string>) => {
        if (cfg.hero_title) setHeroTitle(cfg.hero_title);
        if (cfg.hero_description) setHeroDesc(cfg.hero_description);
      })
      .catch(() => {});
  }, []);

  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), [slides.length]);
  const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 3500);
    return () => clearInterval(t);
  }, [paused, next]);

  const handleClick = () => {
    router.push("/a-propos")
  }

  return (
    <section className="py-8 font-poppins">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-[#2a591d] font-bold text-xl sm:text-2xl lg:text-3xl text-center pb-8 sm:pb-[50px]">Plateforme Digitale des Organisations de la Société Civile - PDOC</p>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">

          {/* Left side */}
          <div className="space-y-6">
            {/* Left side Title */}
            <h2 className="text-gray-900 text-center font-bold">
              {heroTitle}
            </h2>

            {/* Left side card */}
            <div
              className="rounded-lg overflow-hidden hover:shadow-lg transition-shadow shadow-xl"
            >
              {/* Image Slider */}
              <div
                className="relative aspect-video overflow-hidden"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                {slides.map((src, i) => (
                  <div
                    key={i}
                    className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                  >
                    <ImageWithFallback alt="card-image" src={src} className="w-full h-full object-cover" />
                  </div>
                ))}
                {/* Prev */}
                <button
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white rounded-full p-1 shadow transition-all"
                  aria-label="Précédent"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-800" />
                </button>
                {/* Next */}
                <button
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white rounded-full p-1 shadow transition-all"
                  aria-label="Suivant"
                >
                  <ChevronRight className="w-4 h-4 text-gray-800" />
                </button>
                {/* Dots */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`rounded-full transition-all duration-300 ${i === current ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"}`}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Content */}
              <div className="px-6 pb-6 flex flex-col">
                <p className="text-gray-600 text-sm mb-4">
                  {heroDesc}
                </p>
                <Button 
                  variant="outline" 
                  className="border border-[#E05017] bg-[#E05017] text-white hover:text-[#e05017] hover:bg-white rounded-lg px-6 ml-auto cursor-pointer"
                  onClick={() => handleClick()}
                >
                  Voir plus
                </Button>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="space-y-6">
            {/* Title */}
            <h2 className="text-gray-900 text-center font-bold">
              Cliquer sur une zone CRASC sur la carte
            </h2>

            {/* Right side card */}
            {/* Clickable map */}
            <CrascMapSvg
              interactive={true}
              onRegionClick={(regionId, href) => {
                console.log(regionId)
                router.push(href)
              }}
            />

          </div>
        </div>

      </div>
      
      {/* <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SvgComponent/>
      </div> */}

      {/* <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <CrascMapSvg
          interactive={true}
          onRegionClick={(regionId) => {
            console.log('Region clicked:', regionId);
            alert(`Clicked on region: ${regionId.toUpperCase()}`);
          }}
        />
      </div> */}
    </section>
  )
}
