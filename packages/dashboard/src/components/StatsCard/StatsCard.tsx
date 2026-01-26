import './StatsCard.css';

interface StatsCardProps {
  label: string;
  value: number;
  format?: 'number' | 'currency' | 'percentage';
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

function formatValue(value: number, format: 'number' | 'currency' | 'percentage'): string {
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value);
    case 'percentage':
      return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(value / 100);
    case 'number':
    default:
      return new Intl.NumberFormat('en-US').format(value);
  }
}

export function StatsCard({ label, value, format = 'number', trend }: StatsCardProps) {
  const formattedValue = formatValue(value, format);

  return (
    <article className="stats-card">
      <span className="stats-card__label">{label}</span>
      <span className="stats-card__value">{formattedValue}</span>
      {trend && (
        <div className={`stats-card__trend stats-card__trend--${trend.direction}`}>
          <span className="stats-card__trend-icon" aria-hidden="true">
            {trend.direction === 'up' ? '↑' : '↓'}
          </span>
          <span className="stats-card__trend-value">
            {trend.value > 0 ? '+' : ''}{trend.value.toFixed(1)}%
          </span>
        </div>
      )}
    </article>
  );
}
