import { useState, useEffect, useCallback } from 'react';
import { eventsService } from '../services/eventsService';
import { DEFAULT_EVENTS, EMPTY_NEW_EVENT } from '../constants/seedData';

export function useEvents(enabled = true) {
  const [events, setEvents] = useState(DEFAULT_EVENTS);
  const [newEvent, setNewEvent] = useState(EMPTY_NEW_EVENT);
  const [loading, setLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    setLoading(true);
    eventsService
      .fetchEvents()
      .then((list) => {
        if (active) {
          setEvents(list);
          setLoading(false);
        }
      })
      .catch(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [enabled]);

  const handleAddEvent = useCallback(
    (e) => {
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

        const { updatedEvents } = eventsService.createEvent(events, eventToSave);
        setEvents(updatedEvents);
        setNewEvent(EMPTY_NEW_EVENT);
      }
    },
    [events, newEvent]
  );

  const handleDeleteEvent = useCallback((id) => {
    setEvents((prev) => eventsService.deleteEvent(prev, id));
  }, []);

  return {
    events,
    loading,
    newEvent,
    setNewEvent,
    handleAddEvent,
    handleDeleteEvent,
  };
}
