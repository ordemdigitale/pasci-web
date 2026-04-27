"use client";
import { fetchWithAuth } from "@/lib/auth";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Target,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  FileText,
  TrendingUp,
  X,
  Award,
  Loader2,
} from "lucide-react";
import { IOffreProjet } from "@/types/api.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function ProjetsPage() {
  const router = useRouter();
  const [projets, setProjets] = useState<IOffreProjet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomaine, setSelectedDomaine] = useState("");
  const [selectedStatut, setSelectedStatut] = useState("");
  const [selectedProjet, setSelectedProjet] = useState<IOffreProjet | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load projets from API
  useEffect(() => {
    const loadProjets = async () => {
      try {
        setIsLoading(true);
        const response = await fetchWithAuth(`${API_BASE_URL}/api/v1/offre-projets`);
        if (response.ok) {
          const data = await response.json();
          setProjets(data);
        } else {
          console.error("Erreur lors du chargement des projets:", response.statusText);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des projets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjets();
  }, []);

  // Filtrage
  const filteredProjets = projets.filter((projet) => {
    const matchSearch =
      projet.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      projet.osc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      projet.zone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDomaine =
      !selectedDomaine || projet.domaine === selectedDomaine;
    const matchStatut = !selectedStatut || projet.statut === selectedStatut;
    return matchSearch && matchDomaine && matchStatut;
  });

  const handleViewProjet = (projet: IOffreProjet) => {
    setSelectedProjet(projet);
    setIsModalOpen(true);
  };

  const handleDeleteProjet = async (projetSlug: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/v1/offre-projets/${projetSlug}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setProjets(projets.filter((p) => p.slug !== projetSlug));
        } else {
          console.error("Erreur lors de la suppression du projet:", response.statusText);
          alert("Erreur lors de la suppression du projet");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du projet:", error);
        alert("Erreur lors de la suppression du projet");
      }
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

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "En cours":
        return "bg-blue-100 text-blue-700";
      case "En attente":
        return "bg-orange-100 text-orange-700";
      case "Terminé":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const totalBudget = projets.reduce((sum, p) => {
    const budget = parseInt(p.budget.replace(/[^0-9]/g, ""));
    return sum + budget;
  }, 0);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Gestion des Offres de Projets
          </h1>
          <p className="text-gray-600">
            Gérez toutes les offres de projets des OSC membres du CRASC
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Projets</p>
                <p className="text-3xl font-bold text-gray-900">
                  {projets.length}
                </p>
              </div>
              <div className="bg-[#E05017]/10 p-3 rounded-lg">
                <Target className="w-6 h-6 text-[#E05017]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">En Cours</p>
                <p className="text-3xl font-bold text-blue-600">
                  {projets.filter((p) => p.statut === "En cours").length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Terminés</p>
                <p className="text-3xl font-bold text-green-600">
                  {projets.filter((p) => p.statut === "Terminé").length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Budget Total</p>
                <p className="text-2xl font-bold text-purple-600">
                  {(totalBudget / 1000).toFixed(0)}M
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
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
                  placeholder="Rechercher par nom, OSC ou zone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                />
              </div>
            </div>

            {/* Filter by Domaine */}
            <div>
              <select
                value={selectedDomaine}
                onChange={(e) => setSelectedDomaine(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
              >
                <option value="">Tous les domaines</option>
                <option value="Eau & Assainissement">Eau & Assainissement</option>
                <option value="Éducation">Éducation</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Santé">Santé</option>
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
                <option value="En cours">En cours</option>
                <option value="En attente">En attente</option>
                <option value="Terminé">Terminé</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Link
              href="/admin/projets/ajouter"
              className="flex items-center gap-2 px-6 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-bold"
            >
              <Plus className="w-5 h-5" />
              Créer un projet
            </Link>
          </div>
        </div>

        {/* Projets Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-[#E05017] animate-spin mb-4" />
              <p className="text-gray-500 font-semibold">Chargement des projets...</p>
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Projet
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    OSC Porteuse
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Zone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Progression
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProjets.map((projet) => (
                  <tr
                    key={projet.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {projet.nom}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="bg-[#E05017]/10 text-[#E05017] px-2 py-0.5 rounded text-xs font-semibold">
                            {projet.domaine}
                          </span>
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{projet.osc}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{projet.zone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">
                        {projet.budget}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getStatutColor(
                          projet.statut
                        )}`}
                      >
                        {projet.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#E05017] h-2 rounded-full"
                            style={{ width: `${projet.progression}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                          {projet.progression}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewProjet(projet)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/admin/projets/${projet.slug}/modifier`}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteProjet(projet.slug)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProjets.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-semibold">
                  Aucun projet trouvé
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            )}
          </div>
          )}
        </div>

        {/* Projet Details Modal */}
        {isModalOpen && selectedProjet && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Détails du projet
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
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-[#E05017] text-white text-sm font-bold px-3 py-1 rounded-full">
                      {selectedProjet.domaine}
                    </span>
                    <span
                      className={`text-sm font-bold px-3 py-1 rounded-full ${getStatutColor(
                        selectedProjet.statut
                      )}`}
                    >
                      {selectedProjet.statut}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">
                    {selectedProjet.nom}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedProjet.objectif}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-700">
                      Progression du projet
                    </span>
                    <span className="font-bold text-[#E05017]">
                      {selectedProjet.progression}%
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-[#E05017] h-3 rounded-full transition-all"
                      style={{ width: `${selectedProjet.progression}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Building2 className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        OSC Porteuse
                      </p>
                      <p className="text-gray-900 font-bold">
                        {selectedProjet.osc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Zone
                      </p>
                      <p className="text-gray-900 font-bold">
                        {selectedProjet.zone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Durée
                      </p>
                      <p className="text-gray-900 font-bold">
                        {selectedProjet.durée}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Budget
                      </p>
                      <p className="text-gray-900 font-bold">
                        {selectedProjet.budget}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Users className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Bénéficiaires
                      </p>
                      <p className="text-gray-900">
                        {selectedProjet.beneficiaires}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Date de publication
                      </p>
                      <p className="text-gray-900">
                        {formatDate(selectedProjet.date_publication)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Partenaires */}
                {selectedProjet.partenaires_list &&
                  selectedProjet.partenaires_list.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="w-5 h-5 text-[#E05017]" />
                        <h4 className="font-bold text-gray-900">
                          Partenaires
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedProjet.partenaires_list.map(
                          (partenaire: string, idx: number) => (
                            <span
                              key={idx}
                              className="bg-[#E05017]/10 text-[#E05017] px-4 py-2 rounded-lg font-semibold text-sm"
                            >
                              {partenaire}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Link
                    href={`/admin/projets/${selectedProjet.slug}/modifier`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-bold"
                  >
                    <Edit className="w-5 h-5" />
                    Modifier
                  </Link>
                  <Link
                    href={`/offre-projets/${selectedProjet.slug}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold"
                  >
                    <FileText className="w-5 h-5" />
                    Voir la page publique
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
