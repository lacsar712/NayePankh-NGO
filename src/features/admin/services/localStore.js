/**
 * 【logic 层｜services】localStorage 读写适配（仅限 services 层内部使用）。
 * 页面/展示组件禁止直接调用 localStorage。
 */
export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeKey(key) {
  localStorage.removeItem(key);
}

export function readString(key, fallback = '') {
  return localStorage.getItem(key) || fallback;
}

export function writeString(key, value) {
  localStorage.setItem(key, value);
}
