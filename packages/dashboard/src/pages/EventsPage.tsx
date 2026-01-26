import { EventList } from '../components/EventList';
import './EventsPage.css';

export function EventsPage() {
  return (
    <div className="events-page">
      <div className="events-page__header">
        <h1 className="events-page__title">Events</h1>
        <p className="events-page__description">
          View and filter raw tracking events from your shop.
        </p>
      </div>
      <EventList />
    </div>
  );
}
