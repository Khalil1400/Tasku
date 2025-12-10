import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

const TASKS_KEY = "tasks";

export async function setReminder(taskId, reminderDate) {
  const json = await AsyncStorage.getItem(TASKS_KEY);
  const tasks = json ? JSON.parse(json) : [];

  const updated = tasks.map(t =>
    t.id === taskId ? { ...t, reminder: reminderDate } : t
  );

  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updated));
}


export async function scheduleTaskReminder(task, datetime) {
  const triggerDate = new Date(datetime);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Task Reminder",
      body: task.title,
    },
    trigger: triggerDate,
  });
}
