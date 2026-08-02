/** 【logic 层｜services】certificates 合并读取、签发双写与品牌资产读写适配，仅供 hooks 调用 */
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, isConfigured } from '../../../firebase/config';
import { ADMIN_COLLECTIONS, ADMIN_STORAGE_KEYS } from '../constants/storageKeys';
import { readJSON, writeJSON, readString, writeString, removeKey } from './localStore';

/**
 * 拉取证书台账：Firestore + localStorage 按 certificateId 去重合并（行为保持）。
 * @returns {Promise<Array>}
 */
export async function fetchCertificates() {
  let remoteList = [];
  if (isConfigured) {
    try {
      const snap = await getDocs(collection(db, ADMIN_COLLECTIONS.CERTIFICATES));
      remoteList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.error('Error fetching Firestore certificates:', err);
    }
  }

  const saved = readJSON(ADMIN_STORAGE_KEYS.CERTIFICATES, []);
  const combined = [...remoteList];
  saved.forEach(sc => {
    if (!combined.some(c => c.certificateId === sc.certificateId)) {
      combined.push(sc);
    }
  });
  return combined;
}

/**
 * 签发证书：配置 Firebase 时写 certificates 集合；同时始终追加本地镜像。
 * @param {object} certData 证书视图模型（certificateId/name/email/eventId/eventTitle/date/hours/signatureUrl/stampUrl 等）
 * @returns {Promise<object>} 入参原样返回，便于调用方更新 state
 */
export async function issueCertificate(certData) {
  if (isConfigured) {
    try {
      await addDoc(collection(db, ADMIN_COLLECTIONS.CERTIFICATES), {
        ...certData,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error creating certificate in Firestore:', err);
    }
  }

  const saved = readJSON(ADMIN_STORAGE_KEYS.CERTIFICATES, []);
  saved.push(certData);
  writeJSON(ADMIN_STORAGE_KEYS.CERTIFICATES, saved);
  return certData;
}

/** 读取证书品牌资产（签名/章 dataURL） */
export function getBrandingAssets() {
  return {
    signature: readString(ADMIN_STORAGE_KEYS.SIGNATURE),
    stamp: readString(ADMIN_STORAGE_KEYS.STAMP),
  };
}

/** 保存品牌资产；kind: 'signature' | 'stamp' */
export function saveBrandingAsset(kind, dataUrl) {
  writeString(kind === 'signature' ? ADMIN_STORAGE_KEYS.SIGNATURE : ADMIN_STORAGE_KEYS.STAMP, dataUrl);
}

/** 清除品牌资产，回退默认展示 */
export function resetBrandingAssets() {
  removeKey(ADMIN_STORAGE_KEYS.SIGNATURE);
  removeKey(ADMIN_STORAGE_KEYS.STAMP);
}
