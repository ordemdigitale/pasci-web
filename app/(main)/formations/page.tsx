"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search, Loader2, Calendar, MapPin, Users,
  Clock, ChevronRight, ChevronLeft, Mail, Phone, Send, Lightbulb, CheckCircle,
  AlertCircle, BookOpen, UserCheck, GraduationCap, Building2, BarChart3
} from 'lucide-react';
import { ImageWithFallback } from "@/lib/imageWithFallback";
import { fetchAllFormations, IFormation } from '@/lib/fetch-formations';

const FALLBACK_IMAGE = "/images/page-formation/0cd2210f-3c2d-4036-9e65-e993265c441c.jpg";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const PAGE_SIZE = 9;


interface IFormationStats {
  total_formations: number;
  total_inscrits: number;
  total_osc_formees: number;
  par_categorie_acteur: { categorie: string; total: number }[];
}

interface SuggestionForm {
  nom: string;
  prenoms: string;
  email: string;
  contact: string;
  message: string;
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function isUpcoming(dateStr: string | null | undefined) {
  if (!dateStr) return false;
  return new Date(dateStr) > new Date();
}

export default function FormationsPage() {
  const [activeCategorie, setActiveCategorie] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'gratuite' | 'payante'>('all');
  const [filterMode, setFilterMode] = useState<'all' | 'en_ligne' | 'presentiel'>('all');
  const [filterStatut, setFilterStatut] = useState<'all' | 'actif' | 'termine'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [formations, setFormations] = useState<IFormation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [defaultImage, setDefaultImage] = useState(FALLBACK_IMAGE);

  const [stats, setStats] = useState<IFormationStats | null>(null);

  // Suggestion modal
  const [suggestion, setSuggestion] = useState<SuggestionForm>({ nom: '', prenoms: '', email: '', contact: '', message: '' });
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [suggestionSuccess, setSuggestionSuccess] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const formationsData = await fetchAllFormations({ published_only: true, limit: 100 });
        setFormations(formationsData);
      } catch {
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

    fetch(`${API_BASE}/api/v1/stats/formations`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setStats(data); })
      .catch(() => {});
  }, []);

  const categories = Array.from(
    new Set(formations.map(f => f.categorie).filter(Boolean))
  ) as string[];

  const filteredFormations = formations.filter(formation => {
    const matchesSearch = formation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (formation.description && formation.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategorie = activeCategorie === null || formation.categorie === activeCategorie;
    const matchesType = filterType === 'all' || formation.type === filterType;
    const isEnLigne = !formation.location || formation.location.toLowerCase().includes('ligne') || formation.location.toLowerCase().includes('online') || formation.location.toLowerCase().includes('distance');
    const matchesMode = filterMode === 'all' || (filterMode === 'en_ligne' ? isEnLigne : !isEnLigne);
    const matchesStatut = filterStatut === 'all' || (filterStatut === 'actif' ? !formation.is_completed : formation.is_completed);
    return matchesSearch && matchesCategorie && matchesType && matchesMode && matchesStatut;
  });

  const totalPages = Math.ceil(filteredFormations.length / PAGE_SIZE);
  const paginatedFormations = filteredFormations.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Reset page when filters change
  const setCategorie = (cat: string | null) => { setActiveCategorie(cat); setCurrentPage(1); };
  const setType = (v: 'all' | 'gratuite' | 'payante') => { setFilterType(v); setCurrentPage(1); };
  const setMode = (v: 'all' | 'en_ligne' | 'presentiel') => { setFilterMode(v); setCurrentPage(1); };
  const setStatut = (v: 'all' | 'actif' | 'termine') => { setFilterStatut(v); setCurrentPage(1); };
  const resetFilters = () => { setFilterType('all'); setFilterMode('all'); setFilterStatut('all'); setCurrentPage(1); };

  const upcomingFormations = formations
    .filter(f => isUpcoming(f.start_date))
    .sort((a, b) => new Date(a.start_date!).getTime() - new Date(b.start_date!).getTime())
    .slice(0, 6);

  const handleSuggestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuggestionLoading(true);
    setSuggestionError(null);
    try {
      const res = await fetch(`${API_BASE}/api/v1/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: suggestion.nom,
          prenoms: suggestion.prenoms,
          email: suggestion.email,
          contact: suggestion.contact,
          motif: 'Suggestion de formation',
          message: suggestion.message,
        }),
      });
      if (!res.ok) throw new Error();
      setSuggestionSuccess(true);
      setSuggestion({ nom: '', prenoms: '', email: '', contact: '', message: '' });
    } catch {
      setSuggestionError("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
      setSuggestionLoading(false);
    }
  };

  return (
    <section className="py-16 px-4 bg-white font-poppins">
      <div className="max-w-7xl mx-auto">

        {/* Header — pleine largeur */}
        <div className="border border-gray-200 rounded-lg p-8 mb-10 bg-[#f0f9ff] grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-[#2a591d] font-bold text-4xl">Explorez nos programmes de formation</h2>
            <p className="text-gray-600 text-md max-w-xl mt-6">
              Découvrez une <b>bibliothèque complète</b> de cours, formations, vidéos, audios et tutoriels conçus pour :
              <ul className="list-disc list-inside pl-5">
                <li><b>Enrichir vos connaissances</b> dans des domaines variés</li>
                <li><b>Développer vos compétences pratiques</b> grâce à des contenus interactifs</li>
                <li><b>Accéder à des ressources adaptées</b> à votre rythme et à vos besoins</li>
                <li><b>Apprendre en continu</b> avec des supports modernes et accessibles</li>
              </ul>
              <br />
              Que vous soyez débutant ou expert, notre plateforme vous accompagne pas à pas pour transformer vos ambitions en réussites.
              <br /><br />
              Déjà :
              <br />
              <ul className="list-disc list-inside pl-5">
                <li><b>3 553 OSC</b> formées aux critères de soumission aux appels à projet.</li>
                <li><b>1 056</b> Organisations formées aux <b>thématiques</b> : gestion de projets, communication digitale, égalité de genre, prévention et gestion des conflits.</li>
                <li><b>780</b> organisations &#40;femmes, jeunes, associations locales&#41; appuyées à la <b>création et à la formalisation</b>.</li>
                <li><b>20</b> organisations accompagnées techniquement et institutionnellement par semaine.</li>
              </ul>
            </p>
          </div>
          <div>
            <ImageWithFallback
              src="/images/page-formation/0cd2210f-3c2d-4036-9e65-e993265c441c.jpg"
              alt="image"
              className="w-full h-[700px] object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Search Bar — pleine largeur */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une formation..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Sidebar + Formations côte à côte */}
        <div className="flex gap-8">

          {/* Left Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0 mt-20">
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-md">
              {/* Titre sidebar */}
              <div className="bg-[#E05017] px-5 py-4">
                <p className="text-white font-bold text-sm uppercase tracking-widest">Catégories</p>
              </div>

              {/* Toutes les formations */}
              <button
                onClick={() => setCategorie(null)}
                className={`w-full text-left px-5 py-3.5 flex items-center gap-3 transition-all border-b border-gray-100 ${
                  activeCategorie === null
                    ? 'bg-[#E05017] text-white font-semibold'
                    : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-[#E05017]'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${activeCategorie === null ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  •
                </span>
                <span className="text-sm">Toutes les formations</span>
              </button>

              {/* Catégories dynamiques */}
              {categories.map((cat, index) => (
                <button
                  key={cat}
                  onClick={() => setCategorie(cat)}
                  className={`w-full text-left px-5 py-3.5 flex items-center gap-3 transition-all border-b border-gray-100 last:border-b-0 ${
                    activeCategorie === cat
                      ? 'bg-[#E05017] text-white font-semibold'
                      : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-[#E05017]'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${activeCategorie === cat ? 'bg-white/20 text-white' : 'bg-orange-100 text-[#E05017]'}`}>
                    {index + 1}
                  </span>
                  <span className="text-sm leading-snug">{cat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">

            {/* Formations Grid */}
            <div className="mb-8">
              <h3 className="text-gray-800 text-3xl font-bold my-6">Programmes de Formations</h3>

              {/* Filtres */}
              <div className="flex flex-wrap gap-3 mb-6">
                {/* Type */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
                  {([['all', 'Tous'], ['gratuite', 'Gratuit'], ['payante', 'Payant']] as const).map(([val, label]) => (
                    <button key={val} onClick={() => setType(val)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${filterType === val ? 'bg-green-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}>
                      {label}
                    </button>
                  ))}
                </div>
                {/* Mode */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
                  {([['all', 'Tous modes'], ['en_ligne', 'En ligne'], ['presentiel', 'Présentiel']] as const).map(([val, label]) => (
                    <button key={val} onClick={() => setMode(val)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${filterMode === val ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}>
                      {label}
                    </button>
                  ))}
                </div>
                {/* Statut */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
                  {([['all', 'Tous statuts'], ['actif', 'Actif'], ['termine', 'Terminé']] as const).map(([val, label]) => (
                    <button key={val} onClick={() => setStatut(val)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${filterStatut === val ? 'bg-[#E05017] text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}>
                      {label}
                    </button>
                  ))}
                </div>
                {/* Reset si filtres actifs */}
                {(filterType !== 'all' || filterMode !== 'all' || filterStatut !== 'all') && (
                  <button onClick={resetFilters}
                    className="px-3 py-1 rounded-full text-xs font-semibold text-gray-500 border border-gray-300 hover:bg-gray-100 transition-all">
                    Réinitialiser
                  </button>
                )}
              </div>

              {loading && (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#E05107]" />
                  <span className="ml-3 text-gray-600">Chargement des formations...</span>
                </div>
              )}
              {error && !loading && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>
              )}
              {!loading && !error && filteredFormations.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">
                    {searchQuery ? "Aucune formation ne correspond à votre recherche." : "Aucune formation disponible pour le moment."}
                  </p>
                </div>
              )}

              {!loading && !error && filteredFormations.length > 0 && (
                <>
                  <p className="text-sm text-gray-500 mb-4">
                    {filteredFormations.length} formation{filteredFormations.length > 1 ? 's' : ''} trouvée{filteredFormations.length > 1 ? 's' : ''}
                    {totalPages > 1 && ` — Page ${currentPage} / ${totalPages}`}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {paginatedFormations.map((formation) => (
                      <div key={formation.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative h-48">
                          <ImageWithFallback
                            src={formation.thumbnail_url || defaultImage}
                            alt={formation.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-5">
                          {/* Ligne 1 : type + rubrique */}
                          <div className="flex items-center gap-2 mb-1">
                            {formation.type === "payante" ? (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                                {formation.price ? `${formation.price.toLocaleString()} FCFA` : "Payante"}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Gratuite</span>
                            )}
                            {formation.rubrique && (
                              <span className="px-2 py-0.5 text-white text-xs font-semibold rounded-full" style={{ backgroundColor: formation.rubrique.color || '#E05017' }}>
                                {formation.rubrique.name}
                              </span>
                            )}
                          </div>
                          <h4 className="text-gray-800 text-xl font-semibold mb-3">{formation.title}</h4>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{formation.description || "Aucune description disponible."}</p>
                          {formation.start_date && (
                            <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(formation.start_date)}
                            </p>
                          )}
                          <Link href={`/formations/${formation.slug}`}>
                            <button className="px-4 py-2 text-white rounded-full text-sm hover:bg-[#c44315] transition-colors" style={{ backgroundColor: '#E05107' }}>
                              Voir plus
                            </button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        aria-label="Page précédente"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        const isActive = page === currentPage;
                        const isNearCurrent = Math.abs(page - currentPage) <= 1 || page === 1 || page === totalPages;
                        if (!isNearCurrent) {
                          if (page === currentPage - 2 || page === currentPage + 2) {
                            return <span key={page} className="text-gray-400 px-1">…</span>;
                          }
                          return null;
                        }
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                              isActive
                                ? 'bg-[#E05017] text-white'
                                : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        aria-label="Page suivante"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                </>
              )}
            </div>
          </div>
        </div>

        {/* ── STATISTIQUES ── */}
        {stats && (
          <div className="py-12 border-t border-gray-100">
            <div className="flex gap-8">
              <div className="hidden lg:block w-64 flex-shrink-0" />
              <div className="flex-1">
              <h3 className="text-gray-800 text-2xl font-bold mb-2 flex items-center gap-3">
                <BarChart3 className="w-7 h-7 text-[#2a591d]" />
                Nos formations en chiffres
              </h3>
              <p className="text-gray-500 text-sm mb-8">Données mises à jour en temps réel</p>

              {/* Chiffres clés */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                {[
                  {
                    icon: <GraduationCap className="w-8 h-8 text-white" />,
                    value: stats.total_inscrits.toLocaleString('fr-FR'),
                    label: 'Personnes formées',
                    sublabel: 'Total des inscrits à toutes les formations',
                    bg: 'from-[#2a591d] to-[#3d7a28]',
                  },
                  {
                    icon: <Building2 className="w-8 h-8 text-white" />,
                    value: stats.total_osc_formees.toLocaleString('fr-FR'),
                    label: 'OSC formées',
                    sublabel: 'Organisations ayant participé',
                    bg: 'from-[#E05017] to-[#c44315]',
                  },
                  {
                    icon: <BookOpen className="w-8 h-8 text-white" />,
                    value: stats.total_formations.toLocaleString('fr-FR'),
                    label: 'Formations disponibles',
                    sublabel: 'Programmes publiés actifs',
                    bg: 'from-[#1a6a9a] to-[#155e8a]',
                  },
                ].map(({ icon, value, label, sublabel, bg }) => (
                  <div key={label} className={`bg-gradient-to-br ${bg} rounded-2xl p-6 text-white shadow-lg`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-white/20 rounded-xl">{icon}</div>
                    </div>
                    <p className="text-4xl font-extrabold">{value}</p>
                    <p className="text-lg font-semibold mt-1">{label}</p>
                    <p className="text-white/70 text-xs mt-1">{sublabel}</p>
                  </div>
                ))}
              </div>

              {/* Répartition par catégorie d'acteurs */}
              {stats.par_categorie_acteur.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h4 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#E05017]" />
                    OSC formées par catégorie d&apos;acteurs
                  </h4>
                  <div className="space-y-4">
                    {(() => {
                      const maxTotal = Math.max(...stats.par_categorie_acteur.map(c => c.total));
                      return stats.par_categorie_acteur.map(({ categorie, total }, i) => {
                        const pct = maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0;
                        const colors = ['#2a591d', '#E05017', '#1a6a9a', '#7c3aed', '#b45309', '#0f766e'];
                        const color = colors[i % colors.length];
                        return (
                          <div key={categorie}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700">{categorie}</span>
                              <span className="text-sm font-bold text-gray-900">{total.toLocaleString('fr-FR')}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                              <div
                                className="h-2.5 rounded-full transition-all duration-700"
                                style={{ width: `${pct}%`, backgroundColor: color }}
                              />
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        )}

        {/* ── AGENDA ── */}
        {upcomingFormations.length > 0 && (
          <div className="py-12 border-t border-gray-100">
            <div className="flex gap-8">
              <div className="hidden lg:block w-64 flex-shrink-0" />
              <div className="flex-1">
              <h3 className="text-gray-800 text-2xl font-bold mb-2 flex items-center gap-3">
                <Calendar className="w-7 h-7 text-[#2a591d]" />
                Agenda des Formations
              </h3>
              <p className="text-gray-500 text-sm mb-8">Prochaines formations planifiées</p>
              <div className="space-y-4">
                {upcomingFormations.map((f) => (
                  <div key={f.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white border border-gray-200 hover:border-[#2a591d] rounded-xl p-5 shadow-sm hover:shadow-md transition-all group">
                    {/* Date badge */}
                    <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-[#2a591d] text-white flex flex-col items-center justify-center text-center">
                      <span className="text-xl font-bold leading-none">{new Date(f.start_date!).getDate()}</span>
                      <span className="text-xs uppercase mt-0.5">{new Date(f.start_date!).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 group-hover:text-[#2a591d] transition-colors line-clamp-1">{f.title}</h4>
                      <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-500">
                        {f.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{f.location}</span>}
                        {f.trainer && <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{f.trainer}</span>}
                        {f.registration_deadline && (
                          <span className="flex items-center gap-1 text-orange-600">
                            <Clock className="w-3.5 h-3.5" />
                            Inscription avant le {formatDate(f.registration_deadline)}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Badges */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {f.type === "payante" ? (
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                          {f.price ? `${f.price.toLocaleString()} FCFA` : "Payante"}
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Gratuite</span>
                      )}
                      <Link href={`/formations/${f.slug}`} className="flex items-center gap-1 text-[#2a591d] font-semibold text-sm hover:underline">
                        Détails <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        )}

        {/* ── PROCÉDURE D'INSCRIPTION ── */}
        <div className="py-12 border-t border-gray-100">
          <div className="flex gap-8">
            <div className="hidden lg:block w-64 flex-shrink-0" />
            <div className="flex-1">
            <h3 className="text-gray-800 text-2xl font-bold mb-2 flex items-center gap-3">
              <BookOpen className="w-7 h-7 text-[#2a591d]" />
              Procédure d&apos;inscription
            </h3>
            <p className="text-gray-500 text-sm mb-8">Comment participer à nos formations</p>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              {/* Étapes */}
              <div>
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[#E05017]" /> Étapes d&apos;inscription
                </h4>
                <ol className="space-y-4">
                  {[
                    { step: "01", title: "Choisir une formation", desc: "Consultez le catalogue et sélectionnez la formation adaptée à vos besoins." },
                    { step: "02", title: "Vérifier les prérequis", desc: "Assurez-vous de remplir les conditions d'accès avant de vous inscrire." },
                    { step: "03", title: "S'inscrire avant la deadline", desc: "Soumettez votre dossier avant la date limite indiquée sur la fiche formation." },
                    { step: "04", title: "Confirmation & participation", desc: "Un email de confirmation vous sera envoyé. Présentez-vous le jour J." },
                  ].map(({ step, title, desc }) => (
                    <li key={step} className="flex gap-4">
                      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#2a591d] text-white flex items-center justify-center text-sm font-bold">{step}</div>
                      <div>
                        <p className="font-semibold text-gray-800">{title}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Prérequis & Conditions */}
              <div>
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#E05017]" /> Prérequis généraux
                </h4>
                <ul className="space-y-3">
                  {[
                    "Être membre ou représentant d'une OSC",
                    "Avoir une adresse email valide pour recevoir la confirmation",
                    "Respecter la date limite d'inscription propre à chaque formation",
                    "Présenter une pièce d'identité ou un justificatif le jour de la formation",
                    "Pour les formations payantes : effectuer le paiement avant la deadline",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-[#2a591d] mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm font-semibold text-orange-800 flex items-center gap-2 mb-1">
                    <AlertCircle className="w-4 h-4" /> Important
                  </p>
                  <p className="text-sm text-orange-700">
                    Les inscriptions sont closes automatiquement à la date limite ou lorsque le nombre maximum de participants est atteint.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* ── CONTACT & SUGGESTION ── */}
        <div className="py-12 border-t border-gray-100">
          <div className="flex gap-8">
            <div className="hidden lg:block w-64 flex-shrink-0" />
            <div className="flex-1">
            <div className="grid md:grid-cols-2 gap-8">

              {/* Contact */}
              <div className="bg-[#2a591d] rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-3">
                  <Mail className="w-6 h-6" /> Plus d&apos;informations ?
                </h3>
                <p className="text-white/80 text-sm mb-6">
                  Notre équipe est disponible pour répondre à vos questions sur les formations, les modalités d&apos;accès et les contenus pédagogiques.
                </p>
                <div className="space-y-3 mb-6">
                  <a href="mailto:formation@plateforme-osci.org" className="flex items-center gap-3 text-white/90 hover:text-white transition-colors text-sm">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    formation@plateforme-osci.org
                  </a>
                  <a href="tel:+2250000000000" className="flex items-center gap-3 text-white/90 hover:text-white transition-colors text-sm">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    +225 00 00 00 00 00
                  </a>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#2a591d] font-semibold rounded-lg hover:bg-white/90 transition-colors text-sm"
                >
                  Envoyer un message <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Suggérer une formation */}
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                  <Lightbulb className="w-6 h-6 text-[#E05017]" /> Suggérer une formation
                </h3>
                <p className="text-gray-500 text-sm mb-5">
                  Vous avez une idée de formation utile à la communauté ? Partagez-la avec nous.
                </p>
                {suggestionSuccess ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
                    <p className="font-semibold text-gray-800">Merci pour votre suggestion !</p>
                    <p className="text-sm text-gray-500 mt-1">Notre équipe en prendra connaissance.</p>
                    <button onClick={() => setSuggestionSuccess(false)} className="mt-4 text-sm text-[#E05017] hover:underline">Soumettre une autre suggestion</button>
                  </div>
                ) : (
                  <form onSubmit={handleSuggestionSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Nom *"
                        required
                        value={suggestion.nom}
                        onChange={e => setSuggestion(s => ({ ...s, nom: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                      <input
                        type="text"
                        placeholder="Prénoms *"
                        required
                        value={suggestion.prenoms}
                        onChange={e => setSuggestion(s => ({ ...s, prenoms: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                    <input
                      type="email"
                      placeholder="Email *"
                      required
                      value={suggestion.email}
                      onChange={e => setSuggestion(s => ({ ...s, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <textarea
                      placeholder="Décrivez la formation que vous souhaitez (thème, public cible, contenu souhaité…) *"
                      required
                      rows={3}
                      value={suggestion.message}
                      onChange={e => setSuggestion(s => ({ ...s, message: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                    />
                    {suggestionError && <p className="text-red-600 text-xs">{suggestionError}</p>}
                    <button
                      type="submit"
                      disabled={suggestionLoading}
                      className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-[#E05017] text-white font-semibold rounded-lg hover:bg-[#c44315] transition-colors text-sm disabled:opacity-60"
                    >
                      {suggestionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Envoyer ma suggestion
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* CTA final */}
        <div className="py-8">
          <div className="flex gap-8">
            <div className="hidden lg:block w-64 flex-shrink-0" />
            <div className="flex-1 bg-[#E05017] rounded-lg py-8 space-y-6 text-center text-white">
            <p className="font-bold text-4xl">Prêt à se faire accompagner ?</p>
            <p className="max-w-2xl mx-auto">Nous contacter dès aujourd&apos;hui pour discuter de vos besoins et découvrir comment nous pouvons vous aider à atteindre vos objectifs.</p>
            <Link
              href="/contact"
              className="inline-block border border-transparent hover:border-white text-[#E05017] hover:text-white bg-white hover:bg-transparent rounded-lg px-6 py-2 transition-colors"
            >
              Prendre Contact
            </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
