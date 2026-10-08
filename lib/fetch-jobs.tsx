import { IJobs } from "@/types/api.types";
import { API_BASE_URL } from "@/lib/api-config";

// Fetch single Job
// Plus de données fictives de secours : une offre absente ou une API
// indisponible affiche « introuvable » plutôt qu'une fausse offre.
export async function getJobBySlug(job_slug: string): Promise<IJobs> {
  const response = await fetch(`${API_BASE_URL}/api/v1/jobs/${job_slug}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Offre d'emploi non trouvée: ${job_slug}`);
  }

  return response.json();
}
