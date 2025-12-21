import { StyleSheet, Text, View } from "react-native";
import typography from "../constants/typography";
import { useTheme } from "../contexts/ThemeContext";

export default function ScreenContainer({ children, style }) {
  const { colors } = useTheme();

  // Set a consistent base font + color across screens (theme-aware)
  if (!Text.defaultProps) {
    Text.defaultProps = {};
  }
  Text.defaultProps.style = [{ fontFamily: typography.regular, color: colors.text }];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 18 },
});
