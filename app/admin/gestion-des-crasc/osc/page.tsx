"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ImageWithFallback } from "@/lib/imageWithFallback";
import { ChevronLeft, ChevronRight, Search, Loader2, Eye, Edit3, EyeOff } from "lucide-react";
import { getToken } from "@/lib/auth";
import OscEvaluationBadge from "@/components/osc/OscEvaluationBadge";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const PAGE_SIZE = 25;

const FORMALISATION_OPTIONS = [
  { value: "statuts_reglement", label: "Statut et règlement intérieur" },
  { value: "recepisse_depot", label: "Récépissé de dépôt" },
  { value: "recepisse_declaration", label: "Récépissé de déclaration" },
  { value: "agrement_decret", label: "Agrément / décret" },
  { value: "journal_officiel", label: "Déclaration Journal Officiel de la République de Côte d'Ivoire" },
];

const formalisationLabel = (value?: string | null) =>
  FORMALISATION_OPTIONS.find((option) => option.value === value)?.label || "—";

interface IOscType { id: number; name: string; }
interface ICrasc    { id: number; name: string; }
interface IOsc {
  id: number; slug: string; name: string;
  description?: string; thumbnail_url?: string;
  type?: IOscType; crasc?: ICrasc;
  ville?: string; email?: string; phone?: string;
  type_document_formalisation?: string | null;
  document_formalisation_url?: string | null;
  score_autoevaluation?: number; couleur_autoevaluation?: string; couleur_autoevaluation_hex?: string;
  is_visible?: boolean;
}

