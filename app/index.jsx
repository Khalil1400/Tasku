import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, StyleSheet, Text, View } from "react-native";
import TaskuLogo from "../assets/images/Tasku_logo.png";
import { MyButton, ScreenContainer } from "./ui";
import { useTheme } from "./contexts/ThemeContext";
import { useAuth } from "./contexts/AuthContext";
import typography from "./constants/typography";

export default function HomeScreen() {
  const { colors } = useTheme();
  const { signIn } = useAuth();
  const styles = createStyles(colors);
  const spin = useRef(new Animated.Value(0)).current;
  const wink = useRef(new Animated.Value(1)).current;
  const ringOpacity = useRef(new Animated.Value(1)).current;
  const [demoLoading, setDemoLoading] = useState(false);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.delay(1200),
        Animated.timing(wink, { toValue: 0.82, duration: 120, useNativeDriver: true }),
        Animated.timing(wink, { toValue: 1, duration: 140, useNativeDriver: true }),
        Animated.delay(1600),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.delay(6500),
        Animated.timing(ringOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(ringOpacity, { toValue: 1, duration: 1, useNativeDriver: true }),
      ])
    ).start();
  }, [spin, wink]);

  const rotateInterpolate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.logoWrap}>
          <Animated.View style={[styles.ring, { transform: [{ rotate: rotateInterpolate }], opacity: ringOpacity }]} />
          <Animated.Image
            source={TaskuLogo}
            style={[styles.logo, { transform: [{ scaleY: wink }] }]}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Tasku</Text>
        <Text style={styles.subtitle}>Your personal task manager crafted for simplicity.</Text>
      </View>

      <View style={styles.actions}>
        <MyButton text="Login" onPress={() => router.push("/login")} />
        <MyButton
          variant="secondary"
          text={demoLoading ? "Connecting..." : "Continue as Guest"}
          onPress={async () => {
            setDemoLoading(true);
            try {
              await signIn("demo@tasku.com", "password123");
              router.replace("/(tabs)/tasks");
            } catch (err) {
              alert(err?.message || "Demo login failed. Please try again.");
            } finally {
              setDemoLoading(false);
            }
          }}
          style={{ marginTop: 10 }}
        />
      </View>
    </ScreenContainer>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: { justifyContent: "center", alignItems: "center" },
    hero: { alignItems: "center", gap: 10, marginBottom: 24 },
    logoWrap: {
      width: 160,
      height: 160,
      borderRadius: 80,
      backgroundColor: colors.card,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.shadow,
      shadowOpacity: 0.14,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 },
      elevation: 4,
      overflow: "visible",
    },
    ring: {
      position: "absolute",
      width: 170,
      height: 170,
      borderRadius: 85,
      borderWidth: 6,
      borderColor: "transparent",
      borderTopColor: "rgba(34, 197, 94, 0.45)",
      borderBottomColor: "rgba(34, 197, 94, 0.45)",
      borderLeftColor: "transparent",
      borderRightColor: "transparent",
    },
    logo: { width: 120, height: 120 },
    title: { fontSize: 34, fontWeight: "800", fontFamily: typography.bold, color: colors.text },
    subtitle: {
      fontSize: 15,
      textAlign: "center",
      color: colors.textSecondary,
      maxWidth: 260,
      fontFamily: typography.medium,
    },
    actions: { width: "100%", paddingHorizontal: 24 },
  });
