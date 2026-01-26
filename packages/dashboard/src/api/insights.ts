import { Insight, InsightGenerateRequestDto, InsightType, PaginatedResponseDto } from '@flowtel/shared';
import { apiClient } from './client';

export interface InsightsQueryDto {
  type?: InsightType;
  page?: number;
  limit?: number;
}

export async function fetchInsights(
  filters: InsightsQueryDto = {},
): Promise<PaginatedResponseDto<Insight>> {
  const params = new URLSearchParams();

  if (filters.type) params.append('type', filters.type);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());

  const queryString = params.toString();
  const endpoint = `/api/insights${queryString ? `?${queryString}` : ''}`;

  return apiClient<PaginatedResponseDto<Insight>>(endpoint);
}

export async function generateInsights(
  request: InsightGenerateRequestDto = {},
): Promise<Insight[]> {
  return apiClient<Insight[]>('/api/insights/generate', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}
