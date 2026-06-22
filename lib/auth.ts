// lib/auth.ts | Authentication service
import { ILoginRequest, ILoginResponse, IUser, IRegisterRequest } from "@/types/api.types";

// Use the same env variable as other files for consistency
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_URL = `${API_BASE_URL}/api/v1`;

// Token management
export const TOKEN_KEY = "pasci_access_token";
export const REFRESH_TOKEN_KEY = "pasci_refresh_token";
export const USER_KEY = "pasci_user";

// Durée de vie de l'access token en secondes (doit correspondre à ACCESS_TOKEN_EXPIRE_MINUTES côté API)
const ACCESS_TOKEN_MAX_AGE = 8 * 60 * 60; // 8 heures

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const setToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
    // Cookie avec Max-Age pour survivre à la fermeture de l'onglet/inactivité
    document.cookie = `auth_token=${token}; path=/; SameSite=Lax; Max-Age=${ACCESS_TOKEN_MAX_AGE}`;
  }
};

export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    // Supprimer aussi le cookie
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
};

export const getRefreshToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  return null;
};

export const setRefreshToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
};

/** Décode le payload JWT sans vérifier la signature (côté client, lecture seule) */
export const getTokenExpiry = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
};

/** Retourne true si le token expire dans moins de `marginSeconds` secondes */
export const isTokenExpiringSoon = (token: string, marginSeconds = 300): boolean => {
  const exp = getTokenExpiry(token);
  if (!exp) return true;
  return Date.now() / 1000 > exp - marginSeconds;
};

export const getStoredUser = (): IUser | null => {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
  }
  return null;
};

export const setStoredUser = (user: IUser): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const removeStoredUser = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_KEY);
  }
};

// Authentication API calls
export const authService = {
  /**
   * Login user
   */
  async login(credentials: ILoginRequest): Promise<ILoginResponse> {
    const formData = new URLSearchParams();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        detail: "Identifiants incorrects",
      }));
      throw new Error(error.detail || "Erreur lors de la connexion");
    }

    const data: ILoginResponse = await response.json();
    setToken(data.access_token);
    if (data.refresh_token) setRefreshToken(data.refresh_token);
    return data;
  },

  /**
   * Register new user
   */
  async register(userData: IRegisterRequest): Promise<IUser> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        detail: "Erreur lors de l'inscription",
      }));
      throw new Error(error.detail || "Erreur lors de l'inscription");
    }

    return await response.json();
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<IUser> {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        removeToken();
        removeStoredUser();
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      }
      throw new Error("Erreur lors de la récupération du profil");
    }

    const user: IUser = await response.json();
    setStoredUser(user);
    return user;
  },

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<boolean> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      if (!response.ok) return false;
      const data = await response.json();
      if (data.access_token) {
        setToken(data.access_token);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  /**
   * Logout user
   */
  logout(): void {
    removeToken();
    removeStoredUser();
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return getToken() !== null;
  },

  /**
   * Check if user is admin (staff or superuser)
   */
  isAdmin(): boolean {
    const user = getStoredUser();
    return user !== null && (user.is_staff || user.is_superuser);
  },

  /**
   * Check if user is superuser
   */
  isSuperuser(): boolean {
    const user = getStoredUser();
    return user !== null && user.is_superuser;
  },
};

/**
 * Fetch with authentication
 * Helper function to make authenticated API calls
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken();

  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Don't set Content-Type for FormData - browser will set it automatically with boundary
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized
  if (response.status === 401) {
    authService.logout();
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
  }

  return response;
}
