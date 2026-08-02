// logic: signature/stamp branding asset read/write and file encoding.
import { ADMIN_STORAGE_KEYS } from '../constants/storageKeys';
import { readRaw, writeRaw, removeKey } from './storage';

export const readSignature = () => readRaw(ADMIN_STORAGE_KEYS.SIGNATURE);
export const readStamp = () => readRaw(ADMIN_STORAGE_KEYS.STAMP);

export const writeSignature = (dataUrl) =>
  writeRaw(ADMIN_STORAGE_KEYS.SIGNATURE, dataUrl);
export const writeStamp = (dataUrl) =>
  writeRaw(ADMIN_STORAGE_KEYS.STAMP, dataUrl);

export const resetBrandingAssets = () => {
  removeKey(ADMIN_STORAGE_KEYS.SIGNATURE);
  removeKey(ADMIN_STORAGE_KEYS.STAMP);
};

export const readFileAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
