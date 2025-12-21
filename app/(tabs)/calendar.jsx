import { useFocusEffect } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { ScreenContainer } from "../ui";
import typography from "../constants/typography";
import { useTheme } from "../contexts/ThemeContext";
import { getAllItems } from "../services/storageService";

export default function CalendarPage() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [markedDates, setMarkedDates] = useState({});
  const [tasksCount, setTasksCount] = useState(0);
  const [upcoming, setUpcoming] = useState([]);

  async function loadMarkedDates() {
    const tasks = await getAllItems();
    const marks = {};

    tasks.forEach((task) => {
      if (task.reminder) {
        const date = new Date(task.reminder);
        const dateStr = date.toISOString().split("T")[0];

        marks[dateStr] = {
          marked: true,
          dotColor: colors.accent,
        };
      }
    });

    const reminderCount = tasks.filter((t) => t.reminder).length;
    setTasksCount(reminderCount);

    const upcomingReminders = tasks
      .filter((t) => t.reminder && new Date(t.reminder) >= new Date())
      .sort((a, b) => new Date(a.reminder) - new Date(b.reminder))
      .slice(0, 5);
    setUpcoming(upcomingReminders);

    setMarkedDates(marks);
  }

  useFocusEffect(() => {
    loadMarkedDates();
  });

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendar</Text>
        <Text style={styles.headerSubtitle}>
          {tasksCount > 0 ? `You have ${tasksCount} reminders` : "No reminders"}
        </Text>
      </View>

      <View style={styles.centerWrapper}>
        <View style={styles.calendarCard}>
          <Calendar
            markedDates={markedDates}
            markingType="dot"
            onDayPress={(day) => console.log("Selected:", day.dateString)}
            style={styles.calendar}
            theme={{
              backgroundColor: colors.background,
              calendarBackground: colors.card,
              textSectionTitleColor: colors.textSecondary,
              monthTextColor: colors.text,
              dayTextColor: colors.text,
              todayTextColor: colors.primary,
              todayBackgroundColor: colors.cardMuted,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: "#fff",
              arrowColor: colors.primary,
              agendaDayTextColor: colors.textSecondary,
              agendaDayNumColor: colors.text,
              agendaTodayColor: colors.primary,
              textDisabledColor: colors.textSecondary,
              stylesheet: {
                day: {
                  basic: {
                    base: {
                      height: 42,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: colors.card,
                    },
                    text: { color: colors.text, fontFamily: typography.medium },
                  },
                },
                calendar: {
                  main: {
                    backgroundColor: colors.card,
                    borderRadius: 12,
                  },
                  week: {
                    marginTop: 2,
                    marginBottom: 2,
                    flexDirection: "row",
                    justifyContent: "space-around",
                  },
                },
              },
            }}
          />
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Reminders</Text>
            <Text style={styles.statValue}>{tasksCount}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Upcoming</Text>
            <Text style={styles.statValue}>{upcoming.length}</Text>
          </View>
        </View>

        <View style={styles.listCard}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Upcoming reminders</Text>
            <Text style={styles.listSubtitle}>{upcoming.length > 0 ? "Next 5" : "Nothing scheduled"}</Text>
          </View>
          {upcoming.length === 0 ? (
            <Text style={styles.empty}>Plan a reminder to see it here.</Text>
          ) : (
            upcoming.map((item) => {
              const dateObj = new Date(item.reminder);
              const dateStr = dateObj.toLocaleDateString(undefined, { month: "short", day: "numeric" });
              const timeStr = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
              return (
                <View key={item.id} style={styles.listItem}>
                  <View style={styles.bullet} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemMeta}>{dateStr} • {timeStr}</Text>
                  </View>
                  <Text style={styles.itemCategory}>{item.category || "General"}</Text>
                </View>
              );
            })
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    header: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 10,
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "800",
      fontFamily: typography.bold,
      color: colors.text,
      textAlign: "center",
    },
    headerSubtitle: {
      fontSize: 15,
      color: colors.textSecondary,
      marginTop: 6,
      textAlign: "center",
      fontFamily: typography.medium,
    },
    centerWrapper: {
      flex: 1,
      paddingHorizontal: 16,
      marginTop: 10,
    },
    calendarCard: {
      width: "100%",
      borderRadius: 16,
      backgroundColor: colors.card,
      padding: 10,
      borderWidth: 1,
      borderColor: colors.border,
      elevation: 3,
      shadowColor: colors.shadow,
      shadowOpacity: 0.2,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
    },
    calendar: { backgroundColor: colors.card, borderRadius: 12 },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 12,
      gap: 10,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
    },
    statLabel: { color: colors.textSecondary, fontFamily: typography.medium, fontSize: 13 },
    statValue: { color: colors.text, fontFamily: typography.bold, fontSize: 20, marginTop: 4 },
    listCard: {
      marginTop: 14,
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      shadowColor: colors.shadow,
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
    },
    listHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
    listTitle: { fontSize: 16, fontFamily: typography.semibold, color: colors.text },
    listSubtitle: { fontSize: 13, fontFamily: typography.medium, color: colors.textSecondary },
    empty: { color: colors.textSecondary, fontFamily: typography.medium, paddingVertical: 6 },
    listItem: { flexDirection: "row", alignItems: "center", paddingVertical: 8, gap: 10 },
    bullet: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.accent,
    },
    itemTitle: { color: colors.text, fontFamily: typography.semibold, fontSize: 15 },
    itemMeta: { color: colors.textSecondary, fontFamily: typography.medium, fontSize: 13, marginTop: 2 },
    itemCategory: { color: colors.textSecondary, fontFamily: typography.medium, fontSize: 12 },
  });
