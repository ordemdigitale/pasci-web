"use client";

import { useState, useEffect } from 'react';
import { Search, MapPin, Users2, Building, Filter, ArrowRight, Loader2 } from 'lucide-react';
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
  // Computed properties for display
  domaine?: string;
  region?: string;
  logo?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AnnuaireOSCPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomaine, setSelectedDomaine] = useState('Tous les domaines');
  const [selectedRegion, setSelectedRegion] = useState('Toutes les régions');
  const [oscData, setOscData] = useState<IOSC[]>([]);
  const [filteredOSCs, setFilteredOSCs] = useState<IOSC[]>([]);
  const [domaines, setDomaines] = useState<string[]>(["Tous les domaines"]);
  const [regions, setRegions] = useState<string[]>(["Toutes les régions"]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);

  // Fetch OSC data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch OSCs
        const oscResponse = await fetch(`${API_BASE_URL}/api/v1/crasc/osc?limit=500`);
        const oscRawData = await oscResponse.json();

        // Transform API data to match component interface
        const transformedOSCs: IOSC[] = oscRawData.map((osc: any) => ({
          ...osc,
          domaine: osc.type?.name || "Non spécifié",
          region: osc.crasc?.name || "Non spécifié",
          logo: osc.thumbnail_url,
          ville: osc.ville || "Non spécifié"
        }));

        setOscData(transformedOSCs);
        setFilteredOSCs(transformedOSCs);

        // Extract unique domaines and regions
        const uniqueDomaines = ["Tous les domaines", ...new Set(transformedOSCs.map(osc => osc.domaine || "Non spécifié"))];
        const uniqueRegions = ["Toutes les régions", ...new Set(transformedOSCs.map(osc => osc.region || "Non spécifié"))];

        setDomaines(uniqueDomaines);
        setRegions(uniqueRegions);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter OSCs based on search and filters
  useEffect(() => {
    let filtered = oscData;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(osc =>
        osc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        osc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (osc.ville?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      );
    }

    // Domaine filter
    if (selectedDomaine !== 'Tous les domaines') {
      filtered = filtered.filter(osc => osc.domaine === selectedDomaine);
    }

    // Region filter
    if (selectedRegion !== 'Toutes les régions') {
      filtered = filtered.filter(osc => osc.region === selectedRegion);
    }

    setFilteredOSCs(filtered);
  }, [searchQuery, selectedDomaine, selectedRegion, oscData]);

  const loadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDomaine('Tous les domaines');
    setSelectedRegion('Toutes les régions');
  };

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white font-poppins">

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Annuaire des <span className="text-[#E05017]">CRASC</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez les Organisations de la Société Civile membres du réseau CRASC
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
                {oscData.length}
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
                {domaines.length - 1}
              </div>
              <div className="text-sm font-bold uppercase tracking-wider text-gray-600 group-hover:text-white/80 transition-colors">
                Domaines d'Intervention
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
                Régions Couvertes
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
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une OSC par nom, domaine ou ville..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E05017] focus:border-transparent"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <select
                  value={selectedDomaine}
                  onChange={(e) => setSelectedDomaine(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E05017] focus:border-transparent appearance-none cursor-pointer"
                >
                  {domaines.map((domaine) => (
                    <option key={domaine} value={domaine}>{domaine}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E05017] focus:border-transparent appearance-none cursor-pointer"
                >
                  {regions.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count and Reset */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-gray-600">
                <span className="font-bold text-[#E05017]">{filteredOSCs.length}</span> OSC{filteredOSCs.length > 1 ? 's' : ''} trouvée{filteredOSCs.length > 1 ? 's' : ''}
              </p>
              {(searchQuery || selectedDomaine !== 'Tous les domaines' || selectedRegion !== 'Toutes les régions') && (
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
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#E05017]" />
            <p className="text-gray-600 font-semibold">Chargement des OSC...</p>
          </div>
        ) : filteredOSCs.length === 0 ? (
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-12 text-center border-2 border-orange-100">
            <div className="max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users2 className="w-10 h-10 text-[#E05017]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Aucune OSC trouvée
              </h3>
              <p className="text-gray-600 mb-8">
                Aucune OSC ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
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
              {filteredOSCs.slice(0, visibleCount).map((osc) => (
                <Link
                  key={osc.id}
                  href={`/annuaire/annuaire-des-osc/${osc.slug}`}
                  className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
                >
                  {/* Logo */}
                  <div className="aspect-video overflow-hidden relative bg-gray-100">
                    <ImageWithFallback
                      src={osc.logo || "/images/default-osc-logo.png"}
                      alt={osc.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Region Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-[#E05017] text-white text-xs font-bold px-3 py-1 rounded-full">
                        {osc.region}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#E05017] transition-colors">
                      {osc.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {osc.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="w-4 h-4 text-[#E05017] flex-shrink-0" />
                        <span className="font-semibold text-gray-700">{osc.domaine}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-[#E05017] flex-shrink-0" />
                        <span>{osc.ville}</span>
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

            {/* Load More Button */}
            {visibleCount < filteredOSCs.length && (
              <div className="text-center mb-12">
                <button
                  onClick={loadMore}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#E05017] to-[#d04010] text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Charger plus d'OSC
                  <ArrowRight className="w-5 h-5" />
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
              href="/rejoindre"
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
