import type { CreateEventDto } from '@flowtel/shared';

/**
 * Result of sending events to the backend
 */
export interface SendResult {
  success: boolean;
  error?: string;
  retryable?: boolean;
}

/**
 * Configuration for the event sender
 */
export interface SenderConfig {
  endpoint: string;
  debug?: boolean;
  maxRetries?: number;
  retryDelayMs?: number;
}

const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_RETRY_DELAY_MS = 1000;

/**
 * Determine if an HTTP status code indicates a retryable error
 */
function isRetryableStatus(status: number): boolean {
  return status === 0 || (status >= 500 && status < 600);
}

/**
 * Calculate delay for retry attempt using exponential backoff
 */
function getRetryDelay(attempt: number, baseDelayMs: number): number {
  return baseDelayMs * Math.pow(2, attempt);
}

/**
 * Wait for a specified duration
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Send a batch of events to the configured endpoint.
 * Supports automatic retry with exponential backoff for transient failures.
 */
export async function sendEvents(
  events: CreateEventDto[],
  config: SenderConfig
): Promise<SendResult> {
  if (events.length === 0) {
    return { success: true };
  }

  const maxRetries = config.maxRetries ?? DEFAULT_MAX_RETRIES;
  const baseDelay = config.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(events),
      });

      if (response.ok) {
        if (config.debug) {
          console.log(
            `[Flowtel Tracker] Sent ${events.length} event(s) successfully`
          );
        }
        return { success: true };
      }

      // Client errors (4xx) - don't retry
      if (response.status >= 400 && response.status < 500) {
        const errorText = await response.text().catch(() => 'Unknown error');
        if (config.debug) {
          console.warn(
            `[Flowtel Tracker] Client error: ${response.status} - ${errorText}`
          );
        }
        return {
          success: false,
          error: `Client error: ${response.status}`,
          retryable: false,
        };
      }

      // Server errors (5xx) - retry
      if (isRetryableStatus(response.status) && attempt < maxRetries) {
        const retryDelay = getRetryDelay(attempt, baseDelay);
        if (config.debug) {
          console.log(
            `[Flowtel Tracker] Server error ${response.status}, retrying in ${retryDelay}ms...`
          );
        }
        await delay(retryDelay);
        continue;
      }

      return {
        success: false,
        error: `Server error: ${response.status}`,
        retryable: true,
      };
    } catch (error) {
      // Network error - retry
      if (attempt < maxRetries) {
        const retryDelay = getRetryDelay(attempt, baseDelay);
        if (config.debug) {
          console.log(
            `[Flowtel Tracker] Network error, retrying in ${retryDelay}ms...`
          );
        }
        await delay(retryDelay);
        continue;
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown network error';
      if (config.debug) {
        console.error(
          `[Flowtel Tracker] Failed to send events after ${maxRetries + 1} attempts:`,
          errorMessage
        );
      }
      return {
        success: false,
        error: errorMessage,
        retryable: true,
      };
    }
  }

  return {
    success: false,
    error: 'Max retries exceeded',
    retryable: true,
  };
}
