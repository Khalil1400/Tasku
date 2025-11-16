import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import MyButton from "../components/MyButton";
import ScreenContainer from "../components/ScreenContainer";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const { user, updateProfile, signOut } = useAuth();
  const [loadingImage, setLoadingImage] = useState(false);

  async function changeAvatar() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return alert("Permission denied");
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7
    });
    if (!res.canceled && res.assets && res.assets[0]) {
      setLoadingImage(true);
      await updateProfile({ avatar: res.assets[0].uri });
      setLoadingImage(false);
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.center}>
        <Image source={{ uri: user?.avatar || "https://picsum.photos/200" }} style={styles.avatar} />
        <Text style={styles.name}>{user?.name || "Anonymous"}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <MyButton text="Change Avatar" onPress={changeAvatar} />
        <MyButton text="Logout" variant="secondary" onPress={signOut} style={{ marginTop: 12 }} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: "center", padding: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 12 },
  name: { fontSize: 18, fontWeight: "700" },
  email: { color: "#666", marginBottom: 12 },
});
