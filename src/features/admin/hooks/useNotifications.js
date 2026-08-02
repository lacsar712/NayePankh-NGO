// Logic hook: lazily reads admin notification logs only when the notifications
// tab is active, and refreshes on cross-tab storage events.
import { useState, useEffect, useCallback, useRef } from 'react';
import { notificationsService } from '../services/notificationsService';
import { ADMIN_STORAGE_KEYS } from '../constants/storageKeys';
import { TAB_IDS } from '../constants/tabs';

export function useNotifications(activeTab) {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const hasLoadedRef = useRef(false);

  const reload = useCallback(() => {
    const logs = notificationsService.fetchNotifications();
    setNotifications(logs);
    if (logs.length > 0) {
      setSelectedNotification((prev) => prev || logs[0]);
    } else {
      setSelectedNotification(null);
    }
    return logs;
  }, []);

  useEffect(() => {
    if (activeTab !== TAB_IDS.NOTIFICATIONS) return;
    setLoading(true);
    reload();
    hasLoadedRef.current = true;
    setLoading(false);
  }, [activeTab, reload]);

  useEffect(() => {
    if (activeTab !== TAB_IDS.NOTIFICATIONS) return;
    const handleStorage = (e) => {
      if (e.key === ADMIN_STORAGE_KEYS.ADMIN_NOTIFICATIONS) {
        reload();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [activeTab, reload]);

  const handleClearNotifications = useCallback(() => {
    notificationsService.clearNotifications();
    setNotifications([]);
    setSelectedNotification(null);
    alert('Notifications logs cleared successfully!');
  }, []);

  return {
    notifications,
    selectedNotification,
    setSelectedNotification,
    notificationsLoading: loading,
    notificationsLoaded: hasLoadedRef.current,
    reloadNotifications: reload,
    handleClearNotifications,
  };
}
