import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

const REMINDERS_KEY = "tasku_task_reminders";

async function readStore() {
  try {
    const json = await AsyncStorage.getItem(REMINDERS_KEY);
    return json ? JSON.parse(json) : {};
  } catch (err) {
    console.log("read reminder store error", err);
    return {};
  }
}

async function writeStore(map) {
  try {
    await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(map));
  } catch (err) {
    console.log("write reminder store error", err);
  }
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

export async function clearReminder(taskId) {
  const store = await readStore();
  const notifId = store[taskId];
  if (notifId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notifId);
    } catch (err) {
      console.log("cancel notification error", err);
    }
    delete store[taskId];
    await writeStore(store);
  }
}

export async function setReminder(taskId, title, datetime) {
  const iso = new Date(datetime).toISOString();

  await clearReminder(taskId);
  const notificationId = await scheduleLocalNotification(title, iso);

  const store = await readStore();
  store[taskId] = notificationId;
  await writeStore(store);

  return notificationId;
}
