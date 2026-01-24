// lib/services/formation.service.ts | Formation service for API calls
import { fetchWithAuth } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface IFormation {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    trainer: string | null;
    location: string | null;
    start_date: string | null;
    end_date: string | null;
    registration_deadline: string | null;
    max_participants: number | null;
    current_participants: number;
    is_published: boolean;
    is_full: boolean;
    is_completed: boolean;
    thumbnail_path: string;
    registration_link: string | null;
    materials_link: string | null;
    crasc_id: number | null;
    osc_id: number | null;
    created_at: string;
    updated_at: string;
    crasc?: {
        id: number;
        name: string;
        slug: string;
    } | null;
    osc?: {
        id: number;
        name: string;
        slug: string;
    } | null;
}

export interface FormationFilters {
    skip?: number;
    limit?: number;
    published_only?: boolean;
    upcoming_only?: boolean;
    search?: string;
    crasc_id?: number;
    osc_id?: number;
}

export interface CreateFormationData {
    title: string;
    description?: string;
    trainer?: string;
    location?: string;
    start_date?: string;
    end_date?: string;
    registration_deadline?: string;
    max_participants?: number;
    registration_link?: string;
    materials_link?: string;
    is_published?: boolean;
    thumbnail?: File;
    crasc_id?: number;
    osc_id?: number;
}

export interface UpdateFormationData {
    title?: string;
    description?: string;
    trainer?: string;
    location?: string;
    start_date?: string;
    end_date?: string;
    registration_deadline?: string;
    max_participants?: number;
    current_participants?: number;
    registration_link?: string;
    materials_link?: string;
    is_published?: boolean;
    is_full?: boolean;
    is_completed?: boolean;
    thumbnail?: File;
    crasc_id?: number;
    osc_id?: number;
}

/**
 * Formation Service
 * Handles all API calls for formations/trainings
 */
