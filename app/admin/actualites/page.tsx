"use client";

import { useState } from "react";
import {
  Newspaper,
  Eye,
  Calendar,
  User,
  Search,
  Plus,
  Edit,
  Trash2,
  Tag,
  TrendingUp,
  MessageSquare,
  Share2,
  X,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
} from "lucide-react";

// Mock data
const mockActualites = [
  {
    id: 1,
    titre: "Lancement du nouveau programme CRASC 2026",
    slug: "lancement-programme-crasc-2026",
    contenu:
      "Le PASCI est fier d'annoncer le lancement d'un nouveau programme de renforcement des capacités des CRASC à travers toute la Côte d'Ivoire. Ce programme ambitieux vise à améliorer la gouvernance et l'efficacité des organisations de la société civile.",
    categorie: "Annonce",
    auteur: "Direction PASCI",
    date_publication: "2026-01-20",
    statut: "Publié",
    image: "/images/actualites/crasc-2026.jpg",
    vues: 1245,
    commentaires: 34,
    partages: 56,
    tags: ["CRASC", "Programme", "Renforcement"],
  },
  {
    id: 2,
    titre: "Atelier de formation sur la mobilisation de ressources",
    slug: "atelier-mobilisation-ressources",
    contenu:
      "Du 15 au 17 février 2026, le PASCI organise un atelier intensif sur les stratégies de mobilisation de ressources pour les OSC. Cet événement réunira plus de 50 organisations à Abidjan.",
    categorie: "Formation",
    auteur: "Équipe Formation",
    date_publication: "2026-01-18",
    statut: "Publié",
    image: "/images/actualites/atelier-formation.jpg",
    vues: 892,
    commentaires: 18,
    partages: 41,
    tags: ["Formation", "Mobilisation", "Ressources"],
  },
  {
    id: 3,
    titre: "Nouveau partenariat avec l'Union Européenne",
    slug: "partenariat-union-europeenne",
    contenu:
      "Le PASCI et l'Union Européenne renforcent leur collaboration avec la signature d'un nouvel accord de partenariat d'une durée de 3 ans. Ce partenariat permettra de financer de nombreux projets sociaux.",
    categorie: "Partenariat",
    auteur: "Relations Internationales",
    date_publication: "2026-01-15",
    statut: "Publié",
    image: "/images/actualites/partenariat-ue.jpg",
    vues: 2103,
    commentaires: 67,
    partages: 128,
    tags: ["Partenariat", "Union Européenne", "Financement"],
  },
  {
    id: 4,
    titre: "Rapport d'impact 2025 : Des résultats encourageants",
    slug: "rapport-impact-2025",
    contenu:
      "Le rapport d'impact 2025 du PASCI révèle des progrès significatifs dans l'accompagnement des OSC. Plus de 300 projets ont été financés pour un montant total de 15 milliards FCFA.",
    categorie: "Rapport",
    auteur: "Service Monitoring",
    date_publication: "2026-01-10",
    statut: "Brouillon",
    image: "/images/actualites/rapport-2025.jpg",
    vues: 0,
    commentaires: 0,
    partages: 0,
    tags: ["Rapport", "Impact", "Statistiques"],
  },
  {
    id: 5,
    titre: "Appel à candidatures : Prix de l'Innovation Sociale 2026",
    slug: "prix-innovation-sociale-2026",
    contenu:
      "Le PASCI lance son Prix annuel de l'Innovation Sociale. Les OSC ont jusqu'au 31 mars pour soumettre leurs projets innovants. Le grand prix est doté de 10 millions FCFA.",
    categorie: "Concours",
    auteur: "Coordination PASCI",
    date_publication: "2026-01-05",
    statut: "Publié",
    image: "/images/actualites/prix-innovation.jpg",
    vues: 3421,
    commentaires: 95,
    partages: 234,
    tags: ["Concours", "Innovation", "Prix"],
  },
];

