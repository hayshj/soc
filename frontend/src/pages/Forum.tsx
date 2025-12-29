// CSS
import '../css/style.css';
import '../css/pages/forum.css';

// Components
import Navbar from '../components/Navbar';

import { FormEvent, useEffect, useRef, useState } from 'react';

type ForumPost = {
  _id: string;
  name: string;
  message: string;
  createdAt: string;
};

function Forum() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollYRef = useRef(0);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('http://localhost:8082/api/forum');
      if (!res.ok) throw new Error('Failed to load posts');
      const data: ForumPost[] = await res.json();
      setPosts(data ?? []);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPosition = body.style.position;
    const previousTop = body.style.top;
    const previousWidth = body.style.width;

    scrollYRef.current = window.scrollY;
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollYRef.current}px`;
    body.style.width = '100%';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      body.style.overflow = previousOverflow;
      body.style.position = previousPosition;
      body.style.top = previousTop;
      body.style.width = previousWidth;
      window.scrollTo(0, scrollYRef.current);
    };
  }, [isModalOpen]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setNotice(null);

    try {
      const res = await fetch('http://localhost:8082/api/forum/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message }),
      });

      if (!res.ok) throw new Error('Unable to post right now.');

      setName('');
      setMessage('');
      setNotice('Thanks for sharing your experience.');
      await fetchPosts();
      setIsModalOpen(false);
    } catch (err: any) {
      setNotice(err?.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="forum-container">
        <section className="section forum-feed">
          <div className="forum-header">
            <div>
              <h1>Recent Posts</h1>
              <p className="kicker">Stories from the SOC community</p>
            </div>
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => setIsModalOpen(true)}
            >
              Post Experience
            </button>
          </div>

          {loading && <p className="state">Loading posts...</p>}
          {!loading && error && <p className="state error">Could not load posts.</p>}
          {!loading && !error && posts.length === 0 && (
            <p className="state empty">No posts yet. Be the first to share.</p>
          )}
          {!loading && !error && posts.length > 0 && (
            <div className="forum-list">
              {posts.map((post) => (
                <article className="post-card" key={post._id}>
                  <div className="post-header">
                    <span className="post-meta">
                      {post.name} - {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p>{post.message}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>Share Your Experience</h2>
              <button
                className="modal-close"
                type="button"
                aria-label="Close"
                onClick={() => setIsModalOpen(false)}
              >
                x
              </button>
            </div>
            <p className="kicker">Encourage others with your story</p>
            <form className="forum-card" onSubmit={handleSubmit}>
              <label className="field">
                <span>Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  maxLength={80}
                  required
                />
              </label>
              <label className="field">
                <span>Message</span>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Share your experience"
                  rows={5}
                  maxLength={2000}
                  required
                />
              </label>
              <div className="form-actions">
                <button className="btn btn-primary" type="submit" disabled={submitting}>
                  {submitting ? 'Posting...' : 'Post Experience'}
                </button>
                {notice && <span className="form-note">{notice}</span>}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Forum;
