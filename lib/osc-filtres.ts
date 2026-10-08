import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api-config";

/**
 * Options de la recherche de l'annuaire.
 *
 * Elles viennent de `GET /crasc/osc/filtres`, qui renvoie les valeurs
 * réellement enregistrées : proposer une liste déroulante plutôt qu'une
 * saisie libre supprime les recherches sans résultat dues à une faute de
 * frappe ou à un accent manquant.
 */
export interface OscFiltres {
  regions: string[];
  departements: string[];
  sous_prefectures: string[];
  villes: string[];
  domaines: string[];
  niveaux_couverture: string[];
  niveaux_regroupement: string[];
  annees_creation: string[];
  types_osc: { id: number; name: string }[];
  crascs: { id: number; name: string }[];
  bareme: { critere: string; points: number; detail: string }[];
  tranches_couleur: { couleur: string; min: number; max: number; libelle: string; hex: string }[];
}

/**
 * Barème sur 20 points et code couleur — repris de l'API
 * (`app/services/osc_autoevaluation.py`). Ces valeurs servent de repli pour
 * que le barème reste affiché même si l'appel aux filtres échoue.
 */
export const BAREME_DEFAUT: OscFiltres["bareme"] = [
  { critere: "Document de formalisation", points: 7, detail: "Journal Officiel 7 · Récépissé de déclaration 5 · Agrément/décret 5 · Récépissé de dépôt 3 · Statuts 1" },
  { critere: "Existence d'un siège", points: 3, detail: "Siège social identifié" },
  { critere: "Plan d'action", points: 3, detail: "Plan d'action formalisé" },
  { critere: "Rapports annuels d'activités", points: 3, detail: "Rapports d'activités produits" },
  { critere: "Manuel de procédures", points: 3, detail: "Manuel de procédures en vigueur" },
  { critere: "Adhésion au CRASC", points: 1, detail: "Adhésion effective au CRASC" },
];

export const TRANCHES_COULEUR_DEFAUT: OscFiltres["tranches_couleur"] = [
  { couleur: "rouge", min: 1, max: 5, libelle: "Très faible", hex: "#DC2626" },
  { couleur: "orange", min: 6, max: 8, libelle: "Faible", hex: "#EA580C" },
  { couleur: "jaune", min: 9, max: 12, libelle: "Moyen", hex: "#CA8A04" },
  { couleur: "bleu", min: 13, max: 15, libelle: "Bon", hex: "#2563EB" },
  { couleur: "vert", min: 16, max: 20, libelle: "Très bon", hex: "#16A34A" },
];

export const FILTRES_VIDES: OscFiltres = {
  regions: [],
  departements: [],
  sous_prefectures: [],
  villes: [],
  domaines: [],
  niveaux_couverture: [],
  niveaux_regroupement: [],
  annees_creation: [],
  types_osc: [],
  crascs: [],
  bareme: BAREME_DEFAUT,
  tranches_couleur: TRANCHES_COULEUR_DEFAUT,
};

export function useOscFiltres(): OscFiltres {
  const [filtres, setFiltres] = useState<OscFiltres>(FILTRES_VIDES);

  useEffect(() => {
    let annule = false;
    fetch(`${API_BASE_URL}/api/v1/crasc/osc/filtres`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && !annule) setFiltres({ ...FILTRES_VIDES, ...data });
      })
      .catch(() => {
        /* la recherche reste utilisable sans les listes */
      });
    return () => {
      annule = true;
    };
  }, []);

  return filtres;
}

// ─── Référentiels partagés par la recherche avancée et le back-office ───

export const FORMALISATION_OPTIONS = [
  { value: "journal_officiel", label: "Déclaration au Journal Officiel (7 pts)" },
  { value: "recepisse_declaration", label: "Récépissé de déclaration (5 pts)" },
  { value: "agrement_decret", label: "Agrément / décret (5 pts)" },
  { value: "recepisse_depot", label: "Récépissé de dépôt (3 pts)" },
  { value: "statuts_reglement", label: "Statuts et règlement intérieur (1 pt)" },
];

export const CATEGORIE_OPTIONS = [
  { value: "organisation_jeune", label: "Organisation de jeunes (OdJ)" },
  { value: "organisation_femme", label: "Organisation de femmes (OdF)" },
  { value: "organisation_handicap", label: "Organisation de personnes en situation de handicap (OPSH)" },
  { value: "organisation_mixte", label: "Organisation mixte" },
];

export const OUI_NON_OPTIONS = [
  { value: "true", label: "Oui" },
  { value: "false", label: "Non / non renseigné" },
];

export const ADHESION_OPTIONS = [
  { value: "oui", label: "Adhérente" },
  { value: "en_cours", label: "Adhésion en cours" },
  { value: "non", label: "Non adhérente" },
];

export const JUSTIFICATIF_OPTIONS = [
  { value: "with", label: "Justificatif fourni" },
  { value: "without", label: "Sans justificatif" },
];

/** Tranches de score alignées sur le code couleur du barème sur 20 points. */
export const SCORE_OPTIONS = [
  { value: "16-20", label: "16 à 20 — Très bon", hex: "#16A34A" },
  { value: "13-15", label: "13 à 15 — Bon", hex: "#2563EB" },
  { value: "9-12", label: "9 à 12 — Moyen", hex: "#CA8A04" },
  { value: "6-8", label: "6 à 8 — Faible", hex: "#EA580C" },
  { value: "1-5", label: "1 à 5 — Très faible", hex: "#DC2626" },
  { value: "0-0", label: "0 — Non évaluée", hex: "#6B7280" },
];

export const categorieLabel = (value?: string | null) =>
  CATEGORIE_OPTIONS.find((option) => option.value === value)?.label || value || "";

export const formalisationLabel = (value?: string | null) =>
  FORMALISATION_OPTIONS.find((option) => option.value === value)?.label.replace(/ \(\d+ pts?\)$/, "") ||
  value ||
  null;
