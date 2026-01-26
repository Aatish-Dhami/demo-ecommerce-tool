import { useCallback, useEffect, useState } from 'react';
import { Insight, InsightType } from '@flowtel/shared';
import { fetchInsights, generateInsights, InsightsQueryDto } from '../api/insights';

interface UseInsightsFilters {
  type?: InsightType;
  page?: number;
  limit?: number;
}

interface UseInsightsState {
  insights: Insight[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
}

interface UseInsightsReturn extends UseInsightsState {
  setFilters: (filters: UseInsightsFilters) => void;
  setPage: (page: number) => void;
  refresh: () => void;
  generate: () => Promise<void>;
}

const DEFAULT_LIMIT = 10;

export function useInsights(initialFilters?: UseInsightsFilters): UseInsightsReturn {
  const [filters, setFiltersState] = useState<InsightsQueryDto>({
    page: 1,
    limit: DEFAULT_LIMIT,
    ...initialFilters,
  });

  const [state, setState] = useState<UseInsightsState>({
    insights: [],
    total: 0,
    page: 1,
    limit: DEFAULT_LIMIT,
    totalPages: 0,
    isLoading: true,
    isGenerating: false,
    error: null,
  });

  const loadInsights = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetchInsights(filters);
      setState({
        insights: response.data,
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
        isLoading: false,
        isGenerating: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to load insights',
      }));
    }
  }, [filters]);

  useEffect(() => {
    loadInsights();
  }, [loadInsights]);

  const setFilters = useCallback((newFilters: UseInsightsFilters) => {
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
    loadInsights();
  }, [loadInsights]);

  const generate = useCallback(async () => {
    setState((prev) => ({ ...prev, isGenerating: true, error: null }));

    try {
      await generateInsights();
      await loadInsights();
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isGenerating: false,
        error: err instanceof Error ? err.message : 'Failed to generate insights',
      }));
    }
  }, [loadInsights]);

  return {
    ...state,
    setFilters,
    setPage,
    refresh,
    generate,
  };
}
