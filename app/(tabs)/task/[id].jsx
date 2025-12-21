import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { Card, MyButton, ScreenContainer } from "../../ui";
import typography from "../../constants/typography";
import { useTheme } from "../../contexts/ThemeContext";
import { deleteItem, getItemById, toggleFavorite } from "../../services/storageService";

export default function TaskDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [item, setItem] = useState(null);
  const { colors } = useTheme();
  const styles = createStyles(colors);

  async function load() {
    const it = await getItemById(id);
    setItem(it);
  }

  useFocusEffect(() => { load(); });

  if (!item) return <ScreenContainer><Text style={{ padding: 20, color: colors.textSecondary }}>Loading...</Text></ScreenContainer>;

  return (
    <ScreenContainer>
      <Card>
        {item.image ? <Image source={{ uri: item.image }} style={styles.image} /> : null}
        <View style={styles.headerRow}>
          <Text style={styles.title}>{item.title}</Text>
          {item.isFavorite ? (
            <View style={styles.pill}>
              <Text style={styles.pillText}>Favorite</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Category</Text>
          <Text style={styles.metaValue}>{item.category || "General"}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Created</Text>
          <Text style={styles.metaValue}>{new Date(item.createdAt).toLocaleString()}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionLabel}>Notes</Text>
        <Text style={styles.body}>{item.notes || "No notes yet."}</Text>

        <View style={{ flexDirection: "row", marginTop: 12, justifyContent: "space-between" }}>
          <MyButton text={item.isFavorite ? "Unfavorite" : "Favorite"} onPress={async () => { await toggleFavorite(item.id); await load(); }} />
          <MyButton text="Edit" onPress={() => router.push({ pathname: "/edit", params: { id: item.id } })} />
          <MyButton text="Delete" variant="secondary" onPress={() => {
            Alert.alert("Delete", "Delete this item?", [
              { text: "Cancel" },
              { text: "Delete", style: "destructive", onPress: async () => { await deleteItem(item.id); router.replace("/(tabs)/tasks"); } }
            ]);
          }} />
        </View>
      </Card>
    </ScreenContainer>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    image: { width: "100%", height: 200, borderRadius: 12, marginBottom: 14 },
    headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
    title: { fontSize: 22, fontWeight: "800", fontFamily: typography.bold, color: colors.text, flex: 1, marginRight: 10 },
    metaRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
    metaLabel: { color: colors.textSecondary, fontSize: 13, fontFamily: typography.medium },
    metaValue: { color: colors.text, fontSize: 14, fontFamily: typography.semibold },
    divider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
    sectionLabel: { fontSize: 14, color: colors.textSecondary, fontFamily: typography.medium, marginBottom: 6, letterSpacing: 0.2 },
    body: { marginTop: 2, lineHeight: 20, fontSize: 15, color: colors.text, fontFamily: typography.regular },
    pill: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      backgroundColor: colors.primary,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.primaryDark,
    },
    pillText: { color: "#fff", fontSize: 12, fontFamily: typography.semibold },
  });
