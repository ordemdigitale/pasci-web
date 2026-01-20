import { IJobs, IProjet } from "@/types/api.types";

// Fetch single Job
export async function getJobBySlug(job_slug: string): Promise<IJobs> {
  const response = await fetch (`http://localhost:8000/api/v1/jobs/${job_slug}`, {
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