// lib/ptf-classification.ts | Types de PTF (/ptf/types) et task forces thématiques (/task-forces)
"use client";

import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface TypePtf {
  nom: string;
  description?: string | null;
  nb_ptf: number;
}

export interface MembreTaskForce {
  id: number;
  name: string;
  slug?: string | null;
  categorie?: string | null;
  thumbnail_url?: string | null;
  chef_de_file: boolean;
}

export interface TaskForce {
  id: number;
  nom: string;
  slug: string;
  thematique: string;
  description?: string | null;
  ordre: number;
  actif: boolean;
  membres: MembreTaskForce[];
}

/** Liste de repli identique à l'API (pasci-api/app/api/v1/endpoints/ptf.py, TYPES_PTF). */
export const TYPES_PTF_DEFAUT: TypePtf[] = [
  "Institutions multilatérales",
  "Agences spécialisées",
  "Bailleurs bilatéraux",
  "Institutions financières",
  "ONG internationales",
  "Fondations",
  "Secteur privé",
  "Autres",
].map((nom) => ({ nom, nb_ptf: 0 }));

export function useTypesPtf(): TypePtf[] {
  const [types, setTypes] = useState<TypePtf[]>(TYPES_PTF_DEFAUT);
  useEffect(() => {
    let actif = true;
    fetch(`${API_BASE_URL}/api/v1/ptf/types`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (actif && Array.isArray(data) && data.length) setTypes(data);
      })
      .catch(() => {});
    return () => {
      actif = false;
    };
  }, []);
  return types;
}

export async function fetchTaskForces(params = ""): Promise<TaskForce[]> {
  const res = await fetch(`${API_BASE_URL}/api/v1/task-forces${params}`, { cache: "no-store" });
  return res.ok ? res.json() : [];
}
