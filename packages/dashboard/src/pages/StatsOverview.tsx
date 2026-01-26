import { StatsCard } from '../components/StatsCard/StatsCard';
import { useStats } from '../hooks/useStats';
import './StatsOverview.css';

interface StatsOverviewProps {
  shopId?: string;
}

export function StatsOverview({ shopId }: StatsOverviewProps) {
  const {
    stats,
    isLoading,
    error,
    lastUpdated,
    refresh,
    setAutoRefresh,
    isAutoRefreshEnabled,
  } = useStats({ shopId });

  const handleAutoRefreshToggle = () => {
    setAutoRefresh(!isAutoRefreshEnabled);
  };

  const formatLastUpdated = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <section className="stats-overview" aria-label="Statistics overview">
      <div className="stats-overview__header">
        <h2 className="stats-overview__title">Overview</h2>
        <div className="stats-overview__controls">
          <label className="stats-overview__auto-refresh">
            <input
              type="checkbox"
              checked={isAutoRefreshEnabled}
              onChange={handleAutoRefreshToggle}
              className="stats-overview__auto-refresh-checkbox"
            />
            <span className="stats-overview__auto-refresh-label">
              Auto-refresh
            </span>
          </label>
          <button
            type="button"
            onClick={refresh}
            disabled={isLoading}
            className="stats-overview__refresh-button"
            aria-label="Refresh statistics"
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
          {lastUpdated && (
            <span className="stats-overview__last-updated">
              Last updated: {formatLastUpdated(lastUpdated)}
            </span>
          )}
        </div>
      </div>

      {isLoading && !stats && (
        <div className="stats-overview__loading" aria-live="polite">
          <div className="stats-overview__spinner" aria-hidden="true" />
          <span>Loading statistics...</span>
        </div>
      )}

      {error && (
        <div className="stats-overview__error" role="alert">
          <span className="stats-overview__error-icon" aria-hidden="true">
            !
          </span>
          <span>{error}</span>
        </div>
      )}

      {stats && (
        <div className="stats-overview__grid">
          <StatsCard
            label="Total Events"
            value={stats.totalEvents}
            format="number"
          />
          <StatsCard
            label="Purchases"
            value={stats.totalPurchases}
            format="number"
          />
          <StatsCard
            label="Revenue"
            value={stats.totalRevenue}
            format="currency"
          />
          <StatsCard
            label="Conversion Rate"
            value={stats.conversionRate}
            format="percentage"
          />
        </div>
      )}
    </section>
  );
}
