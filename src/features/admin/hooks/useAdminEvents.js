import { useState, useEffect, useCallback } from 'react';
import { fetchEvents, persistEvents, createEventRemote, deleteEventRemote } from '../services/eventsService';
import { DEFAULT_EVENTS, EMPTY_EVENT_FORM } from '../constants/defaults';

/**
 * 【logic 层｜hooks】活动域 Hook（乐观本地更新 + 非阻塞远端同步）。
 * @returns {{
 *   list: Array,
 *   newEvent: object,
 *   setNewEvent: import('react').Dispatch<import('react').SetStateAction<object>>,
 *   addEvent: (e: {preventDefault: () => void}) => void,
 *   remove: (id: string) => void
 * }}
 */
export function useAdminEvents() {
  const [events, setEvents] = useState(DEFAULT_EVENTS);
  const [newEvent, setNewEvent] = useState(EMPTY_EVENT_FORM);

  useEffect(() => {
    let cancelled = false;
    fetchEvents().then(list => {
      if (!cancelled && list.length > 0) setEvents(list);
    });
    return () => { cancelled = true; };
  }, []);

  const addEvent = useCallback((e) => {
    e.preventDefault();
    if (!newEvent.image) {
      alert('Please upload a showcase picture for this event.');
      return;
    }
    if (newEvent.title && newEvent.date && newEvent.location) {
      const eventToSave = {
        title: newEvent.title,
        date: newEvent.date,
        location: newEvent.location,
        desc: newEvent.desc || 'Join our campaign to support the community.',
        type: newEvent.type || 'Drive Campaign',
        rawType: newEvent.rawType || 'drive',
        image: newEvent.image,
        status: newEvent.status || 'upcoming',
      };

      const docId = `evt-${Date.now()}`;

      const updated = [...events, { ...eventToSave, id: docId }];
      setEvents(updated);
      persistEvents(updated);
      setNewEvent(EMPTY_EVENT_FORM);
      createEventRemote(eventToSave);
    }
  }, [events, newEvent]);

  const remove = useCallback((id) => {
    const updated = events.filter(ev => ev.id !== id);
    setEvents(updated);
    persistEvents(updated);
    deleteEventRemote(id);
  }, [events]);

  return { list: events, newEvent, setNewEvent, addEvent, remove };
}
