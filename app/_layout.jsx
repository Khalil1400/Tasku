import * as Notifications from 'expo-notifications';
import { Stack } from "expo-router";
import { useEffect } from 'react';
import { AuthProvider } from "./contexts/AuthContext";

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
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { paddingBlockStart: 32 }, }}>
        <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
      </Stack>
    </AuthProvider>
  );
}