export default function AdminOscPage() {
  const [oscs, setOscs]           = useState<IOsc[]>([]);
  const [total, setTotal]         = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage]           = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch]       = useState('');
  const [typeDocumentFormalisation, setTypeDocumentFormalisation] = useState("all");
  const [hasDocumentFormalisation, setHasDocumentFormalisation] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading]     = useState(true);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const fetchOscs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), size: String(PAGE_SIZE) });
      if (search) params.set('search', search);
      if (typeDocumentFormalisation !== "all") {
        params.set("type_document_formalisation", typeDocumentFormalisation);
      }
      if (hasDocumentFormalisation !== "all") {
        params.set("has_document_formalisation", hasDocumentFormalisation === "with" ? "true" : "false");
      }
      params.set("sort_by", sortBy);
      params.set("sort_order", sortOrder);
      const res  = await fetch(`${API_BASE_URL}/api/v1/crasc/osc?${params}`);
      const data = await res.json();
      setOscs(data.items);
      setTotal(data.total);
      setTotalPages(data.pages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, search, typeDocumentFormalisation, hasDocumentFormalisation, sortBy, sortOrder]);

  useEffect(() => { fetchOscs(); }, [fetchOscs]);

  const handleTogglePublish = async (osc: IOsc) => {
    setTogglingId(osc.id);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/crasc/osc/${osc.slug}/visibility`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const updated = await res.json();
        setOscs(prev => prev.map(o => o.id === osc.id ? { ...o, is_visible: updated.is_visible } : o));
      }
    } finally {
      setTogglingId(null);
    }
  };

  const applySearch = () => { setSearch(searchInput); setPage(1); };
  const resetFilters = () => {
    setSearch('');
    setSearchInput('');
    setTypeDocumentFormalisation("all");
    setHasDocumentFormalisation("all");
    setSortBy("name");
    setSortOrder("asc");
    setPage(1);
  };

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const delta = 2;
    const pages: (number | '...')[] = [];
    const left  = Math.max(1, page - delta);
    const right = Math.min(totalPages, page + delta);
    if (left > 1) { pages.push(1); if (left > 2) pages.push('...'); }
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages) { if (right < totalPages - 1) pages.push('...'); pages.push(totalPages); }
    return pages;
  };

  return (
    <div className="max-w-7xl mx-auto font-poppins bg-slate-50 min-h-screen p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <Link href="/admin/gestion-des-crasc" className="text-sm text-blue-600 hover:underline">
          ← Gestion des CRASC
        </Link>
        <Link
          href="/admin/gestion-des-crasc/osc/ajouter-osc"
          className="px-4 py-2 bg-[#2A591D] text-white rounded-lg hover:bg-[#244a17] transition-colors"
        >
          Ajouter une OSC
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion des OSC</h1>
      <p className="text-gray-600 mb-6">
        {total} OSC{total > 1 ? 's' : ''} au total
        {totalPages > 1 && ` — page ${page} / ${totalPages}`}
      </p>

      {/* Search and filters */}
      <div className="flex flex-col gap-3 mb-6 rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col lg:flex-row gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applySearch()}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2A591D]"
          />
        </div>
        <button
          onClick={applySearch}
          className="px-4 py-2 bg-[#2A591D] text-white text-sm rounded-lg hover:bg-[#244a17] transition-colors"
        >
          Rechercher
        </button>
        {(search || typeDocumentFormalisation !== "all" || hasDocumentFormalisation !== "all" || sortBy !== "name" || sortOrder !== "asc") && (
          <button
            onClick={resetFilters}
            className="px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-100 transition-colors"
          >
            Effacer
          </button>
        )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <label className="text-xs font-semibold text-gray-600">
            Type de document de formalisation
            <select
              value={typeDocumentFormalisation}
              onChange={(event) => { setTypeDocumentFormalisation(event.target.value); setPage(1); }}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-normal text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A591D]"
            >
              <option value="all">Tous les types</option>
              {FORMALISATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="text-xs font-semibold text-gray-600">
            Justificatif
            <select
              value={hasDocumentFormalisation}
              onChange={(event) => { setHasDocumentFormalisation(event.target.value); setPage(1); }}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-normal text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A591D]"
            >
              <option value="all">Tous les justificatifs</option>
              <option value="with">Avec justificatif</option>
              <option value="without">Sans justificatif</option>
            </select>
          </label>

          <label className="text-xs font-semibold text-gray-600">
            Trier par
            <select
              value={sortBy}
              onChange={(event) => { setSortBy(event.target.value); setPage(1); }}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-normal text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A591D]"
            >
              <option value="name">Nom</option>
              <option value="type_document_formalisation">Type de document de formalisation</option>
              <option value="document_formalisation">Justificatif de formalisation</option>
            </select>
          </label>

          <label className="text-xs font-semibold text-gray-600">
            Ordre
            <select
              value={sortOrder}
              onChange={(event) => { setSortOrder(event.target.value); setPage(1); }}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-normal text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A591D]"
            >
              <option value="asc">Ascendant</option>
              <option value="desc">Descendant</option>
            </select>
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Logo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CRASC</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ville</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Formalisation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center">
                  <Loader2 className="w-8 h-8 text-[#2A591D] animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Chargement...</p>
                </td>
              </tr>
            ) : oscs.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  Aucune OSC trouvée.
                </td>
              </tr>
            ) : (
              oscs.map((osc) => (
                <tr key={osc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                      <ImageWithFallback
                        src={osc.thumbnail_url || "/images/default-osc-logo.png"}
                        alt={osc.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-gray-900 max-w-xs">{osc.name}</div>
                      {osc.is_visible === false && (
                        <span className="inline-flex items-center gap-0.5 text-xs px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded-full font-medium" title="Non publiée dans l'annuaire public">
                          Non publiée
                        </span>
                      )}
                    </div>
                    <div className="mt-1">
                      <OscEvaluationBadge score={osc.score_autoevaluation} color={osc.couleur_autoevaluation} hex={osc.couleur_autoevaluation_hex} compact />
                    </div>
                    {osc.description && (
                      <div className="text-xs text-gray-500 truncate max-w-xs">{osc.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {osc.type?.name || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {osc.crasc?.name || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {osc.ville || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formalisationLabel(osc.type_document_formalisation)}</div>
                    {osc.document_formalisation_url ? (
                      <a
                        href={osc.document_formalisation_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-flex rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700 hover:underline"
                      >
                        Justificatif déposé
                      </a>
                    ) : (
                      <span className="mt-1 inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
                        Sans justificatif
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs space-y-1 max-w-[200px]">
                      {osc.email && <div className="text-gray-600 truncate" title={osc.email}>📧 {osc.email}</div>}
                      {osc.phone && <div className="text-gray-600 truncate" title={osc.phone}>📞 {osc.phone}</div>}
                      {!osc.email && !osc.phone && <span className="text-gray-400">Aucun contact</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/gestion-des-crasc/osc/${osc.slug}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Voir
                      </Link>
                      <Link
                        href={`/admin/gestion-des-crasc/osc/${osc.slug}/modifier`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Modifier
                      </Link>
                      <button
                        onClick={() => handleTogglePublish(osc)}
                        disabled={togglingId === osc.id}
                        title={osc.is_visible !== false ? "Dépublier" : "Publier"}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                          osc.is_visible !== false
                            ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                        }`}
                      >
                        {osc.is_visible !== false
                          ? <><EyeOff className="w-3.5 h-3.5" />Dépublier</>
                          : <><Eye className="w-3.5 h-3.5" />Publier</>
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Affichage de <span className="font-semibold">{(page - 1) * PAGE_SIZE + 1}</span> à{" "}
            <span className="font-semibold">{Math.min(page * PAGE_SIZE, total)}</span> sur{" "}
            <span className="font-semibold">{total}</span> OSC
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {getPageNumbers().map((p, i) =>
              p === '...' ? (
                <span key={`e-${i}`} className="px-2 text-gray-400 text-sm">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => goToPage(p as number)}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                    p === page
                      ? 'bg-[#2A591D] text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {total > 0 && (
        <div className="mt-6 text-sm text-gray-600 bg-white rounded-lg p-4 border border-gray-200">
          <p className="font-semibold mb-2">💡 Actions disponibles :</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Cliquez sur Afficher pour voir les détails d&apos;une OSC</li>
            <li>Cliquez sur Modifier pour mettre à jour une OSC</li>
            <li>Utilisez la barre de recherche et les filtres pour trier les OSC par formalisation</li>
            <li>Utilisez Ajouter une OSC pour enregistrer une nouvelle organisation</li>
          </ul>
        </div>
      )}
    </div>
  );
}
