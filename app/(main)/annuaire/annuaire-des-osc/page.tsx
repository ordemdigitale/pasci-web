"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, MapPin, Users2, Building, Filter, ArrowRight, Loader2, ChevronLeft, ChevronRight, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { ImageWithFallback } from "@/lib/imageWithFallback";
import Link from 'next/link';
import OscEvaluationBadge from '@/components/osc/OscEvaluationBadge';
import OscEtiquettes from '@/components/osc/OscEtiquettes';
import { useDomainesPrioritaires } from '@/lib/osc-domaines';
import {
  useOscFiltres,
  ADHESION_OPTIONS,
  CATEGORIE_OPTIONS,
  FORMALISATION_OPTIONS,
  JUSTIFICATIF_OPTIONS,
  OUI_NON_OPTIONS,
  SCORE_OPTIONS,
  categorieLabel,
} from '@/lib/osc-filtres';

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
  region_nom?: string | null;
  sous_prefecture?: string | null;
  categorie?: string | null;
  etiquettes?: string[];
  ville: string | null;
  email?: string | null;
  phone?: string | null;
  slug: string;
  score_autoevaluation?: number;
  couleur_autoevaluation?: string;
  couleur_autoevaluation_hex?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const PAGE_SIZE = 12;

/**
 * Recherche avancée : les 15 champs demandés sont tous des listes
 * déroulantes alimentées soit par un référentiel figé, soit par les valeurs
 * réellement présentes en base (`/crasc/osc/filtres`).
 */
const FILTRES_AVANCES_VIDES = {
  type_document_formalisation: '',
  has_document_formalisation: '',
  existence_siege: '',
  manuel_procedures: '',
  plan_action: '',
  rapports_annuels: '',
  adhesion_crasc_statut: '',
  niveau_regroupement: '',
  faitiere: '',
  niveau_couverture: '',
  departement: '',
  annee_creation: '',
  score: '',
};

type FiltresAvances = typeof FILTRES_AVANCES_VIDES;

const SELECT_CLS =
  "w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E05017] focus:border-transparent appearance-none cursor-pointer bg-white";

