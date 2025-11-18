// app/(tabs)/settings.jsx
import { Alert, StyleSheet, Text, View } from "react-native";
import MyButton from "../components/MyButton";
import ScreenContainer from "../components/ScreenContainer";
import { resetAllData } from "../services/storageService";

export default function Settings() {
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.heading}>Settings</Text>

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

        <Text style={{ marginTop: 20, color: "#666" }}>
          About: Minimal Tasku demo app for project
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
});
