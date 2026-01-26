import { InsightType } from './insights.js';

/**
 * DTO for creating a new tracking event.
 * Used for POST /api/events endpoint.
 */
export interface CreateEventDto {
  /** ID of the shop where the event originated */
  shopId: string;

  /** Session identifier for the user */
  sessionId: string;

  /** Type of event (e.g., PAGE_VIEW, ADD_TO_CART) */
  eventType: string;

  /** Human-readable name of the event */
  eventName: string;

  /** Additional event-specific data */
  properties: Record<string, unknown>;

  /** URL where the event was triggered */
  url: string;

  /** Browser user agent string */
  userAgent: string;

  /** ISO 8601 timestamp when the event occurred (optional - server sets if not provided) */
  timestamp?: string;
}

/**
 * DTO for querying/filtering events.
 * Used for GET /api/events endpoint.
 */
export interface EventsQueryDto {
  /** Filter by shop ID */
  shopId?: string;

  /** Filter by session ID */
  sessionId?: string;

  /** Filter by event type */
  eventType?: string;

  /** Filter events after this date (ISO 8601) */
  startDate?: string;

  /** Filter events before this date (ISO 8601) */
  endDate?: string;

  /** Page number for pagination (1-indexed) */
  page?: number;

  /** Number of items per page */
  limit?: number;
}

/**
 * DTO for analytics chat requests.
 * Used for POST /api/chat endpoint.
 */
export interface ChatRequestDto {
  /** The user's question about analytics */
  message: string;

  /** Optional shop ID to scope the query */
  shopId?: string;

  /** Optional conversation ID for multi-turn conversations */
  conversationId?: string;
}

/**
 * Source reference for chat responses.
 */
export interface ChatSource {
  /** Type of source (e.g., 'event', 'stat', 'insight') */
  type: string;

  /** Reference to the source data */
  reference: string;
}

/**
 * DTO for analytics chat responses.
 * Used for POST /api/chat endpoint response.
 */
export interface ChatResponseDto {
  /** The AI-generated answer */
  answer: string;

  /** Conversation ID for continuing the conversation */
  conversationId: string;

  /** Optional sources referenced in the answer */
  sources?: ChatSource[];
}

/**
 * DTO for triggering insight generation.
 * Used for POST /api/insights/generate endpoint.
 */
export interface InsightGenerateRequestDto {
  /** Optional shop ID to scope the analysis */
  shopId?: string;

  /** Optional specific insight type to generate */
  type?: InsightType;

  /** Start of date range for analysis (ISO 8601) */
  startDate?: string;

  /** End of date range for analysis (ISO 8601) */
  endDate?: string;
}

/**
 * DTO for querying/filtering insights.
 * Used for GET /api/insights endpoint.
 */
export interface InsightsQueryDto {
  /** Number of items to skip (offset-based pagination) */
  offset?: number;

  /** Number of items per page */
  limit?: number;

  /** Filter by insight type */
  type?: InsightType;
}

/**
 * Generic paginated response wrapper.
 * Used for list endpoints that support pagination.
 */
export interface PaginatedResponseDto<T> {
  /** Array of items for the current page */
  data: T[];

  /** Total number of items across all pages */
  total: number;

  /** Current page number (1-indexed) */
  page: number;

  /** Number of items per page */
  limit: number;

  /** Total number of pages */
  totalPages: number;
}
