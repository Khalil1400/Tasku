import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';
import MyButton from '../components/MyButton';
import colors from './constants/colors';

export default function SettingsScreen() {
  const [dark, setDark] = useState(false);

  async function resetAll() {
    Alert.alert('Reset App', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch value={dark} onValueChange={setDark} />
      </View>

      <MyButton text="Reset App Data" onPress={resetAll} danger style={{ marginTop: 20 }} />

      <Text style={styles.about}>Tasku v1.0 — made with Expo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.darkBg, padding: 20 },
  header: { fontSize: 24, color: colors.text, fontWeight: '700', marginBottom: 20 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1b1b1b',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  label: { color: colors.text, fontSize: 16 },
  about: { color: colors.muted, marginTop: 40, textAlign: 'center' },
});
