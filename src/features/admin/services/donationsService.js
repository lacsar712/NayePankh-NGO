/** 【logic 层｜services】donations 读取与视图字段归一化，仅供 hooks 调用 */
import { collection, getDocs } from 'firebase/firestore';
import { db, isConfigured } from '../../../firebase/config';
import { ADMIN_COLLECTIONS } from '../constants/storageKeys';

/**
 * 拉取捐赠台账并规范化为 Admin 视图模型。
 * 未配置 Firebase 或失败时返回 []，由 hook 回退默认数据。
 * @returns {Promise<Array<{id:string,donor:string,email:string,amount:number,frequency:string,method:string,date:string}>>}
 */
export async function fetchDonations() {
  if (!isConfigured) return [];
  try {
    const snap = await getDocs(collection(db, ADMIN_COLLECTIONS.DONATIONS));
    return snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        donor: data.donor || data.name || data.userEmail?.split('@')[0] || 'Anonymous',
        email: data.email || data.userEmail || 'guest@example.com',
        amount: data.amount || 0,
        frequency: data.frequency || 'one-time',
        method: data.paymentMethod || data.method || 'UPI',
        date: data.timestamp?.toDate
          ? data.timestamp.toDate().toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
      };
    });
  } catch (err) {
    console.error('Error fetching donations:', err);
    return [];
  }
}
