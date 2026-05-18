"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Users,
  Clock,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  X,
  Calendar,
  MapPin,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { fetchAllFormations, IFormation } from "@/lib/fetch-formations";
import { fetchWithAuth } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const PAGE_SIZE = 24;

export default function FormationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isCrascAdmin = !!user?.is_staff && !user?.is_superuser && !!user?.crasc_id;

  const [formations, setFormations] = useState<IFormation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedFormation, setSelectedFormation] = useState<IFormation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Charger les formations
  useEffect(() => {
    const loadFormations = async () => {
      setLoading(true);
      try {
        const data = await fetchAllFormations({
          limit: 100,
          ...(isCrascAdmin && user?.crasc_id ? { crasc_id: user.crasc_id } : {}),
        });
        setFormations(data);
      } catch (error) {
        console.error("Erreur lors du chargement des formations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFormations();
  }, [isCrascAdmin, user?.crasc_id]);

  // Filtrage
  const filteredFormations = formations.filter((formation) => {
    const matchSearch =
      formation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (formation.trainer && formation.trainer.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchStatus =
      !selectedStatus ||
      (selectedStatus === "Publié" && formation.is_published) ||
      (selectedStatus === "Brouillon" && !formation.is_published);
    return matchSearch && matchStatus;
  });

  // Reset page on filter change
  useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedStatus]);

  const totalPages = Math.ceil(filteredFormations.length / PAGE_SIZE);
  const paginatedFormations = filteredFormations.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleViewFormation = (formation: IFormation) => {
    setSelectedFormation(formation);
    setIsModalOpen(true);
  };

  const handleDeleteFormation = async (formationSlug: string, formationId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette formation ?")) {
      return;
    }

    setDeletingId(formationId);
    try {
      const response = await fetchWithAuth(
        `${API_BASE_URL}/api/v1/formations/${formationSlug}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      setFormations(formations.filter((f) => f.id !== formationId));
      if (selectedFormation?.id === formationId) {
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression de la formation");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (formation: IFormation) => {
    try {
      const formData = new FormData();
      formData.append("is_published", (!formation.is_published).toString());

      const response = await fetchWithAuth(
        `${API_BASE_URL}/api/v1/formations/${formation.slug}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour");
      }

      const updatedFormation = await response.json();
      setFormations(
        formations.map((f) =>
          f.id === formation.id ? updatedFormation : f
        )
      );

      if (selectedFormation?.id === formation.id) {
        setSelectedFormation(updatedFormation);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
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

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const totalParticipants = formations.reduce(
    (sum, f) => sum + f.current_participants,
    0
  );

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Gestion des Formations
          </h1>
          <p className="text-gray-600">
            Créez et gérez toutes les formations PASCI
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Formations</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : formations.length}
                </p>
              </div>
              <div className="bg-[#E05017]/10 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-[#E05017]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Participants Inscrits</p>
                <p className="text-3xl font-bold text-blue-600">
                  {totalParticipants}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Formations Complètes</p>
                <p className="text-3xl font-bold text-orange-600">
                  {formations.filter((f) => f.is_full).length}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Formations Publiées</p>
                <p className="text-3xl font-bold text-green-600">
                  {formations.filter((f) => f.is_published).length}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par titre ou formateur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                />
              </div>
            </div>

            {/* Filter by Status */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
              >
                <option value="">Tous les statuts</option>
                <option value="Publié">Publié</option>
                <option value="Brouillon">Brouillon</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Link href="/admin/formations/ajouter">
              <button className="flex items-center gap-2 px-6 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-bold">
                <Plus className="w-5 h-5" />
                Créer une formation
              </button>
            </Link>
          </div>
        </div>

        {/* Formations Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#E05017]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedFormations.map((formation) => (
              <div
                key={formation.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all overflow-hidden"
              >
                {/* Header Image */}
                <div className="relative h-40 bg-gradient-to-br from-[#E05017] to-[#c44315] flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-white/30" />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        formation.is_published
                          ? "bg-green-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {formation.is_published ? "Publié" : "Brouillon"}
                    </span>
                    {formation.is_full && (
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-500 text-white">
                        Complet
                      </span>
                    )}
                    {formation.is_completed && (
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500 text-white">
                        Terminé
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {formation.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>
                        {formation.current_participants}
                        {formation.max_participants && ` / ${formation.max_participants}`} participants
                      </span>
                    </div>
                    {formation.start_date && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(formation.start_date)}</span>
                      </div>
                    )}
                    {formation.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{formation.location}</span>
                      </div>
                    )}
                    {formation.trainer && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="truncate">Par {formation.trainer}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewFormation(formation)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/admin/formations/${formation.slug}/contenu`)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Gérer le contenu"
                      >
                        <BookOpen className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/admin/formations/${formation.slug}/inscriptions`)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Gérer les inscriptions"
                      >
                        <Users className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/admin/formations/${formation.slug}/modifier`)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFormation(formation.slug, formation.id)}
                        disabled={deletingId === formation.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Supprimer"
                      >
                        {deletingId === formation.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredFormations.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-semibold">
              Aucune formation trouvée
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredFormations.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Affichage de {Math.min((currentPage - 1) * PAGE_SIZE + 1, filteredFormations.length)}–{Math.min(currentPage * PAGE_SIZE, filteredFormations.length)} sur {filteredFormations.length} formation{filteredFormations.length > 1 ? 's' : ''}
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ← Précédent
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                  .reduce<(number | string)[]>((acc, p, idx, arr) => {
                    if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('…');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, idx) =>
                    p === '…' ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p as number)}
                        className={`px-3 py-2 text-sm border rounded-lg ${currentPage === p ? 'bg-[#E05017] text-white border-[#E05017]' : 'border-gray-300 hover:bg-gray-100'}`}
                      >
                        {p}
                      </button>
                    )
                  )}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Suivant →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Formation Details Modal */}
        {isModalOpen && selectedFormation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Détails de la formation
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
                  <div className="flex justify-center gap-2 mb-3">
                    <span
                      className={`text-sm font-bold px-4 py-2 rounded-full ${
                        selectedFormation.is_published
                          ? "bg-green-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {selectedFormation.is_published ? "Publié" : "Brouillon"}
                    </span>
                    {selectedFormation.is_full && (
                      <span className="text-sm font-bold px-4 py-2 rounded-full bg-orange-500 text-white">
                        Complet
                      </span>
                    )}
                    {selectedFormation.is_completed && (
                      <span className="text-sm font-bold px-4 py-2 rounded-full bg-blue-500 text-white">
                        Terminé
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {selectedFormation.title}
                  </h3>
                  {selectedFormation.description && (
                    <p className="text-gray-700 leading-relaxed">
                      {selectedFormation.description}
                    </p>
                  )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Users className="w-6 h-6 text-[#E05017] mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedFormation.current_participants}
                      {selectedFormation.max_participants && ` / ${selectedFormation.max_participants}`}
                    </p>
                    <p className="text-xs text-gray-600">Participants</p>
                  </div>

                  {selectedFormation.start_date && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Calendar className="w-6 h-6 text-[#E05017] mx-auto mb-2" />
                      <p className="text-sm font-bold text-gray-900">
                        {formatDateTime(selectedFormation.start_date)}
                      </p>
                      <p className="text-xs text-gray-600">Date de début</p>
                    </div>
                  )}
                </div>

                {/* Information Sections */}
                <div className="space-y-3">
                  {selectedFormation.trainer && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <Users className="w-5 h-5 text-[#E05017] mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Formateur</p>
                        <p className="text-gray-900">{selectedFormation.trainer}</p>
                      </div>
                    </div>
                  )}

                  {selectedFormation.location && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-[#E05017] mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Lieu</p>
                        <p className="text-gray-900">{selectedFormation.location}</p>
                      </div>
                    </div>
                  )}

                  {selectedFormation.end_date && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-[#E05017] mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Date de fin</p>
                        <p className="text-gray-900">{formatDateTime(selectedFormation.end_date)}</p>
                      </div>
                    </div>
                  )}

                  {selectedFormation.registration_deadline && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-[#E05017] mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          Date limite d'inscription
                        </p>
                        <p className="text-gray-900">
                          {formatDateTime(selectedFormation.registration_deadline)}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedFormation.registration_link && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <BookOpen className="w-5 h-5 text-[#E05017] mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                          Lien d'inscription
                        </p>
                        <a
                          href={selectedFormation.registration_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm break-all"
                        >
                          {selectedFormation.registration_link}
                        </a>
                      </div>
                    </div>
                  )}

                  {selectedFormation.materials_link && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <BookOpen className="w-5 h-5 text-[#E05017] mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                          Supports de formation
                        </p>
                        <a
                          href={selectedFormation.materials_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm break-all"
                        >
                          {selectedFormation.materials_link}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      router.push(`/admin/formations/${selectedFormation.slug}/contenu`);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-bold"
                  >
                    <BookOpen className="w-5 h-5" />
                    Contenu
                  </button>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      router.push(`/admin/formations/${selectedFormation.slug}/inscriptions`);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold"
                  >
                    <Users className="w-5 h-5" />
                    Inscrits
                  </button>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      router.push(`/admin/formations/${selectedFormation.slug}/modifier`);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-bold"
                  >
                    <Edit className="w-5 h-5" />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleToggleStatus(selectedFormation)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-bold"
                  >
                    {selectedFormation.is_published
                      ? "Brouillon"
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
