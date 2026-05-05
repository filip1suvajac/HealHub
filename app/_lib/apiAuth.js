const LOCAL_USER_KEY = "healhub-user";

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || "Request failed");
  }

  return data;
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;

  const storedUser = window.localStorage.getItem(LOCAL_USER_KEY);
  return storedUser ? JSON.parse(storedUser) : null;
}

export async function login({ password, email }) {
  const data = await requestJson("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  window.localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(data.user));
  return data;
}

export async function getCurrentUser() {
  return getStoredUser();
}

export async function logout() {
  window.localStorage.removeItem(LOCAL_USER_KEY);
}
