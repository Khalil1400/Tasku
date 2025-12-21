import { Alert, StyleSheet, Switch, Text, View } from "react-native";
import { MyButton, ScreenContainer } from "../ui";
import typography from "../constants/typography";
import { useTheme } from "../contexts/ThemeContext";
import { resetAllData } from "../services/storageService";

export default function Settings() {
  const { theme, setTheme, colors } = useTheme();
  const styles = createStyles(colors);
  const isDark = theme === "dark";

  return (
    <ScreenContainer style={{ backgroundColor: colors.background }}>
      <View style={styles.container}>
        <Text style={styles.heading}>Settings</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Dark mode</Text>
              <Text style={styles.sub}>Toggle the app theme</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={(value) => setTheme(value ? "dark" : "light")}
              trackColor={{ false: colors.border, true: colors.primaryDark }}
              thumbColor={isDark ? colors.accent : "#fff"}
            />
          </View>
        </View>

        <MyButton
          variant="secondary"
          text="Reset All App Data"
          onPress={() => {
            Alert.alert("Reset", "Delete all local app data?", [
              { text: "Cancel" },
              {
                text: "Reset",
                style: "destructive",
                onPress: async () => {
                  await resetAllData();
                  Alert.alert("Data reset completed");
                },
              },
            ]);
          }}
        />

        
        
          
      </View>
    </ScreenContainer>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: { padding: 20, gap: 14 },
    heading: { fontSize: 22, fontWeight: "800", marginBottom: 4, fontFamily: typography.bold, color: colors.text },
    card: {
      backgroundColor: colors.card,
      padding: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    label: { fontSize: 16, fontFamily: typography.semibold, color: colors.text },
    sub: { color: colors.textSecondary, fontSize: 13, marginTop: 4 },
  });
