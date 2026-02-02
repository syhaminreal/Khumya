// app/store/useEventStore.ts
import { create } from 'zustand';
import api from '../service/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Event type based on backend schema
export interface Event {
  id: number;
  title: string;
  description?: string;
  date: string;
  time: string;
  venue?: string;
  address?: string;
  userId: number;
  vendorId?: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

export interface EventFormData {
  title: string;
  description?: string;
  date: string;
  time: string;
  venue?: string;
  address?: string;
}

interface EventState {
  events: Event[];
  currentEvent: Event | null;
  loading: boolean;
  error: string | null;
}

interface EventActions {
  fetchEvents: () => Promise<void>;
  fetchEventById: (id: number) => Promise<Event | null>;
  createEvent: (data: EventFormData) => Promise<boolean>;
  updateEvent: (id: number, data: Partial<EventFormData>) => Promise<boolean>;
  deleteEvent: (id: number) => Promise<boolean>;
  setCurrentEvent: (event: Event | null) => void;
  clearError: () => void;
}

export const useEventStore = create<EventState & EventActions>((set, get) => ({
  // Initial state
  events: [],
  currentEvent: null,
  loading: false,
  error: null,

  // Fetch all events
  fetchEvents: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/event');
      if (res.data.success) {
        set({ events: res.data.data || [], loading: false });
      } else {
        set({ error: res.data.message || 'Failed to fetch events', loading: false });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch events';
      set({ error: errorMessage, loading: false });
    }
  },

  // Fetch event by ID
  fetchEventById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/event/${id}`);
      if (res.data.success) {
        const event = res.data.data;
        set({ currentEvent: event, loading: false });
        return event;
      }
      set({ error: res.data.message || 'Event not found', loading: false });
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch event';
      set({ error: errorMessage, loading: false });
      return null;
    }
  },

  // Create event
  createEvent: async (data: EventFormData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/event', data);
      if (res.data.success) {
        const newEvent = res.data.data;
        set((state) => ({
          events: [...state.events, newEvent],
          loading: false,
        }));
        return true;
      }
      set({ error: res.data.message || 'Failed to create event', loading: false });
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create event';
      set({ error: errorMessage, loading: false });
      return false;
    }
  },

  // Update event
  updateEvent: async (id: number, data: Partial<EventFormData>) => {
    set({ loading: true, error: null });
    try {
      const res = await api.put(`/event/${id}`, data);
      if (res.data.success) {
        const updatedEvent = res.data.data;
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? updatedEvent : e)),
          currentEvent: state.currentEvent?.id === id ? updatedEvent : state.currentEvent,
          loading: false,
        }));
        return true;
      }
      set({ error: res.data.message || 'Failed to update event', loading: false });
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update event';
      set({ error: errorMessage, loading: false });
      return false;
    }
  },

  // Delete event
  deleteEvent: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const res = await api.delete(`/event/${id}`);
      if (res.data.success) {
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
          currentEvent: state.currentEvent?.id === id ? null : state.currentEvent,
          loading: false,
        }));
        return true;
      }
      set({ error: res.data.message || 'Failed to delete event', loading: false });
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete event';
      set({ error: errorMessage, loading: false });
      return false;
    }
  },

  // Set current event
  setCurrentEvent: (event: Event | null) => {
    set({ currentEvent: event });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
