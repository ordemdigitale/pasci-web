"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Loader2, Download, FileText } from 'lucide-react';
import { ImageWithFallback } from "@/lib/imageWithFallback"
import { fetchAllFormations, fetchAllRubriques, IFormation, IFormationRubrique } from '@/lib/fetch-formations';

const FALLBACK_IMAGE = "/images/page-formation/0cd2210f-3c2d-4036-9e65-e993265c441c.jpg";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ICatalogue {
  id: number;
  titre: string;
  description?: string | null;
  fichier_url: string;
  is_active: boolean;
}

export default function FormationsPage() {
  const [activeRubriqueId, setActiveRubriqueId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [visiblePrograms, setVisiblePrograms] = useState(9);
  const [formations, setFormations] = useState<IFormation[]>([]);
  const [rubriques, setRubriques] = useState<IFormationRubrique[]>([]);
  const [catalogues, setCatalogues] = useState<ICatalogue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [defaultImage, setDefaultImage] = useState(FALLBACK_IMAGE);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [formationsData, rubriquesData, cataloguesRes] = await Promise.all([
          fetchAllFormations({ published_only: true, limit: 100 }),
          fetchAllRubriques(),
          fetch(`${API_BASE}/api/v1/formations/catalogue?active_only=true`).then(r => r.ok ? r.json() : []),
        ]);
        setFormations(formationsData);
        setRubriques(rubriquesData.filter((r) => r.is_active));
        setCatalogues(cataloguesRes);
      } catch (err) {
        console.error("Erreur lors du chargement:", err);
        setError("Erreur lors du chargement des formations. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };
    loadData();

    fetch(`${API_BASE}/api/v1/config`)
      .then((r) => r.ok ? r.json() : {})
      .then((cfg: Record<string, string>) => { if (cfg.formation_default_image) setDefaultImage(cfg.formation_default_image); })
      .catch(() => {});
  }, []);

  // Filter formations
  const filteredFormations = formations.filter(formation => {
    const matchesSearch = formation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (formation.description && formation.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRubrique = activeRubriqueId === null || formation.rubrique_id === activeRubriqueId;
    return matchesSearch && matchesRubrique;
  });

  const loadMorePrograms = () => {
    setVisiblePrograms(prev => Math.min(prev + 5, filteredFormations.length));
  };

  return (
    <section className="py-16 px-4 bg-white font-poppins">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-8">
          {/* Left Sidebar — visible uniquement s'il y a des rubriques */}
          {rubriques.length > 0 && (
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => setActiveRubriqueId(null)}
                className={`w-full text-left px-6 py-4 transition-colors rounded-t-lg ${
                  activeRubriqueId === null ? 'text-white' : 'text-gray-700 hover:bg-gray-50'
                }`}
                style={activeRubriqueId === null ? { backgroundColor: '#E05017' } : {}}
              >
                <span className="flex items-center gap-3">
                  <span className="text-sm">•</span>
                  <span>Toutes les formations</span>
                </span>
              </button>
              {rubriques.map((r, index) => (
                <button
                  key={r.id}
                  onClick={() => setActiveRubriqueId(r.id)}
                  className={`w-full text-left px-6 py-4 transition-colors ${
                    activeRubriqueId === r.id ? 'text-white' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  style={activeRubriqueId === r.id ? { backgroundColor: r.color || '#E05017' } : {}}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-sm">{index + 1}</span>
                    <span>{r.name}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Header Section */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-200 rounded-lg p-8 mb-10 bg-[#f0f9ff] grid lg:grid-cols-2 gap-12">
            {/* Left content */}
            <div className="">
              <h2 className="text-[#2a591d] font-bold text-4xl">Explorez nos programmes de formation</h2>
              <p className="text-gray-600 text-md max-w-xl mt-6">
                Découvrir une bibliothèque complète de cours, formations, vidéos, audios et tutoriels conçus pour enrichir vos connaissances et développer vos compétences.
              </p>

            </div>
            
            {/* Right content */}
            <div className="space-y-12">
              <div className="">
                <ImageWithFallback
                  src="/images/page-formation/0cd2210f-3c2d-4036-9e65-e993265c441c.jpg"
                  alt="image"
                  className="w-full h-[300px] object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une formation (ex: Rédaction d'appel à Projets, Rédaction de statut, Formalisation...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

            {/* Programs Section */}
            <div className="mb-8">
              <h3 className="text-gray-800 text-3xl font-bold my-6">Programmes de Formations</h3>

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#E05107]" />
                  <span className="ml-3 text-gray-600">Chargement des formations...</span>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                  {error}
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && filteredFormations.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">
                    {searchQuery
                      ? "Aucune formation ne correspond à votre recherche."
                      : "Aucune formation disponible pour le moment."}
                  </p>
                </div>
              )}

              {/* Formations Grid */}
              {!loading && !error && filteredFormations.length > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {filteredFormations.slice(0, visiblePrograms).map((formation) => (
                      <div
                        key={formation.id}
                        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="relative h-48">
                          <ImageWithFallback
                            src={formation.thumbnail_url || defaultImage}
                            alt={formation.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-5">
                          <div className="flex items-center gap-2 mb-2">
                            {formation.type === "payante" ? (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                                {formation.price ? `${formation.price.toLocaleString()} FCFA` : "Payante"}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                Gratuite
                              </span>
                            )}
                            {formation.rubrique && (
                              <span
                                className="px-2 py-0.5 text-white text-xs font-semibold rounded-full"
                                style={{ backgroundColor: formation.rubrique.color || '#E05017' }}
                              >
                                {formation.rubrique.name}
                              </span>
                            )}
                          </div>
                          <h4 className="text-gray-800 text-xl font-semibold mb-3">{formation.title}</h4>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {formation.description || "Aucune description disponible."}
                          </p>

                          <Link href={`/formations/${formation.slug}`}>
                            <button
                              className="px-4 py-2 text-white rounded-full text-sm hover:bg-[#c44315] transition-colors"
                              style={{ backgroundColor: '#E05107' }}
                            >
                              Voir plus
                            </button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Load More Buttons */}
                  <div className="flex flex-wrap gap-3 justify-end">
                    {visiblePrograms < filteredFormations.length && (
                      <button
                        onClick={loadMorePrograms}
                        className="px-6 py-2 border border-[#E05107] text-[#E05107] rounded-lg hover:bg-[#E05107] hover:text-white transition-colors"
                      >
                        Voir plus
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Catalogue de formations */}
        {catalogues.length > 0 && (
          <div className="py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <h3 className="text-gray-800 text-2xl font-bold mb-6 flex items-center gap-3">
                <FileText className="w-7 h-7 text-[#E05017]" />
                Catalogue de Formations
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catalogues.map((cat) => (
                  <a
                    key={cat.id}
                    href={cat.fichier_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 bg-white border-2 border-gray-200 hover:border-[#E05017] rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-red-50 group-hover:bg-[#E05017]/10 flex items-center justify-center flex-shrink-0 transition-colors">
                      <FileText className="w-6 h-6 text-red-500 group-hover:text-[#E05017]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 line-clamp-1 group-hover:text-[#E05017] transition-colors">{cat.titre}</p>
                      {cat.description && (
                        <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">{cat.description}</p>
                      )}
                    </div>
                    <Download className="w-5 h-5 text-gray-400 group-hover:text-[#E05017] flex-shrink-0 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Prêt à se faire accompagner */}
        <div className="py-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#E05017] rounded-lg py-8 space-y-6 text-center text-white">
            <p className="font-bold text-4xl">Prêt à se faire accompagner ?</p>
            <p className="max-w-2xl mx-auto">Nous contacter dès aujourd'hui pour discuter de vos besoins et découvrir comment nous pouvons vous aider à atteindre vos objectifs.</p>
            <Link
              href="/contact"
              className="border border-transparent hover:border-white text-[#E05017] hover:text-white bg-white hover:bg-transparent rounded-lg px-6 py-2">
              Prendre Contact
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
