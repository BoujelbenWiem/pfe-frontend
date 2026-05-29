"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import {
  login as loginService,
  logout as logoutService,
  getCurrentUser,
} from "@/services/auth.service";
import { LoginPayload, User } from "@/types/auth";

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const { user } = await loginService(payload);
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutService();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      login,
      logout,
    }),
    [user, loading, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}