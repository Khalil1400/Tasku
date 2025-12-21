import { useRouter } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import {
  getProfile as getProfileFromStore,
  login as loginService,
  logout as logoutService,
  saveProfile,
  getStoredToken,
} from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async function restore() {
      try {
        const token = await getStoredToken();
        const profile = await getProfileFromStore();
        if (!mounted) return;
        setUser(token && profile ? profile : null);
      } catch (err) {
        console.log("restore auth error", err);
        setUser(null);
      } finally {
        if (mounted) setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function signIn(email, password) {
    const res = await loginService(email, password);
    await saveProfile(res.user);
    setUser(res.user);
    return true;
  }

  async function signOut() {
    await logoutService();
    setUser(null);
    try {
      router.replace("/");
    } catch (navErr) {
      console.log("router replace error on signOut:", navErr);
    }
  }

  async function updateProfile(updates) {
    const merged = { ...(user || {}), ...updates };
    setUser(merged);
    await saveProfile(merged);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, updateProfile, isAuthenticated: !!user, isReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
