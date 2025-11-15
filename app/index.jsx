import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import temp from '../assets/images/testappp.png';
import MyButton from '../components/MyButton';
import colors from './constants/colors';

export default function Homescreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={temp} style={styles.image} />
      <Text style={styles.title}>Tasku</Text>
      <Text style={styles.subtitle}>Smarter tasks. Sharper focus.</Text>

      <MyButton
        text="Login"
        onPress={() => router.push('/login')}
        style={{ marginTop: 12 }}
      />

      <TouchableOpacity
        style={[styles.button, { marginTop: 12 }]}
        onPress={() => router.push('/tasks')}
      >
        <Text style={styles.buttonText}>Get started (guest)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 160,
    height: 150,
    marginBottom: 20,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: colors.muted,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  buttonText: {
    color: colors.accent,
    fontSize: 16,
  },
});
