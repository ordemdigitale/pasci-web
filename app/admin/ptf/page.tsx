"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  Target,
  X,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { IPTF } from "@/types/api.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";


export default function PTFPage() {
  const router = useRouter();
  const [ptfList, setPtfList] = useState<IPTF[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPTF, setSelectedPTF] = useState<IPTF | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load PTF data from API
  useEffect(() => {
    const loadPTFs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/ptf`);
        if (response.ok) {
          const data = await response.json();
          setPtfList(data);
        }
      } catch (error) {
        console.error("Error loading PTFs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPTFs();
  }, []);

  // Filtrage PTF
  const filteredPTF = ptfList.filter(
    (ptf) =>
      ptf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ptf.description && ptf.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ptf.domaines_list && ptf.domaines_list.some((d) =>
        d.toLowerCase().includes(searchQuery.toLowerCase())
      ))
  );

  const handleViewPTF = (ptf: any) => {
    setSelectedPTF(ptf);
    setIsModalOpen(true);
  };

  const handleDeletePTF = async (ptf: IPTF) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${ptf.name}" ?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/ptf/${ptf.slug}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPtfList(ptfList.filter((p) => p.id !== ptf.id));
      } else {
        alert("Erreur lors de la suppression du PTF");
      }
    } catch (error) {
      console.error("Error deleting PTF:", error);
      alert("Erreur lors de la suppression du PTF");
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

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Gestion des PTF & Appels à Propositions
          </h1>
          <p className="text-gray-600">
            Gérez les Partenaires Techniques et Financiers et leurs appels
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total PTF</p>
                <p className="text-3xl font-bold text-gray-900">
                  {ptfList.length}
                </p>
              </div>
              <div className="bg-[#E05017]/10 p-3 rounded-lg">
                <Building2 className="w-6 h-6 text-[#E05017]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Domaines couverts</p>
                <p className="text-3xl font-bold text-green-600">
                  {new Set(ptfList.flatMap(ptf => ptf.domaines_list || [])).size}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Projets</p>
                <p className="text-3xl font-bold text-blue-600">
                  {ptfList.reduce((sum, ptf) => sum + (ptf.projets?.length || 0), 0)}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Domaines</p>
                <p className="text-3xl font-bold text-purple-600">
                  {new Set(ptfList.flatMap(ptf => ptf.domaines_list || [])).size}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search & Add */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un PTF..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
              />
            </div>
            <Link
              href="/admin/ptf/ajouter"
              className="flex items-center gap-2 px-6 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-bold whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Ajouter PTF
            </Link>
          </div>
        </div>

        {/* PTF List */}
        <>
          <>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#E05017]" />
              </div>
            ) : filteredPTF.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                <p className="text-gray-500">Aucun PTF trouvé</p>
                <Link
                  href="/admin/ptf/ajouter"
                  className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-bold"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter votre premier PTF
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPTF.map((ptf) => (
              <div
                key={ptf.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {ptf.thumbnail_url ? (
                        <img
                          src={ptf.thumbnail_url}
                          alt={ptf.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="w-8 h-8 text-[#E05017]" />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewPTF(ptf)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Voir les détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/admin/ptf/${ptf.slug}/modifier`}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeletePTF(ptf)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {ptf.name}
                  </h3>
                  {ptf.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{ptf.description}</p>
                  )}

                  <div className="space-y-2 mb-4">
                    {ptf.pays && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{ptf.pays}</span>
                      </div>
                    )}
                    {ptf.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{ptf.email}</span>
                      </div>
                    )}
                    {ptf.projets && ptf.projets.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Target className="w-4 h-4 text-gray-400" />
                        <span>{ptf.projets.length} projets</span>
                      </div>
                    )}
                  </div>

                  {ptf.domaines_list && ptf.domaines_list.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {ptf.domaines_list.slice(0, 3).map((domaine: string, idx: number) => (
                        <span
                          key={idx}
                          className="text-xs bg-[#E05017]/10 text-[#E05017] px-2 py-1 rounded font-semibold"
                        >
                          {domaine}
                        </span>
                      ))}
                      {ptf.domaines_list.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-semibold">
                          +{ptf.domaines_list.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
                ))}
              </div>
            )}
          </>
        </>

        {/* PTF Details Modal */}
        {isModalOpen && selectedPTF && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">

              {/* Hero — bouton X en overlay */}
              <div className="relative">
                {selectedPTF.cover_url ? (
                  /* PTF avec photo de couverture */
                  <>
                    <div className="w-full h-52 overflow-hidden rounded-t-2xl">
                      <img
                        src={selectedPTF.cover_url}
                        alt={`Couverture ${selectedPTF.name}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="px-8 pb-0">
                      <div className="flex items-end gap-5 -mt-10 mb-2">
                        <div className="w-20 h-20 bg-white border-4 border-white shadow-md rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                          {selectedPTF.thumbnail_url ? (
                            <img src={selectedPTF.thumbnail_url} alt={selectedPTF.name} className="w-full h-full object-cover" />
                          ) : (
                            <Building2 className="w-10 h-10 text-[#E05017]" />
                          )}
                        </div>
                        <div className="pb-1">
                          <h3 className="text-2xl font-bold text-gray-900">{selectedPTF.name}</h3>
                          {selectedPTF.description && (
                            <p className="text-gray-500 text-sm mt-0.5">{selectedPTF.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* PTF sans photo de couverture — hero dégradé style OSC */
                  <div className="bg-gradient-to-r from-[#E05017] to-[#c44315] rounded-t-2xl p-8 text-white shadow-lg">
                    <div className="flex items-start gap-6">
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-white/20 border-2 border-white/30 flex-shrink-0 flex items-center justify-center">
                        {selectedPTF.thumbnail_url ? (
                          <img src={selectedPTF.thumbnail_url} alt={selectedPTF.name} className="w-full h-full object-cover" />
                        ) : (
                          <Building2 className="w-12 h-12 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-2xl font-bold mb-1">{selectedPTF.name}</h3>
                        {selectedPTF.description && (
                          <p className="text-white/80 text-sm leading-relaxed">{selectedPTF.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {selectedPTF.pays && (
                            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold flex items-center gap-1">
                              <MapPin className="w-3 h-3" />{selectedPTF.pays}
                            </span>
                          )}
                          {selectedPTF.projets && selectedPTF.projets.length > 0 && (
                            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold flex items-center gap-1">
                              <Target className="w-3 h-3" />{selectedPTF.projets.length} projet(s)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bouton fermer en overlay */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-3 right-3 p-2 bg-black/30 hover:bg-black/50 text-white rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {selectedPTF.mission && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 mb-2">Mission</h4>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedPTF.mission}
                    </p>
                  </div>
                )}

                {selectedPTF.vision && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 mb-2">Vision</h4>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedPTF.vision}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedPTF.email && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-[#E05017] mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          Email
                        </p>
                        <p className="text-gray-900">{selectedPTF.email}</p>
                      </div>
                    </div>
                  )}

                  {selectedPTF.phone && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-[#E05017] mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          Téléphone
                        </p>
                        <p className="text-gray-900">{selectedPTF.phone}</p>
                      </div>
                    </div>
                  )}

                  {selectedPTF.website && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <Globe className="w-5 h-5 text-[#E05017] mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          Site Web
                        </p>
                        <a
                          href={selectedPTF.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {selectedPTF.website}
                        </a>
                      </div>
                    </div>
                  )}

                  {selectedPTF.address && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-[#E05017] mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          Adresse
                        </p>
                        <p className="text-gray-900">
                          {selectedPTF.address}
                          {selectedPTF.pays && `, ${selectedPTF.pays}`}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedPTF.projets && selectedPTF.projets.length > 0 && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <Target className="w-5 h-5 text-[#E05017] mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          Projets
                        </p>
                        <p className="text-gray-900">
                          {selectedPTF.projets.length}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {selectedPTF.domaines_list && selectedPTF.domaines_list.length > 0 && (
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">
                      Domaines d'intervention
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPTF.domaines_list.map((domaine: string, idx: number) => (
                        <span
                          key={idx}
                          className="bg-[#E05017]/10 text-[#E05017] px-4 py-2 rounded-lg font-semibold text-sm"
                        >
                          {domaine}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Link
                    href={`/admin/ptf/${selectedPTF.slug}/modifier`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-bold"
                  >
                    <Edit className="w-5 h-5" />
                    Modifier
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
