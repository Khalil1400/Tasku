// app/(tabs)/_layout.jsx
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0b0b0f",
          borderTopColor: "#222",
          height: 68,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: "#4da6ff",
        tabBarInactiveTintColor: "#7a7a7a",
        tabBarIcon: ({ color, focused }) => {
          let icon = "ellipse";

          if (route.name === "tasks") {
            icon = focused ? "list" : "list-outline";
          }

          if (route.name === "calendar") {
            icon = focused ? "calendar" : "calendar-outline";
          }

          if (route.name === "profile") {
            icon = focused ? "person" : "person-outline";
          }

          return <Ionicons name={icon} size={26} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="tasks" />
      <Tabs.Screen name="calendar" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
