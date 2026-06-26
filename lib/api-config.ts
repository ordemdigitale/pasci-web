/**
 * API Configuration
 * Centralized configuration for API base URL
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: `${API_BASE_URL}/api/v1/auth/login`,
    register: `${API_BASE_URL}/api/v1/auth/register`,
    me: `${API_BASE_URL}/api/v1/auth/me`,
  },

  // CRASC
  crasc: {
    list: `${API_BASE_URL}/api/v1/crasc/crasc`,
    bySlug: (slug: string) => `${API_BASE_URL}/api/v1/crasc/crasc/${slug}`,
    create: `${API_BASE_URL}/api/v1/crasc/crasc`,
    update: (slug: string) => `${API_BASE_URL}/api/v1/crasc/crasc/${slug}`,
    delete: (slug: string) => `${API_BASE_URL}/api/v1/crasc/crasc/${slug}`,
    newsSpotlight: `${API_BASE_URL}/api/v1/crasc/news-spotlight-crasc`,
  },

  // Regions
  region: {
    list: `${API_BASE_URL}/api/v1/crasc/region`,
    bySlug: (slug: string) => `${API_BASE_URL}/api/v1/crasc/region/${slug}`,
    create: `${API_BASE_URL}/api/v1/crasc/region`,
    update: (slug: string) => `${API_BASE_URL}/api/v1/crasc/region/${slug}`,
    delete: (slug: string) => `${API_BASE_URL}/api/v1/crasc/region/${slug}`,
  },

  // OSC
  osc: {
    list: `${API_BASE_URL}/api/v1/crasc/osc`,
    bySlug: (slug: string) => `${API_BASE_URL}/api/v1/crasc/osc/${slug}`,
    create: `${API_BASE_URL}/api/v1/crasc/osc`,
    update: (slug: string) => `${API_BASE_URL}/api/v1/crasc/osc/${slug}`,
    delete: (slug: string) => `${API_BASE_URL}/api/v1/crasc/osc/${slug}`,
  },

  // OSC Types
  oscType: {
    list: `${API_BASE_URL}/api/v1/crasc/osc-type`,
    bySlug: (slug: string) => `${API_BASE_URL}/api/v1/crasc/osc-type/${slug}`,
    create: `${API_BASE_URL}/api/v1/crasc/osc-type`,
    update: (slug: string) => `${API_BASE_URL}/api/v1/crasc/osc-type/${slug}`,
    delete: (slug: string) => `${API_BASE_URL}/api/v1/crasc/osc-type/${slug}`,
  },

  // Jobs
  jobs: {
    list: `${API_BASE_URL}/api/v1/jobs`,
    bySlug: (slug: string) => `${API_BASE_URL}/api/v1/jobs/${slug}`,
    create: `${API_BASE_URL}/api/v1/jobs`,
    update: (slug: string) => `${API_BASE_URL}/api/v1/jobs/${slug}`,
    delete: (slug: string) => `${API_BASE_URL}/api/v1/jobs/${slug}`,
  },

  // PTF
  ptf: {
    list: `${API_BASE_URL}/api/v1/ptf`,
    bySlug: (slug: string) => `${API_BASE_URL}/api/v1/ptf/${slug}`,
    create: `${API_BASE_URL}/api/v1/ptf`,
    update: (slug: string) => `${API_BASE_URL}/api/v1/ptf/${slug}`,
    delete: (slug: string) => `${API_BASE_URL}/api/v1/ptf/${slug}`,
  },

  // Projets
  projets: {
    list: `${API_BASE_URL}/api/v1/offre-projets`,
    bySlug: (slug: string) => `${API_BASE_URL}/api/v1/offre-projets/${slug}`,
    create: `${API_BASE_URL}/api/v1/offre-projets`,
    update: (slug: string) => `${API_BASE_URL}/api/v1/offre-projets/${slug}`,
    delete: (slug: string) => `${API_BASE_URL}/api/v1/offre-projets/${slug}`,
  },

  // Formations
  formations: {
    list: `${API_BASE_URL}/api/v1/formations`,
    bySlug: (slug: string) => `${API_BASE_URL}/api/v1/formations/${slug}`,
    create: `${API_BASE_URL}/api/v1/formations`,
    update: (slug: string) => `${API_BASE_URL}/api/v1/formations/${slug}`,
    delete: (slug: string) => `${API_BASE_URL}/api/v1/formations/${slug}`,
  },

  // Documentation/Resources
  documentation: {
    list: `${API_BASE_URL}/api/v1/documentation`,
    bySlug: (slug: string) => `${API_BASE_URL}/api/v1/documentation/${slug}`,
    create: `${API_BASE_URL}/api/v1/documentation`,
    update: (slug: string) => `${API_BASE_URL}/api/v1/documentation/${slug}`,
    delete: (slug: string) => `${API_BASE_URL}/api/v1/documentation/${slug}`,
  },

  // News
  news: {
    list: `${API_BASE_URL}/api/v1/news`,
    spotlight: `${API_BASE_URL}/api/v1/news/spotlight`,
    bySlug: (slug: string) => `${API_BASE_URL}/api/v1/news/${slug}`,
    create: `${API_BASE_URL}/api/v1/news`,
    update: (slug: string) => `${API_BASE_URL}/api/v1/news/${slug}`,
    delete: (slug: string) => `${API_BASE_URL}/api/v1/news/${slug}`,
  },

  // Key Stats
  keyStats: {
    list: `${API_BASE_URL}/api/v1/key-stats`,
  },

  // Forum / Pôles de concertation
  forum: {
    poles: `${API_BASE_URL}/api/v1/forum/poles`,
    poleBySlug: (slug: string) => `${API_BASE_URL}/api/v1/forum/poles/${slug}`,
    sujets: (poleSlug: string) => `${API_BASE_URL}/api/v1/forum/poles/${poleSlug}/sujets`,
    sondages: (poleSlug: string) => `${API_BASE_URL}/api/v1/forum/poles/${poleSlug}/sondages`,
    sondage: (sondageId: number) => `${API_BASE_URL}/api/v1/forum/sondages/${sondageId}`,
    voteSondage: (sondageId: number) => `${API_BASE_URL}/api/v1/forum/sondages/${sondageId}/vote`,
    sujetDetail: (poleSlug: string, sujetSlug: string) =>
      `${API_BASE_URL}/api/v1/forum/poles/${poleSlug}/sujets/${sujetSlug}`,
    createSujet: (poleSlug: string) => `${API_BASE_URL}/api/v1/forum/poles/${poleSlug}/sujets`,
    createCommentaire: (poleSlug: string, sujetSlug: string) =>
      `${API_BASE_URL}/api/v1/forum/poles/${poleSlug}/sujets/${sujetSlug}/commentaires`,
    deleteCommentaire: (id: number) => `${API_BASE_URL}/api/v1/forum/commentaires/${id}`,
  },
};
