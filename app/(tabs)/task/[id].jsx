import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import Card from "../../components/Card";
import MyButton from "../../components/MyButton";
import ScreenContainer from "../../components/ScreenContainer";
import { deleteItem, getItemById, toggleFavorite } from "../../services/storageService";

export default function TaskDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [item, setItem] = useState(null);

  async function load() {
    const it = await getItemById(id);
    setItem(it);
  }

  useEffect(() => { load(); }, [id]);

  if (!item) return <ScreenContainer><Text style={{ padding: 20 }}>Loading...</Text></ScreenContainer>;

  return (
    <ScreenContainer>
      <Card>
        {item.image ? <Image source={{ uri: item.image }} style={styles.image} /> : null}
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.meta}>{item.category || "General"} • {new Date(item.createdAt).toLocaleString()}</Text>
        <Text style={styles.body}>{item.notes || ""}</Text>

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

const styles = StyleSheet.create({
  image: { width: "100%", height: 200, borderRadius: 10, marginBottom: 10 },
  title: { fontSize: 20, fontWeight: "700" },
  meta: { color: "#666", marginBottom: 8 },
  body: { marginTop: 6, lineHeight: 20 },
});
