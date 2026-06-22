"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { IUser, ILoginRequest } from "@/types/api.types";
import { authService, getStoredUser, getToken, isTokenExpiringSoon } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  error: string | null;
  login: (credentials: ILoginRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperuser: boolean;
  isOscUser: boolean;
  isCrascAdmin: boolean;
  crascId: number | null;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = getStoredUser();
      if (storedUser) {
        setUser(storedUser);
        // Rafraîchir le token si proche de l'expiration avant d'appeler l'API
        const token = getToken();
        if (token && isTokenExpiringSoon(token)) {
          await authService.refreshAccessToken();
        }
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (err) {
          console.error("Failed to refresh user data:", err);
          // Keep using stored user if API call fails
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Auto-refresh du token toutes les 4 minutes
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(async () => {
      const token = getToken();
      if (token && isTokenExpiringSoon(token, 5 * 60)) {
        const refreshed = await authService.refreshAccessToken();
        if (!refreshed) {
          authService.logout();
          setUser(null);
          router.push("/admin/login");
        }
      }
    }, 4 * 60 * 1000); // toutes les 4 minutes
    return () => clearInterval(interval);
  }, [user, router]);

  const login = async (credentials: ILoginRequest) => {
    setLoading(true);
    setError(null);

    try {
      await authService.login(credentials);
      // Get user data after successful login
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur de connexion";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push("/admin/login");
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error("Failed to refresh user:", err);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: user !== null,
    isAdmin: user !== null && (user.is_staff || user.is_superuser || user.is_redacteur || !!user.osc_id),
    isSuperuser: user !== null && user.is_superuser,
    isOscUser: user !== null && !!user.osc_id && !user.is_staff && !user.is_superuser,
    isCrascAdmin: user !== null && !!user.is_staff && !user.is_superuser && !!user.crasc_id,
    crascId: user?.crasc_id ?? null,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
