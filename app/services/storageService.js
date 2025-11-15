// app/services/storageService.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const ITEMS_KEY = "findit_items_v1";

async function safeGetRaw(key) {
  try {
    return await AsyncStorage.getItem(key);
  } catch (err) {
    console.log("AsyncStorage get error for", key, err);
    return null;
  }
}

async function safeSetRaw(key, value) {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (err) {
    console.log("AsyncStorage set error for", key, err);
    return false;
  }
}

export async function getAllItems() {
  const raw = await safeGetRaw(ITEMS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.log("getAllItems JSON parse error", err);
    return [];
  }
}

export async function saveAllItems(items = []) {
  return await safeSetRaw(ITEMS_KEY, JSON.stringify(items));
}

export async function addItem(item) {
  try {
    const items = await getAllItems();
    const newItem = { ...item, id: item.id ?? String(Date.now()) };
    items.unshift(newItem);
    await saveAllItems(items);
    return newItem;
  } catch (err) {
    console.log("addItem error", err);
    throw err;
  }
}

// alias some previously used names
export async function saveItem(item) {
  return addItem(item);
}

export async function getItemById(id) {
  const items = await getAllItems();
  return items.find((i) => i.id === id) || null;
}

export async function updateItem(itemOrId, patch) {
  try {
    const items = await getAllItems();
    let updated;
    if (typeof itemOrId === "string") {
      updated = items.map((i) => (i.id === itemOrId ? { ...i, ...patch } : i));
    } else {
      updated = items.map((i) => (i.id === itemOrId.id ? { ...i, ...itemOrId } : i));
    }
    await saveAllItems(updated);
    return true;
  } catch (err) {
    console.log("updateItem error", err);
    throw err;
  }
}

export async function deleteItem(id) {
  try {
    const items = await getAllItems();
    const filtered = items.filter((i) => i.id !== id);
    await saveAllItems(filtered);
    return true;
  } catch (err) {
    console.log("deleteItem error", err);
    throw err;
  }
}
