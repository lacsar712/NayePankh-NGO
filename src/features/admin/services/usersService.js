/** 【logic 层｜services】users 集合读写适配（Firestore 配置化降级），仅供 hooks 调用 */
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db, isConfigured } from '../../../firebase/config';
import { ADMIN_COLLECTIONS } from '../constants/storageKeys';

/**
 * 拉取用户列表。未配置 Firebase 或远端为空时返回 []，由 hook 决定回退默认数据。
 * @returns {Promise<Array<{id:string,name:string,email:string,role:string}>>}
 */
export async function fetchUsers() {
  if (!isConfigured) return [];
  try {
    const snap = await getDocs(collection(db, ADMIN_COLLECTIONS.USERS));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('Error fetching users:', err);
    return [];
  }
}

/**
 * 更新用户角色。未配置 Firebase 时为 no-op（纯本地 state 更新由 hook 完成）。
 * @param {string} id
 * @param {'admin'|'user'|'volunteer'} nextRole
 * @returns {Promise<boolean>} 远端是否写入成功（未配置时恒为 false）
 */
export async function updateUserRole(id, nextRole) {
  if (!isConfigured) return false;
  try {
    await updateDoc(doc(db, ADMIN_COLLECTIONS.USERS, id), { role: nextRole });
    return true;
  } catch (err) {
    console.error('Error updating role in Firestore:', err);
    return false;
  }
}
