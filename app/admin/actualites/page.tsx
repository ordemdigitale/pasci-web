"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Newspaper,
  Eye,
  Calendar,
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Image as ImageIcon,
  CheckCircle,
  Loader2,
  AlertCircle,
  MessageSquare,
  Share2,
} from "lucide-react";
import newsService, { INews, NewsAdminListe } from "@/lib/services/news.service";
import { toast } from "sonner";

const PAR_PAGE = 10;

const ETATS: Record<string, { libelle: string; classe: string }> = {
  en_attente: { libelle: "En attente de validation", classe: "bg-amber-100 text-amber-700" },
  rejete: { libelle: "Rejetée", classe: "bg-red-100 text-red-700" },
};

export default function ActualitesPage() {
  // Liste paginée par l'API : toutes les actualités (y compris en attente,
  // rejetées et archivées), limitées au CRASC du compte côté API
  const [liste, setListe] = useState<NewsAdminListe | null>(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [recherche, setRecherche] = useState("");
  const [statut, setStatut] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedActualite, setSelectedActualite] = useState<INews | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Recherche envoyée à l'API après une courte pause de frappe
  useEffect(() => {
    const t = window.setTimeout(() => {
      setRecherche(searchQuery);
      setPage(1);
    }, 300);
    return () => window.clearTimeout(t);
  }, [searchQuery]);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setListe(await newsService.listeAdmin({ page, size: PAR_PAGE, search: recherche, statut_publication: statut }));
    } catch (err: any) {
      console.error("Erreur lors du chargement des actualités:", err);
      setError(err.message || "Impossible de charger les actualités");
      toast.error("Erreur lors du chargement des actualités");
    } finally {
      setLoading(false);
    }
  }, [page, recherche, statut]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Dernière actualité d'une page supprimée : revenir à la page précédente
  useEffect(() => {
    if (liste && liste.items.length === 0 && page > 1) setPage((p) => p - 1);
  }, [liste, page]);

  const actualites = liste?.items ?? [];
  const compteurs = liste?.compteurs;

  const handleViewActualite = (actu: INews) => {
    setSelectedActualite(actu);
    setIsModalOpen(true);
  };

  const handleDeleteActualite = async (slug: string, title: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'actualité "${title}" ?`)) {
      return;
    }

    try {
      await newsService.delete(slug);
      toast.success("Actualité supprimée avec succès");
      fetchArticles();
    } catch (err: any) {
      console.error("Erreur lors de la suppression:", err);
      toast.error(err.message || "Erreur lors de la suppression");
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

  const truncateContent = (html: string | null | undefined, maxLength: number = 100) => {
    const text = (html || '').replace(/<[^>]*>/g, ''); // Remove HTML tags
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Gestion des Actualités
          </h1>
          <p className="text-gray-600">
            Créez et gérez toutes les actualités et annonces PdoC
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Actualités</p>
                <p className="text-3xl font-bold text-gray-900">
                  {compteurs?.total ?? "—"}
                </p>
                {!!compteurs?.en_attente && (
                  <p className="text-xs text-amber-600 mt-1">dont {compteurs.en_attente} en attente</p>
                )}
              </div>
              <div className="bg-[#E05017]/10 p-3 rounded-lg">
                <Newspaper className="w-6 h-6 text-[#E05017]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Par CRASC</p>
                <p className="text-3xl font-bold text-green-600">
                  {compteurs?.crasc ?? "—"}
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
                <p className="text-sm text-gray-500 mb-1">Par OSC</p>
                <p className="text-3xl font-bold text-blue-600">
                  {compteurs?.osc ?? "—"}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Ce mois</p>
                <p className="text-3xl font-bold text-purple-600">
                  {compteurs?.ce_mois ?? "—"}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-red-800 font-semibold mb-1">Erreur de chargement</h3>
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={fetchArticles}
                className="mt-2 text-sm text-red-700 underline hover:text-red-900"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Filters & Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par titre, contenu, CRASC ou OSC..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                />
              </div>
            </div>

            <select
              value={statut}
              onChange={(e) => {
                setStatut(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017] bg-white"
            >
              <option value="">Tous les états</option>
              <option value="publie">Publiées</option>
              <option value="en_attente">En attente de validation</option>
              <option value="rejete">Rejetées</option>
            </select>

            <div className="flex justify-end">
              <Link
                href="/admin/gestion-des-crasc/articles/ajouter-article"
                className="flex items-center gap-2 px-6 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-bold"
              >
                <Plus className="w-5 h-5" />
                Créer une actualité
              </Link>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg p-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#E05017] mx-auto mb-4" />
            <p className="text-gray-600">Chargement des actualités...</p>
          </div>
        )}

        {/* Actualites List */}
        {!loading && (
          <div className="space-y-4">
            {actualites.map((actu) => (
              <div
                key={actu.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-64 h-48 bg-gradient-to-br from-[#E05017] to-[#c44315] flex items-center justify-center relative">
                    {actu.thumbnail_url ? (
                      <Image
                        src={actu.thumbnail_url}
                        alt={actu.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-16 h-16 text-white/30" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {actu.crasc && (
                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                              {actu.crasc.name}
                            </span>
                          )}
                          {actu.osc && (
                            <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                              {actu.osc.name}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2">
                          {actu.title}
                          {actu.est_archivee && (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 text-xs font-semibold align-middle">Archivée</span>
                          )}
                          {ETATS[actu.statut_publication] && (
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold align-middle ${ETATS[actu.statut_publication].classe}`}>
                              {ETATS[actu.statut_publication].libelle}
                            </span>
                          )}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {truncateContent(actu.content, 150)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(actu.created_at)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Slug: {actu.slug}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewActualite(actu)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/admin/gestion-des-actualites/${actu.slug}/modifier`}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteActualite(actu.slug, actu.title)}
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
        )}

        {/* Pagination */}
        {!loading && liste && liste.total > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 text-sm">
            <p className="text-gray-500">
              {(liste.page - 1) * liste.size + 1}–{Math.min(liste.page * liste.size, liste.total)} sur {liste.total} actualité{liste.total > 1 ? "s" : ""}
            </p>
            {liste.pages > 1 && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ← Précédent
                </button>
                <span className="text-gray-600">Page {liste.page} / {liste.pages}</span>
                <button
                  type="button"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= liste.pages}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Suivant →
                </button>
              </div>
            )}
          </div>
        )}

        {!loading && actualites.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-semibold">
              Aucune actualité trouvée
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {searchQuery || statut ? "Essayez de modifier vos critères de recherche" : "Commencez par créer votre première actualité"}
            </p>
            {!searchQuery && !statut && (
              <Link
                href="/admin/gestion-des-crasc/articles/ajouter-article"
                className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-bold"
              >
                <Plus className="w-5 h-5" />
                Créer une actualité
              </Link>
            )}
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
                <div className="relative h-64 bg-gradient-to-br from-[#E05017] to-[#c44315] rounded-xl flex items-center justify-center overflow-hidden">
                  {selectedActualite.thumbnail_url ? (
                    <Image
                      src={selectedActualite.thumbnail_url}
                      alt={selectedActualite.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-24 h-24 text-white/20" />
                  )}
                </div>

                {/* Title & Category */}
                <div>
                  <div className="flex gap-2 mb-3">
                    {selectedActualite.crasc && (
                      <span className="bg-blue-100 text-blue-800 text-sm font-bold px-4 py-2 rounded-full">
                        {selectedActualite.crasc.name}
                      </span>
                    )}
                    {selectedActualite.osc && (
                      <span className="bg-green-100 text-green-800 text-sm font-bold px-4 py-2 rounded-full">
                        {selectedActualite.osc.name}
                      </span>
                    )}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mt-3 mb-4">
                    {selectedActualite.title}
                  </h3>
                  <div
                    className="text-gray-700 leading-relaxed prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedActualite.content }}
                  />
                </div>

                {/* Meta Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Date de création
                      </p>
                      <p className="text-gray-900">
                        {formatDate(selectedActualite.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-[#E05017] mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Dernière modification
                      </p>
                      <p className="text-gray-900">
                        {formatDate(selectedActualite.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Link
                    href={`/admin/gestion-des-actualites/${selectedActualite.slug}/modifier`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-bold"
                  >
                    <Edit className="w-5 h-5" />
                    Modifier
                  </Link>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      handleDeleteActualite(selectedActualite.slug, selectedActualite.title);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold"
                  >
                    <Trash2 className="w-5 h-5" />
                    Supprimer
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
