import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import TaskuLogo from "../../assets/images/Tasku_logo.png";
import { MyButton, ScreenContainer } from "../ui";
import typography from "../constants/typography";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { getAllItems } from "../services/storageService";

export default function Profile() {
  const { user, updateProfile, signOut } = useAuth();
  const [loadingImage, setLoadingImage] = useState(false);
  const [stats, setStats] = useState({ total: 0, favorites: 0, reminders: 0 });
  const { colors } = useTheme();
  const styles = createStyles(colors);

  useEffect(() => {
    (async function loadStats() {
      const items = await getAllItems();
      const total = items.length;
      const favorites = items.filter((i) => i.isFavorite).length;
      const reminders = items.filter((i) => i.reminder).length;
      setStats({ total, favorites, reminders });
    })();
  }, []);

  async function changeAvatar() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return alert("Permission denied");

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7
    });

    if (!res.canceled && res.assets && res.assets[0]) {
      setLoadingImage(true);
      await updateProfile({ avatar: res.assets[0].uri });
      setLoadingImage(false);
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.center}>

        <Image
          source={user?.avatar ? { uri: user.avatar } : TaskuLogo}
          style={styles.avatar}
        />

        <Text style={styles.name}>{user?.name || "Anonymous"}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Tasks</Text>
            <Text style={styles.statValue}>{stats.total}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Favorites</Text>
            <Text style={styles.statValue}>{stats.favorites}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Reminders</Text>
            <Text style={styles.statValue}>{stats.reminders}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <MyButton text="Change Avatar" onPress={changeAvatar} />
          <MyButton text="Logout" variant="secondary" onPress={signOut} style={{ marginTop: 12 }} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Profile</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{user?.name || "—"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user?.email || "—"}</Text>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    center: { alignItems: "center", padding: 20, gap: 12 },
    avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 6, borderWidth: 2, borderColor: colors.border },
    name: { fontSize: 20, fontWeight: "800", fontFamily: typography.bold, color: colors.text },
    email: { color: colors.textSecondary, marginBottom: 8, fontFamily: typography.medium },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      gap: 10,
      marginTop: 6,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      shadowColor: colors.shadow,
      shadowOpacity: 0.1,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 4 },
    },
    statLabel: { color: colors.textSecondary, fontSize: 12, fontFamily: typography.medium },
    statValue: { color: colors.text, fontSize: 18, fontFamily: typography.bold, marginTop: 4 },
    actions: { width: "100%", marginTop: 4 },
    card: {
      marginTop: 14,
      width: "100%",
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      shadowColor: colors.shadow,
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
    },
    cardTitle: { fontSize: 16, fontFamily: typography.semibold, color: colors.text, marginBottom: 10 },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
    label: { color: colors.textSecondary, fontFamily: typography.medium, fontSize: 14 },
    value: { color: colors.text, fontFamily: typography.semibold, fontSize: 14 },
  });
