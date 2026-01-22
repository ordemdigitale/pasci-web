"use client";

import { useState } from "react";
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
  Calendar,
  DollarSign,
  Target,
  X,
  Users,
  TrendingUp,
} from "lucide-react";

// Mock data
const mockPTF = [
  {
    id: 1,
    name: "Banque Mondiale",
    type: "Institution Financière Internationale",
    domaines: ["Infrastructure", "Éducation", "Santé", "Développement Rural"],
    email: "contact@worldbank.org",
    phone: "+1 202 473 1000",
    website: "https://www.worldbank.org",
    pays: "International",
    ville: "Washington, D.C.",
    logo: "/images/ptf/banque-mondiale.png",
    description:
      "La Banque mondiale est une institution financière internationale qui accorde des prêts et des dons aux gouvernements des pays en développement pour financer des projets d'investissement.",
    projets_finances: 245,
    montant_total: "12.5 milliards USD",
    appels_actifs: 3,
    date_partenariat: "2010-05-15",
  },
  {
    id: 2,
    name: "Agence Française de Développement (AFD)",
    type: "Agence de Développement",
    domaines: ["Environnement", "Énergie", "Éducation", "Gouvernance"],
    email: "afd@afd.fr",
    phone: "+33 1 53 44 31 31",
    website: "https://www.afd.fr",
    pays: "France",
    ville: "Paris",
    logo: "/images/ptf/afd.png",
    description:
      "L'AFD est l'agence publique française de développement, qui finance et accompagne des projets dans les pays en développement et d'outre-mer.",
    projets_finances: 178,
    montant_total: "8.3 milliards USD",
    appels_actifs: 5,
    date_partenariat: "2012-03-20",
  },
  {
    id: 3,
    name: "Union Européenne - DG DEVCO",
    type: "Organisation Internationale",
    domaines: ["Démocratie", "Droits de l'Homme", "Commerce", "Agriculture"],
    email: "devco@ec.europa.eu",
    phone: "+32 2 299 11 11",
    website: "https://ec.europa.eu/devco",
    pays: "Belgique",
    ville: "Bruxelles",
    logo: "/images/ptf/eu.png",
    description:
      "La Direction générale de la Coopération internationale et du développement met en œuvre la politique de développement de l'UE.",
    projets_finances: 312,
    montant_total: "15.7 milliards EUR",
    appels_actifs: 8,
    date_partenariat: "2008-11-10",
  },
];

const mockAppels = [
  {
    id: 1,
    ptf_id: 1,
    titre: "Appel à propositions - Infrastructure routière durable",
    description:
      "Financement de projets d'infrastructure routière en zone rurale avec approche durable.",
    budget: "50 millions USD",
    date_ouverture: "2026-01-15",
    date_limite: "2026-03-15",
    domaines: ["Infrastructure", "Développement Rural"],
    criteres: ["Expérience de 5 ans minimum", "Budget >1M USD"],
    statut: "Ouvert",
  },
  {
    id: 2,
    ptf_id: 1,
    titre: "Programme d'appui à l'éducation des filles",
    description:
      "Soutien aux initiatives favorisant la scolarisation et le maintien des filles à l'école.",
    budget: "25 millions USD",
    date_ouverture: "2026-01-20",
    date_limite: "2026-04-01",
    domaines: ["Éducation", "Égalité des genres"],
    criteres: ["Collaboration avec écoles locales", "Impact mesurable"],
    statut: "Ouvert",
  },
  {
    id: 3,
    ptf_id: 2,
    titre: "Transition énergétique en Afrique de l'Ouest",
    description:
      "Financement de projets d'énergie renouvelable (solaire, éolien, biomasse).",
    budget: "100 millions EUR",
    date_ouverture: "2025-12-01",
    date_limite: "2026-02-28",
    domaines: ["Énergie", "Environnement"],
    criteres: ["Technologie éprouvée", "Partenariat public-privé"],
    statut: "Ouvert",
  },
];

