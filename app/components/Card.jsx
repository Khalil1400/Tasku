import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function Card({ children, onPress }) {
  const isPressable = typeof onPress === "function";
  const Container = isPressable ? TouchableOpacity : View;

  return (
    <Container
      style={styles.card}
      {...(isPressable ? { onPress } : {})}
      activeOpacity={0.7}
    >
      <View>
        {children}
      </View>
    </Container>
  );
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
    shadowRadius: 6
  }
});
