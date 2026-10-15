/**
 * Read-only client for the public Skate Results API (https://api.skateresults.app, OpenAPI in
 * github.com/skateresults/api-client). The API allows cross-origin requests, so the UI calls it
 * directly and the extension needs no backend.
 */
import { queryOptions } from '@tanstack/react-query';
import { useSyncExternalStore } from 'react';
import type { CommonWorkspaceId, EventId } from '@graphite-sports/sdk';

const API_URL = 'https://api.skateresults.app';

export interface SkateResultsEvent {
  id: string;
  slug: string;
  name: string;
  dateBegin: string;
  dateEnd: string;
  address?: { addressLines?: string[]; postalCode?: string; city?: string; country?: string };
}

export interface AgeGroup {
  id: string;
  name: string;
  gender: 'male' | 'female' | null;
  competitions: Competition[];
}

export interface Competition {
  id: string;
  name: string;
  rounds: { id: string; name: string; done: boolean }[];
}

export const eventsQO = () =>
  queryOptions({
    queryKey: ['skateresults', 'events'],
    queryFn: async () => (await get<{ items: SkateResultsEvent[] }>('/events')).items.sort((a, b) => b.dateBegin.localeCompare(a.dateBegin)),
    staleTime: 5 * 60_000,
  });

export const eventQO = (id: string) =>
  queryOptions({ queryKey: ['skateresults', 'events', id], queryFn: () => get<SkateResultsEvent>(`/events/${id}`), staleTime: 5 * 60_000 });

export const ageGroupsQO = (id: string) =>
  queryOptions({
    queryKey: ['skateresults', 'events', id, 'age-groups'],
    queryFn: async () => (await get<{ items: AgeGroup[] }>(`/events/${id}/age-groups`)).items,
    staleTime: 60_000,
  });

/**
 * The Skate Results event an engine event is linked to. Stored in this browser only, until the
 * extension gets a backend to keep it with the event.
 */
export function useLinkedEvent(workspaceId: CommonWorkspaceId, eventId: EventId) {
  const key = `skateresults:linked-event:${workspaceId}:${eventId}`;
  const linked = useSyncExternalStore(subscribe, () => readStorage(key));
  const setLinked = (id: string | null) => {
    try {
      if (id) localStorage.setItem(key, id);
      else localStorage.removeItem(key);
    } catch {
      // Storage blocked by the browser: nothing to persist to.
    }
    window.dispatchEvent(new Event(LINK_CHANGED));
  };
  return [linked, setLinked] as const;
}

async function get<T>(path: string): Promise<T> {
  const response = await fetch(API_URL + path);
  if (!response.ok) throw new Error(`Skate Results ${path}: ${response.status}`);
  return response.json();
}

const LINK_CHANGED = 'skateresults-link-changed';

function subscribe(onChange: () => void) {
  window.addEventListener(LINK_CHANGED, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(LINK_CHANGED, onChange);
    window.removeEventListener('storage', onChange);
  };
}

function readStorage(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
