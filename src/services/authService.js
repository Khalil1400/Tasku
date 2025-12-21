import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import { getToken, setToken, TOKEN_KEY } from "./tokenStorage";

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

export async function login(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  await setToken(data.token);
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(data.user));
  return data;
}

export async function register(email, password) {
  const { data } = await api.post("/auth/register", { email, password });
  await setToken(data.token);
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(data.user));
  return data;
}

export async function getProfile() {
  const current = await readProfile(PROFILE_KEY);
  if (current) return current;

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
    await setToken(null);
    await AsyncStorage.multiRemove([PROFILE_KEY, LEGACY_PROFILE_KEY, TOKEN_KEY]);
  } catch (err) {
    console.log("logout error", err);
  }
}

export async function getStoredToken() {
  return await getToken();
}
