import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function Card({ children, onPress }) {
  const Container = onPress ? TouchableOpacity : View;
  return <Container onPress={onPress} style={styles.card}>{children}</Container>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    margin: 12,
    padding: 12,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
});
