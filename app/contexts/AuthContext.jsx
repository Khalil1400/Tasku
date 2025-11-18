// app/contexts/AuthContext.jsx
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import { getProfile as getProfileFromStore, loginMock, logout as logoutService, saveProfile } from "../services/authService";

const TOKEN_KEY = "taskmate_token_v1";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async function restore() {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        const profile = await getProfileFromStore();
        if (!mounted) return;
        if (token && profile) {
          setUser(profile);
        } else {
          setUser(null);
        }
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
    try {
      const res = await loginMock(email, password);

      await SecureStore.setItemAsync(TOKEN_KEY, res.token);
      await saveProfile({ name: res.name, email: res.email, avatar: res.avatar });
      setUser({ name: res.name, email: res.email, avatar: res.avatar });
      return true;
    } catch (err) {
      console.log("signIn error", err);
      throw err;
    }
  }

  async function signOut() {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await logoutService();
      setUser(null);
      try {
        router.replace("/");
      } catch (navErr) {
        console.log("router replace error on signOut:", navErr);
      }
    } catch (err) {
      console.log("signOut error", err);
    }
  }

  async function updateProfile(updates) {
    const merged = { ...(user || {}), ...updates };
    setUser(merged);
    await saveProfile(merged);
  }

  if (!isReady) return null;

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, updateProfile, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
