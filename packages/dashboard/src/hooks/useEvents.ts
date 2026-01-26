import { useCallback, useEffect, useState } from 'react';
import { TrackingEvent } from '@flowtel/shared';
import { fetchEvents } from '../api/events';

interface UseEventsFilters {
  eventType?: string;
  shopId?: string;
  page?: number;
  limit?: number;
}

interface UseEventsState {
  events: TrackingEvent[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}

interface UseEventsReturn extends UseEventsState {
  setFilters: (filters: UseEventsFilters) => void;
  setPage: (page: number) => void;
  refresh: () => void;
}

const DEFAULT_LIMIT = 20;

export function useEvents(initialFilters?: UseEventsFilters): UseEventsReturn {
  const [filters, setFiltersState] = useState<UseEventsFilters>({
    page: 1,
    limit: DEFAULT_LIMIT,
    ...initialFilters,
  });

  const [state, setState] = useState<UseEventsState>({
    events: [],
    total: 0,
    page: 1,
    limit: DEFAULT_LIMIT,
    totalPages: 0,
    isLoading: true,
    error: null,
  });

  const loadEvents = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetchEvents(filters);
      setState({
        events: response.data,
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to load events',
      }));
    }
  }, [filters]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const setFilters = useCallback((newFilters: UseEventsFilters) => {
    setFiltersState((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page ?? 1,
    }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFiltersState((prev) => ({ ...prev, page }));
  }, []);

  const refresh = useCallback(() => {
    loadEvents();
  }, [loadEvents]);

  return {
    ...state,
    setFilters,
    setPage,
    refresh,
  };
}
