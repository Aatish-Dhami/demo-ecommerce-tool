import { useCallback, useEffect, useRef, useState } from 'react';
import { Stats } from '@flowtel/shared';
import { fetchStats } from '../api/stats';

interface UseStatsOptions {
  shopId?: string;
  autoRefreshInterval?: number;
}

interface UseStatsState {
  stats: Stats | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

interface UseStatsReturn extends UseStatsState {
  refresh: () => void;
  setAutoRefresh: (enabled: boolean) => void;
  isAutoRefreshEnabled: boolean;
}

const DEFAULT_REFRESH_INTERVAL = 30000;

export function useStats(options?: UseStatsOptions): UseStatsReturn {
  const { shopId, autoRefreshInterval = DEFAULT_REFRESH_INTERVAL } =
    options ?? {};

  const [state, setState] = useState<UseStatsState>({
    stats: null,
    isLoading: true,
    error: null,
    lastUpdated: null,
  });

  const [isAutoRefreshEnabled, setAutoRefreshEnabled] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const loadStats = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const stats = await fetchStats({ shopId });
      setState({
        stats,
        isLoading: false,
        error: null,
        lastUpdated: new Date(),
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to load stats',
      }));
    }
  }, [shopId]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    if (isAutoRefreshEnabled && autoRefreshInterval > 0) {
      intervalRef.current = window.setInterval(() => {
        loadStats();
      }, autoRefreshInterval);
    }

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAutoRefreshEnabled, autoRefreshInterval, loadStats]);

  const refresh = useCallback(() => {
    loadStats();
  }, [loadStats]);

  const setAutoRefresh = useCallback((enabled: boolean) => {
    setAutoRefreshEnabled(enabled);
  }, []);

  return {
    ...state,
    refresh,
    setAutoRefresh,
    isAutoRefreshEnabled,
  };
}
