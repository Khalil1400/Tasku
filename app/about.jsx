// app/about.jsx
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function About() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>About This App</Text>
      <View style={styles.body}>
        <Text style={styles.text}>
          This is a simple To-Do List app with favorites, editing, and local storage.
        </Text>
        <Text style={styles.text}>Made with React Native + Expo Router.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20 },
  title: { color: "#fff", fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  body: { marginTop: 6 },
  text: { color: "#ccc", fontSize: 16, lineHeight: 22, marginBottom: 10 },
});
