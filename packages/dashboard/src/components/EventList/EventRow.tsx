import { useState } from 'react';
import { TrackingEvent } from '@flowtel/shared';
import './EventRow.css';

interface EventRowProps {
  event: TrackingEvent;
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  page_view: 'Page View',
  product_viewed: 'Product Viewed',
  add_to_cart: 'Add to Cart',
  remove_from_cart: 'Remove from Cart',
  checkout_started: 'Checkout Started',
  purchase_completed: 'Purchase Completed',
};

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatProperties(properties: Record<string, unknown>): string {
  return JSON.stringify(properties, null, 2);
}

export function EventRow({ event }: EventRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasProperties = Object.keys(event.properties).length > 0;
  const badgeClass = `event-row__badge event-row__badge--${event.eventType.replace(/_/g, '-')}`;
  const label = EVENT_TYPE_LABELS[event.eventType] || event.eventName;

  return (
    <>
      <tr className="event-row">
        <td className="event-row__cell event-row__cell--type">
          <span className={badgeClass}>{label}</span>
        </td>
        <td className="event-row__cell event-row__cell--timestamp">
          {formatTimestamp(event.timestamp)}
        </td>
        <td className="event-row__cell event-row__cell--name">
          {event.eventName}
        </td>
        <td className="event-row__cell event-row__cell--properties">
          {hasProperties ? (
            <button
              className="event-row__expand-button"
              onClick={() => setIsExpanded(!isExpanded)}
              type="button"
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Hide properties' : 'Show properties'}
            >
              {isExpanded ? 'Hide' : 'View'} properties
            </button>
          ) : (
            <span className="event-row__no-properties">No properties</span>
          )}
        </td>
      </tr>
      {isExpanded && hasProperties && (
        <tr className="event-row__properties-row">
          <td colSpan={4} className="event-row__properties-cell">
            <pre className="event-row__properties-content">
              {formatProperties(event.properties)}
            </pre>
          </td>
        </tr>
      )}
    </>
  );
}
