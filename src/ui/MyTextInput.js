import { StyleSheet, Text, TextInput, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export function MyTextInput({ label, error, ...props }) {
  const { colors } = useTheme();

  return (
    <View style={{ marginBottom: 10 }}>
      {label ? <Text style={styles.label(colors)}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.textSecondary}
        {...props}
        style={[styles.input(colors), { color: colors.text }, props.style]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: (colors) => ({ marginBottom: 4, color: colors.textSecondary, fontWeight: "600" }),
  input: (colors) => ({
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  }),
  error: { color: "#ef4444", marginTop: 4 },
});
