import { StyleSheet, Text, TextInput, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export default function MyTextInput({ label, style, inputStyle, ...props }) {
  const { colors } = useTheme();
  const themedStyles = styles(colors);

  return (
    <View style={[themedStyles.container, style]}>
      {label ? <Text style={themedStyles.label}>{label}</Text> : null}
      <TextInput
        style={[themedStyles.input, inputStyle, props.multiline && themedStyles.multiline]}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
    </View>
  );
}

const styles = (colors) =>
  StyleSheet.create({
    container: { marginBottom: 12 },
    label: { color: colors.textSecondary, marginBottom: 6, fontSize: 14 },
    input: {
      backgroundColor: colors.card,
      color: colors.text,
      padding: 12,
      borderRadius: 8,
      fontSize: 15,
      borderWidth: 1,
      borderColor: colors.border,
    },
    multiline: {
      height: 100,
      textAlignVertical: "top",
      paddingVertical: 12,
    },
  });
