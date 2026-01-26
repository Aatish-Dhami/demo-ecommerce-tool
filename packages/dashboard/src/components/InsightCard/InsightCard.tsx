import { Insight, InsightType } from '@flowtel/shared';
import './InsightCard.css';

interface InsightCardProps {
  insight: Insight;
}

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function getTypeLabel(type: InsightType): string {
  const labels: Record<InsightType, string> = {
    summary: 'Summary',
    trend: 'Trend',
    anomaly: 'Anomaly',
  };
  return labels[type];
}

export function InsightCard({ insight }: InsightCardProps) {
  const { type, title, content, generatedAt } = insight;

  return (
    <article className="insight-card">
      <header className="insight-card__header">
        <span className={`insight-card__badge insight-card__badge--${type}`}>
          {getTypeLabel(type)}
        </span>
        <time className="insight-card__timestamp" dateTime={generatedAt}>
          {formatTimestamp(generatedAt)}
        </time>
      </header>
      <h3 className="insight-card__title">{title}</h3>
      <p className="insight-card__content">{content}</p>
    </article>
  );
}
