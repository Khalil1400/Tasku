import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { getProfile as getProfileFromStore, loginMock, logout as logoutService } from "../services/authService";

const TOKEN_KEY = "findit_token_v1";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function restore() {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token && mounted) {
          const profile = await getProfileFromStore();
          if (profile) setUser(profile);
        }
      } catch (err) {
        console.log("Auth restore error:", err);
      } finally {
        if (mounted) setIsReady(true);
      }
    }
    restore();
    return () => { mounted = false; };
  }, []);

  const signIn = async ({ email, password }) => {
    const { profile } = await loginMock({ email, password });
    setUser(profile);
    return profile;
  };

  const signOut = async () => {
    try {
      await logoutService();
    } catch (err) {
      console.log("logout error", err);
    } finally {
      setUser(null);
    }
  };

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
