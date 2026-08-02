// Logic: safe localStorage read/write helpers used by all domain services.
import { ADMIN_STORAGE_KEYS } from '../constants/storageKeys';

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
  } catch (err) {
    console.error(`[storage] Failed to write ${key}:`, err);
  }
};

export const removeKey = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(`[storage] Failed to remove ${key}:`, err);
  }
};

export const readRaw = (key, fallback = '') => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch (err) {
    console.error(`[storage] Failed to read raw ${key}:`, err);
    return fallback;
  }
};

export const writeRaw = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.error(`[storage] Failed to write raw ${key}:`, err);
  }
};

export { ADMIN_STORAGE_KEYS };
