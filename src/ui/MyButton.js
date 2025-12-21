import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export function MyButton({ text, onPress, variant = "primary", loading = false, style }) {
  const { colors } = useTheme();

  if (variant === "secondary") {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.secondary(colors), pressed && styles.pressed, style]}>
        {loading ? <ActivityIndicator color={colors.primary} /> : <Text style={styles.secondaryText(colors)}>{text}</Text>}
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={style}>
      <LinearGradient colors={[colors.buttonGradientStart, colors.buttonGradientEnd]} style={styles.primary}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>{text}</Text>}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryText: { color: "#fff", fontWeight: "700" },
  secondary: (colors) => ({
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: colors.cardMuted,
    borderWidth: 1,
    borderColor: colors.border,
  }),
  secondaryText: (colors) => ({ color: colors.text, fontWeight: "700" }),
  pressed: { opacity: 0.85 },
});
