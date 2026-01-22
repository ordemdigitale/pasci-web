"use client";

import { useState } from "react";
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
} from "lucide-react";

// Mock data basé sur les offres d'emploi existantes
const mockJobs = [
  {
    id: "1",
    title: "Chargé de Mission Innovation",
    description:
      "Rejoignez notre équipe dynamique pour piloter des initiatives stratégiques au sein de l'espace collaboratif PASCI.",
    location: "Abidjan, Côte d'Ivoire",
    type: "CDI",
    slug: "charge-mission-innovation",
    employer: "PASCI Côte d'Ivoire",
    publication_date: new Date().toISOString(),
    salaire: "Non spécifié",
    experience: "3-5 ans",
    candidatures: 45,
    statut: "Publié",
    date_limite: "2026-03-15",
  },
  {
    id: "2",
    title: "Responsable Communication Digitale",
    description:
      "Nous recherchons un(e) Responsable Communication Digitale passionné(e) pour développer et animer notre présence en ligne.",
    location: "Dakar, Sénégal",
    type: "CDD",
    slug: "responsable-communication-digitale",
    employer: "PASCI Sénégal",
    publication_date: new Date(Date.now() - 86400000).toISOString(),
    salaire: "500,000 - 700,000 FCFA",
    experience: "2-4 ans",
    candidatures: 32,
    statut: "Publié",
    date_limite: "2026-02-28",
  },
  {
    id: "3",
    title: "Chef de Projet Développement Durable",
    description:
      "Pilotez des projets d'envergure dans le domaine du développement durable et de la responsabilité sociétale.",
    location: "Ouagadougou, Burkina Faso",
    type: "CDI",
    slug: "chef-projet-developpement-durable",
    employer: "PASCI Burkina Faso",
    publication_date: new Date(Date.now() - 172800000).toISOString(),
    salaire: "800,000 - 1,200,000 FCFA",
    experience: "5-7 ans",
    candidatures: 28,
    statut: "Publié",
    date_limite: "2026-03-01",
  },
  {
    id: "4",
    title: "Analyste de Données Impact",
    description:
      "Transformez les données en insights stratégiques pour mesurer et optimiser l'impact de nos programmes.",
    location: "Dakar, Sénégal",
    type: "CDI",
    slug: "analyste-donnees-impact",
    employer: "PASCI Sénégal",
    publication_date: new Date(Date.now() - 259200000).toISOString(),
    salaire: "600,000 - 900,000 FCFA",
    experience: "3-5 ans",
    candidatures: 56,
    statut: "Publié",
    date_limite: "2026-02-20",
  },
  {
    id: "5",
    title: "Coordonnateur RSE Senior",
    description:
      "Accompagnez les entreprises dans leur démarche RSE et favorisez les partenariats stratégiques.",
    location: "Abidjan, Côte d'Ivoire",
    type: "CDI",
    slug: "coordonnateur-rse-senior",
    employer: "PASCI Côte d'Ivoire",
    publication_date: new Date(Date.now() - 345600000).toISOString(),
    salaire: "900,000 - 1,500,000 FCFA",
    experience: "7-10 ans",
    candidatures: 19,
    statut: "Expiré",
    date_limite: "2026-01-15",
  },
  {
    id: "6",
    title: "Assistant(e) de Direction",
    description:
      "Apportez votre soutien à l'équipe de direction dans la gestion quotidienne et la coordination des activités de PASCI.",
    location: "Lomé, Togo",
    type: "CDD",
    slug: "assistant-direction",
    employer: "PASCI Togo",
    publication_date: new Date(Date.now() - 432000000).toISOString(),
    salaire: "300,000 - 450,000 FCFA",
    experience: "1-3 ans",
    candidatures: 67,
    statut: "Brouillon",
    date_limite: "2026-04-01",
  },
];

export default function EmploisPage() {
  const [jobs, setJobs] = useState(mockJobs);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatut, setSelectedStatut] = useState("");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtrage
  const filteredJobs = jobs.filter((job) => {
    const matchSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.employer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = !selectedType || job.type === selectedType;
    const matchStatut = !selectedStatut || job.statut === selectedStatut;
    return matchSearch && matchType && matchStatut;
  });

  const handleViewJob = (job: any) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleDeleteJob = (jobId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette offre d'emploi ?")) {
      setJobs(jobs.filter((j) => j.id !== jobId));
    }
  };

  const handleToggleStatus = (jobId: string) => {
    setJobs(
      jobs.map((j) =>
        j.id === jobId
          ? {
              ...j,
              statut: j.statut === "Publié" ? "Brouillon" : "Publié",
            }
          : j
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
    switch (statut) {
      case "Publié":
        return "bg-green-100 text-green-700";
      case "Brouillon":
        return "bg-gray-100 text-gray-700";
      case "Expiré":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const totalCandidatures = jobs.reduce((sum, job) => sum + job.candidatures, 0);

  return (
    <div className="min-h-screen bg-gray-50 font-poppins p-8">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                <p className="text-sm text-gray-500 mb-1">Offres Publiées</p>
                <p className="text-3xl font-bold text-green-600">
                  {jobs.filter((j) => j.statut === "Publié").length}
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
                <p className="text-sm text-gray-500 mb-1">Total Candidatures</p>
                <p className="text-3xl font-bold text-blue-600">
                  {totalCandidatures}
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
                <p className="text-sm text-gray-500 mb-1">Offres Expirées</p>
                <p className="text-3xl font-bold text-red-600">
                  {jobs.filter((j) => j.statut === "Expiré").length}
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
            <button className="flex items-center gap-2 px-6 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-bold">
              <Plus className="w-5 h-5" />
              Créer une offre d'emploi
            </button>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
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
                          job.statut
                        )}`}
                      >
                        {job.statut}
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
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>{job.candidatures} candidatures</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Expire le {formatDate(job.date_limite)}</span>
                  </div>
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
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                        selectedJob.statut
                      )}`}
                    >
                      {selectedJob.statut}
                    </span>
                    <span className="bg-[#E05017] text-white text-sm font-bold px-3 py-1 rounded-full">
                      {selectedJob.type}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">
                    {selectedJob.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedJob.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-2xl text-blue-600">
                      {selectedJob.candidatures}
                    </span>
                    <span className="text-gray-700">candidatures reçues</span>
                  </div>
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
                    <DollarSign className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Salaire
                      </p>
                      <p className="text-gray-900 font-bold">
                        {selectedJob.salaire}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Target className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Expérience requise
                      </p>
                      <p className="text-gray-900 font-bold">
                        {selectedJob.experience}
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

                  <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Date limite
                      </p>
                      <p className="text-red-600 font-bold">
                        {formatDate(selectedJob.date_limite)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-bold">
                    <Edit className="w-5 h-5" />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleToggleStatus(selectedJob.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-bold"
                  >
                    {selectedJob.statut === "Publié"
                      ? "Mettre en brouillon"
                      : "Publier"}
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold">
                    <Users className="w-5 h-5" />
                    Voir candidatures
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
