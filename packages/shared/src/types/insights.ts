/**
 * Types of AI-generated insights.
 */
export type InsightType = 'summary' | 'trend' | 'anomaly';

/**
 * Represents an AI-generated analytics insight.
 * Used to display intelligent analysis of tracking data.
 */
export interface Insight {
  /** Unique identifier for the insight */
  id: string;

  /** ISO 8601 timestamp when the insight was generated */
  generatedAt: string;

  /** Category of the insight */
  type: InsightType;

  /** Brief title describing the insight */
  title: string;

  /** Detailed content/explanation of the insight */
  content: string;

  /** Additional context and data related to the insight */
  metadata: Record<string, unknown>;
}
