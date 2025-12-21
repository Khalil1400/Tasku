import * as Notifications from 'expo-notifications';
import { Stack } from "expo-router";
import { useEffect } from 'react';
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

function ThemedStack() {
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        contentStyle: { paddingTop: 32, backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ gestureEnabled: true }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    async function askPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Enable notifications to receive reminders.");
      }
    }
    askPermissions();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <ThemedStack />
      </AuthProvider>
    </ThemeProvider>
  );
}
