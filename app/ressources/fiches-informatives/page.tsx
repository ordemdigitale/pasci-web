"use client";

import React, { useState } from 'react'
import { ImageWithFallback } from '@/lib/imageWithFallback'
import {
  Search,
  Calendar,
  Grid3x3,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function PageFichesInformatives() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  /* Categories data */
  const categories = [
    "Rapport",
    "Guide",
    "Étude",
    "Manuel",
    "PV",
    "Infographie",
    "Politique",
    "Récit",
    "Plan",
  ];

  return (
    <section className="py-10 lg:pb-32 lg:pt-10 font-poppins">

      <div className="bg-[#f0f9ff] sm:px-6 lg:px-8 p-8">
        <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 p-8 grid lg:grid-cols-2 gap-12">
          
          {/* Left content */}
          <div className="">
            <h2 className="font-bold text-3xl">Fiches informatives</h2>
            <p className="font-bold text-xl max-w-sm mt-6">
              L&apos;information plus simple, plus rapide à lire et plus facile à utiliser
            </p>
            <p className="text-gray-600 text-md max-w-2xl mt-4">
              Accédez à une bibliothèque complète de documents pour éclairer vos décisions stratégiques et optimiser vos actions.
            </p>
          </div>
          
          {/*  */}
          <div className="space-y-12">
            <div className="">
              <ImageWithFallback
                src="/icons/fiche-informative-icon.png"
                alt="image"
                className="w-full h-[200px] object-contain"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Search bar + filters area*/}
      <div className="border-b border-b-[#dee1e6] p-6 mb-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="grid grid-cols-6 md:grid-cols-6 gap-4 items-end">
            {/* search bar */}
            <div className="relative col-span-3">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher des documents..."
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
                  Sélectionner une catégorie
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
                <option value="">Sélectionner un type</option>
                <option value="type1">Type 1</option>
                <option value="type2">Type 2</option>
                <option value="type3">Type 3</option>
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
                <option value="">Sélectionner une date</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>

          </div>
        </div>
      </div>

    </section>
  )
}
