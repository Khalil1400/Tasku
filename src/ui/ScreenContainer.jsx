import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export function ScreenContainer({ children, style }) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe(colors), style]}>
      <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: (colors) => ({ flex: 1, backgroundColor: colors.background }),
  content: { flexGrow: 1 },
});
