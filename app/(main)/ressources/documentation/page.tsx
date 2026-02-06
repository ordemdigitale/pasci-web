"use client";

import React, {useState, useEffect} from 'react'
import {
  Search,
  Calendar,
  Grid3x3,
  List,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
} from "lucide-react";
import { ImageWithFallback } from '@/lib/imageWithFallback'
import { 
  fetchAllDocumentation, 
  fetchDocumentationCategories,
  type IDocumentation,
  type DocumentationFilters 
} from '@/lib/fetch-documentation'

interface IDocument {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  date: string;
  file_url: string | null;
  thumbnail_url: string;
}

export default function PageDocumentation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [documents, setDocuments] = useState<IDocumentation[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 12;

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await fetchDocumentationCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Erreur lors du chargement des catégories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch documents when filters change
  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const filters: DocumentationFilters = {
          skip: (currentPage - 1) * itemsPerPage,
          limit: itemsPerPage,
          sort_by: "created_at",
          sort_order: "desc",
        };

        if (selectedCategory) {
          filters.category = selectedCategory;
        }

        if (searchQuery) {
          filters.search = searchQuery;
        }

        // Filter by year if selected
        if (selectedDate) {
          // We'll filter by year in the search or handle it separately
          // For now, we'll use search to filter by year in created_at
        }

        const docs = await fetchAllDocumentation(filters);
        setDocuments(docs);
      } catch (err: any) {
        console.error("Erreur lors du chargement des documents:", err);
        setError("Impossible de charger les documents. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [currentPage, selectedCategory, searchQuery, selectedDate]);

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
    // Filters are applied automatically via useEffect
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleResetFilters = () => {
    setSelectedCategory("");
    setSelectedDate("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const handleDownload = (fileUrl: string | null, title: string) => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  return (
    <section className="py-10 lg:pb-32 lg:pt-10 font-poppins">
      
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-200 rounded-lg p-8 mb-10 bg-[#f0f9ff] grid lg:grid-cols-2 gap-12">
          
          {/* Left content */}
          <div className="">
            <h2 className="font-bold text-4xl text-[#2a591d] leading-tight">Documentation</h2>
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
          <div className="relative mb-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher des documents..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleApplyFilters();
                }
              }}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent"
            />
          </div>
          {/* filters */}
          {/*<div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
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
                Année
              </label>
              <select
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-xs px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent"
              >
                <option value="">Toutes les années</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
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
          </div>*/}

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
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Chargement des documents...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-red-500">{error}</div>
          </div>
        ) : documents.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Aucun document trouvé.</div>
          </div>
        ) : (
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
                onClick={() => doc.file_url && handleDownload(doc.file_url, doc.title)}
              >
                {viewMode === "grid" && doc.thumbnail_url && (
                  <div className="mb-4">
                    <ImageWithFallback
                      src={doc.thumbnail_url}
                      alt={doc.title}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                )}
                <h3 className="text-gray-900 mb-3 font-semibold">
                  {doc.title}
                </h3>
                {doc.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {doc.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  {doc.category && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${getCategoryColor(doc.category)}`}
                    >
                      {doc.category}
                    </span>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(doc.created_at)}</span>
                  </div>
                </div>
                {doc.file_url && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-[#E05017]">
                    <Download className="w-4 h-4" />
                    <span>Télécharger</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {/* End document cards grid */}

        {/* Pagination */}
        {!loading && documents.length > 0 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="px-4 py-2 text-sm text-gray-700">
              Page {currentPage}
            </span>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={documents.length < itemsPerPage}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
        {/* End pagination */}

      </div>
      
    </section>
  )
}
