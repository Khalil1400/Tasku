import { StyleSheet, View } from "react-native";
import colors from "../constants/colors";

export default function ScreenContainer({ children, style }) {
  return (
    <View style={[styles.container, { backgroundColor: colors.card }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
