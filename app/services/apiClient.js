const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || "http://localhost:3000";

let authToken = null;
let onUnauthorized = null;

export function setAuthToken(token) {
  authToken = token || null;
}

export function clearAuthToken() {
  authToken = null;
}

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

export async function request(path, { method = "GET", body, headers, ...rest } = {}) {
  const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const finalHeaders = {
    Accept: "application/json",
    ...(body ? { "Content-Type": "application/json" } : {}),
    ...(headers || {}),
  };

  if (authToken && !finalHeaders.Authorization) {
    finalHeaders.Authorization = `Bearer ${authToken}`;
  }

  let response;
  try {
    response = await fetch(url, {
      method,
      ...rest,
      headers: finalHeaders,
      body: body && typeof body !== "string" ? JSON.stringify(body) : body,
    });
  } catch (err) {
    throw new Error(err?.message || "Network request failed");
  }

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (err) {
      // leave data as null if parsing fails
    }
  }

  if (response.status === 401 && onUnauthorized) {
    onUnauthorized();
  }

  if (!response.ok) {
    const error = new Error(data?.error || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.details = data?.details;
    throw error;
  }

  return data;
}
