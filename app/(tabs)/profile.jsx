// app/(tabs)/profile.jsx
import { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MyButton from "../../components/MyButton"; // FIXED
import colors from "../../constants/colors"; // FIXED
import { getProfile } from "../../services/authService"; // FIXED

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        Alert.alert("Error", "Failed to load profile.");
      }
    }
    loadProfile();
  }, []);

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: profile.avatar }}
        style={styles.avatar}
      />

      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.email}>{profile.email}</Text>

      <MyButton
        title="Edit Profile"
        onPress={() => Alert.alert("Edit", "Edit profile pressed")}
      />

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => Alert.alert("Logout", "Logged out")}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: colors.text,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.text,
  },
  email: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 20,
  },
  logoutBtn: {
    marginTop: 20,
    padding: 12,
  },
  logoutText: {
    color: "#ff5c5c",
    fontSize: 16,
  },
});
