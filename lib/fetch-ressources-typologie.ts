// lib/fetch-ressources-typologie.ts | Types et catégories de ressources (gérés dans l'admin)
"use client";

import { useCallback, useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export const TYPOLOGIE_URL = `${API_BASE_URL}/api/v1/ressources-typologie`;

export interface IRessourceType {
  id: number;
  /** Valeur stockée dans le champ `type` des ressources (ne change pas). */
  slug: string;
  nom: string;
  description?: string | null;
  ordre: number;
  actif: boolean;
  nb_documents: number;
}

export interface IRessourceCategorie {
  id: number;
  /** Valeur stockée dans le champ `category` des ressources. */
  nom: string;
  /** Type de rattachement ; null = proposée pour tous les types. */
  type_slug: string | null;
  ordre: number;
  actif: boolean;
  nb_documents: number;
}

export async function fetchTypesRessources(tous = false): Promise<IRessourceType[]> {
  const res = await fetch(`${TYPOLOGIE_URL}/types${tous ? "?tous=true" : ""}`, { cache: "no-store" });
  return res.ok ? res.json() : [];
}

export async function fetchCategoriesRessources(tous = false): Promise<IRessourceCategorie[]> {
  const res = await fetch(`${TYPOLOGIE_URL}/categories${tous ? "?tous=true" : ""}`, { cache: "no-store" });
  return res.ok ? res.json() : [];
}

/** Libellés de secours si l'API n'est pas joignable (types historiques). */
const LIBELLES_PAR_DEFAUT: Record<string, string> = {
  documentation: "Documentation",
  fiche: "Fiches et modules PdoC",
};

/**
 * Typologie chargée depuis l'API : listes pour les formulaires et filtres,
 * libellé d'un type et catégories proposées pour un type donné.
 */
export function useTypologieRessources(tous = false) {
  const [types, setTypes] = useState<IRessourceType[]>([]);
  const [categories, setCategories] = useState<IRessourceCategorie[]>([]);
  const [chargement, setChargement] = useState(true);

  const charger = useCallback(
    () => Promise.all([fetchTypesRessources(tous), fetchCategoriesRessources(tous)]),
    [tous],
  );

  const recharger = useCallback(async () => {
    const [t, c] = await charger();
    setTypes(t);
    setCategories(c);
    setChargement(false);
  }, [charger]);

  useEffect(() => {
    let actif = true;
    charger().then(([t, c]) => {
      if (!actif) return;
      setTypes(t);
      setCategories(c);
      setChargement(false);
    });
    return () => {
      actif = false;
    };
  }, [charger]);

  const libelleType = useCallback(
    (slug: string | null | undefined) =>
      (slug && (types.find((t) => t.slug === slug)?.nom || LIBELLES_PAR_DEFAUT[slug] || slug)) || "",
    [types],
  );

  const categoriesPour = useCallback(
    (typeSlug: string | null | undefined) => [
      // Catégories propres au type d'abord, puis celles communes à tous les types
      ...categories.filter((c) => !!typeSlug && c.type_slug === typeSlug),
      ...categories.filter((c) => c.type_slug === null),
    ],
    [categories],
  );

  return { types, categories, chargement, recharger, libelleType, categoriesPour };
}
