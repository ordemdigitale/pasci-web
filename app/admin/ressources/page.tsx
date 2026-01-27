"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Download,
  Eye,
  Search,
  Plus,
  Edit,
  Trash2,
  Folder,
  File,
  X,
  Calendar,
  User,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { 
  fetchAllDocumentation, 
  type IDocumentation,
  type DocumentationFilters 
} from '@/lib/fetch-documentation';
import { fetchWithAuth } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function RessourcesPage() {
  const router = useRouter();
  const [ressources, setRessources] = useState<IDocumentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategorie, setSelectedCategorie] = useState("");
  const [selectedRessource, setSelectedRessource] = useState<IDocumentation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Charger les documents
  useEffect(() => {
    const loadDocuments = async () => {
      setLoading(true);
      try {
        const filters: DocumentationFilters = {
          limit: 100,
          sort_by: "created_at",
          sort_order: "desc",
        };
        
        if (selectedCategorie) {
          filters.category = selectedCategorie;
        }
        
        if (searchQuery) {
          filters.search = searchQuery;
        }

        const docs = await fetchAllDocumentation(filters);
        setRessources(docs);
      } catch (error) {
        console.error("Erreur lors du chargement des documents:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [selectedCategorie, searchQuery]);

  const handleViewRessource = (ressource: IDocumentation) => {
    setSelectedRessource(ressource);
    setIsModalOpen(true);
  };

  const handleDeleteRessource = async (docSlug: string, docId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
      return;
    }

    setDeletingId(docId);
    try {
      const response = await fetchWithAuth(
        `${API_BASE_URL}/api/v1/documentation/${docSlug}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      setRessources(ressources.filter((r) => r.id !== docId));
      if (selectedRessource?.id === docId) {
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression du document");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileName = (filePath: string | null) => {
    if (!filePath) return "Aucun fichier";
    return filePath.split("/").pop() || "Document";
  };

  const categories = Array.from(new Set(ressources.map(r => r.category).filter(Boolean))) as string[];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Gestion des Ressources
          </h1>
          <p className="text-gray-600">
            Gérez la bibliothèque de documentation et fiches informatives
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Ressources</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : ressources.length}
                </p>
              </div>
              <div className="bg-[#E05017]/10 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-[#E05017]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Catégories</p>
                <p className="text-3xl font-bold text-blue-600">
                  {categories.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Folder className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Avec fichiers</p>
                <p className="text-3xl font-bold text-purple-600">
                  {ressources.filter((r) => r.file_path).length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <File className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Documents</p>
                <p className="text-3xl font-bold text-green-600">
                  {ressources.length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Download className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par titre, description ou auteur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                />
              </div>
            </div>

            {/* Filter by Categorie */}
            <div>
              <select
                value={selectedCategorie}
                onChange={(e) => setSelectedCategorie(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Link
              href="/admin/ressources/ajouter"
              className="flex items-center gap-2 px-6 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-bold"
            >
              <Plus className="w-5 h-5" />
              Ajouter un document
            </Link>
          </div>
        </div>

        {/* Ressources Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#E05017]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ressources.map((ressource) => (
              <div
                key={ressource.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-[#E05017]/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-[#E05017]" />
                    </div>
                    {ressource.category && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">
                        {ressource.category}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {ressource.title}
                  </h3>
                  {ressource.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {ressource.description}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Fichier:</span>
                      <span className="font-semibold text-gray-900 text-xs">
                        {getFileName(ressource.file_path)}
                      </span>
                    </div>
                    {ressource.file_size && (
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Taille:</span>
                        <span className="font-semibold text-gray-900">
                          {formatFileSize(ressource.file_size)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{formatDate(ressource.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewRessource(ressource)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/admin/ressources/${ressource.slug}/modifier`)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRessource(ressource.slug || "", ressource.id)}
                        disabled={deletingId === ressource.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Supprimer"
                      >
                        {deletingId === ressource.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {ressource.file_url && (
                      <a
                        href={ressource.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Télécharger"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && ressources.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-semibold">
              Aucune ressource trouvée
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}

        {/* Ressource Details Modal */}
        {isModalOpen && selectedRessource && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Détails de la ressource
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-[#E05017]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-[#E05017]" />
                  </div>
                  {selectedRessource.category && (
                    <span className="bg-blue-100 text-blue-700 text-sm font-bold px-4 py-2 rounded-full">
                      {selectedRessource.category}
                    </span>
                  )}
                  <h3 className="text-2xl font-bold text-gray-900 mt-4 mb-3">
                    {selectedRessource.title}
                  </h3>
                  {selectedRessource.description && (
                    <p className="text-gray-700 leading-relaxed">
                      {selectedRessource.description}
                    </p>
                  )}
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedRessource.category && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <FileText className="w-5 h-5 text-[#E05017] mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          Catégorie
                        </p>
                        <p className="text-gray-900">{selectedRessource.category}</p>
                      </div>
                    </div>
                  )}

                  {selectedRessource.file_path && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <File className="w-5 h-5 text-[#E05017] mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          Fichier
                        </p>
                        <p className="text-gray-900 text-sm">
                          {getFileName(selectedRessource.file_path)}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedRessource.file_size && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-[#E05017] mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          Taille
                        </p>
                        <p className="text-gray-900">{formatFileSize(selectedRessource.file_size)}</p>
                      </div>
                    </div>
                  )}

                  {selectedRessource.file_type && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <FileText className="w-5 h-5 text-[#E05017] mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          Type de fichier
                        </p>
                        <p className="text-gray-900">{selectedRessource.file_type.toUpperCase()}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg md:col-span-2">
                    <Calendar className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Date d'ajout
                      </p>
                      <p className="text-gray-900">
                        {formatDate(selectedRessource.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  {selectedRessource.file_url && (
                    <a
                      href={selectedRessource.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold"
                    >
                      <Download className="w-5 h-5" />
                      Télécharger
                    </a>
                  )}
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      router.push(`/admin/ressources/${selectedRessource.slug}/modifier`);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-bold"
                  >
                    <Edit className="w-5 h-5" />
                    Modifier
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
