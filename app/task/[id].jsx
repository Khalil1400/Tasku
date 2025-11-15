import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import MyButton from '../../components/MyButton';
import colors from '../constants/colors';
import { deleteItem, getAllItems, updateItem } from '../services/storageService';

export default function TaskDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load selected task
  useEffect(() => {
    async function loadItem() {
      try {
        setLoading(true);
        const all = await getAllItems();
        const found = all.find((t) => t.id === id);
        setItem(found || null);
      } catch (error) {
        console.error('Failed to load task', error);
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Task not found.</Text>
        <MyButton text="Back" onPress={() => router.back()} />
      </View>
    );
  }

  async function handleDelete() {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteItem(item.id);
            router.replace('/tasks');
          },
        },
      ]
    );
  }

  async function toggleFavorite() {
    const updated = { ...item, isFavorite: !item.isFavorite };
    await updateItem(updated);
    setItem(updated);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.title}</Text>

      {item.category && (
        <Text style={styles.category}>Category: {item.category}</Text>
      )}

      <Text style={styles.date}>
        Created: {new Date(item.createdAt).toLocaleString()}
      </Text>

      <View style={{ height: 30 }} />

      <MyButton
        text={item.isFavorite ? 'Unfavorite' : 'Favorite'}
        onPress={toggleFavorite}
      />

      <MyButton
        text="Edit Task"
        onPress={() => router.push(`/edit?id=${item.id}`)}
        style={{ marginTop: 12 }}
      />

      <MyButton
        text="Delete Task"
        onPress={handleDelete}
        style={{ marginTop: 12 }}
        danger
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBg,
    padding: 20,
  },
  center: {
    flex: 1,
    backgroundColor: colors.darkBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFound: {
    color: colors.text,
    fontSize: 20,
    marginBottom: 20,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '700',
  },
  category: {
    color: colors.accent,
    fontSize: 18,
    marginTop: 8,
  },
  date: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 12,
  },
});
