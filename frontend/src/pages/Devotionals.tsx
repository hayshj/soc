// CSS
import '../css/style.css';
import '../css/pages/devotionals.css';
import { API_BASE_URL } from '../utils/api';

// Components
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';

import { useEffect, useState } from 'react';

type Devotional = {
  _id: string;
  title: string;
  documents?: string[];
  createdAt?: string;
};

function Devotionals() {
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDevotionals = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE_URL}/api/devotionals`);
        if (!res.ok) throw new Error('Failed to load devotionals');
        const data: Devotional[] = await res.json();
        setDevotionals(data ?? []);
      } catch (err: any) {
        setError(err?.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };
    fetchDevotionals();
  }, []);

  const resolveDocumentUrl = (docPath: string) => {
    if (docPath.startsWith('http')) return docPath;
    const normalizedPath = docPath.startsWith('/') ? docPath : `/${docPath}`;
    return `${API_BASE_URL}${normalizedPath}`;
  };

  const formatDocumentName = (docPath: string) => {
    try {
      const url = new URL(resolveDocumentUrl(docPath));
      const parts = url.pathname.split('/');
      return decodeURIComponent(parts[parts.length - 1] || docPath);
    } catch {
      const parts = docPath.split('/');
      return parts[parts.length - 1] || docPath;
    }
  };

  return (
    <>
      <Navbar />
      <PageHeader pageName="Devotionals" />

      <main className="devotionals-container">
        <section className="section">
          <header className="section-header">
            <h2>Latest Devotionals</h2>
            <p className="kicker">Download and read whenever you need encouragement</p>
          </header>

          {loading && (
            <div className="state loading">
              <div className="spinner" aria-hidden />
              <p>Loading devotionals...</p>
            </div>
          )}

          {!loading && error && (
            <div className="state error" role="alert">
              <p>Could not load devotionals. Please try again later.</p>
            </div>
          )}

          {!loading && !error && devotionals.length === 0 && (
            <div className="state empty">
              <p>No devotionals yet. Check back soon!</p>
            </div>
          )}

          {!loading && !error && devotionals.length > 0 && (
            <div className="devotionals-list">
              {devotionals.map((item) => (
                <article className="devotional-card" key={item._id}>
                  <div className="devotional-header">
                    <h3>{item.title}</h3>
                    {item.createdAt && (
                      <span className="meta">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {item.documents && item.documents.length > 0 ? (
                    <div className="devotional-docs">
                      {item.documents.map((docUrl, index) => (
                        <a
                          key={`${item._id}-doc-${index}`}
                          href={resolveDocumentUrl(docUrl)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {formatDocumentName(docUrl)}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="meta">No documents available.</p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default Devotionals;