export default function ActualitesPage() {
  const [actualites, setActualites] = useState(mockActualites);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategorie, setSelectedCategorie] = useState("");
  const [selectedStatut, setSelectedStatut] = useState("");
  const [selectedActualite, setSelectedActualite] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtrage
  const filteredActualites = actualites.filter((actu) => {
    const matchSearch =
      actu.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      actu.contenu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      actu.auteur.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategorie =
      !selectedCategorie || actu.categorie === selectedCategorie;
    const matchStatut = !selectedStatut || actu.statut === selectedStatut;
    return matchSearch && matchCategorie && matchStatut;
  });

  const handleViewActualite = (actu: any) => {
    setSelectedActualite(actu);
    setIsModalOpen(true);
  };

  const handleDeleteActualite = (actuId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette actualité ?")) {
      setActualites(actualites.filter((a) => a.id !== actuId));
    }
  };

  const handleToggleStatus = (actuId: number) => {
    setActualites(
      actualites.map((a) =>
        a.id === actuId
          ? {
              ...a,
              statut: a.statut === "Publié" ? "Brouillon" : "Publié",
            }
          : a
      )
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatutColor = (statut: string) => {
    return statut === "Publié"
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-700";
  };

  const totalVues = actualites.reduce((sum, actu) => sum + actu.vues, 0);
  const totalCommentaires = actualites.reduce(
    (sum, actu) => sum + actu.commentaires,
    0
  );

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Gestion des Actualités
          </h1>
          <p className="text-gray-600">
            Créez et gérez toutes les actualités et annonces PASCI
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Actualités</p>
                <p className="text-3xl font-bold text-gray-900">
                  {actualites.length}
                </p>
              </div>
              <div className="bg-[#E05017]/10 p-3 rounded-lg">
                <Newspaper className="w-6 h-6 text-[#E05017]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Vues</p>
                <p className="text-3xl font-bold text-blue-600">{totalVues}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Commentaires</p>
                <p className="text-3xl font-bold text-purple-600">
                  {totalCommentaires}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Publiées</p>
                <p className="text-3xl font-bold text-green-600">
                  {actualites.filter((a) => a.statut === "Publié").length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
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
                  placeholder="Rechercher par titre, contenu ou auteur..."
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
                <option value="Annonce">Annonce</option>
                <option value="Formation">Formation</option>
                <option value="Partenariat">Partenariat</option>
                <option value="Rapport">Rapport</option>
                <option value="Concours">Concours</option>
              </select>
            </div>

            {/* Filter by Statut */}
            <div>
              <select
                value={selectedStatut}
                onChange={(e) => setSelectedStatut(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
              >
                <option value="">Tous les statuts</option>
                <option value="Publié">Publié</option>
                <option value="Brouillon">Brouillon</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button className="flex items-center gap-2 px-6 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-bold">
              <Plus className="w-5 h-5" />
              Créer une actualité
            </button>
          </div>
        </div>

        {/* Actualites List */}
        <div className="space-y-4">
          {filteredActualites.map((actu) => (
            <div
              key={actu.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="md:w-64 h-48 bg-gradient-to-br from-[#E05017] to-[#c44315] flex items-center justify-center relative">
                  <ImageIcon className="w-16 h-16 text-white/30" />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${getStatutColor(
                        actu.statut
                      )}`}
                    >
                      {actu.statut}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-[#E05017]/10 text-[#E05017] text-xs font-bold px-3 py-1 rounded-full">
                          {actu.categorie}
                        </span>
                      </div>
                      <h3 className="font-bold text-xl text-gray-900 mb-2">
                        {actu.titre}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {actu.contenu}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{actu.auteur}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(actu.date_publication)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{actu.vues}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{actu.commentaires}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="w-4 h-4" />
                        <span>{actu.partages}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewActualite(actu)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteActualite(actu.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredActualites.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-semibold">
              Aucune actualité trouvée
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}

        {/* Actualite Details Modal */}
        {isModalOpen && selectedActualite && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Détails de l'actualité
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Image Header */}
                <div className="relative h-64 bg-gradient-to-br from-[#E05017] to-[#c44315] rounded-xl flex items-center justify-center">
                  <ImageIcon className="w-24 h-24 text-white/20" />
                  <div className="absolute top-4 left-4">
                    <span
                      className={`text-sm font-bold px-4 py-2 rounded-full ${getStatutColor(
                        selectedActualite.statut
                      )}`}
                    >
                      {selectedActualite.statut}
                    </span>
                  </div>
                </div>

                {/* Title & Category */}
                <div>
                  <span className="bg-[#E05017]/10 text-[#E05017] text-sm font-bold px-4 py-2 rounded-full">
                    {selectedActualite.categorie}
                  </span>
                  <h3 className="text-3xl font-bold text-gray-900 mt-3 mb-4">
                    {selectedActualite.titre}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedActualite.contenu}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Eye className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedActualite.vues}
                    </p>
                    <p className="text-xs text-gray-600">Vues</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">
                      {selectedActualite.commentaires}
                    </p>
                    <p className="text-xs text-gray-600">Commentaires</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Share2 className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">
                      {selectedActualite.partages}
                    </p>
                    <p className="text-xs text-gray-600">Partages</p>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Auteur
                      </p>
                      <p className="text-gray-900">{selectedActualite.auteur}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Date de publication
                      </p>
                      <p className="text-gray-900">
                        {formatDate(selectedActualite.date_publication)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[#E05017]" />
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedActualite.tags.map((tag: string, idx: number) => (
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
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-bold">
                    <Edit className="w-5 h-5" />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleToggleStatus(selectedActualite.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-bold"
                  >
                    {selectedActualite.statut === "Publié"
                      ? "Mettre en brouillon"
                      : "Publier"}
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
