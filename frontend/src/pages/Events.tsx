// CSS
import '../css/style.css';
import '../css/pages/events.css';

// Components
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import EventCard from '../components/EventCard';

import { useEffect, useMemo, useState } from 'react';

type Event = {
  title: string;
  date: string;     // ISO-ish string; we format in EventCard
  location: string;
  description: string;
};

function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setErr(null);
        // Same API as Home page
        const res = await fetch('http://localhost:8082/api/events');
        if (!res.ok) throw new Error('Failed to load events');
        const data: Event[] = await res.json();
        setEvents(data ?? []);
      } catch (e: any) {
        setErr(e?.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Only show upcoming (today or later), sort soonest first
  const upcoming = useMemo(() => {
    const today = new Date();
    const isUpcoming = (d: string) => {
      const t = new Date(d);
      if (isNaN(t.getTime())) return false;
      // compare by date only
      const a = new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime();
      const b = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
      return a >= b;
    };
    return [...events]
      .filter(e => isUpcoming(e.date))
      .sort((a, b) => +new Date(a.date) - +new Date(b.date));
  }, [events]);

  return (
    <>
      <Navbar />
      <PageHeader pageName="Events" />

      <main className="events-container">
        <section className="section">
          <header className="section-header">
            <h2>Upcoming Events</h2>
            <p className="kicker">What’s next on the calendar</p>
          </header>

          {loading && (
            <div className="state loading">
              <div className="spinner" aria-hidden />
              <p>Loading events…</p>
            </div>
          )}

          {!loading && err && (
            <div className="state error" role="alert">
              <p>Couldn’t load events. Please try again later.</p>
            </div>
          )}

          {!loading && !err && upcoming.length === 0 && (
            <div className="state empty">
              <p>No upcoming events yet—check back soon!</p>
            </div>
          )}

          {!loading && !err && upcoming.length > 0 && (
            <div className="events-grid">
              {upcoming.map((e, i) => (
                <EventCard
                  key={`${e.title}-${i}`}
                  title={e.title}
                  date={e.date}
                  location={e.location}
                  description={e.description}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default Events;