export default function PTFPage() {
  const [ptfList, setPtfList] = useState(mockPTF);
  const [appelsList, setAppelsList] = useState(mockAppels);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPTF, setSelectedPTF] = useState<any>(null);
  const [selectedAppel, setSelectedAppel] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAppelModalOpen, setIsAppelModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"ptf" | "appels">("ptf");

  // Filtrage PTF
  const filteredPTF = ptfList.filter(
    (ptf) =>
      ptf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ptf.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ptf.domaines.some((d) =>
        d.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  // Filtrage Appels
  const filteredAppels = appelsList.filter(
    (appel) =>
      appel.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appel.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewPTF = (ptf: any) => {
    setSelectedPTF(ptf);
    setIsModalOpen(true);
  };

  const handleViewAppel = (appel: any) => {
    setSelectedAppel(appel);
    setIsAppelModalOpen(true);
  };

  const handleDeletePTF = (ptfId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce PTF ?")) {
      setPtfList(ptfList.filter((p) => p.id !== ptfId));
    }
  };

  const handleDeleteAppel = (appelId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet appel ?")) {
      setAppelsList(appelsList.filter((a) => a.id !== appelId));
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
                <p className="text-sm text-gray-500 mb-1">Appels Actifs</p>
                <p className="text-3xl font-bold text-green-600">
                  {appelsList.filter((a) => a.statut === "Ouvert").length}
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
                <p className="text-sm text-gray-500 mb-1">Projets Financés</p>
                <p className="text-3xl font-bold text-blue-600">
                  {ptfList.reduce((sum, ptf) => sum + ptf.projets_finances, 0)}
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
                <p className="text-sm text-gray-500 mb-1">Budget Total</p>
                <p className="text-2xl font-bold text-purple-600">36.5B+</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("ptf")}
              className={`flex-1 px-6 py-4 font-bold transition-colors ${
                activeTab === "ptf"
                  ? "text-[#E05017] border-b-2 border-[#E05017]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Partenaires (PTF)
            </button>
            <button
              onClick={() => setActiveTab("appels")}
              className={`flex-1 px-6 py-4 font-bold transition-colors ${
                activeTab === "appels"
                  ? "text-[#E05017] border-b-2 border-[#E05017]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Appels à Propositions
            </button>
          </div>

          {/* Search & Add Button */}
          <div className="p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={
                    activeTab === "ptf"
                      ? "Rechercher un PTF..."
                      : "Rechercher un appel à propositions..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                />
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-bold whitespace-nowrap">
                <Plus className="w-5 h-5" />
                {activeTab === "ptf" ? "Ajouter PTF" : "Créer Appel"}
              </button>
            </div>
          </div>
        </div>

        {/* PTF List */}
        {activeTab === "ptf" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPTF.map((ptf) => (
              <div
                key={ptf.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-[#E05017]" />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewPTF(ptf)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePTF(ptf.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {ptf.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{ptf.type}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>
                        {ptf.ville}, {ptf.pays}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Target className="w-4 h-4 text-gray-400" />
                      <span>{ptf.projets_finances} projets financés</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span>{ptf.appels_actifs} appels actifs</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {ptf.domaines.slice(0, 3).map((domaine: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-xs bg-[#E05017]/10 text-[#E05017] px-2 py-1 rounded font-semibold"
                      >
                        {domaine}
                      </span>
                    ))}
                    {ptf.domaines.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-semibold">
                        +{ptf.domaines.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Appels List */}
        {activeTab === "appels" && (
          <div className="space-y-4">
            {filteredAppels.map((appel) => {
              const ptf = ptfList.find((p) => p.id === appel.ptf_id);
              return (
                <div
                  key={appel.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-xl text-gray-900">
                          {appel.titre}
                        </h3>
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                          {appel.statut}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Par {ptf?.name}
                      </p>
                      <p className="text-gray-700 mb-4">{appel.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-[#E05017]" />
                          <div>
                            <p className="text-xs text-gray-500">Budget</p>
                            <p className="font-bold text-gray-900">
                              {appel.budget}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-[#E05017]" />
                          <div>
                            <p className="text-xs text-gray-500">Ouverture</p>
                            <p className="font-bold text-gray-900">
                              {formatDate(appel.date_ouverture)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-red-600" />
                          <div>
                            <p className="text-xs text-gray-500">Date limite</p>
                            <p className="font-bold text-red-600">
                              {formatDate(appel.date_limite)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {appel.domaines.map((domaine: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold"
                          >
                            {domaine}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleViewAppel(appel)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAppel(appel.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PTF Details Modal */}
        {isModalOpen && selectedPTF && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Détails du PTF
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-12 h-12 text-[#E05017]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedPTF.name}
                  </h3>
                  <p className="text-gray-600 mt-1">{selectedPTF.type}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedPTF.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Email
                      </p>
                      <p className="text-gray-900">{selectedPTF.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Téléphone
                      </p>
                      <p className="text-gray-900">{selectedPTF.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Globe className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Site Web
                      </p>
                      <a
                        href={selectedPTF.website}
                        target="_blank"
                        className="text-blue-600 hover:underline"
                      >
                        {selectedPTF.website}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Localisation
                      </p>
                      <p className="text-gray-900">
                        {selectedPTF.ville}, {selectedPTF.pays}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Target className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Projets Financés
                      </p>
                      <p className="text-gray-900">
                        {selectedPTF.projets_finances}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Montant Total
                      </p>
                      <p className="text-gray-900">
                        {selectedPTF.montant_total}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-3">
                    Domaines d'intervention
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPTF.domaines.map((domaine: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-[#E05017]/10 text-[#E05017] px-4 py-2 rounded-lg font-semibold text-sm"
                      >
                        {domaine}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-bold">
                    <Edit className="w-5 h-5" />
                    Modifier
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appel Details Modal */}
        {isAppelModalOpen && selectedAppel && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Détails de l'appel à propositions
                </h2>
                <button
                  onClick={() => setIsAppelModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {selectedAppel.titre}
                    </h3>
                    <span className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full">
                      {selectedAppel.statut}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedAppel.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Budget
                      </p>
                      <p className="text-gray-900 font-bold">
                        {selectedAppel.budget}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Date d'ouverture
                      </p>
                      <p className="text-gray-900">
                        {formatDate(selectedAppel.date_ouverture)}
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
                        {formatDate(selectedAppel.date_limite)}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-3">
                    Domaines concernés
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAppel.domaines.map((domaine: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold text-sm"
                      >
                        {domaine}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-3">
                    Critères d'éligibilité
                  </h4>
                  <ul className="space-y-2">
                    {selectedAppel.criteres.map((critere: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-[#E05017] rounded-full mt-2"></span>
                        <span className="text-gray-700">{critere}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
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
