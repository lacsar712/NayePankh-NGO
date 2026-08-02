// Admin logic layer — localStorage adapter
// The ONLY module allowed to touch window.localStorage directly.
// Every other service goes through these helpers so JSON parsing / error
// handling stays consistent and centralized.

export function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[localStore] Failed to parse key "${key}":`, err);
    return fallback;
  }
}

export function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`[localStore] Failed to write key "${key}":`, err);
  }
}

export function readString(key) {
  return localStorage.getItem(key) || '';
}

export function writeString(key, value) {
  localStorage.setItem(key, value);
}

export function removeKey(key) {
  localStorage.removeItem(key);
}
