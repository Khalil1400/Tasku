// app/_layout.jsx
import { Stack } from "expo-router";
import { AuthProvider } from "./contexts/AuthContext";

export default function RootLayout() {
  // Wrap whole app in AuthProvider
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}