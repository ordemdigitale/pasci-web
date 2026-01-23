"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { IUser, ILoginRequest } from "@/types/api.types";
import { authService, getStoredUser } from "@/lib/auth";
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
        // Try to refresh user data from API
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
    isAdmin: user !== null && (user.is_staff || user.is_superuser),
    isSuperuser: user !== null && user.is_superuser,
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
