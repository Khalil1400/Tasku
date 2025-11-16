import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";
import colors from "../constants/colors";

export default function MyButton({ text, onPress, loading, variant = "primary", style }) {
  return (
    <TouchableOpacity
      style={[styles.button, variant === "secondary" && styles.secondary, style]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text style={[styles.text, variant === "secondary" && styles.textSecondary]}>{text}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { padding: 12, backgroundColor: colors.accent, borderRadius: 8, alignItems: "center" },
  secondary: { backgroundColor: "#eee" },
  text: { color: "#fff", fontWeight: "700" },
  textSecondary: { color: "#333" },
});
