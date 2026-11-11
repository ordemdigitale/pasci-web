"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function VisiteCounter() {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/visites/stats`)
      .then((r) => r.ok ? r.json() : null)
      // Compteur public : nombre de visites de pages, mesuré de la même façon
      // depuis l'ouverture du site. « total » est passé aux connexions, une
      // mesure qui n'existe que depuis le 5 novembre 2026 : l'afficher ici
      // faisait chuter le compteur public d'un facteur dix.
      .then((d) => { const n = d?.pages_vues ?? d?.total; if (n != null) setTotal(n); })
      .catch(() => {});
  }, []);

  if (total === null) return null;

  return (
    <span>{total.toLocaleString("fr-FR")}</span>
  );
}
