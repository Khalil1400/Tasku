// components/MyTextInput.jsx
import { StyleSheet, Text, TextInput, View } from "react-native";
import colors from "../app/constants/colors";

export default function MyTextInput({ label, style, ...props }) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput style={styles.input} placeholderTextColor="#777" {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  label: {
    color: colors.muted,
    marginBottom: 4,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#1a1a1a",
    color: colors.text,
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
  },
});
