"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { ArrowRight, Play } from 'lucide-react';
import { ImageWithFallback } from "@/lib/imageWithFallback"
import Link from "next/link";
//import SvgComponent from "../ui/svgComponent";
import { CrascMapSvg } from "../ui/CrascMapSvg";

export default function SectionHero() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/a-propos")
  }

  return (
    <section className="py-10 lg:pb-32 lg:pt-10 font-poppins">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="text-[#2a591d] font-bold text-4xl text-center pb-[50px]">Plateforme digitale des OSC membres du CRASC</p>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">

          {/* Left side */}
          <div className="space-y-6">
            {/* Left side Title */}
            <h2 className="text-gray-900 text-center font-bold">
              Centre Régional d'Appui à la Société Civile (CRASC)
            </h2>

            {/* Left side card */}
            <div
              className="rounded-lg overflow-hidden hover:shadow-lg transition-shadow shadow-xl"
            >
              {/* Image */}
              <div className="aspect-video overflow-hidden">
                <ImageWithFallback
                  alt="card-image"
                  src="/images/hero-card-image.jpg"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Content */}
              <div className="p-6 flex flex-col">
                {/* <h3 className="text-gray-900 mb-3">Contexte</h3> */}
                <p className="text-gray-600 text-sm mb-4">
                  Cette Plateforme digitale est la résultante d&apos;une démarche alliant à la fois, inclusivité, représentativité, accessibilité et pérennité. Multifonctionnelle et dynamique, elle vise à accroître la visibilité des OSC, la synergie d&apos;action, le partage d&apos;expérience et la professionnalisation.
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
