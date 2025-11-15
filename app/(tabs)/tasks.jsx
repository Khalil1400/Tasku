// app/tasks.jsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const STORAGE_KEY = "@MyTodoApp:tasks";

const TaskItem = ({ task, onToggleComplete, onToggleFavorite, onDelete, onEdit }) => (
  <View style={styles.taskContainer}>
    <Pressable onPress={() => onToggleComplete(task.id)} style={styles.taskIcon}>
      <Text style={styles.taskIconText}>{task.isComplete ? "✓" : "□"}</Text>
    </Pressable>

    <Text style={[styles.taskText, task.isComplete && styles.taskTextComplete]}>
      {task.text}
    </Text>

    <Pressable onPress={() => onToggleFavorite(task.id)} style={styles.taskIcon}>
      <Text style={styles.taskIconText}>{task.isFavorite ? "★" : "☆"}</Text>
    </Pressable>

    <Pressable onPress={() => onEdit(task)} style={styles.taskIcon}>
      <Text style={styles.taskIconText}>✏</Text>
    </Pressable>

    <Pressable onPress={() => onDelete(task.id)} style={styles.taskIcon}>
      <Text style={styles.taskIconText}>🗑</Text>
    </Pressable>
  </View>
);

const EditModal = ({ visible, task, onClose, onSave }) => {
  const [editText, setEditText] = useState("");

  useEffect(() => {
    if (task) setEditText(task.text ?? "");
    else setEditText("");
  }, [task, visible]);

  const handleSave = () => {
    const trimmed = (editText || "").trim();
    if (!trimmed) return;
    onSave(task.id, trimmed);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Task</Text>

          <TextInput
            style={styles.modalInput}
            value={editText}
            onChangeText={setEditText}
            placeholder="Edit task"
            placeholderTextColor="#bbb"
            autoFocus
          />

          <View style={styles.modalButtonRow}>
            <Pressable style={[styles.modalButton, styles.modalButtonCancel]} onPress={onClose}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </Pressable>

            <Pressable style={[styles.modalButton, styles.modalButtonSave]} onPress={handleSave}>
              <Text style={styles.modalButtonText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load from storage once
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setTasks(JSON.parse(raw));
      } catch (e) {
        console.error("Failed to load tasks.", e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Save on tasks change (but not during first load)
  useEffect(() => {
    if (isLoading) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)).catch((e) =>
      console.error("Failed to save tasks.", e)
    );
  }, [tasks, isLoading]);

  const handleAdd = () => {
    const trimmed = (text || "").trim();
    if (!trimmed) return;
    const newTask = { id: Date.now().toString(), text: trimmed, isComplete: false, isFavorite: false };
    setTasks((s) => [newTask, ...s]);
    setText("");
  };

  const toggleComplete = (id) => {
    setTasks((s) => s.map((t) => (t.id === id ? { ...t, isComplete: !t.isComplete } : t)));
  };

  const toggleFavorite = (id) => {
    setTasks((s) => s.map((t) => (t.id === id ? { ...t, isFavorite: !t.isFavorite } : t)));
  };

  const deleteTask = (id) => {
    setTasks((s) => s.filter((t) => t.id !== id));
  };

  const openEdit = (task) => {
    setEditing(task);
    setModalVisible(true);
  };

  const closeEdit = () => {
    setEditing(null);
    setModalVisible(false);
  };

  const saveEdit = (id, newText) => {
    setTasks((s) => s.map((t) => (t.id === id ? { ...t, text: newText } : t)));
  };

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return 0;
    });
  }, [tasks]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My To-Do List</Text>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Add a new task..."
          placeholderTextColor="#999"
          onSubmitEditing={handleAdd}
        />
        <Pressable style={[styles.addButton, !text.trim() && styles.addButtonDisabled]} disabled={!text.trim()} onPress={handleAdd}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </KeyboardAvoidingView>

      <FlatList
        data={sortedTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggleComplete={toggleComplete}
            onToggleFavorite={toggleFavorite}
            onDelete={deleteTask}
            onEdit={openEdit}
          />
        )}
        ListEmptyComponent={!isLoading ? <Text style={styles.emptyText}>No tasks yet.</Text> : null}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      />

      <EditModal visible={modalVisible} task={editing} onClose={closeEdit} onSave={saveEdit} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", textAlign: "center", paddingVertical: 20 },
  inputContainer: { flexDirection: "row", paddingHorizontal: 20, marginBottom: 20 },
  input: { flex: 1, backgroundColor: "#333", color: "#fff", paddingVertical: 15, paddingHorizontal: 20, borderRadius: 10, fontSize: 16, marginRight: 10 },
  addButton: { backgroundColor: "#007AFF", paddingHorizontal: 20, paddingVertical: 15, borderRadius: 10, justifyContent: "center" },
  addButtonDisabled: { backgroundColor: "#555" },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  emptyText: { color: "#999", textAlign: "center", marginTop: 50, fontSize: 18 },
  taskContainer: { backgroundColor: "#222", padding: 15, borderRadius: 10, flexDirection: "row", alignItems: "center", marginBottom: 10 },
  taskText: { flex: 1, color: "#fff", fontSize: 16, marginLeft: 10 },
  taskTextComplete: { textDecorationLine: "line-through", color: "#888" },
  taskIcon: { padding: 5, marginLeft: 5 },
  taskIconText: { fontSize: 20 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center" },
  modalContainer: { width: "90%", backgroundColor: "#333", borderRadius: 15, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#fff", marginBottom: 20, textAlign: "center" },
  modalInput: { backgroundColor: "#444", color: "#fff", paddingVertical: 15, paddingHorizontal: 20, borderRadius: 10, marginBottom: 20 },
  modalButtonRow: { flexDirection: "row", justifyContent: "flex-end" },
  modalButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginLeft: 10 },
  modalButtonCancel: { backgroundColor: "#555" },
  modalButtonSave: { backgroundColor: "#007AFF" },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
});
