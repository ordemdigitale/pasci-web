"use client";

import React, { useState, useEffect } from 'react'
import {
  Search,
  Calendar,
  Grid3x3,
  List,
  ChevronLeft,
  ChevronRight,
  Download,
  X,
  Eye,
} from "lucide-react";
import { ImageWithFallback } from '@/lib/imageWithFallback'
import {
  fetchAllDocumentation,
  fetchDocumentationCategories,
  type IDocumentation,
  type DocumentationFilters
} from '@/lib/fetch-documentation'

export default function PageRessources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all"); // 'all', 'documentation', 'fiche'
  const [selectedCategory, setSelectedCategory] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [documents, setDocuments] = useState<IDocumentation[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiche, setSelectedFiche] = useState<IDocumentation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

        // Filter by type if not "all"
        if (selectedType && selectedType !== "all") {
          filters.type = selectedType;
        }

        if (selectedCategory) {
          filters.category = selectedCategory;
        }

        if (searchQuery) {
          filters.search = searchQuery;
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
  }, [currentPage, selectedCategory, searchQuery, selectedType]);

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

  const handleResetFilters = () => {
    setSelectedType("all");
    setSelectedCategory("");
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

  const handleFicheClick = (fiche: IDocumentation) => {
    setSelectedFiche(fiche);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFiche(null);
  };

  // Separate documents by type
  // Si le champ type n'existe pas (ancien serveur), considérer tout comme documentation
  const documentationItems = documents.filter(doc => !doc.type || doc.type === "documentation");
  const ficheItems = documents.filter(doc => doc.type === "fiche");

  // Determine what to display based on selectedType
  let displayItems: IDocumentation[] = [];
  if (selectedType === "all") {
    displayItems = documents;
  } else if (selectedType === "documentation") {
    displayItems = documentationItems;
  } else if (selectedType === "fiche") {
    displayItems = ficheItems;
  }

  const totalItems = displayItems.length;

  return (
    <section className="py-10 lg:pb-32 lg:pt-10 font-poppins">

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-200 rounded-lg p-8 mb-10 bg-[#f0f9ff] grid lg:grid-cols-2 gap-12">

        {/* Left content */}
        <div className="">
          <h2 className="font-bold text-4xl text-[#2a591d] leading-tight">Ressources</h2>
          <p className="font-bold text-xl max-w-sm mt-6">
            Documentation et Fiches Informatives
          </p>
          <p className="text-gray-600 text-md max-w-xl mt-2">
            Accédez à une collection complète de documents, rapports, études, guides et fiches informatives du projet PASCI. Filtrez par type pour trouver rapidement l'information dont vous avez besoin.
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
        {/* Search bar + filters area */}
        <div className="bg-[#fafafb] rounded-lg shadow-sm p-6 mb-6">
          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher des ressources..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Type de ressource
              </label>
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent"
              >
                <option value="all">Toutes les ressources</option>
                <option value="documentation">Documentation</option>
                <option value="fiche">Fiches informatives</option>
              </select>
            </div>

            {selectedType !== "fiche" && (
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-end">
              <button
                onClick={handleResetFilters}
                className="w-full bg-white text-sm px-4 py-2 rounded-lg cursor-pointer border border-gray-300 hover:bg-gray-100 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        </div>
        {/* End search bar + filters area */}

        {/* Header with Title and View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedType === "all" && "Toutes les ressources"}
            {selectedType === "documentation" && "Documentation"}
            {selectedType === "fiche" && "Fiches informatives"}
            {totalItems > 0 && ` (${totalItems})`}
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

        {/* Content Area */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Chargement des ressources...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-red-500">{error}</div>
          </div>
        ) : totalItems === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Aucune ressource trouvée.</div>
          </div>
        ) : (
          <div>
            {/* Documentation Section */}
            {(selectedType === "all" || selectedType === "documentation") && documentationItems.length > 0 && (
              <div className="mb-12">
                {selectedType === "all" && (
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Documentation</h3>
                )}
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {documentationItems.map((doc) => (
                    <div
                      key={`doc-${doc.id}`}
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
              </div>
            )}

            {/* Fiches Informatives Section */}
            {(selectedType === "all" || selectedType === "fiche") && ficheItems.length > 0 && (
              <div className="mb-12">
                {selectedType === "all" && (
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Fiches informatives</h3>
                )}
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {ficheItems.map((fiche) => (
                    <div
                      key={`fiche-${fiche.id}`}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white py-4 px-5 relative min-h-[280px] cursor-pointer"
                      onClick={() => handleFicheClick(fiche)}
                    >
                      {viewMode === "grid" && fiche.thumbnail_url && (
                        <div className="mb-4">
                          <ImageWithFallback
                            src={fiche.thumbnail_url}
                            alt={fiche.title}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className="mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{fiche.title}</h3>
                        <p className="text-sm text-gray-600 mt-3">{fiche.description}</p>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(fiche.created_at)}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-sm text-[#E05017]">
                        <Eye className="w-4 h-4" />
                        <span>Lire la fiche</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {/* End Content Area */}

        {/* Pagination */}
        {!loading && totalItems > 0 && (
          <div className="flex items-center justify-center gap-2 mt-8">
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
              disabled={displayItems.length < itemsPerPage}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
        {/* End pagination */}
      </div>

      {/* Modal for Fiche Informative */}
      {isModalOpen && selectedFiche && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={handleCloseModal}>
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedFiche.title}</h2>
                {selectedFiche.category && (
                  <span className={`px-3 py-1 rounded-full text-xs ${getCategoryColor(selectedFiche.category)}`}>
                    {selectedFiche.category}
                  </span>
                )}
              </div>
              <button
                onClick={handleCloseModal}
                className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Fermer"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {selectedFiche.thumbnail_url && (
                <div className="mb-6">
                  <ImageWithFallback
                    src={selectedFiche.thumbnail_url}
                    alt={selectedFiche.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              {selectedFiche.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedFiche.description}</p>
                </div>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(selectedFiche.created_at)}</span>
                </div>
              </div>

              {/* Display PDF if available */}
              {selectedFiche.file_url && selectedFiche.file_type === 'pdf' && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Document</h3>
                  <iframe
                    src={selectedFiche.file_url}
                    className="w-full h-[600px] border border-gray-300 rounded-lg"
                    title={selectedFiche.title}
                  />
                </div>
              )}

              {/* Download button */}
              {selectedFiche.file_url && (
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => handleDownload(selectedFiche.file_url, selectedFiche.title)}
                    className="px-6 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c94515] transition-colors flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>Télécharger la fiche</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
