import { Text, View } from "react-native";
import ScreenContainer from "../components/ScreenContainer";

export default function Calendar() {
  return (
    <ScreenContainer>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>Calendar</Text>
        <Text style={{ marginTop: 8, color: "#666" }}>Placeholder calendar screen (you can expand later).</Text>
      </View>
    </ScreenContainer>
  );
}
