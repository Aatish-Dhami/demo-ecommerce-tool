import { useState } from 'react';
import { useEvents } from '../../hooks/useEvents';
import { EventFilters } from './EventFilters';
import { EventRow } from './EventRow';
import { Pagination } from './Pagination';
import './EventList.css';

interface EventListProps {
  shopId?: string;
}

export function EventList({ shopId }: EventListProps) {
  const [eventType, setEventType] = useState<string | undefined>(undefined);

  const {
    events,
    total,
    page,
    limit,
    totalPages,
    isLoading,
    error,
    setFilters,
    setPage,
  } = useEvents({ shopId, eventType });

  const handleEventTypeChange = (newEventType: string | undefined) => {
    setEventType(newEventType);
    setFilters({ eventType: newEventType, shopId });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <section className="event-list" aria-label="Events list">
      <div className="event-list__header">
        <h2 className="event-list__title">Events</h2>
        <EventFilters
          selectedEventType={eventType}
          onEventTypeChange={handleEventTypeChange}
        />
      </div>

      {isLoading && (
        <div className="event-list__loading" aria-live="polite">
          <div className="event-list__spinner" aria-hidden="true" />
          <span>Loading events...</span>
        </div>
      )}

      {error && (
        <div className="event-list__error" role="alert">
          <span className="event-list__error-icon" aria-hidden="true">!</span>
          <span>{error}</span>
        </div>
      )}

      {!isLoading && !error && events.length === 0 && (
        <div className="event-list__empty">
          <p>No events found.</p>
          {eventType && (
            <p className="event-list__empty-hint">
              Try clearing the filter to see all events.
            </p>
          )}
        </div>
      )}

      {!isLoading && !error && events.length > 0 && (
        <div className="event-list__table-container">
          <table className="event-list__table" role="table">
            <thead>
              <tr>
                <th className="event-list__header-cell">Type</th>
                <th className="event-list__header-cell">Timestamp</th>
                <th className="event-list__header-cell">Name</th>
                <th className="event-list__header-cell">Properties</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
        onPageChange={handlePageChange}
      />
    </section>
  );
}
