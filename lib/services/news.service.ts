// lib/services/news.service.ts | News service for API calls
import { fetchWithAuth, getToken } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_URL = `${API_BASE_URL}/api/v1`;

export interface INews {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnail_path: string;
  thumbnail_url: string;
  osc_id?: number | null;
  crasc_id?: number | null;
  /** AAAA-MM-JJ : après cette date, l'actualité passe dans les archives de l'OSC */
  date_expiration?: string | null;
  est_archivee?: boolean;
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
  /** actives (défaut de l'API) | archives | toutes (admin) */
  statut?: "actives" | "archives" | "toutes";
}

/** Liste paginée du back-office (toutes les actualités, avec leur état de validation). */
export interface NewsAdminListe {
  items: (INews & { statut_publication: "publie" | "en_attente" | "rejete" })[];
  total: number;
  page: number;
  size: number;
  pages: number;
  /** Sur toutes les actualités visibles par le compte, pas seulement la page */
  compteurs: { total: number; crasc: number; osc: number; ce_mois: number; en_attente: number };
}

export interface CreateNewsData {
  title: string;
  content: string;
  thumbnail?: File;
  crasc_id?: number;
  osc_id?: number;
  /** AAAA-MM-JJ, vide = jamais désactivée */
  date_expiration?: string;
}

export interface UpdateNewsData {
  title?: string;
  content?: string;
  thumbnail?: File;
  crasc_id?: number;
  osc_id?: number;
  /** AAAA-MM-JJ, vide = n'expire plus */
  date_expiration?: string;
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
    if (filters.statut) params.append("statut", filters.statut);

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
    const token = getToken();
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(`${API_URL}/news/${slug}`, {
      method: "GET",
      headers,
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
    if (data.date_expiration !== undefined) formData.append("date_expiration", data.date_expiration);

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
    if (data.date_expiration !== undefined) formData.append("date_expiration", data.date_expiration);

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
  async listeAdmin(filtres: { page: number; size: number; search?: string; statut_publication?: string }): Promise<NewsAdminListe> {
    const params = new URLSearchParams({ page: String(filtres.page), size: String(filtres.size) });
    if (filtres.search?.trim()) params.set("search", filtres.search.trim());
    if (filtres.statut_publication) params.set("statut_publication", filtres.statut_publication);
    const response = await fetchWithAuth(`${API_URL}/news/admin/liste?${params.toString()}`);
    if (!response.ok) throw new Error("Impossible de charger les actualités");
    return response.json();
  },

  /** Nombre d'actualités en ligne (sans la limite de 20 de la liste). */
  async compte(filtres: { crasc_id?: number; osc_id?: number } = {}): Promise<number> {
    const params = new URLSearchParams();
    if (filtres.crasc_id) params.set("crasc_id", String(filtres.crasc_id));
    if (filtres.osc_id) params.set("osc_id", String(filtres.osc_id));
    const response = await fetch(`${API_URL}/news/compte?${params.toString()}`);
    if (!response.ok) throw new Error("Impossible de compter les actualités");
    return (await response.json()).total;
  },

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
