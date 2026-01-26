import {
  ChatRequestDto,
  ChatResponseDto,
  EventsQueryDto,
  Insight,
  InsightGenerateRequestDto,
  InsightsQueryDto,
  InsightType,
  PaginatedResponseDto,
  Stats,
  StatsQueryDto,
  TrackingEvent,
} from '@flowtel/shared';
import { apiClient, ApiError } from '../api/client';

export { ApiError };

interface InsightsQueryParams {
  type?: InsightType;
  page?: number;
  limit?: number;
}

export const apiService = {
  /**
   * Fetch aggregated statistics.
   * GET /api/stats
   */
  async getStats(params?: StatsQueryDto): Promise<Stats> {
    const searchParams = new URLSearchParams();

    if (params?.shopId) {
      searchParams.append('shopId', params.shopId);
    }
    if (params?.startDate) {
      searchParams.append('startDate', params.startDate);
    }
    if (params?.endDate) {
      searchParams.append('endDate', params.endDate);
    }

    const queryString = searchParams.toString();
    const endpoint = `/api/stats${queryString ? `?${queryString}` : ''}`;

    return apiClient<Stats>(endpoint);
  },

  /**
   * Fetch events with optional filters.
   * GET /api/events
   */
  async getEvents(
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
  },

  /**
   * Fetch generated insights with optional filters.
   * GET /api/insights
   */
  async getInsights(
    filters: InsightsQueryParams = {},
  ): Promise<PaginatedResponseDto<Insight>> {
    const params = new URLSearchParams();

    if (filters.type) params.append('type', filters.type);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const endpoint = `/api/insights${queryString ? `?${queryString}` : ''}`;

    return apiClient<PaginatedResponseDto<Insight>>(endpoint);
  },

  /**
   * Trigger insight generation.
   * POST /api/insights/generate
   */
  async generateInsights(
    request: InsightGenerateRequestDto = {},
  ): Promise<Insight[]> {
    return apiClient<Insight[]>('/api/insights/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  /**
   * Send a chat message about analytics data.
   * POST /api/chat
   */
  async sendChatMessage(request: ChatRequestDto): Promise<ChatResponseDto> {
    return apiClient<ChatResponseDto>('/api/chat', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },
};
