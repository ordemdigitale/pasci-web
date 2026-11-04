// lib/zones-projet.ts | Zones d'exécution des offres de projet (plusieurs par offre)
import { REGIONS_OPTIONS } from "@/lib/osc-referentiels";

/** Zones d'exécution d'une offre de projet : zones générales puis les régions de Côte d'Ivoire. */
export const ZONES_GENERALES = ["Toutes les régions de Côte d'Ivoire", "National", "Sous-régional", "International"];
export const ZONES_PROJET = [...ZONES_GENERALES, ...REGIONS_OPTIONS.map((r) => r.value)];

/** Les zones sont enregistrées dans un seul champ texte, séparées par des virgules. */
export function zonesDe(zone?: string | null): string[] {
  return (zone || "").split(",").map((z) => z.trim()).filter(Boolean);
}

/** Une offre « nationale » ou « toutes régions » couvre chacune des régions du filtre. */
export function couvreLaZone(zone: string | null | undefined, cherchee: string): boolean {
  const zones = zonesDe(zone);
  if (zones.includes(cherchee)) return true;
  const estRegion = !ZONES_GENERALES.includes(cherchee);
  return estRegion && zones.some((z) => z === "Toutes les régions de Côte d'Ivoire" || z === "National");
}
