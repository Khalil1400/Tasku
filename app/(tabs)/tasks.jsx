import { AntDesign, Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useFocusEffect } from "expo-router";
import { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Card from "../components/Card";
import MyButton from "../components/MyButton";
import ScreenContainer from "../components/ScreenContainer";
import colors from "../constants/colors";

import { getAllItems, setReminder, toggleFavorite } from "../services/storageService";

export default function TasksList() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Reminder modal
  const [reminderModal, setReminderModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [reminderDate, setReminderDate] = useState(new Date());

  /* LOAD TASKS */
  async function load() {
    setLoading(true);
    const all = await getAllItems();
    setItems(all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    setLoading(false);
  }

  useFocusEffect(() => {
    load();
  });

  useEffect(() => {
    const unsubscribe = router.addListener?.("focus", load);
    load();
    return unsubscribe;
  }, []);

  const filtered = items.filter((i) =>
    i.title.toLowerCase().includes(query.toLowerCase())
  );

  /*REMINDER MODAL */
  function openReminder(task) {
    setSelectedTask(task);
    setReminderDate(task.reminder ? new Date(task.reminder) : new Date());
    setReminderModal(true);
  }

  async function saveReminder() {
    if (!selectedTask) return;

    try {
      await setReminder(selectedTask.id, reminderDate.toISOString());
      setReminderModal(false);
      load();
    } catch (e) {
      console.log("Failed to set reminder:", e);
      alert("Failed to set reminder. Make sure notifications are allowed.");
    }
  }

  // UI
  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>My Tasks</Text>
        <MyButton text="Create" onPress={() => router.push("/create")} />
      </View>

      <TextInput
        placeholder="Search..."
        placeholderTextColor="black" // <-- placeholder in black
        value={query}
        onChangeText={setQuery}
        style={[styles.search, { color: "black" }]} // <-- typed text in black
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
          keyExtractor={(i) => i.id.toString()}
          renderItem={({ item }) => {
            const reminderDateObj = item.reminder ? new Date(item.reminder) : null;
            const formattedDate = reminderDateObj
              ? reminderDateObj.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "";
            const formattedTime = reminderDateObj
              ? reminderDateObj.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "";

            return (
              <Card onPress={() => router.push(`/task/${item.id}`)}>
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.meta}>
                      {item.category || "General"} •{" "}
                      {new Date(item.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </Text>

                    {item.reminder && (
                      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                        <Feather name="clock" size={14} color="#3b82f6" style={{ marginRight: 4 }} />
                        <Text style={styles.reminder}>{formattedDate} • {formattedTime}</Text>
                      </View>
                    )}
                  </View>

                  {/* FAVORITE ICON */}
                  <TouchableOpacity
                    onPress={async () => {
                      await toggleFavorite(item.id);
                      load();
                    }}
                  >
                    <AntDesign
                      name={"star"}
                      size={22}
                      color={item.isFavorite ? colors.accent : "#666"}
                      style={{ marginRight: 14 }}
                    />
                  </TouchableOpacity>

                  {/* REMINDER ICON */}
                  <TouchableOpacity onPress={() => openReminder(item)}>
                    <Feather name="bell" size={22} color="#666" />
                  </TouchableOpacity>
                </View>
              </Card>
            );
          }}
        />
      )}

      {/* REMINDER MODAL */}
      <Modal visible={reminderModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              Set Reminder for: {selectedTask?.title}
            </Text>

            <DateTimePicker
              value={reminderDate}
              mode="datetime"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={(e, d) => d && setReminderDate(d)}
              textColor="black"
              style={{ backgroundColor: "black", color: "black" }}
            />

            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setReminderModal(false)} />
              <Button title="Save" onPress={saveReminder} />
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  title: { fontSize: 22, fontWeight: "700" },
  search: { margin: 12, padding: 10, borderRadius: 8, backgroundColor: "#f3f3f3" },
  row: { flexDirection: "row", alignItems: "center" },
  itemTitle: { fontSize: 16, fontWeight: "600" },
  meta: { color: "black", marginTop: 4, fontSize: 12 },
  reminder: { fontSize: 12, color: "#3b82f6" },
  empty: { alignItems: "center", padding: 40 },
  emptyText: { color: "#666" },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalBox: {
    width: "85%",
    padding: 20,
    backgroundColor: "black",
    borderRadius: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "white" },
  modalButtons: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
