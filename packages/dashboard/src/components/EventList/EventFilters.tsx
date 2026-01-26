import './EventFilters.css';

interface EventFiltersProps {
  selectedEventType: string | undefined;
  onEventTypeChange: (eventType: string | undefined) => void;
}

const EVENT_TYPES = [
  { value: 'page_view', label: 'Page View' },
  { value: 'product_viewed', label: 'Product Viewed' },
  { value: 'add_to_cart', label: 'Add to Cart' },
  { value: 'remove_from_cart', label: 'Remove from Cart' },
  { value: 'checkout_started', label: 'Checkout Started' },
  { value: 'purchase_completed', label: 'Purchase Completed' },
] as const;

export function EventFilters({
  selectedEventType,
  onEventTypeChange,
}: EventFiltersProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onEventTypeChange(value === '' ? undefined : value);
  };

  return (
    <div className="event-filters">
      <label htmlFor="event-type-filter" className="event-filters__label">
        Filter by type:
      </label>
      <select
        id="event-type-filter"
        className="event-filters__select"
        value={selectedEventType || ''}
        onChange={handleChange}
      >
        <option value="">All Events</option>
        {EVENT_TYPES.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
    </div>
  );
}
