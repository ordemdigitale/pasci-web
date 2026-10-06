import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/lib/api-config";

// Listes partagées par le formulaire d'adhésion et la modification du profil OSC
// (retours PdoC : « harmoniser les champs à l'enrôlement avec ceux de la mise à jour »).
// La référence est la liste des régions en base (useRegions) ; la liste ci-dessous
// ne sert que de secours si l'API ne répond pas. L'API rapproche de toute façon les
// noms sans tenir compte des accents ni de la ponctuation (« San-Pédro » / « San Pedro »).

export const REGIONS_OPTIONS = [
  "District Autonome d'Abidjan",
  "District Autonome de Yamoussoukro",
  "Agnéby-Tiassa",
  "Bafing",
  "Bagoué",
  "Béré",
  "Bélier",
  "Bounkani",
  "Cavally",
  "Folon",
  "Gbêkê",
  "Gbôklé",
  "Gôh",
  "Gontougo",
  "Grands-Ponts",
  "Guémon",
  "Hambol",
  "Haut-Sassandra",
  "Iffou",
  "Indénié-Djuablin",
  "Kabadougou",
  "La Mé",
  "Loh-Djiboua",
  "Marahoué",
  "Moronou",
  "Nawa",
  "N'Zi",
  "Poro",
  "San-Pédro",
  "Sud-Comoé",
  "Tchologo",
  "Tonkpi",
  "Worodougou",
].map((nom) => ({ value: nom, label: nom }));

/** Régions de la base (mêmes noms que l'annuaire et les CRASC). */
export function useRegions(): { value: string; label: string }[] {
  const [options, setOptions] = useState(REGIONS_OPTIONS);

  useEffect(() => {
    let annule = false;
    fetch(API_ENDPOINTS.region.list)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const regions: { name?: string }[] = Array.isArray(data) ? data : data?.items ?? [];
        const noms = regions.map((r) => (r.name || "").trim()).filter(Boolean);
        if (!annule && noms.length > 0) {
          setOptions(noms.sort((a, b) => a.localeCompare(b, "fr")).map((nom) => ({ value: nom, label: nom })));
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

export const TYPE_OSC_OPTIONS = [
  { value: "Association", label: "Association" },
  { value: "Fondation", label: "Fondation" },
  { value: "Organisation cultuelle", label: "Organisation cultuelle" },
  { value: "ONG", label: "ONG" },
];
