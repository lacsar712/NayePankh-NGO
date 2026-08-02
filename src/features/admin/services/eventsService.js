/** 【logic 层｜services】events 合并读取、本地持久化+广播、远端增删适配，仅供 hooks 调用 */
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, isConfigured } from '../../../firebase/config';
import { ADMIN_COLLECTIONS, ADMIN_STORAGE_KEYS, ADMIN_EVENTS_UPDATED_EVENT } from '../constants/storageKeys';
import { DEFAULT_EVENTS } from '../constants/defaults';
import { readJSON, writeJSON } from './localStore';

/**
 * 拉取活动列表：Firestore + localStorage + 内置默认活动三路合并（行为保持）。
 * @returns {Promise<Array>}
 */
export async function fetchEvents() {
  let remoteList = [];
  if (isConfigured) {
    try {
      const snap = await getDocs(collection(db, ADMIN_COLLECTIONS.EVENTS));
      remoteList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.error('Error fetching Firestore events:', err);
    }
  }

  const saved = readJSON(ADMIN_STORAGE_KEYS.EVENTS, []);
  const combined = [...remoteList];
  saved.forEach(se => {
    if (!combined.some(e => e.id === se.id)) combined.push(se);
  });
  DEFAULT_EVENTS.forEach(de => {
    if (!combined.some(e => e.id === de.id || e.title === de.title)) combined.push(de);
  });
  return combined;
}

/** 持久化活动列表到 localStorage，并广播更新事件（Events 页监听同名事件） */
export function persistEvents(events) {
  writeJSON(ADMIN_STORAGE_KEYS.EVENTS, events);
  window.dispatchEvent(new Event(ADMIN_EVENTS_UPDATED_EVENT));
}

/**
 * 非阻塞写 Firestore 新活动（本地乐观 id 与远端 doc id 有意分离，行为保持）。
 * @param {object} eventToSave 不含 id 的活动字段
 */
export function createEventRemote(eventToSave) {
  if (!isConfigured) return;
  addDoc(collection(db, ADMIN_COLLECTIONS.EVENTS), {
    ...eventToSave,
    timestamp: serverTimestamp(),
  })
    .then(docRef => console.log('Event created in Firestore with ID:', docRef.id))
    .catch(err => console.error('Error creating event in Firestore:', err));
}

/** 仅真实 Firestore 文档 id 允许远端删除（本地/默认活动跳过） */
export function canDeleteEventRemote(id) {
  return (
    isConfigured &&
    !id.startsWith('evt-') &&
    !id.startsWith('local-') &&
    !DEFAULT_EVENTS.some(de => de.id === id)
  );
}

/** 非阻塞远端删除 */
export function deleteEventRemote(id) {
  if (!canDeleteEventRemote(id)) return;
  deleteDoc(doc(db, ADMIN_COLLECTIONS.EVENTS, id))
    .then(() => console.log('Event deleted from Firestore'))
    .catch(err => console.error('Error deleting event in Firestore:', err));
}
