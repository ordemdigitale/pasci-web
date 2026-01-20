import { IPTF, IProjet } from "@/types/api.types";

// Fetch single PTF
export async function getPtfBySlug(ptf_slug: string): Promise<IPTF> {
  const response = await fetch (`http://localhost:8000/api/v1/ptf/${ptf_slug}`, {
  method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });
  if (!response.ok) {
    throw new Error("Problème de chargement des données.");
  }
  return response.json();
}