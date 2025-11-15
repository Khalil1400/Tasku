import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'findit_token_v1';
const USER_KEY = 'findit_user_v1';

export async function loginMock({ email, password }) {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  const token = `mock-token:${Date.now()}`;
  await SecureStore.setItemAsync(TOKEN_KEY, token);

  const profile = {
    email,
    displayName: email.split('@')[0] || 'User',
    avatar: null,
  };

  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(profile));

  return { token, profile };
}

export async function getToken() {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function getProfile() {
  const raw = await SecureStore.getItemAsync(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function logout() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
}