export const formationService = {
    /**
     * Get all formations with filters and pagination
     */
    async getAll(filters: FormationFilters = {}): Promise<IFormation[]> {
        const params = new URLSearchParams();

        if (filters.skip !== undefined) params.append("skip", filters.skip.toString());
        if (filters.limit !== undefined) params.append("limit", filters.limit.toString());
        if (filters.published_only) params.append("published_only", "true");
        if (filters.upcoming_only) params.append("upcoming_only", "true");
        if (filters.search) params.append("search", filters.search);
        if (filters.crasc_id) params.append("crasc_id", filters.crasc_id.toString());
        if (filters.osc_id) params.append("osc_id", filters.osc_id.toString());

        const url = `${API_URL}/formations?${params.toString()}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error(`Erreur lors du chargement des formations: ${response.status}`);
        }

        return response.json();
    },

    /**
     * Get upcoming formations
     */
    async getUpcoming(limit: number = 5): Promise<IFormation[]> {
        const response = await fetch(`${API_URL}/formations/upcoming?limit=${limit}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error(`Erreur lors du chargement des formations à venir: ${response.status}`);
        }

        return response.json();
    },

    /**
     * Get single formation by slug
     */
    async getBySlug(slug: string): Promise<IFormation> {
        const response = await fetch(`${API_URL}/formations/${slug}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Formation non trouvée");
            }
            throw new Error(`Erreur lors du chargement de la formation: ${response.status}`);
        }

        return response.json();
    },

    /**
     * Create new formation (requires authentication)
     */
    async create(data: CreateFormationData): Promise<IFormation> {
        const formData = new FormData();

        // Ensure title is never undefined
        formData.append("title", data.title || "");

        if (data.description !== undefined) {
            formData.append("description", data.description);
        }

        if (data.trainer !== undefined) {
            formData.append("trainer", data.trainer);
        }

        if (data.location !== undefined) {
            formData.append("location", data.location);
        }

        if (data.start_date) {
            formData.append("start_date", data.start_date);
        }

        if (data.end_date) {
            formData.append("end_date", data.end_date);
        }

        if (data.registration_deadline) {
            formData.append("registration_deadline", data.registration_deadline);
        }

        if (data.max_participants !== undefined) {
            formData.append("max_participants", data.max_participants.toString());
        }

        if (data.registration_link !== undefined) {
            formData.append("registration_link", data.registration_link);
        }

        if (data.materials_link !== undefined) {
            formData.append("materials_link", data.materials_link);
        }

        if (data.is_published !== undefined) {
            formData.append("is_published", data.is_published.toString());
        }

        if (data.thumbnail) {
            formData.append("thumbnail", data.thumbnail);
        }

        // Always send crasc_id and osc_id (even if empty) to match backend expectations
        formData.append("crasc_id", data.crasc_id !== undefined ? data.crasc_id.toString() : "");
        formData.append("osc_id", data.osc_id !== undefined ? data.osc_id.toString() : "");

        const response = await fetchWithAuth(`${API_URL}/formations`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({
                detail: "Erreur lors de la création de la formation",
            }));
            throw new Error(error.detail || "Erreur lors de la création");
        }

        return response.json();
    },

    /**
     * Update formation (requires authentication)
     */
    async update(slug: string, data: UpdateFormationData): Promise<IFormation> {
        const formData = new FormData();

        if (data.title !== undefined) {
            formData.append("title", data.title);
        }

        if (data.description !== undefined) {
            formData.append("description", data.description);
        }

        if (data.trainer !== undefined) {
            formData.append("trainer", data.trainer);
        }

        if (data.location !== undefined) {
            formData.append("location", data.location);
        }

        if (data.start_date !== undefined) {
            formData.append("start_date", data.start_date);
        }

        if (data.end_date !== undefined) {
            formData.append("end_date", data.end_date);
        }

        if (data.registration_deadline !== undefined) {
            formData.append("registration_deadline", data.registration_deadline);
        }

        if (data.max_participants !== undefined) {
            formData.append("max_participants", data.max_participants.toString());
        }

        if (data.current_participants !== undefined) {
            formData.append("current_participants", data.current_participants.toString());
        }

        if (data.registration_link !== undefined) {
            formData.append("registration_link", data.registration_link);
        }

        if (data.materials_link !== undefined) {
            formData.append("materials_link", data.materials_link);
        }

        if (data.is_published !== undefined) {
            formData.append("is_published", data.is_published.toString());
        }

        if (data.is_full !== undefined) {
            formData.append("is_full", data.is_full.toString());
        }

        if (data.is_completed !== undefined) {
            formData.append("is_completed", data.is_completed.toString());
        }

        if (data.thumbnail) {
            formData.append("thumbnail", data.thumbnail);
        }

        // Always send crasc_id and osc_id (even if empty) to match backend expectations
        formData.append("crasc_id", data.crasc_id !== undefined ? data.crasc_id.toString() : "");
        formData.append("osc_id", data.osc_id !== undefined ? data.osc_id.toString() : "");

        const response = await fetchWithAuth(`${API_URL}/formations/${slug}`, {
            method: "PATCH",
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({
                detail: "Erreur lors de la mise à jour de la formation",
            }));
            throw new Error(error.detail || "Erreur lors de la mise à jour");
        }

        return response.json();
    },

    /**
     * Delete formation (requires authentication)
     */
    async delete(slug: string): Promise<void> {
        const response = await fetchWithAuth(`${API_URL}/formations/${slug}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({
                detail: "Erreur lors de la suppression de la formation",
            }));
            throw new Error(error.detail || "Erreur lors de la suppression");
        }
    },

    /**
     * Register to a formation
     */
    async register(slug: string): Promise<{ message: string; formation: string; current_participants: number; is_full: boolean }> {
        const response = await fetchWithAuth(`${API_URL}/formations/${slug}/register`, {
            method: "POST",
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({
                detail: "Erreur lors de l'inscription",
            }));
            throw new Error(error.detail || "Erreur lors de l'inscription");
        }

        return response.json();
    },

    /**
     * Search formations
     */
    async search(query: string, limit: number = 20): Promise<IFormation[]> {
        return this.getAll({ search: query, limit });
    },

    /**
     * Get formations by CRASC
     */
    async getByCrasc(crascId: number, limit: number = 20): Promise<IFormation[]> {
        return this.getAll({ crasc_id: crascId, limit });
    },

    /**
     * Get formations by OSC
     */
    async getByOsc(oscId: number, limit: number = 20): Promise<IFormation[]> {
        return this.getAll({ osc_id: oscId, limit });
    },
};

export default formationService;
