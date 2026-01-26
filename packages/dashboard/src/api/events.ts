import { EventsQueryDto, PaginatedResponseDto, TrackingEvent } from '@flowtel/shared';
import { apiClient } from './client';

export async function fetchEvents(
  filters: EventsQueryDto,
): Promise<PaginatedResponseDto<TrackingEvent>> {
  const params = new URLSearchParams();

  if (filters.shopId) params.append('shopId', filters.shopId);
  if (filters.sessionId) params.append('sessionId', filters.sessionId);
  if (filters.eventType) params.append('eventType', filters.eventType);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());

  const queryString = params.toString();
  const endpoint = `/api/events${queryString ? `?${queryString}` : ''}`;

  return apiClient<PaginatedResponseDto<TrackingEvent>>(endpoint);
}
