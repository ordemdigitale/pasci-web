"use client";

import { useState } from "react";
import {
  BookOpen,
  Users,
  Clock,
  Award,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Video,
  FileText,
  Star,
  TrendingUp,
  X,
  Calendar,
  Target,
  Play,
  CheckCircle,
} from "lucide-react";

// Mock data
const mockFormations = [
  {
    id: 1,
    title: "Gestion de Projet pour OSC",
    slug: "gestion-projet-osc",
    category: "Gestion",
    level: "Débutant",
    duration: "6 semaines",
    modules: 12,
    students: 245,
    rating: 4.8,
    reviews: 89,
    instructor: {
      name: "Dr. Koné Adjoua",
      title: "Expert en Gestion de Projets",
      avatar: "/images/instructors/kone.jpg",
    },
    price: "Gratuit",
    status: "Publié",
    date_creation: "2024-11-15",
    description:
      "Formation complète sur la gestion de projet adaptée aux besoins des OSC en Côte d'Ivoire.",
    completion_rate: 78,
  },
  {
    id: 2,
    title: "Mobilisation de Ressources",
    slug: "mobilisation-ressources",
    category: "Finance",
    level: "Intermédiaire",
    duration: "4 semaines",
    modules: 8,
    students: 178,
    rating: 4.9,
    reviews: 65,
    instructor: {
      name: "Marie Diabaté",
      title: "Consultante en Levée de Fonds",
      avatar: "/images/instructors/diabate.jpg",
    },
    price: "50,000 FCFA",
    status: "Publié",
    date_creation: "2024-10-20",
    description:
      "Apprenez les stratégies efficaces de mobilisation de ressources pour votre organisation.",
    completion_rate: 85,
  },
  {
    id: 3,
    title: "Leadership et Gouvernance",
    slug: "leadership-gouvernance",
    category: "Leadership",
    level: "Avancé",
    duration: "8 semaines",
    modules: 16,
    students: 134,
    rating: 4.7,
    reviews: 52,
    instructor: {
      name: "Prof. Yao Bernard",
      title: "Formateur en Leadership",
      avatar: "/images/instructors/yao.jpg",
    },
    price: "75,000 FCFA",
    status: "Publié",
    date_creation: "2024-09-05",
    description:
      "Développez vos compétences en leadership et gouvernance organisationnelle.",
    completion_rate: 72,
  },
  {
    id: 4,
    title: "Communication Digitale pour OSC",
    slug: "communication-digitale",
    category: "Communication",
    level: "Débutant",
    duration: "3 semaines",
    modules: 6,
    students: 0,
    rating: 0,
    reviews: 0,
    instructor: {
      name: "Awa Traoré",
      title: "Experte en Communication",
      avatar: "/images/instructors/traore.jpg",
    },
    price: "Gratuit",
    status: "Brouillon",
    date_creation: "2026-01-10",
    description:
      "Maîtrisez les outils de communication digitale pour mieux promouvoir votre OSC.",
    completion_rate: 0,
  },
];

