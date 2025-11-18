import { AntDesign } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Card from "../components/Card";
import MyButton from "../components/MyButton";
import ScreenContainer from "../components/ScreenContainer";
import colors from "../constants/colors";
import { getAllItems, toggleFavorite } from "../services/storageService";

export default function TasksList() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const all = await getAllItems();

    setItems(all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    setLoading(false);
  }

  useFocusEffect(() => {
    load();
  })

  useEffect(() => {
    const unsubscribe = router.addListener?.("focus", () => { load(); });
    load();
    return unsubscribe;
  }, []);

  const filtered = items.filter(i => i.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>My Tasks</Text>
        <MyButton text="Create" onPress={() => router.push("/create")} />
      </View>

      <TextInput
        placeholder="Search..."
        value={query}
        onChangeText={setQuery}
        style={styles.search}
      />

      {loading ? (
        <Text style={{ padding: 20 }}>Loading...</Text>
      ) : filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No tasks. Tap Create to add one.</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <Card onPress={() => router.push(`/task/${item.id}`)}>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.meta}>
                    {item.category || "General"} • {new Date(item.createdAt).toLocaleString()}
                  </Text>
                </View>

                <TouchableOpacity onPress={async () => {
                  await toggleFavorite(item.id);
                  load();
                }}>
                  <AntDesign
                    name={item.isFavorite ? "star" : "staro"}
                    size={22}
                    color={item.isFavorite ? colors.accent : "#666"}
                  />
                </TouchableOpacity>
              </View>
            </Card>
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 10 },
  title: { fontSize: 22, fontWeight: "700" },
  search: { margin: 12, padding: 10, borderRadius: 8, backgroundColor: "#f3f3f3" },
  row: { flexDirection: "row", alignItems: "center" },
  itemTitle: { fontSize: 16, fontWeight: "600" },
  meta: { color: "#666", marginTop: 4, fontSize: 12 },
  empty: { alignItems: "center", padding: 40 },
  emptyText: { color: "#666" },
});
