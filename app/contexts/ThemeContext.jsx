import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Appearance } from "react-native";
import { darkColors, lightColors } from "../theme";

const ThemeContext = createContext();
const THEME_KEY = "taskmate_theme_v1";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async function loadTheme() {
      try {
        const stored = await AsyncStorage.getItem(THEME_KEY);
        const system = Appearance.getColorScheme();
        const initial = stored || system || "light";
        if (mounted) setTheme(initial);
      } catch (e) {
        console.log("Theme load error:", e);
      } finally {
        if (mounted) setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(THEME_KEY, theme).catch((e) => console.log("Theme save error:", e));
  }, [theme]);

  const colors = useMemo(() => (theme === "dark" ? darkColors : lightColors), [theme]);

  const value = useMemo(
    () => ({
      theme,
      colors,
      setTheme,
      toggleTheme: () => setTheme((prev) => (prev === "dark" ? "light" : "dark")),
    }),
    [theme, colors]
  );

  if (!isReady) return null;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
