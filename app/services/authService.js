import AsyncStorage from "@react-native-async-storage/async-storage";

const PROFILE_KEY = "taskmate_profile_v1";

export async function loginMock(email, password) {
  const token = "token_" + Math.random().toString(36).slice(2, 10);
  const profile = { name: email.split("@")[0] || "User", email, avatar: null };
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  return { token, ...profile };
}

export async function getProfile() {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.log("getProfile error", err);
    return null;
  }
}

export async function saveProfile(profile) {
  try {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.log("saveProfile error", err);
  }
}

export async function logout() {
  try {
    await AsyncStorage.removeItem(PROFILE_KEY);
  } catch (err) {
    console.log("logout error", err);
  }
}
