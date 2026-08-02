/** 【logic 层｜services】volunteers 三路合并读取与状态写入适配，仅供 hooks 调用 */
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db, isConfigured } from '../../../firebase/config';
import { ADMIN_COLLECTIONS, ADMIN_STORAGE_KEYS } from '../constants/storageKeys';
import { DEFAULT_VOLUNTEERS } from '../constants/defaults';
import { readJSON, writeJSON } from './localStore';

/**
 * 拉取志愿者列表：Firestore + localStorage + 内置默认数据三路合并。
 * 合并规则（行为保持）：local 记录按 id/email 覆盖远端；默认数据只补缺不覆盖。
 * @returns {Promise<Array>}
 */
export async function fetchVolunteers() {
  let remoteList = [];
  if (isConfigured) {
    try {
      const snap = await getDocs(collection(db, ADMIN_COLLECTIONS.VOLUNTEERS));
      remoteList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.error('Error fetching Firestore volunteers:', err);
    }
  }

  const saved = readJSON(ADMIN_STORAGE_KEYS.VOLUNTEERS, []);
  const combined = [...remoteList];
  saved.forEach(sv => {
    const idx = combined.findIndex(v => v.id === sv.id || v.email === sv.email);
    if (idx !== -1) {
      combined[idx] = { ...combined[idx], ...sv };
    } else {
      combined.push(sv);
    }
  });
  DEFAULT_VOLUNTEERS.forEach(dv => {
    const idx = combined.findIndex(v => v.id === dv.id || v.email === dv.email);
    if (idx === -1) {
      combined.push(dv);
    }
  });
  return combined;
}

/** 将完整志愿者列表持久化到 localStorage（乐观更新的本地镜像） */
export function persistVolunteers(volunteers) {
  writeJSON(ADMIN_STORAGE_KEYS.VOLUNTEERS, volunteers);
}

/**
 * 远端审批/驳回（仅真实 Firestore 文档 id 才写远端；vol-/local- 前缀跳过）。
 * @returns {Promise<boolean>}
 */
export async function setVolunteerStatusRemote(id, status) {
  if (!isConfigured || id.startsWith('vol-') || id.startsWith('local-')) return false;
  try {
    await updateDoc(doc(db, ADMIN_COLLECTIONS.VOLUNTEERS, id), { status });
    return true;
  } catch (err) {
    console.error(`Error setting volunteer ${status} in Firestore:`, err);
    return false;
  }
}
