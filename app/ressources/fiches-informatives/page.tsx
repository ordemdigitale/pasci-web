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

interface IFicheInformatives {
  id: number;
  icon: string;
  title: string;
  description: string;
  tags: string[];
}

const fichesInformatives: IFicheInformatives[] = [
  {
    id: 1,
    icon: "/icons/fiche-info-page/1.png",
    title: "Guide complet pour l'optimisation des processus",
    description: "Ce guide détaille les étapes essentielles pour identifier, analyser et optimiser les processus métier de votre organisation.",
    tags: ["Guides", "Optimisation"],
  },
  {
    id: 2,
    icon: "/icons/fiche-info-page/2.png",
    title: "Rapport annuel sur les tendances du marché 2023",
    description: "Une analyse approfondie des tendances clés ayant marqué le marché en 2023 et leurs implications futures pour les entreprises.",
    tags: ["Rapports", "Tendances"],
  },
  {
    id: 3,
    icon: "/icons/fiche-info-page/3.png",
    title: "Politique de confidentialité des données PASCI",
    description: "Présentation de notre engagement envers la protection des données personnelles de nos utilisateurs, conforme aux réglementations en vigueur.",
    tags: ["Politiques", "Sécurité"],
  },
  {
    id: 4,
    icon: "/icons/fiche-info-page/4.png",
    title: "10 astuces pour une stratégie de communication efficace",
    description: "Découvrez des conseils pratiques pour élaborer une stratégie de communication percutante et atteindre vos objectifs.",
    tags: ["Guides", "Marketing"],
  },
  {
    id: 5,
    icon: "/icons/fiche-info-page/5.png",
    title: "L'impact du numérique sur l'économie globale",
    description: "Étude des transformations numériques et de leur influence sur les dynamiques économiques à l'échelle mondiale.",
    tags: ["Analyses", "Économie"],
  },
  {
    id: 6,
    icon: "/icons/fiche-info-page/6.png",
    title: "Mise en œuvre des systèmes de gestion intégrés",
    description: "Un aperçu des meilleures pratiques pour l'implémentation réussie de systèmes de gestion intégrés dans diverses structures.",
    tags: ["Guides", "Technologie"],
  },
];

export default function PageFichesInformatives() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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

      <div className="bg-[#f0f9ff] sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto sm:px-6 lg:px-6 py-8 grid lg:grid-cols-2">
          
          {/* Left content */}
          <div className="">
            <h2 className="font-bold text-5xl text-[#2a591d]">Fiches informatives</h2>
            <p className="font-bold text-xl max-w-sm mt-6">
              L&apos;information plus simple, plus rapide à lire et plus facile à utiliser
            </p>
            <p className="text-gray-600 text-md max-w-3xl mt-4">
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
                <option value="">Date</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>

          </div>
        </div>
      </div>

      {/* Section title */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h3 className="font-bold text-2xl">Explorer nos fiches</h3>
      </div>
      {/* Documents card grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {fichesInformatives.map((fiche) => (
          <div
            key={fiche.id}
            className="border border-gray-200 rounded-lg overflow-hidden hover-shadow-lg transition-shadow bg-white py-4 px-5 relative h-84"
          >
            {/* Image */}
            <div className="mb-4">
              <ImageWithFallback
                src={fiche.icon}
                alt={fiche.title}
                className="w-15 h-15 bg-[#f0f9ff] rounded-full"
              />
            </div>
            
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{fiche.title}</h3>
              <p className="text-sm text-gray-600 mt-3 inline-block">{fiche.description}</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              {fiche.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full mr-2 mt-2"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() =>
              setCurrentPage(Math.max(1, currentPage - 1))
            }
            disabled={currentPage === 1}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Précédent
          </button>

          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-lg transition-colors ${
                currentPage === page
                  ? "bg-[#E05017] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage(Math.min(3, currentPage + 1))
            }
            disabled={currentPage === 3}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Suivant
          </button>
        </div>

    </section>
  )
}
