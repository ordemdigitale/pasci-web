"use client";

import React, {useState} from 'react'
import {
  Search,
  Calendar,
  Grid3x3,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ImageWithFallback } from '@/lib/imageWithFallback'

interface IDocument {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
}

export default function PageDocumentation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">(
    "grid",
  );
  const [currentPage, setCurrentPage] = useState(1);

  const documents: IDocument[] = [
    {
      id: 1,
      title: "Rapport Annuel PASCI 2023 : Progrès et Impacts",
      description:
        "Ce rapport détaille les réalisations du projet PASCI au cours de l'année 2023, en soulignant les avancées majeures et les",
      category: "Rapport",
      date: "15/01/2024",
    },
    {
      id: 2,
      title:
        "Lignes Directrices pour la Participation Communautaire",
      description:
        "Document cadre présentant les méthodologies et les meilleures pratiques pour engager efficacement les",
      category: "Guide",
      date: "22/11/2023",
    },
    {
      id: 3,
      title:
        "Étude de Faisabilité : Expansion du Projet PASCI en Région Sud",
      description:
        "Analyse approfondie de la viabilité et des défis potentiels d'une extension géographique du projet PASCI dans la",
      category: "Étude",
      date: "10/09/2023",
    },
    {
      id: 4,
      title: "Manuel de Formation pour les Agents de Terrain",
      description:
        "Un guide pratique pour les agents de terrain, couvrant les aspects essentiels de la mise en œuvre des activités de terrain et",
      category: "Manuel",
      date: "05/07/2023",
    },
    {
      id: 5,
      title:
        "Procès-verbal de la Réunion du Comité de Pilotage (Mars 2023)",
      description:
        "Résumé des discussions et décisions clés prises lors de la réunion trimestrielle du comité de pilotage du projet PASCI.",
      category: "PV",
      date: "03/03/2023",
    },
    {
      id: 6,
      title:
        "Infographie : Indicateurs de Performance du Projet PASCI",
      description:
        "Représentation visuelle des principaux indicateurs de performance, montrant les progrès réalisés et les objectifs atteints",
      category: "Infographie",
      date: "18/02/2023",
    },
    {
      id: 7,
      title:
        "Politique de Protection des Données et Confidentialité",
      description:
        "Document officiel décrivant les principes et procédures mis en place par PASCI pour garantir la protection des données",
      category: "Politique",
      date: "01/01/2023",
    },
    {
      id: 8,
      title: "Témoignages de Bénéficiaires du Projet PASCI",
      description:
        "Compilation de récits et d'entretiens avec des bénéficiaires du projet, illustrant l'impact positif de PASCI sur leurs vies.",
      category: "Récit",
      date: "12/12/2022",
    },
    {
      id: 9,
      title: "Plan de Communication Stratégique 2022-2025",
      description:
        "Le plan global définissant les objectifs, les stratégies et les actions de communication pour le projet PASCI sur une période de",
      category: "Plan",
      date: "01/10/2022",
    },
  ];

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

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Rapport: "bg-yellow-100 text-yellow-700",
      Guide: "bg-yellow-100 text-yellow-700",
      Étude: "bg-yellow-100 text-yellow-700",
      Manuel: "bg-yellow-100 text-yellow-700",
      PV: "bg-yellow-100 text-yellow-700",
      Infographie: "bg-yellow-100 text-yellow-700",
      Politique: "bg-yellow-100 text-yellow-700",
      Récit: "bg-yellow-100 text-yellow-700",
      Plan: "bg-yellow-100 text-yellow-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  const handleApplyFilters = () => {
    // Filter logic would go here
    console.log("Filters applied:", {
      selectedCategory,
      selectedType,
      selectedDate,
    });
  };

  const handleResetFilters = () => {
    setSelectedCategory("");
    setSelectedType("");
    setSelectedDate("");
    setSearchQuery("");
  };

  return (
    <section className="py-10 lg:pb-32 lg:pt-10 font-poppins">
      <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 p-8 mb-10 grid lg:grid-cols-2 gap-12">
        
        {/* Left content */}
        <div className="">
          <h2 className="font-bold text-5xl text-[#2a591d] uppercase">Documentation</h2>
          <p className="font-bold text-xl max-w-sm mt-6">
            Profitez de la Base de Données Documentaire des CRASC
          </p>
          <p className="text-gray-600 text-md max-w-xl mt-2">
            Accédez à une collection complète de rapports, études, guides et ressources clés du projet PASCI. Filtrez et recherchez pour trouver rapidement l'information dont vous avez besoin.
          </p>
        </div>

        {/* Right content */}
        <div className="space-y-12">
          <div className="">
            <ImageWithFallback
              src="/images/3a510ba6881dd3274d3f509019311d42ace72cf51c823f60c5e5fe2e112ff892.png"
              alt="image"
              className="w-full h-[300px] object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        {/* Search bar + filters area*/}
        <div className="bg-[#fafafb] rounded-lg shadow-sm p-6 mb-6">
          {/* search bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher des documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent"
            />
          </div>
          {/* filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(e.target.value)
                }
                className="w-full text-xs px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent"
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
              <label className="block text-sm text-gray-700 mb-2">
                Type
              </label>
              <select
                value={selectedType}
                onChange={(e) =>
                  setSelectedType(e.target.value)
                }
                className="w-full text-xs px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent"
              >
                <option value="">Sélectionner un type</option>
                <option value="type1">Type 1</option>
                <option value="type2">Type 2</option>
                <option value="type3">Type 3</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Date
              </label>
              <select
                value={selectedDate}
                onChange={(e) =>
                  setSelectedDate(e.target.value)
                }
                className="w-full text-xs px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent"
              >
                <option value="">Sélectionner une date</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleApplyFilters}
                className="flex-1 bg-[#E05017] text-sm text-white px-2 py-1 rounded-lg hover:bg-[#e67a35] transition-colors cursor-pointer"
              >
                Appliquer les filtres
              </button>
              <button
                onClick={handleResetFilters}
                className="flex-1 bg-white text-sm px-2 rounded-lg cursor-pointer border border-gray-300 hover:bg-gray-100 transition-colors"
              >
                Réinitialiser
              </button>
            </div>
          </div>

        </div>
        {/* End search bar + filters area */}

        {/* Header with Title and View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Documents Disponibles
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${
                viewMode === "grid"
                  ? "bg-[#E05017] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              } transition-colors`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${
                viewMode === "list"
                  ? "bg-[#E05017] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              } transition-colors`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
        {/* End header with Title and View Toggle */}

        {/* Document cards grid */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              : "space-y-4 mb-8"
          }
        >
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h3 className="text-gray-900 mb-3">
                {doc.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {doc.description}
              </p>
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs ${getCategoryColor(doc.category)}`}
                >
                  {doc.category}
                </span>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{doc.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* End document cards grid */}

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
        {/* End pagination */}

      </div>

    </section>
  )
}
