import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { v4 as uuidv4 } from "react-native-uuid";

const ITEMS_KEY = "taskmate_items_v1";

function normalizeId(value) {
  return value?.toString?.();
}

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

export async function getAllItems() {
  return await loadItems();
}

export async function getItemById(id) {
  const items = await loadItems();
  return items.find((item) => normalizeId(item.id) === normalizeId(id));
}

export async function addItem(itemData) {
  const items = await loadItems();
  const newItem = {
    id: uuidv4(),
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
  const index = items.findIndex((item) => normalizeId(item.id) === normalizeId(updatedItem.id));
  if (index > -1) {
    items[index] = updatedItem;
    await saveItems(items);
  }
  return updatedItem;
}

export async function deleteItem(id) {
  let items = await loadItems();

  const item = items.find((it) => normalizeId(it.id) === normalizeId(id));
  if (item?.notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(item.notificationId);
    } catch (e) {}
  }

  const updatedItems = items.filter((item) => normalizeId(item.id) !== normalizeId(id));
  await saveItems(updatedItems);
}

export async function toggleFavorite(id) {
  let items = await loadItems();
  const index = items.findIndex((item) => normalizeId(item.id) === normalizeId(id));
  if (index > -1) {
    items[index].isFavorite = !items[index].isFavorite;
    await saveItems(items);
  }
}

export async function resetAllData() {
  const items = await loadItems();

  await Promise.all(
    items
      .map((item) => item.notificationId)
      .filter(Boolean)
      .map(async (notificationId) => {
        try {
          await Notifications.cancelScheduledNotificationAsync(notificationId);
        } catch (e) {
          console.log("Failed to cancel notification", e);
        }
      })
  );

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {
    console.log("Failed to cancel all notifications", e);
  }

  await AsyncStorage.removeItem(ITEMS_KEY);
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

export async function setReminder(id, datetime) {
  let items = await loadItems();
  let item = items.find((it) => normalizeId(it.id) === normalizeId(id));

  if (!item) throw new Error("Item not found");

  const permissions = await Notifications.getPermissionsAsync();
  if (permissions.status !== "granted") {
    const next = await Notifications.requestPermissionsAsync();
    if (next.status !== "granted") {
      throw new Error("Notifications permission not granted");
    }
  }

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
    normalizeId(it.id) === normalizeId(id)
      ? { ...it, reminder: iso, notificationId }
      : it
  );

  await saveItems(updated);

  return { ...item, reminder: iso, notificationId };
}

export async function clearReminder(id) {
  let items = await loadItems();
  let item = items.find((it) => normalizeId(it.id) === normalizeId(id));

  if (!item) throw new Error("Item not found");

  if (item.notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(item.notificationId);
    } catch (e) {}
  }

  const updated = items.map((it) =>
    normalizeId(it.id) === normalizeId(id)
      ? { ...it, reminder: null, notificationId: null }
      : it
  );

  await saveItems(updated);

  return { ...item, reminder: null, notificationId: null };
}
