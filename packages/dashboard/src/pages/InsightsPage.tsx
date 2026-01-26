import { useState } from 'react';
import { InsightType } from '@flowtel/shared';
import { useInsights } from '../hooks/useInsights';
import { InsightCard } from '../components/InsightCard';
import './InsightsPage.css';

export function InsightsPage() {
  const [typeFilter, setTypeFilter] = useState<InsightType | undefined>(undefined);

  const {
    insights,
    total,
    page,
    totalPages,
    isLoading,
    isGenerating,
    error,
    setFilters,
    setPage,
    generate,
  } = useInsights({ type: typeFilter });

  const handleTypeFilterChange = (newType: InsightType | undefined) => {
    setTypeFilter(newType);
    setFilters({ type: newType });
  };

  const handleGenerateClick = async () => {
    await generate();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <section className="insights-page" aria-label="AI-generated insights">
      <div className="insights-page__header">
        <div className="insights-page__header-left">
          <h2 className="insights-page__title">Insights</h2>
          <span className="insights-page__count">
            {total} {total === 1 ? 'insight' : 'insights'}
          </span>
        </div>
        <div className="insights-page__header-right">
          <select
            className="insights-page__filter"
            value={typeFilter || ''}
            onChange={(e) =>
              handleTypeFilterChange(
                e.target.value ? (e.target.value as InsightType) : undefined
              )
            }
            aria-label="Filter by insight type"
          >
            <option value="">All Types</option>
            <option value="summary">Summary</option>
            <option value="trend">Trend</option>
            <option value="anomaly">Anomaly</option>
          </select>
          <button
            className="insights-page__generate-btn"
            onClick={handleGenerateClick}
            disabled={isGenerating}
            aria-busy={isGenerating}
          >
            {isGenerating ? (
              <>
                <span className="insights-page__btn-spinner" aria-hidden="true" />
                Generating...
              </>
            ) : (
              'Generate New Insights'
            )}
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="insights-page__loading" aria-live="polite">
          <div className="insights-page__spinner" aria-hidden="true" />
          <span>Loading insights...</span>
        </div>
      )}

      {error && (
        <div className="insights-page__error" role="alert">
          <span className="insights-page__error-icon" aria-hidden="true">!</span>
          <span>{error}</span>
        </div>
      )}

      {!isLoading && !error && insights.length === 0 && (
        <div className="insights-page__empty">
          <p>No insights available.</p>
          <p className="insights-page__empty-hint">
            {typeFilter
              ? 'Try clearing the filter or generate new insights.'
              : 'Click "Generate New Insights" to analyze your data.'}
          </p>
        </div>
      )}

      {!isLoading && !error && insights.length > 0 && (
        <div className="insights-page__grid">
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="insights-page__pagination" aria-label="Insights pagination">
          <button
            className="insights-page__pagination-btn"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            Previous
          </button>
          <span className="insights-page__pagination-info">
            Page {page} of {totalPages}
          </span>
          <button
            className="insights-page__pagination-btn"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            Next
          </button>
        </nav>
      )}
    </section>
  );
}
