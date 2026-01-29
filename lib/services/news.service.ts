// lib/services/news.service.ts | News service for API calls
import { fetchWithAuth } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface INews {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnail_path: string;
  thumbnail_url: string;
  osc_id?: number | null;
  crasc_id?: number | null;
  created_at: string;
  updated_at: string;
  tags?: string[];
  osc?: {
    id: number;
    name: string;
    slug: string;
  } | null;
  crasc?: {
    id: number;
    name: string;
    slug: string;
    osc_count?: number;
  } | null;
}

export interface NewsFilters {
  skip?: number;
  limit?: number;
  crasc_id?: number;
  osc_id?: number;
  search?: string;
  sort_by?: "created_at" | "title";
  sort_order?: "asc" | "desc";
}

export interface CreateNewsData {
  title: string;
  content: string;
  thumbnail?: File;
  crasc_id?: number;
  osc_id?: number;
}

export interface UpdateNewsData {
  title?: string;
  content?: string;
  thumbnail?: File;
  crasc_id?: number;
  osc_id?: number;
}

/**
 * News Service
 * Handles all API calls for news/articles
 */
export const newsService = {
  /**
   * Get all news with filters and pagination
   */
  async getAll(filters: NewsFilters = {}): Promise<INews[]> {
    const params = new URLSearchParams();

    if (filters.skip !== undefined) params.append("skip", filters.skip.toString());
    if (filters.limit !== undefined) params.append("limit", filters.limit.toString());
    if (filters.crasc_id) params.append("crasc_id", filters.crasc_id.toString());
    if (filters.osc_id) params.append("osc_id", filters.osc_id.toString());
    if (filters.search) params.append("search", filters.search);
    if (filters.sort_by) params.append("sort_by", filters.sort_by);
    if (filters.sort_order) params.append("sort_order", filters.sort_order);

    const url = `${API_URL}/news?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Erreur lors du chargement des actualités: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Get recent news
   */
  async getRecent(limit: number = 5): Promise<INews[]> {
    const response = await fetch(`${API_URL}/news/recent?limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Erreur lors du chargement des actualités récentes: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Get spotlight news (one per CRASC)
   */
  async getSpotlight(): Promise<INews[]> {
    const response = await fetch(`${API_URL}/news/spotlight`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Erreur lors du chargement des actualités spotlight: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Get single news by slug
   */
  async getBySlug(slug: string): Promise<INews> {
    const response = await fetch(`${API_URL}/news/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Actualité non trouvée");
      }
      throw new Error(`Erreur lors du chargement de l'actualité: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Create new news article (requires authentication)
   */
  async create(data: CreateNewsData): Promise<INews> {
    const formData = new FormData();

    // Ensure title and content are never undefined
    formData.append("title", data.title || "");
    formData.append("content", data.content || "");

    if (data.thumbnail) {
      formData.append("thumbnail", data.thumbnail);
    }

    // Always send crasc_id and osc_id (even if empty) to match backend expectations
    formData.append("crasc_id", data.crasc_id !== undefined ? data.crasc_id.toString() : "");
    formData.append("osc_id", data.osc_id !== undefined ? data.osc_id.toString() : "");

    const response = await fetchWithAuth(`${API_URL}/news`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        detail: "Erreur lors de la création de l'actualité",
      }));
      throw new Error(error.detail || "Erreur lors de la création");
    }

    return response.json();
  },

  /**
   * Update news article (requires authentication)
   */
  async update(slug: string, data: UpdateNewsData): Promise<INews> {
    const formData = new FormData();

    if (data.title !== undefined) {
      formData.append("title", data.title);
    }

    if (data.content !== undefined) {
      formData.append("content", data.content);
    }

    if (data.thumbnail) {
      formData.append("thumbnail", data.thumbnail);
    }

    // Always send crasc_id and osc_id (even if empty) to match backend expectations
    formData.append("crasc_id", data.crasc_id !== undefined ? data.crasc_id.toString() : "");
    formData.append("osc_id", data.osc_id !== undefined ? data.osc_id.toString() : "");

    const response = await fetchWithAuth(`${API_URL}/news/${slug}`, {
      method: "PATCH",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        detail: "Erreur lors de la mise à jour de l'actualité",
      }));
      throw new Error(error.detail || "Erreur lors de la mise à jour");
    }

    return response.json();
  },

  /**
   * Delete news article (requires authentication)
   */
  async delete(slug: string): Promise<void> {
    const response = await fetchWithAuth(`${API_URL}/news/${slug}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        detail: "Erreur lors de la suppression de l'actualité",
      }));
      throw new Error(error.detail || "Erreur lors de la suppression");
    }
  },

  /**
   * Search news articles
   */
  async search(query: string, limit: number = 20): Promise<INews[]> {
    return this.getAll({ search: query, limit });
  },

  /**
   * Get news by CRASC
   */
  async getByCrasc(crascId: number, limit: number = 20): Promise<INews[]> {
    return this.getAll({ crasc_id: crascId, limit });
  },

  /**
   * Get news by OSC
   */
  async getByOsc(oscId: number, limit: number = 20): Promise<INews[]> {
    return this.getAll({ osc_id: oscId, limit });
  },
};

export default newsService;
