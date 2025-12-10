import { Alert, StyleSheet, Text, View } from "react-native";
import MyButton from "../components/MyButton";
import ScreenContainer from "../components/ScreenContainer";
import colors from "../constants/colors";
import { resetAllData } from "../services/storageService";

export default function Settings() {

  return (
    <ScreenContainer style={{ backgroundColor: colors.background }}>
      <View style={styles.container}>
        <Text style={[styles.heading, { color: colors.text }]}>
          Settings
        </Text>

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

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
});
