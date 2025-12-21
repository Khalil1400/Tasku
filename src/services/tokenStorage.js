import * as SecureStore from "expo-secure-store";

export const TOKEN_KEY = "taskmate_token_v1";

export async function getToken() {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (err) {
    console.log("getToken error", err);
    return null;
  }
}

export async function setToken(token) {
  try {
    if (token) {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  } catch (err) {
    console.log("setToken error", err);
  }
}
