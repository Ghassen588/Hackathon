import { useState, useCallback, useEffect } from "react";

type User = any;

export const useSession = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string>("");
  const [appLoading, setAppLoading] = useState<boolean>(true);

  const checkSession = useCallback(async () => {
    setAppLoading(true);
    try {
      const res = await fetch("/api/session", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data);
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      console.error("Session check failed", e);
      setCurrentUser(null);
    } finally {
      setAppLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      setCurrentUser(null);
    }
  }, []);

  const login = useCallback(async (cin: string, password: string) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cin, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data);
        setAuthError("");
        return data;
      } else {
        setAuthError(data.error || "Login failed");
        return null;
      }
    } catch (e) {
      console.error("Login failed", e);
      setAuthError("Network error");
      return null;
    }
  }, []);

  const signup = useCallback(async (username: string, cin: string, password: string) => {
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, cin, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data);
        setAuthError("");
        return data;
      } else {
        setAuthError(data.error || "Signup failed");
        return null;
      }
    } catch (e) {
      console.error("Signup failed", e);
      setAuthError("Network error");
      return null;
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return {
    currentUser,
    setCurrentUser,
    authError,
    setAuthError,
    appLoading,
    checkSession,
    logout,
    login,
    signup,
  };
};

export default useSession;
