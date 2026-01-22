"use client";

import { useState } from "react";
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
} from "lucide-react";

// Mock data
const mockRessources = [
  {
    id: 1,
    titre: "Guide de rédaction de propositions de projets",
    type: "Documentation",
    categorie: "Guide",
    description:
      "Guide complet pour aider les OSC à rédiger des propositions de projets convaincantes et bien structurées.",
    fichier: "guide-redaction-propositions.pdf",
    taille: "2.5 MB",
    telechargements: 456,
    date_ajout: "2025-12-15",
    auteur: "Équipe Formation PASCI",
    tags: ["Guide", "Projets", "Rédaction"],
  },
  {
    id: 2,
    titre: "Modèle de rapport narratif",
    type: "Documentation",
    categorie: "Modèle",
    description:
      "Modèle standard pour la rédaction de rapports narratifs de projets à soumettre aux partenaires.",
    fichier: "modele-rapport-narratif.docx",
    taille: "156 KB",
    telechargements: 892,
    date_ajout: "2025-11-20",
    auteur: "Service Monitoring",
    tags: ["Modèle", "Rapport", "Documentation"],
  },
  {
    id: 3,
    titre: "Stratégies de mobilisation communautaire",
    type: "Fiche Informative",
    categorie: "Stratégie",
    description:
      "Fiche détaillant les meilleures pratiques pour mobiliser les communautés dans les projets de développement.",
    fichier: "mobilisation-communautaire.pdf",
    taille: "1.8 MB",
    telechargements: 634,
    date_ajout: "2025-10-10",
    auteur: "Experts PASCI",
    tags: ["Mobilisation", "Communauté", "Stratégie"],
  },
  {
    id: 4,
    titre: "Checklist de suivi de projet",
    type: "Fiche Informative",
    categorie: "Outil",
    description:
      "Checklist pratique pour le suivi et l'évaluation continue des activités de projet.",
    fichier: "checklist-suivi-projet.xlsx",
    taille: "89 KB",
    telechargements: 1203,
    date_ajout: "2025-09-25",
    auteur: "Service Monitoring",
    tags: ["Checklist", "Suivi", "Évaluation"],
  },
  {
    id: 5,
    titre: "Manuel de gestion financière pour OSC",
    type: "Documentation",
    categorie: "Manuel",
    description:
      "Manuel complet sur la gestion financière adaptée aux besoins spécifiques des organisations de la société civile.",
    fichier: "manuel-gestion-financiere.pdf",
    taille: "5.2 MB",
    telechargements: 2341,
    date_ajout: "2025-08-15",
    auteur: "Direction Financière PASCI",
    tags: ["Finance", "Manuel", "Gestion"],
  },
];

export default function RessourcesPage() {
  const [ressources, setRessources] = useState(mockRessources);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategorie, setSelectedCategorie] = useState("");
  const [selectedRessource, setSelectedRessource] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtrage
  const filteredRessources = ressources.filter((ressource) => {
    const matchSearch =
      ressource.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ressource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ressource.auteur.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = !selectedType || ressource.type === selectedType;
    const matchCategorie =
      !selectedCategorie || ressource.categorie === selectedCategorie;
    return matchSearch && matchType && matchCategorie;
  });

  const handleViewRessource = (ressource: any) => {
    setSelectedRessource(ressource);
    setIsModalOpen(true);
  };

  const handleDeleteRessource = (ressourceId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette ressource ?")) {
      setRessources(ressources.filter((r) => r.id !== ressourceId));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const totalTelechargements = ressources.reduce(
    (sum, r) => sum + r.telechargements,
    0
  );

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
                  {ressources.length}
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
                <p className="text-sm text-gray-500 mb-1">Documentation</p>
                <p className="text-3xl font-bold text-blue-600">
                  {ressources.filter((r) => r.type === "Documentation").length}
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
                <p className="text-sm text-gray-500 mb-1">Fiches</p>
                <p className="text-3xl font-bold text-purple-600">
                  {
                    ressources.filter((r) => r.type === "Fiche Informative")
                      .length
                  }
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
                <p className="text-sm text-gray-500 mb-1">Téléchargements</p>
                <p className="text-3xl font-bold text-green-600">
                  {totalTelechargements}
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

            {/* Filter by Type */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
              >
                <option value="">Tous les types</option>
                <option value="Documentation">Documentation</option>
                <option value="Fiche Informative">Fiche Informative</option>
              </select>
            </div>

            {/* Filter by Categorie */}
            <div>
              <select
                value={selectedCategorie}
                onChange={(e) => setSelectedCategorie(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
              >
                <option value="">Toutes les catégories</option>
                <option value="Guide">Guide</option>
                <option value="Modèle">Modèle</option>
                <option value="Manuel">Manuel</option>
                <option value="Outil">Outil</option>
                <option value="Stratégie">Stratégie</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button className="flex items-center gap-2 px-6 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-bold">
              <Plus className="w-5 h-5" />
              Ajouter une ressource
            </button>
          </div>
        </div>

        {/* Ressources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRessources.map((ressource) => (
            <div
              key={ressource.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-[#E05017]/10 rounded-lg flex items-center justify-center">
                    {ressource.type === "Documentation" ? (
                      <Folder className="w-6 h-6 text-[#E05017]" />
                    ) : (
                      <File className="w-6 h-6 text-[#E05017]" />
                    )}
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">
                    {ressource.categorie}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                  {ressource.titre}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {ressource.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Fichier:</span>
                    <span className="font-semibold text-gray-900">
                      {ressource.fichier}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Taille:</span>
                    <span className="font-semibold text-gray-900">
                      {ressource.taille}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Download className="w-4 h-4 text-gray-400" />
                    <span>{ressource.telechargements} téléchargements</span>
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
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRessource(ressource.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRessources.length === 0 && (
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
                    {selectedRessource.type === "Documentation" ? (
                      <Folder className="w-10 h-10 text-[#E05017]" />
                    ) : (
                      <File className="w-10 h-10 text-[#E05017]" />
                    )}
                  </div>
                  <span className="bg-blue-100 text-blue-700 text-sm font-bold px-4 py-2 rounded-full">
                    {selectedRessource.categorie}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mt-4 mb-3">
                    {selectedRessource.titre}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedRessource.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2">
                    <Download className="w-6 h-6 text-green-600" />
                    <span className="font-bold text-3xl text-green-600">
                      {selectedRessource.telechargements}
                    </span>
                    <span className="text-gray-700">téléchargements</span>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <FileText className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Type
                      </p>
                      <p className="text-gray-900">{selectedRessource.type}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <File className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Fichier
                      </p>
                      <p className="text-gray-900 text-sm">
                        {selectedRessource.fichier}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Taille
                      </p>
                      <p className="text-gray-900">{selectedRessource.taille}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Auteur
                      </p>
                      <p className="text-gray-900">{selectedRessource.auteur}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg md:col-span-2">
                    <Calendar className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Date d'ajout
                      </p>
                      <p className="text-gray-900">
                        {formatDate(selectedRessource.date_ajout)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRessource.tags.map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold">
                    <Download className="w-5 h-5" />
                    Télécharger
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-bold">
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
