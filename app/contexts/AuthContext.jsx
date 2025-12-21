// app/contexts/AuthContext.jsx
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import { clearAuthToken, setAuthToken, setUnauthorizedHandler } from "../services/apiClient";
import {
  clearStoredUser,
  getStoredUser,
  login as loginApi,
  register as registerApi,
  saveUser,
} from "../services/authService";

const TOKEN_KEY = "taskmate_token_v1";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    setUnauthorizedHandler(async () => {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await clearStoredUser();
      clearAuthToken();
      setUser(null);
      setToken(null);
      try {
        router.replace("/login");
      } catch (navErr) {
        console.log("navigation error on unauthorized", navErr);
      }
    });
  }, [router]);

  useEffect(() => {
    let mounted = true;
    (async function restore() {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        const storedUser = await getStoredUser();
        if (!mounted) return;
        if (storedToken && storedUser) {
          setAuthToken(storedToken);
          setToken(storedToken);
          setUser(storedUser);
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

  async function setSession(nextToken, profile) {
    setAuthToken(nextToken);
    setToken(nextToken);
    setUser(profile);
    await SecureStore.setItemAsync(TOKEN_KEY, nextToken);
    await saveUser(profile);
  }

  function buildProfile(userPayload) {
    return {
      id: userPayload.id,
      email: userPayload.email,
      name: userPayload.email?.split("@")[0] || "User",
      avatar: userPayload.avatar || null,
    };
  }

  async function signIn(email, password) {
    try {
      const res = await loginApi(email, password);
      const profile = buildProfile(res.user);
      await setSession(res.token, profile);
      return profile;
    } catch (err) {
      const status = err?.status;
      const msg =
        status === 401 || status === 400
          ? "Invalid email or password."
          : err?.message || "Login failed. Please try again.";
      throw new Error(msg);
    }
  }

  async function signUp(email, password) {
    try {
      const res = await registerApi(email, password);
      const profile = buildProfile(res.user);
      await setSession(res.token, profile);
      return profile;
    } catch (err) {
      const msg =
        err?.status === 400
          ? err?.message || "Could not create account. Try a different email."
          : err?.message || "Sign up failed. Please try again.";
      throw new Error(msg);
    }
  }

  async function signOut() {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await clearStoredUser();
      clearAuthToken();
      setUser(null);
      setToken(null);
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
    await saveUser(merged);
  }

  if (!isReady) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        signIn,
        signUp,
        signOut,
        updateProfile,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
