// logic: safe localStorage read/write/remove adapter (JSON + raw).
import { ADMIN_STORAGE_KEYS, LOCAL_EVENTS_UPDATE_EVENT } from '../constants/storageKeys';

export const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.error(`[storage] Failed to read ${key}:`, err);
    return fallback;
  }
};

export const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`[storage] Failed to write ${key}:`, err);
    return false;
  }
};

export const removeKey = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (err) {
    console.error(`[storage] Failed to remove ${key}:`, err);
    return false;
  }
};

export const readRaw = (key) => {
  try {
    return localStorage.getItem(key) || '';
  } catch (err) {
    console.error(`[storage] Failed to read raw ${key}:`, err);
    return '';
  }
};

export const writeRaw = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err) {
    console.error(`[storage] Failed to write raw ${key}:`, err);
    return false;
  }
};

export const dispatchLocalEventsUpdate = () => {
  window.dispatchEvent(new Event(LOCAL_EVENTS_UPDATE_EVENT));
};

export const storageKeys = ADMIN_STORAGE_KEYS;
