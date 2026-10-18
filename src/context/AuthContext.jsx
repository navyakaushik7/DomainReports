import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "domainreg_session";

function readSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);

  const login = async ({ username, password }) => {
    if (!username.trim() || !password.trim()) return { ok: false, errorKey: "enterCredentials" };
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "/api";
      const response = await fetch(`${base}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: username.trim(), password }),
      });
      const payload = await response.json().catch(() => ({}));
      if (response.status === 422) {
        return { ok: false, errorKey: "invalidCredentials" };
       }
      if (!response.ok) {
      return { ok: false, errorKey: "signInFailed" };
      }
      const session = {
        username: payload.user.email,
        name: payload.user.name,
        role: payload.user.role,
        token: payload.access_token,
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      setUser(session);
      return { ok: true };
    } catch {
      return { ok: false, errorKey: "serviceUnavailable" };
    }
  };

  const logout = async () => {
    const session = readSession();
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "/api";
      await fetch(`${base}/logout`, {
        method: "POST",
        headers: { Accept: "application/json", Authorization: `Bearer ${session?.token || ""}` },
      });
    } catch {
      // The local session is still cleared when the API is unavailable.
    } finally {
      sessionStorage.removeItem(STORAGE_KEY);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
