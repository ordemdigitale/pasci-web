"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Building2,
  Clock,
  DollarSign,
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
  Target,
  Loader2,
} from "lucide-react";
import { IJobs } from "@/types/api.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const PAGE_SIZE = 24;

export default function EmploisPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<IJobs[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatut, setSelectedStatut] = useState("");
  const [selectedJob, setSelectedJob] = useState<IJobs | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Load jobs from API
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/jobs`);
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des offres d'emploi:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, []);

  // Filtrage
  const filteredJobs = jobs.filter((job) => {
    const matchSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.employer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = !selectedType || job.type === selectedType;

    // Map statut filter to is_expired field
    let matchStatut = true;
    if (selectedStatut === "Publié") {
      matchStatut = !job.is_expired;
    } else if (selectedStatut === "Expiré") {
      matchStatut = job.is_expired;
    }

    return matchSearch && matchType && matchStatut;
  });

  // Reset page on filter change
  useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedType, selectedStatut]);

  const totalPages = Math.ceil(filteredJobs.length / PAGE_SIZE);
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleViewJob = (job: IJobs) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleDeleteJob = async (slug: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette offre d'emploi ?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/jobs/${slug}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setJobs(jobs.filter((j) => j.slug !== slug));
        if (selectedJob?.slug === slug) {
          setIsModalOpen(false);
        }
      } else {
        alert("Erreur lors de la suppression de l'offre d'emploi");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression de l'offre d'emploi");
    }
  };

  const handleToggleExpired = async (slug: string, currentExpired: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/jobs/${slug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_expired: !currentExpired }),
      });

      if (response.ok) {
        const updatedJob = await response.json();
        setJobs(jobs.map((j) => (j.slug === slug ? updatedJob : j)));
        if (selectedJob?.slug === slug) {
          setSelectedJob(updatedJob);
        }
      } else {
        alert("Erreur lors de la mise à jour du statut");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la mise à jour du statut");
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

  const getJobStatus = (job: IJobs) => {
    return job.is_expired ? "Expiré" : "Publié";
  };

  const getStatutColor = (isExpired: boolean) => {
    return isExpired
      ? "bg-red-100 text-red-700"
      : "bg-green-100 text-green-700";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#E05017]" />
        <p className="mt-4 text-gray-600">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Gestion des Offres d'Emploi
          </h1>
          <p className="text-gray-600">
            Créez et gérez toutes les offres d'emploi sur la plateforme PASCI
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Offres</p>
                <p className="text-3xl font-bold text-gray-900">{jobs.length}</p>
              </div>
              <div className="bg-[#E05017]/10 p-3 rounded-lg">
                <Briefcase className="w-6 h-6 text-[#E05017]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Offres Actives</p>
                <p className="text-3xl font-bold text-green-600">
                  {jobs.filter((j) => !j.is_expired).length}
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
                <p className="text-sm text-gray-500 mb-1">Offres Expirées</p>
                <p className="text-3xl font-bold text-red-600">
                  {jobs.filter((j) => j.is_expired).length}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
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
                  placeholder="Rechercher par titre, employeur ou localisation..."
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
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="Stage">Stage</option>
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
                <option value="Expiré">Expiré</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Link
              href="/admin/emplois/ajouter"
              className="flex items-center gap-2 px-6 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-bold"
            >
              <Plus className="w-5 h-5" />
              Créer une offre d'emploi
            </Link>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${getStatutColor(
                          job.is_expired
                        )}`}
                      >
                        {getJobStatus(job)}
                      </span>
                      <span className="bg-[#E05017] text-white text-xs font-bold px-3 py-1 rounded-full">
                        {job.type}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                      {job.title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {job.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span>{job.employer}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Publié le {formatDate(job.publication_date)}</span>
                  </div>
                  {job.expiration_date && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Expire le {formatDate(job.expiration_date)}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewJob(job)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Voir détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/admin/emplois/${job.slug}/modifier`}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteJob(job.slug)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-semibold">
              Aucune offre d'emploi trouvée
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredJobs.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Affichage de {Math.min((currentPage - 1) * PAGE_SIZE + 1, filteredJobs.length)}–{Math.min(currentPage * PAGE_SIZE, filteredJobs.length)} sur {filteredJobs.length} offre{filteredJobs.length > 1 ? 's' : ''}
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

        {/* Job Details Modal */}
        {isModalOpen && selectedJob && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Détails de l'offre d'emploi
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
                    <span
                      className={`text-sm font-bold px-3 py-1 rounded-full ${getStatutColor(
                        selectedJob.is_expired
                      )}`}
                    >
                      {getJobStatus(selectedJob)}
                    </span>
                    <span className="bg-[#E05017] text-white text-sm font-bold px-3 py-1 rounded-full">
                      {selectedJob.type}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">
                    {selectedJob.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedJob.description}
                  </p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Building2 className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Employeur
                      </p>
                      <p className="text-gray-900 font-bold">
                        {selectedJob.employer}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Localisation
                      </p>
                      <p className="text-gray-900 font-bold">
                        {selectedJob.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Briefcase className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Type de contrat
                      </p>
                      <p className="text-gray-900 font-bold">
                        {selectedJob.type}
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
                        {formatDate(selectedJob.publication_date)}
                      </p>
                    </div>
                  </div>

                  {selectedJob.expiration_date && (
                    <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          Date d'expiration
                        </p>
                        <p className="text-red-600 font-bold">
                          {formatDate(selectedJob.expiration_date)}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Créée le
                      </p>
                      <p className="text-gray-900">
                        {formatDate(selectedJob.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Link
                    href={`/admin/emplois/${selectedJob.slug}/modifier`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-bold"
                  >
                    <Edit className="w-5 h-5" />
                    Modifier
                  </Link>
                  <button
                    onClick={() => handleToggleExpired(selectedJob.slug, selectedJob.is_expired)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-bold"
                  >
                    {selectedJob.is_expired
                      ? "Marquer comme active"
                      : "Marquer comme expirée"}
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
