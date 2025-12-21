import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import api from "./api";

const REMINDERS_KEY = "tasku_task_reminders";

async function readReminderStore() {
  try {
    const json = await AsyncStorage.getItem(REMINDERS_KEY);
    return json ? JSON.parse(json) : {};
  } catch (err) {
    console.log("readReminderStore error", err);
    return {};
  }
}

async function writeReminderStore(map) {
  try {
    await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(map));
  } catch (err) {
    console.log("writeReminderStore error", err);
  }
}

async function cancelStoredReminder(taskId) {
  const store = await readReminderStore();
  const notifId = store[taskId];
  if (notifId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notifId);
    } catch (err) {
      console.log("cancel notification error", err);
    }
    delete store[taskId];
    await writeReminderStore(store);
  }
}

export async function getAllItems() {
  const res = await api.get("/tasks");
  return res.data;
}

export async function getItemById(id) {
  const res = await api.get(`/tasks/${id}`);
  return res.data;
}

export async function addItem(itemData) {
  const payload = {
    title: itemData.title,
    category: itemData.category || null,
    description: itemData.notes || itemData.description || null,
    imageUrl: itemData.image || null,
    reminderAt: itemData.reminder || null,
    favorite: !!itemData.favorite,
  };
  const res = await api.post("/tasks", payload);
  return res.data;
}

export async function updateItem(itemData) {
  const payload = {
    title: itemData.title,
    category: itemData.category || null,
    description: itemData.notes || itemData.description || null,
    imageUrl: itemData.image || null,
    reminderAt: itemData.reminderAt || itemData.reminder || null,
    favorite: itemData.favorite,
  };
  const res = await api.put(`/tasks/${itemData.id}`, payload);
  return res.data;
}

export async function deleteItem(id) {
  await cancelStoredReminder(id);
  await api.delete(`/tasks/${id}`);
}

export async function toggleFavorite(id) {
  const current = await getItemById(id);
  const res = await api.patch(`/tasks/${id}`, { favorite: !current.favorite });
  return res.data;
}

async function scheduleLocalNotification(title, datetime) {
  const triggerDate = new Date(datetime);
  if (triggerDate.getTime() <= Date.now()) {
    throw new Error("Cannot schedule notification in the past.");
  }

  const permissions = await Notifications.getPermissionsAsync();
  if (permissions.status !== "granted") {
    const next = await Notifications.requestPermissionsAsync();
    if (next.status !== "granted") {
      throw new Error("Notifications permission not granted");
    }
  }

  return Notifications.scheduleNotificationAsync({
    content: { title: "Task Reminder", body: title, data: { type: "task" } },
    trigger: triggerDate,
  });
}

export async function setReminder(id, datetime) {
  const iso = new Date(datetime).toISOString();
  const task = await getItemById(id);

  await cancelStoredReminder(id);
  const notificationId = await scheduleLocalNotification(task.title, iso);
  const store = await readReminderStore();
  store[id] = notificationId;
  await writeReminderStore(store);

  const res = await api.patch(`/tasks/${id}`, { reminderAt: iso });
  return res.data;
}

export async function clearReminder(id) {
  await cancelStoredReminder(id);
  const res = await api.patch(`/tasks/${id}`, { reminderAt: null });
  return res.data;
}

export async function resetAllData() {
  try {
    const store = await readReminderStore();
    const notificationIds = Object.values(store);
    await Promise.all(
      notificationIds.map((notificationId) =>
        Notifications.cancelScheduledNotificationAsync(notificationId).catch((err) => console.log("cancel notification error", err))
      )
    );
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.removeItem(REMINDERS_KEY);
  } catch (err) {
    console.log("resetAllData error", err);
  }
}
