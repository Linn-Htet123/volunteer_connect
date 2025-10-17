// hooks/useAuth.ts
import { getUserFromToken } from "@/lib/auth";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [user, setUser] = useState(() => getUserFromToken());

  useEffect(() => {
    const handleStorage = () => setUser(getUserFromToken());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  return { user, isAuthenticated: !!user, logout };
};
