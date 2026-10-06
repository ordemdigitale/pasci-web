import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/lib/api-config";

export type DomaineOption = { value: string; label: string };

// Liste de secours, utilisée seulement si l'API des pôles ne répond pas.
// La référence est la liste des pôles de concertation actifs (useDomainesPrioritaires) :
// chaque pôle correspond à un domaine prioritaire, et le 1er domaine d'une OSC
// détermine son pôle.
export const DOMAINE_PRIORITAIRE_OPTIONS: DomaineOption[] = [
  { value: "Agriculture pêche et sylviculture", label: "Agriculture pêche et sylviculture" },
  { value: "Banques et services financiers", label: "Banques et services financiers" },
  { value: "Commerce et tourisme", label: "Commerce et tourisme" },
  { value: "Éducation", label: "Éducation" },
  { value: "Entreprises et autres services", label: "Entreprises et autres services" },
  { value: "Gouvernement et Société Civile", label: "Gouvernement et Société Civile" },
  { value: "Infrastructure et services sociaux divers", label: "Infrastructure et services sociaux divers" },
  { value: "Prévention et règlement des conflits, paix et sécurité", label: "Prévention et règlement des conflits, paix et sécurité" },
  { value: "Programme pour la Population", label: "Programme pour la Population" },
  { value: "Protection de l’environnement, général", label: "Protection de l’environnement, général" },
  { value: "Santé", label: "Santé" },
];

/**
 * Domaines prioritaires = pôles de concertation actifs (même liste partout :
 * adhésion, profil OSC, admin, annuaire). Un pôle ajouté, renommé ou fusionné
 * dans l'admin apparaît donc automatiquement dans tous les formulaires.
 */
export function useDomainesPrioritaires(): DomaineOption[] {
  const [options, setOptions] = useState<DomaineOption[]>(DOMAINE_PRIORITAIRE_OPTIONS);

  useEffect(() => {
    let annule = false;
    fetch(`${API_ENDPOINTS.forum.poles}?limit=100`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const poles: { name?: string }[] = Array.isArray(data) ? data : data?.items ?? [];
        const noms = poles.map((p) => (p.name || "").trim()).filter(Boolean);
        if (!annule && noms.length > 0) {
          setOptions(
            noms
              .sort((a, b) => a.localeCompare(b, "fr"))
              .map((nom) => ({ value: nom, label: nom }))
          );
        }
      })
      .catch(() => {
        /* liste de secours conservée */
      });
    return () => {
      annule = true;
    };
  }, []);

  return options;
}

/**
 * Garde visible la valeur déjà enregistrée d'une OSC même si elle n'existe
 * pas dans la liste (ancien domaine, pôle renommé, région saisie librement),
 * pour ne pas l'effacer silencieusement à l'enregistrement.
 */
export function avecValeurActuelle(options: DomaineOption[], valeur?: string | null): DomaineOption[] {
  if (!valeur || options.some((o) => o.value === valeur)) return options;
  return [{ value: valeur, label: `${valeur} (valeur actuelle)` }, ...options];
}
