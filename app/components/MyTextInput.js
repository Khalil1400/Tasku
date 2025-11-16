import { StyleSheet, Text, TextInput, View } from "react-native";
import colors from "../constants/colors";

export default function MyTextInput({ label, style, inputStyle, ...props }) {
  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, inputStyle, props.multiline && styles.multiline]}
        placeholderTextColor="#777"
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { color: colors.textSecondary, marginBottom: 6, fontSize: 14 },
  input: {
    backgroundColor: colors.card,
    color: colors.textPrimary,
    padding: 12,
    borderRadius: 8,
    fontSize: 15,
  },
  multiline: {
    height: 100,
    textAlignVertical: "top",
    paddingVertical: 12,
  },
});
