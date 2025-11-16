import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import { getProfile as getProfileFromStore, loginMock, logout as logoutService, saveProfile } from "../services/authService";

const TOKEN_KEY = "taskmate_token_v1";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async function restore() {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) {
          const profile = await getProfileFromStore();
          if (mounted) setUser(profile || { name: "User", email: "user@example.com" });
        }
      } catch (err) {
        console.log("restore auth error", err);
      } finally {
        if (mounted) setReady(true);
      }
    })();
    return () => { mounted = false; };
  }, []);

  async function signIn(email, password) {
    const res = await loginMock(email, password);
    if (!res || !res.token) throw new Error("Invalid credentials");
    await SecureStore.setItemAsync(TOKEN_KEY, res.token);
    await saveProfile({ name: res.name, email: res.email, avatar: res.avatar });
    setUser({ name: res.name, email: res.email, avatar: res.avatar });
    return true;
  }

  async function signOut() {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await logoutService();
      setUser(null);
    } catch (err) { console.log("signOut error", err); }
  }

  async function updateProfile(updates) {
    const merged = { ...(user || {}), ...updates };
    setUser(merged);
    await saveProfile(merged);
  }

  if (!isReady) return null;

  return <AuthContext.Provider value={{ user, signIn, signOut, updateProfile, isAuthenticated: !!user }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
