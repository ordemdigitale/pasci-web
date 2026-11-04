// lib/recherche.ts | Recherche tolérante : sans tenir compte de la casse, des accents ni de la ponctuation
import { normaliser } from "@/lib/pole-membres";

/**
 * Vrai si chaque mot recherché apparaît dans l'un des textes :
 * « agneby » trouve « Agnéby-Tiassa », « femmes yopougon » trouve
 * « Association des Femmes de Yopougon ». Recherche vide : tout correspond.
 */
export function correspondRecherche(recherche: string, ...textes: (string | null | undefined)[]): boolean {
  const mots = normaliser(recherche).split(" ").filter(Boolean);
  if (mots.length === 0) return true;
  const contenu = textes.map(normaliser).join(" ");
  return mots.every((mot) => contenu.includes(mot));
}
