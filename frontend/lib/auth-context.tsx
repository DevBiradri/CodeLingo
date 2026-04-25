"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  UserPublic,
  getCurrentUser,
  logoutUser,
  refreshToken,
} from "./api";

// ─── Context Types ────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: UserPublic | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: UserPublic | null) => void;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserPublic | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    try {
      // Try to get the current user; if the access token is valid this works
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      // Access token expired or missing — try refresh
      try {
        const refreshed = await refreshToken();
        setUser(refreshed.user);
      } catch {
        // Both tokens invalid — user is logged out
        setUser(null);
      }
    }
  }, []);

  // On mount, silently hydrate auth state from cookies
  useEffect(() => {
    refreshAuth().finally(() => setIsLoading(false));
  }, [refreshAuth]);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.warn("Logout API failed, continuing with local logout", e);
    } finally {
      setUser(null);
    }
  }, []);

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    setUser,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
