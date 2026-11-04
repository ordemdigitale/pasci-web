"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Une connexion = une visite du site : nouvel identifiant après 30 min sans
// activité. Anonyme, il permet de compter les connexions et non les IP
// (plusieurs personnes derrière la même IP comptent séparément).
const CLE_CONNEXION = "pdoc_connexion";
const INACTIVITE_MS = 30 * 60 * 1000;

function identifiantConnexion(): string | null {
  try {
    const maintenant = Date.now();
    const enCours = JSON.parse(localStorage.getItem(CLE_CONNEXION) || "null");
    const id = enCours?.id && maintenant - enCours.vu < INACTIVITE_MS ? enCours.id : crypto.randomUUID();
    localStorage.setItem(CLE_CONNEXION, JSON.stringify({ id, vu: maintenant }));
    return id;
  } catch {
    return null; // stockage indisponible : l'API compte alors par IP et par jour
  }
}

export default function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Ne pas compter les pages admin
    if (pathname.startsWith("/admin")) return;

    fetch(`${API_BASE}/api/v1/visites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, connexion: identifiantConnexion() }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
