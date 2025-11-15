// app/calendar.jsx
import { SafeAreaView, StyleSheet, Text } from "react-native";

export default function Calendar() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Calendar</Text>
      <Text style={styles.sub}>(Feature coming soon)</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20 },
  title: { color: "#fff", fontSize: 28, fontWeight: "700" },
  sub: { color: "#777", fontSize: 16, marginTop: 10 },
});
