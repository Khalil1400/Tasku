import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export default function Card({ children, onPress }) {
  const isPressable = typeof onPress === "function";
  const { colors } = useTheme();
  const themedStyles = styles(colors);

  if (isPressable) {
    return (
      <Pressable
        style={({ pressed }) => [
          themedStyles.card,
          pressed && themedStyles.cardPressed,
        ]}
        onPress={onPress}
      >
        <View>{children}</View>
      </Pressable>
    );
  }

  return <View style={themedStyles.card}><View>{children}</View></View>;
}

const styles = (colors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      marginHorizontal: 12,
      marginVertical: 8,
      padding: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      elevation: 3,
      shadowColor: colors.shadow,
      shadowOpacity: 0.25,
      shadowOffset: { width: 0, height: 8 },
      shadowRadius: 14,
    },
    cardPressed: {
      transform: [{ scale: 0.985 }],
      opacity: 0.96,
    },
  });
