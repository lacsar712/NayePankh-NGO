import { useState, useEffect, useCallback } from 'react';
import { fetchNotifications, clearNotifications } from '../services/notificationsService';

/**
 * 【logic 层｜hooks】通知日志域 Hook。
 * 读取时机（第 2 轮优化）：仅在进入 notifications Tab 时读取一次本地日志，
 * 切换到其它 Tab 不再重复 JSON.parse；选中项在离开期间保持。
 * @param {string} activeTab 当前激活 Tab
 * @returns {{
 *   list: Array,
 *   selected: object|null,
 *   select: (notif: object|null) => void,
 *   clear: () => void
 * }}
 */
export function useAdminNotifications(activeTab) {
  const [notifications, setNotifications] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (activeTab !== 'notifications') return;
    const logs = fetchNotifications();
    setNotifications(logs);
    setSelected(prev => (logs.length > 0 && !prev ? logs[0] : prev));
  }, [activeTab]);

  const clear = useCallback(() => {
    clearNotifications();
    setNotifications([]);
    setSelected(null);
    alert('Notifications logs cleared successfully!');
  }, []);

  return { list: notifications, selected, select: setSelected, clear };
}
