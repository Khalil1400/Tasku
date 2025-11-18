import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "react-native-uuid";

const ITEMS_KEY = "taskmate_items_v1";

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
  return items.find((item) => item.id.toString() === id.toString());
}

export async function addItem(itemData) {
  const items = await loadItems();
  const newItem = {
    id: Math.random() * 100000,
    ...itemData,
    createdAt: Date.now(),
    isFavorite: false,
  };
  const updatedItems = [newItem, ...items];
  console.log(updatedItems)
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
  };
}
