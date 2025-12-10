import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { v4 as uuidv4 } from "react-native-uuid";

const ITEMS_KEY = "taskmate_items_v1";

/* ---------------------------------------------- */
/* STORAGE HELPERS */
/* ---------------------------------------------- */

export async function loadItems() {
  try {
    const json = await AsyncStorage.getItem(ITEMS_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.log("Load error:", e);
    return [];
  }
}

export async function saveItems(items) {
  try {
    await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(items));
  } catch (e) {
    console.log("Save error:", e);
  }
}

/* ---------------------------------------------- */
/* BASIC CRUD */
/* ---------------------------------------------- */

export async function getAllItems() {
  return await loadItems();
}

export async function getItemById(id) {
  const items = await loadItems();
  return items.find((item) => item.id.toString() === id.toString());
}

export async function addItem(itemData) {
  const items = await loadItems();
  const newItem = {
    id: Math.random() * 100000,
    ...itemData,
    createdAt: Date.now(),
    isFavorite: false,
    reminder: null,
    notificationId: null,
  };
  const updatedItems = [newItem, ...items];
  await saveItems(updatedItems);
  return newItem;
}

export async function updateItem(updatedItem) {
  let items = await loadItems();
  const index = items.findIndex((item) => item.id === updatedItem.id);
  if (index > -1) {
    items[index] = updatedItem;
    await saveItems(items);
  }
  return updatedItem;
}

export async function deleteItem(id) {
  let items = await loadItems();

  // Cancel any scheduled reminder before deleting
  const item = items.find((it) => it.id === id);
  if (item?.notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(item.notificationId);
    } catch (e) {}
  }

  const updatedItems = items.filter((item) => item.id !== id);
  await saveItems(updatedItems);
}

export async function toggleFavorite(id) {
  let items = await loadItems();
  const index = items.findIndex((item) => item.id === id);
  if (index > -1) {
    items[index].isFavorite = !items[index].isFavorite;
    await saveItems(items);
  }
}

export async function resetAllData() {
  await saveItems([]);
}

export function createItem(title, category) {
  return {
    id: uuidv4(),
    title,
    category,
    createdAt: Date.now(),
    isFavorite: false,
    reminder: null,
    notificationId: null,
  };
}

/* ---------------------------------------------- */
/* NOTIFICATION HELPERS */
/* ---------------------------------------------- */

async function scheduleLocalNotification(title, datetime) {
  const triggerDate = new Date(datetime);

  if (triggerDate.getTime() <= Date.now()) {
    throw new Error("Cannot schedule notification in the past.");
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Task Reminder",
      body: title,
      data: { type: "task" },
    },
    trigger: triggerDate,
  });

  return notificationId;
}

/* ---------------------------------------------- */
/* REMINDER FUNCTIONS (THE ONES YOU NEED) */
/* ---------------------------------------------- */

export async function setReminder(id, datetime) {
  let items = await loadItems();
  let item = items.find((it) => it.id === id);

  if (!item) throw new Error("Item not found");

  // Cancel old reminder
  if (item.notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(item.notificationId);
    } catch (e) {}
  }

  const iso = new Date(datetime).toISOString();

  // Schedule new notification
  const notificationId = await scheduleLocalNotification(item.title, iso);

  // Update item
  const updated = items.map((it) =>
    it.id === id
      ? { ...it, reminder: iso, notificationId }
      : it
  );

  await saveItems(updated);

  return { ...item, reminder: iso, notificationId };
}

export async function clearReminder(id) {
  let items = await loadItems();
  let item = items.find((it) => it.id === id);

  if (!item) throw new Error("Item not found");

  if (item.notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(item.notificationId);
    } catch (e) {}
  }

  const updated = items.map((it) =>
    it.id === id
      ? { ...it, reminder: null, notificationId: null }
      : it
  );

  await saveItems(updated);

  return { ...item, reminder: null, notificationId: null };
}
