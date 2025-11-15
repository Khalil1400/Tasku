// app/_layout.jsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* The tabs folder */}
      <Stack.Screen name="(tabs)" />

      {/* Stand-alone screens that should NOT appear in the tab bar */}
      <Stack.Screen name="create" />
      <Stack.Screen name="edit" />
      <Stack.Screen name="login" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="about" />
    </Stack>
  );
}
