import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import colors, { lightColors, darkColors } from "../theme/colors";

const STORAGE_KEY = "tasku_theme_v1";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) setTheme(stored);
      } catch (err) {
        console.log("load theme error", err);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, theme).catch((err) => console.log("save theme error", err));
  }, [theme]);

  const palette = theme === "dark" ? darkColors : lightColors;

  const value = { theme, setTheme, colors: palette, isReady };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
