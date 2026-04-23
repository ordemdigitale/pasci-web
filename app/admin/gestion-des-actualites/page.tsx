"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, Search, AlertCircle } from 'lucide-react';
import newsService, { INews } from '@/lib/services/news.service';
import { toast } from 'sonner';

const PAGE_SIZE = 25;

export default function GestionActualitesPage() {
  const [articles, setArticles] = useState<INews[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<INews[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch articles from API
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await newsService.getAll({ limit: 100 });
      setArticles(data);
      setFilteredArticles(data);
    } catch (err: any) {
      console.error("Erreur lors du chargement des actualités:", err);
      setError(err.message || "Impossible de charger les actualités");
      toast.error("Erreur lors du chargement des actualités");
    } finally {
      setLoading(false);
    }
  };

  // Filter articles based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredArticles(articles);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = articles.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query) ||
        article.crasc?.name.toLowerCase().includes(query) ||
        article.osc?.name.toLowerCase().includes(query)
      );
      setFilteredArticles(filtered);
    }
    setCurrentPage(1);
  }, [searchQuery, articles]);

  const totalPages = Math.ceil(filteredArticles.length / PAGE_SIZE);
  const paginatedArticles = filteredArticles.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'actualité "${title}" ?`)) {
      return;
    }

    try {
      await newsService.delete(slug);
      toast.success("Actualité supprimée avec succès");
      // Refresh list
      fetchArticles();
    } catch (err: any) {
      console.error("Erreur lors de la suppression:", err);
      toast.error(err.message || "Erreur lors de la suppression");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (html: string, maxLength: number = 100) => {
    const text = html.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Actualités</h1>
              <p className="text-gray-600 mt-1">Gérez les articles et actualités de la plateforme</p>
            </div>
            <Link
              href="/admin/gestion-des-crasc/articles/ajouter-article"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-semibold"
            >
              <Plus className="w-5 h-5" />
              Nouvelle Actualité
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total des articles</p>
                <p className="text-3xl font-bold text-gray-900">{articles.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Par CRASC</p>
                <p className="text-3xl font-bold text-green-600">
                  {articles.filter(a => a.crasc_id).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Par OSC</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {articles.filter(a => a.osc_id).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Edit className="w-6 h-6 text-yellow-600" />
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

        {/* Search */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une actualité par titre, contenu, CRASC ou OSC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E05017] focus:border-transparent"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E05017] mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des actualités...</p>
          </div>
        )}

        {/* Articles List */}
        {!loading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Titre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      CRASC / OSC
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date de création
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredArticles.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <p className="text-gray-500">
                          {searchQuery ? "Aucune actualité ne correspond à votre recherche" : "Aucune actualité disponible"}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paginatedArticles.map((article) => (
                      <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900 mb-1">{article.title}</p>
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {truncateContent(article.content, 120)}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {article.crasc && (
                            <div className="mb-1">
                              <span className="inline-flex px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs">
                                {article.crasc.name}
                              </span>
                            </div>
                          )}
                          {article.osc && (
                            <div>
                              <span className="inline-flex px-2 py-1 rounded bg-green-100 text-green-800 text-xs">
                                {article.osc.name}
                              </span>
                            </div>
                          )}
                          {!article.crasc && !article.osc && (
                            <span className="text-gray-400 text-xs">Non catégorisé</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(article.created_at)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/actualites/${article.slug}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Voir"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/admin/gestion-des-actualites/${article.slug}/modifier`}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(article.slug, article.title)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredArticles.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Affichage de {Math.min((currentPage - 1) * PAGE_SIZE + 1, filteredArticles.length)}–{Math.min(currentPage * PAGE_SIZE, filteredArticles.length)} sur {filteredArticles.length} résultat{filteredArticles.length > 1 ? 's' : ''}
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

        {/* Back Link */}
        <div className="mt-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            ← Retour au tableau de bord
          </Link>
        </div>

      </div>
    </div>
  );
}
