import { AntDesign, Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import typography from "../constants/typography";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { Card, MyButton, ScreenContainer } from "../ui";

import { deleteTask, listTasks, updateTask } from "../services/taskApi";
import { clearReminder as cancelTaskReminder, setReminder as scheduleTaskReminder } from "../services/reminderService";

export default function TasksList() {
  const { colors, theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const styles = createStyles(colors);

  // Reminder modal
  const [reminderModal, setReminderModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [reminderDate, setReminderDate] = useState(new Date());

  /* LOAD TASKS */
  const load = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      setError("");
      const all = await listTasks();
      const sorted = all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setItems(sorted);
    } catch (e) {
      console.log("Failed to load tasks", e);
      setError(e?.message || "Failed to load tasks");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated) {
        router.replace("/login");
        return;
      }
      load();
    }, [isAuthenticated, load])
  );

  const filtered = items.filter((i) =>
    (i.title || "").toLowerCase().includes(query.toLowerCase())
  );

  /*REMINDER MODAL */
  function openReminder(task) {
    setSelectedTask(task);
    setReminderDate(task.reminderAt ? new Date(task.reminderAt) : new Date());
    setReminderModal(true);
  }

  async function saveReminder() {
    if (!selectedTask) return;

    try {
      const iso = reminderDate.toISOString();
      await scheduleTaskReminder(selectedTask.id, selectedTask.title, iso);
      await updateTask(selectedTask.id, { reminderAt: iso });
      setReminderModal(false);
      load();
    } catch (e) {
      console.log("Failed to set reminder:", e);
      alert(e?.message || "Failed to set reminder. Make sure notifications are allowed.");
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
        placeholderTextColor={colors.textSecondary}
        value={query}
        onChangeText={setQuery}
        style={[styles.search, { color: colors.text }]}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No tasks. Tap Create to add one.</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => {
            const reminderDateObj = item.reminderAt ? new Date(item.reminderAt) : null;
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
                      {item.category || "General"} |{" "}
                      {new Date(item.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </Text>

                    <View style={styles.badgesRow}>
                      {item.favorite ? (
                        <View style={[styles.pill, styles.pillStrong]}>
                          <AntDesign name="star" size={12} color="#fff" style={{ marginRight: 6 }} />
                          <Text style={styles.pillStrongText}>Favorite</Text>
                        </View>
                      ) : null}
                      {item.reminderAt && (
                        <View style={styles.pill}>
                          <Feather name="clock" size={12} color={colors.primary} style={{ marginRight: 6 }} />
                          <Text style={styles.pillText}>{formattedDate} @ {formattedTime}</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* FAVORITE ICON */}
                  <TouchableOpacity
                    onPress={async () => {
                      try {
                        await updateTask(item.id, { favorite: !item.favorite });
                        load();
                      } catch (e) {
                        alert(e?.message || "Failed to update favorite");
                      }
                    }}
                  >
                    <AntDesign
                      name={"star"}
                      size={24}
                      color={item.favorite ? colors.primary : colors.textSecondary}
                      style={styles.iconBubble}
                    />
                  </TouchableOpacity>

                  {/* REMINDER ICON */}
                  <TouchableOpacity onPress={() => openReminder(item)} style={{ marginRight: 10 }}>
                    <Feather name="bell" size={24} color={colors.textSecondary} />
                  </TouchableOpacity>

                  {/* DELETE ICON */}
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert("Delete task", "Are you sure you want to delete this task?", [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: async () => {
                            try {
                              await cancelTaskReminder(item.id);
                              await deleteTask(item.id);
                              load();
                            } catch (err) {
                              alert(err?.message || "Failed to delete task");
                            }
                          },
                        },
                      ]);
                    }}
                  >
                    <Feather name="trash-2" size={20} color={colors.dangerSoft} style={styles.iconBubbleDanger} />
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
            <Text style={styles.modalSubtitle}>
              Choose when you want to be nudged about this task.
            </Text>

            <DateTimePicker
              value={reminderDate}
              mode="datetime"
              display={Platform.OS === "ios" ? "inline" : "default"}
              themeVariant={theme === "dark" ? "dark" : "light"}
              onChange={(e, d) => d && setReminderDate(d)}
              textColor={colors.text}
              style={styles.picker}
            />

            <View style={styles.modalButtons}>
              <MyButton
                text="Cancel"
                variant="secondary"
                onPress={() => setReminderModal(false)}
                style={{ flex: 1, marginRight: 8 }}
              />
              <MyButton text="Save" onPress={saveReminder} style={{ flex: 1, marginLeft: 8 }} />
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

// Styles
const createStyles = (colors) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 4,
      paddingVertical: 6,
      marginBottom: 10,
    },
    title: { fontSize: 26, fontWeight: "800", color: colors.text, fontFamily: typography.bold },
    search: {
      marginHorizontal: 4,
      marginBottom: 10,
      padding: 12,
      borderRadius: 8,
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderWidth: 1,
      fontFamily: typography.medium,
    },
    row: { flexDirection: "row", alignItems: "center" },
    itemTitle: { fontSize: 17, fontWeight: "700", fontFamily: typography.semibold, color: colors.text },
    meta: { color: colors.textSecondary, marginTop: 4, fontSize: 13, fontFamily: typography.medium },
    reminder: { fontSize: 12, color: colors.primary },
    badgesRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
    pill: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 6,
      backgroundColor: colors.pill,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.border,
      marginRight: 8,
      marginBottom: 6,
    },
    pillText: { color: colors.text, fontSize: 12, fontFamily: typography.medium },
    pillStrong: { backgroundColor: colors.primary, borderColor: colors.primaryDark },
    pillStrongText: { color: "#fff", fontSize: 12, fontFamily: typography.semibold },
    empty: { alignItems: "center", padding: 40 },
    emptyText: { color: colors.textSecondary, fontFamily: typography.medium },
    error: { color: colors.danger, paddingHorizontal: 6, paddingBottom: 6, fontFamily: typography.medium },
    loading: { padding: 20, color: colors.textSecondary },
    iconBubble: {
      marginRight: 14,
      backgroundColor: colors.cardMuted,
      padding: 8,
      borderRadius: 999,
    },
    iconBubbleDanger: {
      marginLeft: 8,
      backgroundColor: colors.cardMuted,
      padding: 7,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.dangerSoft,
    },

    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.4)",
    },
    modalBox: {
      width: "90%",
      padding: 22,
      backgroundColor: colors.card,
      borderRadius: 16,
      shadowColor: colors.shadow,
      shadowOpacity: 0.15,
      shadowRadius: 18,
      elevation: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 4, color: colors.text, fontFamily: typography.semibold },
    modalSubtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 12, fontFamily: typography.medium },
    picker: { backgroundColor: colors.cardMuted, borderRadius: 12 },
    modalButtons: {
      marginTop: 20,
      flexDirection: "row",
      justifyContent: "space-between",
    },
  });
