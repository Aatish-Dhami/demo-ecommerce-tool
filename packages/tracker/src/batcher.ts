import type { CreateEventDto } from '@flowtel/shared';
import { sendEvents, type SenderConfig, type SendResult } from './sender';

/**
 * Configuration for the event batcher
 */
export interface BatcherConfig {
  /** Maximum events to queue before auto-flush */
  batchSize: number;

  /** Milliseconds between timer-based flushes */
  flushInterval: number;

  /** Sender configuration for HTTP transport */
  senderConfig: SenderConfig;

  /** Enable debug logging */
  debug?: boolean;
}

/**
 * Result of a flush operation
 */
export interface FlushResult {
  success: boolean;
  eventCount: number;
  error?: string;
}

/**
 * Event batcher that queues events and flushes them in batches.
 * Handles size-based, timer-based, and unload-triggered flushing.
 */
export class EventBatcher {
  private queue: CreateEventDto[] = [];
  private config: BatcherConfig;
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private isDestroyed: boolean = false;
  private isFlushing: boolean = false;

  constructor(config: BatcherConfig) {
    this.config = config;
    this.startFlushTimer();
    this.setupUnloadHandler();

    if (this.config.debug) {
      console.log(
        `[Flowtel Tracker] Batcher initialized (batchSize: ${config.batchSize}, flushInterval: ${config.flushInterval}ms)`
      );
    }
  }

  /**
   * Add an event to the queue.
   * Triggers flush if queue reaches batchSize.
   */
  add(event: CreateEventDto): void {
    if (this.isDestroyed) {
      if (this.config.debug) {
        console.warn('[Flowtel Tracker] Batcher destroyed, event dropped');
      }
      return;
    }

    this.queue.push(event);

    if (this.config.debug) {
      console.log(
        `[Flowtel Tracker] Event queued (${this.queue.length}/${this.config.batchSize})`
      );
    }

    // Auto-flush if queue reaches threshold
    if (this.queue.length >= this.config.batchSize) {
      this.flush();
    }
  }

  /**
   * Manually flush all queued events.
   * Returns promise that resolves when flush completes.
   */
  async flush(): Promise<FlushResult> {
    if (this.queue.length === 0) {
      return { success: true, eventCount: 0 };
    }

    if (this.isFlushing) {
      if (this.config.debug) {
        console.log('[Flowtel Tracker] Flush already in progress, skipping');
      }
      return { success: true, eventCount: 0 };
    }

    this.isFlushing = true;

    // Take a snapshot of current queue and clear it
    const eventsToSend = [...this.queue];
    this.queue = [];

    if (this.config.debug) {
      console.log(`[Flowtel Tracker] Flushing ${eventsToSend.length} events`);
    }

    try {
      const result: SendResult = await sendEvents(
        eventsToSend,
        this.config.senderConfig
      );

      const flushResult: FlushResult = {
        success: result.success,
        eventCount: eventsToSend.length,
        error: result.error,
      };

      // Re-queue events on retryable failure
      if (!result.success && result.retryable) {
        this.queue = [...eventsToSend, ...this.queue];
        if (this.config.debug) {
          console.warn('[Flowtel Tracker] Flush failed, events re-queued');
        }
      }

      return flushResult;
    } finally {
      this.isFlushing = false;
    }
  }

  /**
   * Flush synchronously using sendBeacon (for unload).
   * Falls back to sync XHR if sendBeacon unavailable.
   */
  flushSync(): boolean {
    if (this.queue.length === 0) {
      return true;
    }

    const eventsToSend = [...this.queue];
    this.queue = [];

    if (this.config.debug) {
      console.log(
        `[Flowtel Tracker] Sync flush ${eventsToSend.length} events (unload)`
      );
    }

    // Use sendBeacon for reliable delivery during unload
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(eventsToSend)], {
        type: 'application/json',
      });
      const success = navigator.sendBeacon(
        this.config.senderConfig.endpoint,
        blob
      );

      if (!success) {
        // Re-queue if sendBeacon fails (rare, usually quota exceeded)
        this.queue = eventsToSend;
      }

      return success;
    }

    // Fallback: synchronous XHR (blocks unload, but better than losing data)
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', this.config.senderConfig.endpoint, false); // sync
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(eventsToSend));
      return xhr.status >= 200 && xhr.status < 300;
    } catch {
      this.queue = eventsToSend;
      return false;
    }
  }

  /**
   * Get current queue length (for testing/debugging).
   */
  getQueueLength(): number {
    return this.queue.length;
  }

  /**
   * Destroy the batcher, flushing remaining events and cleaning up.
   */
  destroy(): void {
    if (this.isDestroyed) {
      return;
    }

    this.isDestroyed = true;
    this.stopFlushTimer();
    this.teardownUnloadHandler();

    // Flush remaining events synchronously
    this.flushSync();

    if (this.config.debug) {
      console.log('[Flowtel Tracker] Batcher destroyed');
    }
  }

  private startFlushTimer(): void {
    if (this.flushTimer) return;

    this.flushTimer = setInterval(() => {
      if (this.queue.length > 0 && !this.isDestroyed) {
        this.flush();
      }
    }, this.config.flushInterval);
  }

  private stopFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  private unloadHandler = (): void => {
    this.flushSync();
  };

  private visibilityHandler = (): void => {
    if (document.visibilityState === 'hidden') {
      this.flushSync();
    }
  };

  private setupUnloadHandler(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.unloadHandler);
      document.addEventListener('visibilitychange', this.visibilityHandler);
    }
  }

  private teardownUnloadHandler(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', this.unloadHandler);
      document.removeEventListener('visibilitychange', this.visibilityHandler);
    }
  }
}
