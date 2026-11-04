"use client";

import { useState } from "react";
import { Building, ChevronDown, Filter, MapPin, SlidersHorizontal, Users2, X } from "lucide-react";
import {
  ADHESION_OPTIONS,
  CATEGORIE_OPTIONS,
  FORMALISATION_OPTIONS,
  JUSTIFICATIF_OPTIONS,
  OUI_NON_OPTIONS,
  SCORE_OPTIONS,
  useOscFiltres,
} from "@/lib/osc-filtres";
import { useDomainesPrioritaires } from "@/lib/osc-domaines";

/**
 * Recherche avancée des OSC (15 critères) : réservée au back-office
 * (admins et rédacteurs CRASC). Les listes sont alimentées par un référentiel
 * figé ou par les valeurs réellement présentes en base (`/crasc/osc/filtres`).
 */
export const FILTRES_AVANCES_VIDES = {
  type_document_formalisation: "",
  has_document_formalisation: "",
  existence_siege: "",
  manuel_procedures: "",
  plan_action: "",
  rapports_annuels: "",
  adhesion_crasc_statut: "",
  niveau_regroupement: "",
  faitiere: "",
  categorie: "",
  type_id: "",
  niveau_couverture: "",
  departement: "",
  domaine_activite: "",
  score: "",
  annee_creation: "",
};

export type FiltresAvances = typeof FILTRES_AVANCES_VIDES;
export type CleFiltreAvance = keyof FiltresAvances;

/** Ajoute les critères renseignés aux paramètres de `/crasc/osc`. */
export function ajouterFiltresAvances(params: URLSearchParams, filtres: FiltresAvances) {
  const { score, has_document_formalisation, ...reste } = filtres;
  Object.entries(reste).forEach(([cle, valeur]) => {
    if (valeur) params.set(cle, valeur);
  });
  if (has_document_formalisation) {
    params.set("has_document_formalisation", has_document_formalisation === "with" ? "true" : "false");
  }
  if (score) {
    const [min, max] = score.split("-");
    params.set("score_min", min);
    params.set("score_max", max);
  }
}

const SELECT_CLS =
  "w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E05017] focus:border-transparent appearance-none cursor-pointer bg-white";

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

export default function RechercheAvanceeOsc({
  valeur,
  onChange,
  champsMasques = [],
}: {
  valeur: FiltresAvances;
  onChange: (filtres: FiltresAvances) => void;
  /** Critères déjà proposés ailleurs sur la page (pour ne pas les afficher deux fois) */
  champsMasques?: CleFiltreAvance[];
}) {
  const [ouvert, setOuvert] = useState(false);
  const disponibles = useOscFiltres();
  const domainesPoles = useDomainesPrioritaires();
  const optionsDomaines = disponibles.domaines.length ? enOptions(disponibles.domaines) : domainesPoles;
  const optionsTypes = disponibles.types_osc.map((t) => ({ value: String(t.id), label: t.name }));

  const nbActifs = Object.entries(valeur).filter(([cle, v]) => v && !champsMasques.includes(cle as CleFiltreAvance)).length;
  const maj = (cle: CleFiltreAvance) => (v: string) => onChange({ ...valeur, [cle]: v });

  const champs: { cle: CleFiltreAvance; label: string; icone: typeof Filter; placeholder: string; options: { value: string; label: string }[] }[] = [
    { cle: "type_document_formalisation", label: "Document de formalisation", icone: Filter, placeholder: "Tous les documents", options: FORMALISATION_OPTIONS },
    { cle: "has_document_formalisation", label: "Justificatif de formalisation", icone: Filter, placeholder: "Avec ou sans justificatif", options: JUSTIFICATIF_OPTIONS },
    { cle: "existence_siege", label: "Existence d'un siège", icone: Building, placeholder: "Indifférent", options: OUI_NON_OPTIONS },
    { cle: "manuel_procedures", label: "Manuel de procédures", icone: Filter, placeholder: "Indifférent", options: OUI_NON_OPTIONS },
    { cle: "plan_action", label: "Plan d'action", icone: Filter, placeholder: "Indifférent", options: OUI_NON_OPTIONS },
    { cle: "rapports_annuels", label: "Rapports annuels d'activités", icone: Filter, placeholder: "Indifférent", options: OUI_NON_OPTIONS },
    { cle: "adhesion_crasc_statut", label: "Adhésion au CRASC", icone: Users2, placeholder: "Indifférent", options: ADHESION_OPTIONS },
    { cle: "niveau_regroupement", label: "Niveau de regroupement", icone: Users2, placeholder: "Tous les niveaux", options: enOptions(disponibles.niveaux_regroupement) },
    {
      cle: "faitiere", label: "Organisations faîtières", icone: Users2, placeholder: "Indifférent",
      options: [
        { value: "true", label: "Faîtières (réseau, fédération, plateforme, confédération)" },
        { value: "false", label: "Non faîtières" },
      ],
    },
    { cle: "categorie", label: "Catégorie d'organisation", icone: Users2, placeholder: "Toutes les catégories", options: CATEGORIE_OPTIONS },
    { cle: "type_id", label: "Type d'OSC", icone: Building, placeholder: "Tous les types", options: optionsTypes },
    { cle: "niveau_couverture", label: "Niveau de couverture", icone: MapPin, placeholder: "Tous les niveaux", options: enOptions(disponibles.niveaux_couverture) },
    { cle: "departement", label: "Département", icone: MapPin, placeholder: "Tous les départements", options: enOptions(disponibles.departements) },
    { cle: "domaine_activite", label: "Domaine prioritaire", icone: Filter, placeholder: "Tous les domaines", options: optionsDomaines },
    { cle: "score", label: "Score de notation (/20)", icone: Filter, placeholder: "Tous les scores", options: SCORE_OPTIONS },
    { cle: "annee_creation", label: "Année de création", icone: Filter, placeholder: "Toutes les années", options: enOptions(disponibles.annees_creation) },
  ];
  const visibles = champs.filter((c) => !champsMasques.includes(c.cle));

  return (
    <div className="rounded-xl border-2 border-dashed border-[#E05017]/40 bg-orange-50/40">
      <button
        type="button"
        onClick={() => setOuvert((o) => !o)}
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
          {nbActifs > 0 && (
            <span className="rounded-full bg-[#E05017] px-2.5 py-0.5 text-xs font-bold text-white">{nbActifs}</span>
          )}
          <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${ouvert ? "rotate-180" : ""}`} />
        </span>
      </button>

      {ouvert && (
        <div className="border-t border-[#E05017]/20 px-5 pb-5 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visibles.map((c) => (
              <ChampDeroulant
                key={c.cle}
                label={c.label}
                icone={c.icone}
                value={valeur[c.cle]}
                onChange={maj(c.cle)}
                placeholder={c.placeholder}
                options={c.options}
              />
            ))}
          </div>
          {nbActifs > 0 && (
            <button
              type="button"
              onClick={() => {
                const vide = { ...valeur };
                visibles.forEach((c) => { vide[c.cle] = ""; });
                onChange(vide);
              }}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#E05017] hover:text-[#d04010]"
            >
              <X className="h-4 w-4" />
              Effacer la recherche avancée
            </button>
          )}
        </div>
      )}
    </div>
  );
}
