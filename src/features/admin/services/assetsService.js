// Logic service: signature/stamp image upload to localStorage (base64 data URLs).
import { ADMIN_STORAGE_KEYS } from '../constants/storageKeys';
import { readRaw, writeRaw, removeKey } from './storage';

const readFileAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const assetsService = {
  loadSignature() {
    return readRaw(ADMIN_STORAGE_KEYS.SIGNATURE, '');
  },

  loadStamp() {
    return readRaw(ADMIN_STORAGE_KEYS.STAMP, '');
  },

  async uploadSignature(file) {
    const dataUrl = await readFileAsDataURL(file);
    writeRaw(ADMIN_STORAGE_KEYS.SIGNATURE, dataUrl);
    return dataUrl;
  },

  async uploadStamp(file) {
    const dataUrl = await readFileAsDataURL(file);
    writeRaw(ADMIN_STORAGE_KEYS.STAMP, dataUrl);
    return dataUrl;
  },

  resetAssets() {
    removeKey(ADMIN_STORAGE_KEYS.SIGNATURE);
    removeKey(ADMIN_STORAGE_KEYS.STAMP);
  },
};
