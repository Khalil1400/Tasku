import { Platform } from "react-native";

const base = Platform.select({
  ios: "Avenir Next",
  android: "sans-serif",
  default: "sans-serif",
});

const medium = Platform.select({
  ios: "AvenirNext-Medium",
  android: "sans-serif-medium",
  default: "sans-serif",
});

const semibold = Platform.select({
  ios: "AvenirNext-DemiBold",
  android: "sans-serif-medium",
  default: "sans-serif",
});

const bold = Platform.select({
  ios: "AvenirNext-Bold",
  android: "sans-serif-bold",
  default: "sans-serif",
});

export default {
  regular: base,
  medium,
  semibold,
  bold,
};
