import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import typography from "../constants/typography";

export default function MyButton({ text, onPress, loading, variant = "primary", style, disabled = false }) {
  const { colors } = useTheme();
  const isSecondary = variant === "secondary";
  const isDisabled = loading || disabled;
  const themedStyles = styles(colors);

  return (
    <Pressable
      style={({ pressed }) => [
        themedStyles.button,
        isSecondary && themedStyles.secondary,
        pressed && !isDisabled && themedStyles.pressed,
        isDisabled && themedStyles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      <View style={styles.inner}>
        {loading ? (
          <ActivityIndicator color={isSecondary ? colors.text : "#fff"} />
        ) : (
          <Text style={[themedStyles.text, isSecondary && themedStyles.textSecondary]}>{text}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = (colors) =>
  StyleSheet.create({
    button: {
      paddingVertical: 12,
      paddingHorizontal: 14,
      backgroundColor: colors.buttonGradientStart,
      borderColor: colors.buttonGradientEnd,
      borderWidth: 1,
      borderRadius: 8,
      alignItems: "center",
      shadowColor: colors.buttonGradientEnd,
      shadowOpacity: 0.25,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 3,
    },
    inner: {
      width: "100%",
      alignItems: "center",
    },
    pressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
    secondary: { backgroundColor: colors.cardMuted, borderColor: colors.border, shadowOpacity: 0 },
    disabled: { backgroundColor: colors.border, borderColor: colors.border, shadowOpacity: 0.1 },
    text: { color: "#fff", fontWeight: "700", fontFamily: typography.semibold, letterSpacing: 0.2 },
    textSecondary: { color: colors.text, fontFamily: typography.medium },
  });
