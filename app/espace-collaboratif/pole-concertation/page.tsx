"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button'
import { ImageWithFallback } from '@/lib/imageWithFallback'
import PolesAndOpportunities from '@/components/espacecollabpage/PolesAndOpportunities';
import {
  Search,
  ChevronDown,
  Briefcase,
  MapPin
} from "lucide-react";

interface IPoleItem {
  id: number;
  image: string;
  title: string;
  category: string;
  description: string;
  email: string;
 // objectifs: [];
}

export default function PagePoleConcertation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  /* Categories data */
  const categories = [
    "Éducation",
    "Recherche",
    "Santé",
    "Commerce & Tourisme",
    "Banques et services financiers",
  ];

  return (
    <section className="mx-auto pt-12 pb-6 font-poppins">
      <div className="max-w-5xl mx-auto sm:px-6 lg:px-6 border border-gray-200 rounded-lg p-8 mb-10 bg-[#f0f9ff] grid lg:grid-cols-2 gap-6">
        {/* Left content */}
        <div className="">
          <h2 className="text-[#2a591d] font-bold text-4xl">Pôles de concertation</h2>
          <p className="text-gray-600 text-md max-w-xl mt-6">
            Au nombre de 11, les pôles de concertation sont espaces de discussion, de libres échanges et de valorisation des domaines prioritaires des OSC. Ils sont les regroupements de l&apos;ensemble des OSC volontairement engagés dans la recherche des conditions de vie meilleure des acteurs du pôle. Les sujets abordés et discutés ne sauraient en aucun cas se détourner des principaux objectifs que l&apos;on s&apos;est assigné. Réservés uniquement aux OSC inscrits sur la plateforme, les partages, les échanges et les discussions s&apos;opèrent dans une dynamique de respect mutuel, de vivre ensemble et l&apos;intérêt commun des membres.
          </p>
          <Button className="mt-12 border border-[#E05017] bg-[#E05017] text-white hover:text-[#E05017] hover:bg-white rounded-lg px-6">
            Explorer les pôles
          </Button>
        </div>
        
        {/* Right content */}
        <div className="space-y-12">
          <div className="">
            <ImageWithFallback
              src="/images/espace-collab-page-thumb.png"
              alt="image"
              className="w-full h-[300px] object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Search bar + filters area*/}
      <div className="p-6 mb-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="grid grid-cols-6 md:grid-cols-6 gap-4 items-end">
            {/* search bar */}
            <div className="relative col-span-3">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un pôle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-sm w-full pl-12 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent"
              />
            </div>

            {/* filters */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(e.target.value)
                }
                className="text-xs w-full px-2 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent"
              >
                <option value="">
                  Catégorie
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedType}
                onChange={(e) =>
                  setSelectedType(e.target.value)
                }
                className="text-xs w-full px-2 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent"
              >
                <option value="">Type</option>
                <option value="type1">Tous</option>
                <option value="type2">Type 1</option>
                <option value="type3">Type 2</option>
                <option value="type4">Type 3</option>
              </select>
            </div>

            <div>
              <select
                value={selectedDate}
                onChange={(e) =>
                  setSelectedDate(e.target.value)
                }
                className="text-xs w-full px-2 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent"
              >
                <option value="">Date</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>

          </div>
        </div>
      </div>

      <PolesAndOpportunities/>

    </section>
  )
}