export default function FormationsPage() {
  const [formations, setFormations] = useState(mockFormations);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedFormation, setSelectedFormation] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtrage
  const filteredFormations = formations.filter((formation) => {
    const matchSearch =
      formation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formation.instructor.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchCategory =
      !selectedCategory || formation.category === selectedCategory;
    const matchStatus =
      !selectedStatus || formation.status === selectedStatus;
    return matchSearch && matchCategory && matchStatus;
  });

  const handleViewFormation = (formation: any) => {
    setSelectedFormation(formation);
    setIsModalOpen(true);
  };

  const handleDeleteFormation = (formationId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette formation ?")) {
      setFormations(formations.filter((f) => f.id !== formationId));
    }
  };

  const handleToggleStatus = (formationId: number) => {
    setFormations(
      formations.map((f) =>
        f.id === formationId
          ? {
              ...f,
              status: f.status === "Publié" ? "Brouillon" : "Publié",
            }
          : f
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

  const totalStudents = formations.reduce(
    (sum, f) => sum + f.students,
    0
  );
  const avgRating =
    formations.filter((f) => f.rating > 0).reduce((sum, f) => sum + f.rating, 0) /
    formations.filter((f) => f.rating > 0).length;

  return (
    <div className="min-h-screen bg-gray-50 font-poppins p-8">
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
                  {formations.length}
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
                <p className="text-sm text-gray-500 mb-1">Étudiants Inscrits</p>
                <p className="text-3xl font-bold text-blue-600">
                  {totalStudents}
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
                <p className="text-sm text-gray-500 mb-1">Note Moyenne</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {avgRating.toFixed(1)}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Formations Publiées</p>
                <p className="text-3xl font-bold text-green-600">
                  {formations.filter((f) => f.status === "Publié").length}
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
                  placeholder="Rechercher par titre ou instructeur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                />
              </div>
            </div>

            {/* Filter by Category */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
              >
                <option value="">Toutes les catégories</option>
                <option value="Gestion">Gestion</option>
                <option value="Finance">Finance</option>
                <option value="Leadership">Leadership</option>
                <option value="Communication">Communication</option>
              </select>
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
            <button className="flex items-center gap-2 px-6 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-bold">
              <Plus className="w-5 h-5" />
              Créer une formation
            </button>
          </div>
        </div>

        {/* Formations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFormations.map((formation) => (
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
                      formation.status === "Publié"
                        ? "bg-green-500 text-white"
                        : "bg-gray-500 text-white"
                    }`}
                  >
                    {formation.status}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                    {formation.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                  {formation.title}
                </h3>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-sm">
                      {formation.rating > 0 ? formation.rating : "N/A"}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    ({formation.reviews} avis)
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>{formation.students} étudiants</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{formation.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span>{formation.modules} modules</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Award className="w-4 h-4 text-gray-400" />
                    <span>Niveau {formation.level}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                    {formation.instructor.name.split(" ")[0][0]}
                    {formation.instructor.name.split(" ")[1][0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {formation.instructor.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {formation.instructor.title}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#E05017]">
                    {formation.price}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewFormation(formation)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Voir détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteFormation(formation.id)}
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

        {filteredFormations.length === 0 && (
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
                <div className="relative h-48 bg-gradient-to-br from-[#E05017] to-[#c44315] rounded-xl flex items-center justify-center overflow-hidden">
                  <BookOpen className="w-24 h-24 text-white/20" />
                  <div className="absolute top-4 right-4">
                    <span
                      className={`text-sm font-bold px-4 py-2 rounded-full ${
                        selectedFormation.status === "Publié"
                          ? "bg-green-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {selectedFormation.status}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-2xl font-bold text-white">
                      {selectedFormation.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedFormation.description}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Users className="w-6 h-6 text-[#E05017] mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedFormation.students}
                    </p>
                    <p className="text-xs text-gray-600">Étudiants</p>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <FileText className="w-6 h-6 text-[#E05017] mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedFormation.modules}
                    </p>
                    <p className="text-xs text-gray-600">Modules</p>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedFormation.rating > 0
                        ? selectedFormation.rating
                        : "N/A"}
                    </p>
                    <p className="text-xs text-gray-600">Note moyenne</p>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedFormation.completion_rate}%
                    </p>
                    <p className="text-xs text-gray-600">Taux de complétion</p>
                  </div>
                </div>

                {/* Information Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Durée
                      </p>
                      <p className="text-gray-900">{selectedFormation.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Award className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Niveau
                      </p>
                      <p className="text-gray-900">{selectedFormation.level}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <BookOpen className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Catégorie
                      </p>
                      <p className="text-gray-900">
                        {selectedFormation.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Target className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Prix
                      </p>
                      <p className="text-gray-900 font-bold">
                        {selectedFormation.price}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Instructor */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-bold text-gray-900 mb-3">Instructeur</h4>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-[#E05017] rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {selectedFormation.instructor.name.split(" ")[0][0]}
                      {selectedFormation.instructor.name.split(" ")[1][0]}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        {selectedFormation.instructor.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedFormation.instructor.title}
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
                    onClick={() => handleToggleStatus(selectedFormation.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-bold"
                  >
                    {selectedFormation.status === "Publié"
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
