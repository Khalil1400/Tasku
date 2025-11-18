import AsyncStorage from "@react-native-async-storage/async-storage";

const globalToken = "datas";

export async function loginMock(email, password) {
  const token = "token_" + Math.random().toString(36).slice(2, 10);
  const profile = { name: email.split("@")[0] || "User", email, avatar: null };
  await AsyncStorage.setItem(globalToken, JSON.stringify(profile));
  return { token, ...profile };
}

export async function getProfile() {
  try {
    const raw = await AsyncStorage.getItem(globalToken);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.log("getProfile error", err);
    return null;
  }
}

export async function saveProfile(profile) {
  try {
    await AsyncStorage.setItem(globalToken, JSON.stringify(profile));
  } catch (err) {
    console.log("saveProfile error", err);
  }
}

export async function logout() {
  try {
    await AsyncStorage.removeItem(globalToken);
  } catch (err) {
    console.log("logout error", err);
  }
}
