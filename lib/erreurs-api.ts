// lib/erreurs-api.ts | Message lisible à partir du « detail » d'une erreur FastAPI

const CHAMPS: Record<string, string> = {
  nom: "Nom", osc: "OSC porteuse", domaine: "Domaine", zone: "Zone", durée: "Durée", budget: "Budget",
};

/**
 * FastAPI renvoie soit un texte, soit une liste d'erreurs de validation
 * ({ loc, msg }) : passée telle quelle à `new Error`, la liste s'affichait
 * « [object Object],[object Object] ».
 */
export function messageErreurApi(detail: unknown): string | null {
  if (!detail) return null;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((e) => {
        const champ = Array.isArray(e?.loc) ? String(e.loc[e.loc.length - 1]) : "";
        const nom = CHAMPS[champ] ?? champ;
        return e?.type === "missing" ? `${nom} : champ obligatoire` : `${nom ? nom + " : " : ""}${e?.msg ?? "valeur invalide"}`;
      })
      .join(" · ");
  }
  return JSON.stringify(detail);
}
