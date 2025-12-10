import { useFocusEffect } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import ScreenContainer from "../components/ScreenContainer";
import { getAllItems } from "../services/storageService";

export default function CalendarPage() {
  const [markedDates, setMarkedDates] = useState({});
  const [tasksCount, setTasksCount] = useState(0);

  async function loadMarkedDates() {
    const tasks = await getAllItems();
    const marks = {};

    tasks.forEach((task) => {
      if (task.reminder) {
        const date = new Date(task.reminder);
        const dateStr = date.toISOString().split("T")[0];

        marks[dateStr] = {
          marked: true,
          dotColor: "#3b82f6",
        };
      }
    });

    setMarkedDates(marks);
    setTasksCount(tasks.length);
  }

  useFocusEffect(() => {
    loadMarkedDates();
  });

  return (
    <ScreenContainer>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendar</Text>
        <Text style={styles.headerSubtitle}>
          {tasksCount > 0 ? `You have ${tasksCount} reminders` : "No reminders"}
        </Text>
      </View>

      {/* Calendar */}
      <View style={styles.centerWrapper}>
        <View style={styles.calendarCard}>
          <Calendar
            markedDates={markedDates}
            markingType="dot"
            onDayPress={(day) => console.log("Selected:", day.dateString)}
          />
        </View>
      </View>

    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 15,
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111",
    textAlign: "center",
  },

  headerSubtitle: {
    fontSize: 18,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },

  centerWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 15, // <-- slightly closer than before
  },

  calendarCard: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#fff",
    padding: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
});
