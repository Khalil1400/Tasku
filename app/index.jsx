// app/index.jsx
import { Link, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import MyButton from "./components/MyButton";
import ScreenContainer from "./components/ScreenContainer";
import colors from "./constants/colors";
import { useAuth } from "./contexts/AuthContext";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  return (
    <ScreenContainer>
      <View style={styles.center}>
        <Text style={styles.title}>TaskMate</Text>
        <Text style={styles.subtitle}>Simple tasks with images, favorites, and secure login</Text>

        <MyButton
          text={isAuthenticated ? "Open App" : "Login"}
          onPress={() => (isAuthenticated ? router.push("/(tabs)/tasks") : router.push("/login"))}
          style={{ marginTop: 20 }}
        />

        <Link href="/about" style={{ marginTop: 16 }}>
          <Text style={styles.link}>About / Info</Text>
      _</Link>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: "center", justifyContent: "center", flex: 1, padding: 20 },
  title: { fontSize: 36, fontWeight: "800", color: colors.textPrimary },
  subtitle: { color: colors.textSecondary, marginTop: 10, textAlign: "center" },
  link: { color: colors.accent, textAlign: "center" },
});