import AsyncStorage from "@react-native-async-storage/async-storage";

const PROFILE_KEY = "tasku_profile_v1";
const LEGACY_PROFILE_KEY = "datas";

async function readProfile(key) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.log("readProfile error", err);
    return null;
  }
}

export async function loginMock(email, password) {
  const token = "token_" + Math.random().toString(36).slice(2, 10);
  const profile = { name: email.split("@")[0] || "User", email, avatar: null };
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  return { token, ...profile };
}

export async function getProfile() {
  const current = await readProfile(PROFILE_KEY);
  if (current) return current;

  // migrate legacy key if present
  const legacy = await readProfile(LEGACY_PROFILE_KEY);
  if (legacy) {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(legacy));
    await AsyncStorage.removeItem(LEGACY_PROFILE_KEY);
    return legacy;
  }

  return null;
}

export async function saveProfile(profile) {
  try {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    await AsyncStorage.removeItem(LEGACY_PROFILE_KEY);
  } catch (err) {
    console.log("saveProfile error", err);
  }
}

export async function logout() {
  try {
    await AsyncStorage.multiRemove([PROFILE_KEY, LEGACY_PROFILE_KEY]);
  } catch (err) {
    console.log("logout error", err);
  }
}