/** Liste déroulante de la recherche avancée. */
function ChampDeroulant({
  label,
  icone: Icone,
  value,
  onChange,
  placeholder,
  options,
}: {
  label: string;
  icone: typeof Filter;
  value: string;
  onChange: (valeur: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</span>
      <div className="relative">
        <Icone className="absolute left-3 top-1/2 z-10 w-4 h-4 -translate-y-1/2 text-gray-400" />
        <select value={value} onChange={(e) => onChange(e.target.value)} className={SELECT_CLS}>
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 w-4 h-4 -translate-y-1/2 text-gray-400" />
      </div>
    </label>
  );
}

const enOptions = (valeurs: string[]) => valeurs.map((valeur) => ({ value: valeur, label: valeur }));

export default function AnnuaireOSCPage() {
  const domaines = useDomainesPrioritaires();
  const filtresDisponibles = useOscFiltres();

  // Moteur 1 : recherche rapide
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState<string>('');
  const [selectedCrascId, setSelectedCrascId] = useState<string>('');
  const [selectedDomaine, setSelectedDomaine] = useState<string>('');
  const [regionQuery, setRegionQuery] = useState<string>('');
  const [sousPrefectureQuery, setSousPrefectureQuery] = useState<string>('');
  const [selectedCategorie, setSelectedCategorie] = useState<string>('');

  // Moteur 2 : recherche avancée
  const [avances, setAvances] = useState<FiltresAvances>(FILTRES_AVANCES_VIDES);
  const [panneauAvanceOuvert, setPanneauAvanceOuvert] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [oscData, setOscData] = useState<IOSC[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  // Distingue « pas encore chargé » de « aucun résultat » : sans cela le
  // rendu serveur affiche 0 partout et laisse croire que la base est vide.
  const [chargementInitial, setChargementInitial] = useState(true);

  const [crascs, setCrascs] = useState<ICRASC[]>([]);
  const [oscTypes, setOscTypes] = useState<IOSCType[]>([]);

  // Fetch filter options once
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/crasc/crasc?limit=50`)
      .then(r => r.json())
      .then((data: ICRASC[]) => setCrascs(Array.isArray(data) ? data : []))
      .catch(() => {});

    fetch(`${API_BASE_URL}/api/v1/crasc/osc-type?limit=50`)
      .then(r => r.json())
      .then((data: IOSCType[]) => setOscTypes(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const nbFiltresAvances = useMemo(
    () => Object.values(avances).filter(Boolean).length,
    [avances],
  );

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
      if (selectedDomaine) params.set('domaine_activite', selectedDomaine);
      if (regionQuery) params.set('region_nom', regionQuery);
      if (sousPrefectureQuery) params.set('sous_prefecture', sousPrefectureQuery);
      if (selectedCategorie) params.set('categorie', selectedCategorie);

      // Recherche avancée
      const { score, has_document_formalisation, ...reste } = avances;
      Object.entries(reste).forEach(([cle, valeur]) => {
        if (valeur) params.set(cle, valeur);
      });
      if (has_document_formalisation) {
        params.set('has_document_formalisation', has_document_formalisation === 'with' ? 'true' : 'false');
      }
      if (score) {
        const [min, max] = score.split('-');
        params.set('score_min', min);
        params.set('score_max', max);
      }

      const res = await fetch(`${API_BASE_URL}/api/v1/crasc/osc?${params}`);
      const data = await res.json();
      setOscData(data.items ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.pages ?? 0);
    } catch (error) {
      console.error("Erreur lors du chargement des OSC:", error);
    } finally {
      setLoading(false);
      setChargementInitial(false);
    }
  }, [currentPage, searchQuery, selectedTypeId, selectedCrascId, selectedDomaine, regionQuery, sousPrefectureQuery, selectedCategorie, avances]);

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

  const handleDomaineChange = (val: string) => {
    setSelectedDomaine(val);
    setCurrentPage(1);
  };

  const handleRegionChange = (val: string) => {
    setRegionQuery(val);
    setCurrentPage(1);
  };

  const handleSousPrefectureChange = (val: string) => {
    setSousPrefectureQuery(val);
    setCurrentPage(1);
  };

  const handleCategorieChange = (val: string) => {
    setSelectedCategorie(val);
    setCurrentPage(1);
  };

  const handleAvanceChange = (cle: keyof FiltresAvances) => (valeur: string) => {
    setAvances((precedents) => ({ ...precedents, [cle]: valeur }));
    setCurrentPage(1);
  };

  const resetAvances = () => {
    setAvances(FILTRES_AVANCES_VIDES);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchInput('');
    setSearchQuery('');
    setSelectedTypeId('');
    setSelectedCrascId('');
    setSelectedDomaine('');
    setRegionQuery('');
    setSousPrefectureQuery('');
    setSelectedCategorie('');
    setAvances(FILTRES_AVANCES_VIDES);
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

  const hasFilters = Boolean(
    searchQuery || selectedTypeId || selectedCrascId || selectedDomaine ||
    regionQuery || sousPrefectureQuery || selectedCategorie || nbFiltresAvances,
  );

  // Les listes déroulantes reprennent les valeurs en base ; les référentiels
  // servent de repli quand l'API des filtres n'a pas répondu.
  const optionsRegions = filtresDisponibles.regions.length ? filtresDisponibles.regions : [];
  const optionsDomaines = filtresDisponibles.domaines.length
    ? enOptions(filtresDisponibles.domaines)
    : domaines;
  const optionsTypes = (filtresDisponibles.types_osc.length ? filtresDisponibles.types_osc : oscTypes)
    .map((t) => ({ value: String(t.id), label: t.name }));

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
                {chargementInitial ? '…' : total.toLocaleString('fr-FR')}
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
                {oscTypes.length || '…'}
              </div>
              <div className="text-sm font-bold uppercase tracking-wider text-gray-600 group-hover:text-white/80 transition-colors">
	                Types d&apos;Organisation
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-xl p-6 border-2 border-[#E05017]/30 hover:border-[#E05017] hover:shadow-xl transition-all duration-300 text-center overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E05017] to-[#d04010] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              {/* Compteur synchronisé avec la liste des CRASC : un 6e CRASC
                  créé dans le back-office apparaît ici automatiquement. */}
              <div className="text-5xl font-extrabold text-[#E05017] group-hover:text-white transition-colors mb-2">
                {crascs.length || '…'}
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
	                  placeholder="Rechercher par nom, sigle, description, région, sous-préfecture, domaine…"
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
            <p className="text-xs text-gray-400">
              La recherche ignore les majuscules, les accents et les tirets : « san pedro » trouve « San-Pédro ».
            </p>

            {/* Filter Dropdowns */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <select
                  value={selectedTypeId}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className={SELECT_CLS}
                >
                  <option value="">Tous les types</option>
                  {optionsTypes.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <select
                  value={selectedCrascId}
                  onChange={(e) => handleCrascChange(e.target.value)}
                  className={SELECT_CLS}
                >
                  <option value="">Tous les CRASC</option>
                  {crascs.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <select
                  value={selectedDomaine}
                  onChange={(e) => handleDomaineChange(e.target.value)}
                  className={SELECT_CLS}
                >
                  <option value="">Tous les domaines</option>
                  {optionsDomaines.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Users2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <select
                  value={selectedCategorie}
                  onChange={(e) => handleCategorieChange(e.target.value)}
                  className={SELECT_CLS}
                >
                  <option value="">Toutes les catégories</option>
                  {CATEGORIE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Région et sous-préfecture : listes des valeurs réellement
                  enregistrées, pour éviter les recherches sans résultat. */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <select
                  value={regionQuery}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  className={SELECT_CLS}
                >
                  <option value="">Toutes les régions</option>
                  {optionsRegions.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <select
                  value={sousPrefectureQuery}
                  onChange={(e) => handleSousPrefectureChange(e.target.value)}
                  className={SELECT_CLS}
                >
                  <option value="">Toutes les sous-préfectures</option>
                  {filtresDisponibles.sous_prefectures.map((sp) => (
                    <option key={sp} value={sp}>{sp}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ─── Moteur de recherche avancée ─── */}
            <div className="rounded-xl border-2 border-dashed border-[#E05017]/40 bg-orange-50/40">
              <button
                type="button"
                onClick={() => setPanneauAvanceOuvert((ouvert) => !ouvert)}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <span className="flex items-center gap-3">
                  <SlidersHorizontal className="h-5 w-5 text-[#E05017]" />
                  <span>
                    <span className="block font-bold text-gray-900">Recherche avancée</span>
                    <span className="block text-xs text-gray-500">
                      Documents de formalisation, barème de notation, couverture, gouvernance…
                    </span>
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  {nbFiltresAvances > 0 && (
                    <span className="rounded-full bg-[#E05017] px-2.5 py-0.5 text-xs font-bold text-white">
                      {nbFiltresAvances}
                    </span>
                  )}
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition-transform ${panneauAvanceOuvert ? 'rotate-180' : ''}`}
                  />
                </span>
              </button>

              {panneauAvanceOuvert && (
                <div className="border-t border-[#E05017]/20 px-5 pb-5 pt-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <ChampDeroulant
                      label="1. Document de formalisation"
                      icone={Filter}
                      value={avances.type_document_formalisation}
                      onChange={handleAvanceChange('type_document_formalisation')}
                      placeholder="Tous les documents"
                      options={FORMALISATION_OPTIONS}
                    />
                    <ChampDeroulant
                      label="2. Justificatif de formalisation"
                      icone={Filter}
                      value={avances.has_document_formalisation}
                      onChange={handleAvanceChange('has_document_formalisation')}
                      placeholder="Avec ou sans justificatif"
                      options={JUSTIFICATIF_OPTIONS}
                    />
                    <ChampDeroulant
                      label="3. Existence d'un siège"
                      icone={Building}
                      value={avances.existence_siege}
                      onChange={handleAvanceChange('existence_siege')}
                      placeholder="Indifférent"
                      options={OUI_NON_OPTIONS}
                    />
                    <ChampDeroulant
                      label="4. Manuel de procédures"
                      icone={Filter}
                      value={avances.manuel_procedures}
                      onChange={handleAvanceChange('manuel_procedures')}
                      placeholder="Indifférent"
                      options={OUI_NON_OPTIONS}
                    />
                    <ChampDeroulant
                      label="5. Plan d'action"
                      icone={Filter}
                      value={avances.plan_action}
                      onChange={handleAvanceChange('plan_action')}
                      placeholder="Indifférent"
                      options={OUI_NON_OPTIONS}
                    />
                    <ChampDeroulant
                      label="6. Rapports annuels d'activités"
                      icone={Filter}
                      value={avances.rapports_annuels}
                      onChange={handleAvanceChange('rapports_annuels')}
                      placeholder="Indifférent"
                      options={OUI_NON_OPTIONS}
                    />
                    <ChampDeroulant
                      label="7. Adhésion au CRASC"
                      icone={Users2}
                      value={avances.adhesion_crasc_statut}
                      onChange={handleAvanceChange('adhesion_crasc_statut')}
                      placeholder="Indifférent"
                      options={ADHESION_OPTIONS}
                    />
                    <ChampDeroulant
                      label="8. Niveau de regroupement"
                      icone={Users2}
                      value={avances.niveau_regroupement}
                      onChange={handleAvanceChange('niveau_regroupement')}
                      placeholder="Tous les niveaux"
                      options={enOptions(filtresDisponibles.niveaux_regroupement)}
                    />
                    <ChampDeroulant
                      label="Organisations faîtières"
                      icone={Users2}
                      value={avances.faitiere}
                      onChange={handleAvanceChange('faitiere')}
                      placeholder="Indifférent"
                      options={[
                        { value: 'true', label: 'Faîtières (réseau, fédération, plateforme, confédération)' },
                        { value: 'false', label: 'Non faîtières' },
                      ]}
                    />
                    <ChampDeroulant
                      label="9. Catégorie d'organisation"
                      icone={Users2}
                      value={selectedCategorie}
                      onChange={handleCategorieChange}
                      placeholder="Toutes les catégories"
                      options={CATEGORIE_OPTIONS}
                    />
                    <ChampDeroulant
                      label="10. Type d'OSC"
                      icone={Building}
                      value={selectedTypeId}
                      onChange={handleTypeChange}
                      placeholder="Tous les types"
                      options={optionsTypes}
                    />
                    <ChampDeroulant
                      label="11. Niveau de couverture"
                      icone={MapPin}
                      value={avances.niveau_couverture}
                      onChange={handleAvanceChange('niveau_couverture')}
                      placeholder="Tous les niveaux"
                      options={enOptions(filtresDisponibles.niveaux_couverture)}
                    />
                    <ChampDeroulant
                      label="12. Département"
                      icone={MapPin}
                      value={avances.departement}
                      onChange={handleAvanceChange('departement')}
                      placeholder="Tous les départements"
                      options={enOptions(filtresDisponibles.departements)}
                    />
                    <ChampDeroulant
                      label="13. Domaine prioritaire"
                      icone={Filter}
                      value={selectedDomaine}
                      onChange={handleDomaineChange}
                      placeholder="Tous les domaines"
                      options={optionsDomaines}
                    />
                    <ChampDeroulant
                      label="14. Score de notation (/20)"
                      icone={Filter}
                      value={avances.score}
                      onChange={handleAvanceChange('score')}
                      placeholder="Tous les scores"
                      options={SCORE_OPTIONS}
                    />
                    <ChampDeroulant
                      label="15. Année de création"
                      icone={Filter}
                      value={avances.annee_creation}
                      onChange={handleAvanceChange('annee_creation')}
                      placeholder="Toutes les années"
                      options={enOptions(filtresDisponibles.annees_creation)}
                    />
                  </div>

                  {nbFiltresAvances > 0 && (
                    <button
                      onClick={resetAvances}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#E05017] hover:text-[#d04010]"
                    >
                      <X className="h-4 w-4" />
                      Effacer la recherche avancée
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Results Count and Reset */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-gray-600">
                {chargementInitial ? (
                  <span className="text-gray-400">Chargement de l&apos;annuaire…</span>
                ) : (
                  <>
                    <span className="font-bold text-[#E05017]">{total}</span> OSC{total > 1 ? 's' : ''} trouvée{total > 1 ? 's' : ''}
                    {totalPages > 1 && (
                      <span className="text-gray-400"> — page {currentPage} / {totalPages}</span>
                    )}
                  </>
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
                    <div className="mb-3">
                      <OscEvaluationBadge
                        score={osc.score_autoevaluation}
                        color={osc.couleur_autoevaluation}
                        hex={osc.couleur_autoevaluation_hex}
                      />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#E05017] transition-colors">
                      {osc.name}
                    </h3>
                    <OscEtiquettes etiquettes={osc.etiquettes} className="mb-2" />
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
	                      {osc.categorie && (
	                        <div className="flex items-center gap-2 text-sm text-gray-600">
	                          <Users2 className="w-4 h-4 text-[#E05017] flex-shrink-0" />
	                          <span>{categorieLabel(osc.categorie)}</span>
	                        </div>
	                      )}
	                      <div className="flex items-center gap-2 text-sm text-gray-600">
	                        <MapPin className="w-4 h-4 text-[#E05017] flex-shrink-0" />
	                        <span>{[osc.region_nom, osc.sous_prefecture, osc.ville].filter(Boolean).join(' · ') || "Non spécifié"}</span>
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
	            <h3 className="font-extrabold text-3xl mb-4">Votre OSC n&apos;est pas listée ?</h3>
	            <p className="max-w-2xl mx-auto mb-8 text-lg">
	              Rejoindre le réseau des CRASC pour bénéficier d&apos;un accompagnement personnalisé et apparaître dans cet annuaire.
	            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#E05017] font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Nous rejoindre
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
