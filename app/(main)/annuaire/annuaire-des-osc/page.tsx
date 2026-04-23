"use client";

import { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Users2, Building, Filter, ArrowRight, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from "@/lib/imageWithFallback";
import Link from 'next/link';

interface IOSCType {
  id: number;
  name: string;
  slug: string;
}

interface ICRASC {
  id: number;
  name: string;
  slug: string;
  osc_count?: number;
}

interface IOSC {
  id: number;
  name: string;
  thumbnail_url?: string;
  thumbnail_path?: string;
  description: string;
  type?: IOSCType;
  crasc?: ICRASC;
  ville: string | null;
  email?: string | null;
  phone?: string | null;
  slug: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const PAGE_SIZE = 12;

export default function AnnuaireOSCPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState<string>('');
  const [selectedCrascId, setSelectedCrascId] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  const [oscData, setOscData] = useState<IOSC[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const [crascs, setCrascs] = useState<ICRASC[]>([]);
  const [oscTypes, setOscTypes] = useState<IOSCType[]>([]);

  // Fetch filter options once
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/crasc/crasc?limit=20`)
      .then(r => r.json())
      .then((data: ICRASC[]) => setCrascs(data))
      .catch(() => {});

    fetch(`${API_BASE_URL}/api/v1/crasc/osc-type?limit=20`)
      .then(r => r.json())
      .then((data: IOSCType[]) => setOscTypes(data))
      .catch(() => {});
  }, []);

  // Fetch OSCs from API with pagination + filters
  const fetchOscs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        size: String(PAGE_SIZE),
      });
      if (searchQuery) params.set('search', searchQuery);
      if (selectedTypeId) params.set('type_id', selectedTypeId);
      if (selectedCrascId) params.set('crasc_id', selectedCrascId);

      const res = await fetch(`${API_BASE_URL}/api/v1/crasc/osc?${params}`);
      const data = await res.json();
      setOscData(data.items);
      setTotal(data.total);
      setTotalPages(data.pages);
    } catch (error) {
      console.error("Erreur lors du chargement des OSC:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, selectedTypeId, selectedCrascId]);

  useEffect(() => {
    fetchOscs();
  }, [fetchOscs]);

  // Reset to page 1 when filters change
  const applySearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const handleTypeChange = (val: string) => {
    setSelectedTypeId(val);
    setCurrentPage(1);
  };

  const handleCrascChange = (val: string) => {
    setSelectedCrascId(val);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchInput('');
    setSearchQuery('');
    setSelectedTypeId('');
    setSelectedCrascId('');
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Build page number array (max 5 visible)
  const getPageNumbers = () => {
    const delta = 2;
    const pages: (number | '...')[] = [];
    const left = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);

    if (left > 1) { pages.push(1); if (left > 2) pages.push('...'); }
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages) { if (right < totalPages - 1) pages.push('...'); pages.push(totalPages); }

    return pages;
  };

  const hasFilters = searchQuery || selectedTypeId || selectedCrascId;

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white font-poppins">

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Annuaire des <span className="text-[#E05017]">OSC</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrir les Organisations de la Société Civile membres du CRASC
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#E05017] to-[#2a591d] mx-auto mt-6 rounded-full"></div>
        </div>
      </div>

      {/* Statistics */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group bg-white rounded-xl p-6 border-2 border-[#E05017]/30 hover:border-[#E05017] hover:shadow-xl transition-all duration-300 text-center overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E05017] to-[#d04010] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-5xl font-extrabold text-[#E05017] group-hover:text-white transition-colors mb-2">
                {total}
              </div>
              <div className="text-sm font-bold uppercase tracking-wider text-gray-600 group-hover:text-white/80 transition-colors">
                OSC Enregistrées
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-xl p-6 border-2 border-[#E05017]/30 hover:border-[#E05017] hover:shadow-xl transition-all duration-300 text-center overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E05017] to-[#d04010] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-5xl font-extrabold text-[#E05017] group-hover:text-white transition-colors mb-2">
                {oscTypes.length}
              </div>
              <div className="text-sm font-bold uppercase tracking-wider text-gray-600 group-hover:text-white/80 transition-colors">
                Types d'Organisation
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-xl p-6 border-2 border-[#E05017]/30 hover:border-[#E05017] hover:shadow-xl transition-all duration-300 text-center overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E05017] to-[#d04010] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-5xl font-extrabold text-[#E05017] group-hover:text-white transition-colors mb-2">
                5
              </div>
              <div className="text-sm font-bold uppercase tracking-wider text-gray-600 group-hover:text-white/80 transition-colors">
                CRASC couverts
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une OSC par nom ou description..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applySearch()}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E05017] focus:border-transparent"
                />
              </div>
              <button
                onClick={applySearch}
                className="px-6 py-3 bg-[#E05017] text-white font-semibold rounded-lg hover:bg-[#d04010] transition-colors"
              >
                Rechercher
              </button>
            </div>

            {/* Filter Dropdowns */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <select
                  value={selectedTypeId}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E05017] focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="">Tous les types</option>
                  {oscTypes.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <select
                  value={selectedCrascId}
                  onChange={(e) => handleCrascChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E05017] focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="">Tous les CRASC</option>
                  {crascs.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count and Reset */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-gray-600">
                <span className="font-bold text-[#E05017]">{total}</span> OSC{total > 1 ? 's' : ''} trouvée{total > 1 ? 's' : ''}
                {totalPages > 1 && (
                  <span className="text-gray-400"> — page {currentPage} / {totalPages}</span>
                )}
              </p>
              {hasFilters && (
                <button
                  onClick={resetFilters}
                  className="text-sm text-[#E05017] hover:text-[#d04010] font-semibold transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* OSC Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-24">
            <Loader2 className="w-12 h-12 text-[#E05017] animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Chargement des OSC...</p>
          </div>
        ) : oscData.length === 0 ? (
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-12 text-center border-2 border-orange-100">
            <div className="max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users2 className="w-10 h-10 text-[#E05017]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucune OSC trouvée</h3>
              <p className="text-gray-600 mb-8">
                Aucune OSC ne correspond à vos critères de recherche.
              </p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#E05017] to-[#d04010] text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Réinitialiser les filtres
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {oscData.map((osc) => (
                <Link
                  key={osc.id}
                  href={`/annuaire/annuaire-des-osc/${osc.slug}`}
                  className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
                >
                  <div className="aspect-video overflow-hidden relative bg-gray-100">
                    <ImageWithFallback
                      src={osc.thumbnail_url || "/images/default-osc-logo.png"}
                      alt={osc.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {osc.crasc && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-[#E05017] text-white text-xs font-bold px-3 py-1 rounded-full">
                          {osc.crasc.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#E05017] transition-colors">
                      {osc.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {osc.description || "Aucune description disponible"}
                    </p>

                    <div className="space-y-2">
                      {osc.type && (
                        <div className="flex items-center gap-2 text-sm">
                          <Building className="w-4 h-4 text-[#E05017] flex-shrink-0" />
                          <span className="font-semibold text-gray-700">{osc.type.name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-[#E05017] flex-shrink-0" />
                        <span>{osc.ville || "Non spécifié"}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <span className="inline-flex items-center gap-2 text-[#E05017] font-semibold text-sm group-hover:gap-3 transition-all">
                        Voir les détails
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mb-12">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {getPageNumbers().map((p, i) =>
                  p === '...' ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-gray-400">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => goToPage(p as number)}
                      className={`w-10 h-10 rounded-lg font-semibold text-sm transition-colors ${
                        p === currentPage
                          ? 'bg-[#E05017] text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Call to Action */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-gradient-to-r from-[#E05017] to-[#d04010] rounded-2xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
          <div className="relative z-10">
            <h3 className="font-extrabold text-3xl mb-4">Votre OSC n'est pas listée ?</h3>
            <p className="max-w-2xl mx-auto mb-8 text-lg">
              Rejoignez le réseau des CRASC pour bénéficier d'un accompagnement personnalisé et apparaître dans cet annuaire.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#E05017] font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Rejoignez-nous
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
