// Admin logic layer — Notifications hook
// Consumed directly by NotificationsTab, which only mounts when the
// notifications tab is active — so we read the inbox once on mount instead of
// re-parsing localStorage on every activeTab change in the orchestrator.
import { useState, useEffect, useCallback } from 'react';
import { loadNotifications, clearNotifications } from '../services/notificationsService';

export function useAdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    const logs = loadNotifications();
    setNotifications(logs);
    if (logs.length > 0) setSelectedNotification(logs[0]);
  }, []);

  const clearInbox = useCallback(() => {
    clearNotifications();
    setNotifications([]);
    setSelectedNotification(null);
    alert('Notifications logs cleared successfully!');
  }, []);

  return { notifications, selectedNotification, setSelectedNotification, clearInbox };
}
