import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";
import colors from "../constants/colors";

export default function MyButton({ text, onPress, loading, variant = "primary", style, disabled = false }) {
  const isSecondary = variant === "secondary";
  const isDisabled = loading || disabled;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSecondary && styles.secondary,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color={isSecondary ? colors.text : "#fff"} />
      ) : (
        <Text style={[styles.text, isSecondary && styles.textSecondary]}>{text}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    backgroundColor: colors.accent,
    borderRadius: 8,
    alignItems: "center",
  },
  secondary: { backgroundColor: "#eef2ff" },
  disabled: { opacity: 0.7 },
  text: { color: "#fff", fontWeight: "700" },
  textSecondary: { color: colors.text },
});
