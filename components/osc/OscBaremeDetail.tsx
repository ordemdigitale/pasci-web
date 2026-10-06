"use client";

import { Check, X, Minus } from "lucide-react";

/**
 * Détail du barème de notation sur 20 points.
 *
 * Le score affiché par `OscEvaluationBadge` ne dit pas *pourquoi* il est bas.
 * Ce composant détaille les six critères, le nombre de points obtenus sur
 * chacun et ce qu'il reste à faire : c'est la seule vue qui rend la note
 * actionnable pour une OSC.
 *
 * Doit rester aligné sur `app/services/osc_autoevaluation.py`.
 */

const POINTS_FORMALISATION: Record<string, number> = {
  journal_officiel: 7,
  recepisse_declaration: 5,
  agrement_decret: 5,
  recepisse_depot: 3,
  statuts_reglement: 1,
};

const LIBELLE_FORMALISATION: Record<string, string> = {
  journal_officiel: "Déclaration au Journal Officiel",
  recepisse_declaration: "Récépissé de déclaration",
  agrement_decret: "Agrément / décret",
  recepisse_depot: "Récépissé de dépôt",
  statuts_reglement: "Statuts et règlement intérieur",
};

export interface OscBaremeSource {
  type_document_formalisation?: string | null;
  existence_siege?: boolean | null;
  manuel_procedures?: boolean | null;
  plan_action?: boolean | null;
  rapports_annuels?: boolean | null;
  adhesion_crasc?: boolean | null;
  adhesion_crasc_statut?: "oui" | "non" | "en_cours" | null;
  score_autoevaluation?: number;
  couleur_autoevaluation_hex?: string;
}

interface Critere {
  libelle: string;
  obtenus: number;
  maximum: number;
  valeur: string;
  acquis: boolean;
  aFaire: string;
}

export function criteresDuBareme(osc: OscBaremeSource): Critere[] {
  const formalisation = POINTS_FORMALISATION[osc.type_document_formalisation || ""] ?? 0;
  const adhesionOui = osc.adhesion_crasc_statut
    ? osc.adhesion_crasc_statut === "oui"
    : Boolean(osc.adhesion_crasc);

  const binaire = (libelle: string, rempli: boolean | null | undefined, aFaire: string): Critere => ({
    libelle,
    obtenus: rempli ? 3 : 0,
    maximum: 3,
    valeur: rempli ? "Oui" : rempli === false ? "Non" : "Non renseigné",
    acquis: Boolean(rempli),
    aFaire,
  });

  return [
    {
      libelle: "Document de formalisation",
      obtenus: formalisation,
      maximum: 7,
      valeur: LIBELLE_FORMALISATION[osc.type_document_formalisation || ""] || "Non renseigné",
      acquis: formalisation > 0,
      aFaire: "Une déclaration au Journal Officiel vaut le maximum (7 points).",
    },
    binaire("Existence d'un siège", osc.existence_siege, "Renseigner l'adresse du siège social."),
    binaire("Plan d'action", osc.plan_action, "Déposer le plan d'action et son justificatif."),
    binaire("Rapports annuels d'activités", osc.rapports_annuels, "Déposer le dernier rapport annuel."),
    binaire("Manuel de procédures", osc.manuel_procedures, "Indiquer le manuel de procédures en vigueur."),
    {
      libelle: "Adhésion au CRASC",
      obtenus: adhesionOui ? 1 : 0,
      maximum: 1,
      valeur:
        osc.adhesion_crasc_statut === "en_cours"
          ? "En cours"
          : adhesionOui
            ? "Adhérente"
            : "Non adhérente",
      acquis: adhesionOui,
      aFaire: "Finaliser l'adhésion au CRASC et déposer la preuve.",
    },
  ];
}

export default function OscBaremeDetail({ osc }: { osc: OscBaremeSource }) {
  const criteres = criteresDuBareme(osc);
  const score = criteres.reduce((total, critere) => total + critere.obtenus, 0);
  const couleur = osc.couleur_autoevaluation_hex || "#6B7280";
  const manquants = criteres.filter((critere) => critere.obtenus < critere.maximum);

  return (
    <div className="space-y-4">
      {/* Jauge */}
      <div>
        <div className="mb-1 flex items-baseline justify-between">
          <span className="text-sm font-semibold text-gray-700">Score de notation</span>
          <span className="text-2xl font-extrabold tabular-nums" style={{ color: couleur }}>
            {score}
            <span className="text-base font-bold text-gray-400">/20</span>
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${(score / 20) * 100}%`, backgroundColor: couleur }}
          />
        </div>
      </div>

      {/* Détail par critère */}
      <ul className="divide-y divide-gray-100">
        {criteres.map((critere) => (
          <li key={critere.libelle} className="flex items-center gap-3 py-2.5">
            <span
              className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${
                critere.obtenus === critere.maximum
                  ? "bg-green-100 text-green-700"
                  : critere.obtenus > 0
                    ? "bg-amber-100 text-amber-700"
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {critere.obtenus === critere.maximum ? (
                <Check className="h-3.5 w-3.5" />
              ) : critere.obtenus > 0 ? (
                <Minus className="h-3.5 w-3.5" />
              ) : (
                <X className="h-3.5 w-3.5" />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-gray-800">{critere.libelle}</span>
              <span className="block truncate text-xs text-gray-500">{critere.valeur}</span>
            </span>
            <span className="flex-shrink-0 text-sm font-bold tabular-nums text-gray-700">
              {critere.obtenus}
              <span className="text-xs font-medium text-gray-400">/{critere.maximum}</span>
            </span>
          </li>
        ))}
      </ul>

      {manquants.length > 0 && (
        <div className="rounded-xl bg-amber-50 p-4">
          <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-amber-800">
            Pour améliorer votre score
          </p>
          <ul className="list-inside list-disc space-y-1 text-xs text-amber-900">
            {manquants.map((critere) => (
              <li key={critere.libelle}>{critere.aFaire}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
