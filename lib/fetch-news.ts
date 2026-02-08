import { INews } from "@/types/api.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Fetch all news with optional filters
export async function fetchAllNews(filters?: {
    crasc_id?: number;
    osc_id?: number;
    skip?: number;
    limit?: number;
}): Promise<INews[]> {
    try {
        const params = new URLSearchParams();

        if (filters?.crasc_id) params.append("crasc_id", filters.crasc_id.toString());
        if (filters?.osc_id) params.append("osc_id", filters.osc_id.toString());
        if (filters?.skip !== undefined) params.append("skip", filters.skip.toString());
        if (filters?.limit !== undefined) params.append("limit", filters.limit.toString());

        const url = `${API_BASE_URL}/news${params.toString() ? `?${params.toString()}` : ''}`;

        const response = await fetch(url, {
            next: { revalidate: 60 }, // Revalidate every minute
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Échec du chargement des actualités");
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur lors du chargement des actualités:", error);
        return [];
    }
}

// Fetch single news by slug
export async function getNewsBySlug(slug: string): Promise<INews | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/news/${slug}`, {
            next: { revalidate: 60 },
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error("Échec du chargement de l'actualité");
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur lors du chargement de l'actualité:", error);
        return null;
    }
}

// Update news by slug
export async function updateNews(
    slug: string,
    data: FormData
): Promise<INews> {
    const response = await fetch(`${API_BASE_URL}/news/${slug}`, {
        method: "PATCH",
        body: data
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Échec de la mise à jour de l'actualité");
    }

    return response.json();
}

// Delete news by slug
export async function deleteNews(slug: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/news/${slug}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Échec de la suppression de l'actualité");
    }
}
