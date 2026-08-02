// Admin logic layer — Events hook
import { useCallback } from 'react';
import { useCollectionLoader } from './useCollectionLoader';
import { loadEvents, createEvent, deleteEvent, DEFAULT_EVENTS } from '../services/eventsService';

export function useAdminEvents() {
  const { data: events, setData: setEvents, loading } = useCollectionLoader(loadEvents, {
    initialData: DEFAULT_EVENTS,
    keepInitialWhenEmpty: true,
  });

  const addEvent = useCallback((eventToSave) => {
    const docId = `evt-${Date.now()}`;
    setEvents((prev) => {
      const updated = [...prev, { ...eventToSave, id: docId }];
      createEvent(updated, eventToSave);
      return updated;
    });
  }, [setEvents]);

  const removeEvent = useCallback((id) => {
    setEvents((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      deleteEvent(updated, id);
      return updated;
    });
  }, [setEvents]);

  return { events, loading, addEvent, removeEvent };
}
