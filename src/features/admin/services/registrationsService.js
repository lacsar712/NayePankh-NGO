/** 【logic 层｜services】eventRegistrations 合并读取、删除与出席标记适配，仅供 hooks 调用 */
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, isConfigured } from '../../../firebase/config';
import { ADMIN_COLLECTIONS, ADMIN_STORAGE_KEYS } from '../constants/storageKeys';
import { readJSON, writeJSON } from './localStore';

/**
 * 拉取活动报名：Firestore + localStorage 合并。
 * 去重规则（行为保持）：id 相同，或 eventId+email 相同视为同一条。
 * @returns {Promise<Array>}
 */
export async function fetchRegistrations() {
  let remoteList = [];
  if (isConfigured) {
    try {
      const snap = await getDocs(collection(db, ADMIN_COLLECTIONS.EVENT_REGISTRATIONS));
      remoteList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.error('Error fetching Firestore registrations:', err);
    }
  }

  const saved = readJSON(ADMIN_STORAGE_KEYS.EVENT_REGISTRATIONS, []);
  const combined = [...remoteList];
  saved.forEach(s => {
    if (!combined.some(c => c.id === s.id || (c.eventId === s.eventId && c.email === s.email))) {
      combined.push(s);
    }
  });
  return combined;
}

/** 持久化报名列表到 localStorage */
export function persistRegistrations(registrations) {
  writeJSON(ADMIN_STORAGE_KEYS.EVENT_REGISTRATIONS, registrations);
}

/**
 * 远端删除报名。仅配置 Firebase 时调用；失败返回 false 由 hook 决定是否回退。
 * @returns {Promise<boolean>}
 */
export async function deleteRegistrationRemote(id) {
  if (!isConfigured) return false;
  try {
    await deleteDoc(doc(db, ADMIN_COLLECTIONS.EVENT_REGISTRATIONS, id));
    return true;
  } catch (err) {
    console.error('Error deleting registration in Firestore:', err);
    return false;
  }
}

/**
 * 远端标记出席（仅真实 Firestore 文档 id 才写；local- 前缀跳过）。
 * @returns {Promise<boolean>}
 */
export async function markAttendedRemote(id) {
  if (!isConfigured || !id || String(id).startsWith('local-')) return false;
  try {
    await updateDoc(doc(db, ADMIN_COLLECTIONS.EVENT_REGISTRATIONS, id), { status: 'attended' });
    return true;
  } catch (err) {
    console.error('Error marking attended in Firestore:', err);
    return false;
  }
}
