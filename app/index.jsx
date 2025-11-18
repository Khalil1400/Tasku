import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Import your logo
import TaskuLogo from "../assets/images/Tasku_logo.png";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      
      <Image source={TaskuLogo} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Tasku</Text>
      <Text style={styles.subtitle}>
        Your personal task manager crafted for simplicity
      </Text>
      <View style={{ height: 35 }} />

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.guestButton}
        onPress={() => router.push("/(tabs)")}
      >
        <Text style={styles.guestText}>Continue as Guest</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
    backgroundColor: "#f8f8f8",
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 20,
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginHorizontal: 20,
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  guestButton: {
    marginTop: 15,
  },
  guestText: {
    color: "#3b82f6",
    fontSize: 16,
  },
});
