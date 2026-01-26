import { Stats } from '@flowtel/shared';
import { apiClient } from './client';

interface StatsQueryParams {
  shopId?: string;
}

export async function fetchStats(params?: StatsQueryParams): Promise<Stats> {
  const searchParams = new URLSearchParams();

  if (params?.shopId) {
    searchParams.append('shopId', params.shopId);
  }

  const queryString = searchParams.toString();
  const endpoint = `/api/stats${queryString ? `?${queryString}` : ''}`;

  return apiClient<Stats>(endpoint);
}
