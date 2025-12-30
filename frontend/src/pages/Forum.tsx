// CSS
import '../css/style.css';
import '../css/pages/forum.css';
import { API_BASE_URL } from '../utils/api';

// Components
import Navbar from '../components/Navbar';

import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

type ForumPost = {
  _id: string;
  name: string;
  message: string;
  photos?: string[];
  createdAt: string;
};

function Forum() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollYRef = useRef(0);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/api/forum`);
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
    if (!isModalOpen) {
      setNotice(null);
      setPhotos([]);
      if (photoInputRef.current) {
        photoInputRef.current.value = '';
      }
      return;
    }
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

  const resolvePhotoUrl = (path: string) => {
    if (path.startsWith('http')) return path;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${normalizedPath}`;
  };

  const handlePhotosChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFiles = Array.from(event.target.files ?? []);
    setPhotos(nextFiles);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (photos.length > 4) {
      setNotice('Please select up to 4 photos.');
      return;
    }
    setSubmitting(true);
    setNotice(null);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('message', message);
      photos.forEach((file) => formData.append('photos', file));

      const res = await fetch(`${API_BASE_URL}/api/forum/create`, {
        method: 'POST',
        body: formData,
      });

      const contentType = res.headers.get('content-type') || '';
      const payload = contentType.includes('application/json') ? await res.json() : null;
      if (!res.ok) throw new Error(payload?.message || 'Unable to post right now.');

      setName('');
      setMessage('');
      setPhotos([]);
      if (photoInputRef.current) {
        photoInputRef.current.value = '';
      }
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
                  {post.photos && post.photos.length > 0 && (
                    <div className="post-photos">
                      {post.photos.map((photoUrl, index) => (
                        <img
                          key={`${post._id}-photo-${index}`}
                          src={resolvePhotoUrl(photoUrl)}
                          alt={`Post photo ${index + 1}`}
                          loading="lazy"
                        />
                      ))}
                    </div>
                  )}
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
              <label className="field">
                <span>Photos (optional)</span>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotosChange}
                />
                <span className="field-hint">
                  {photos.length > 0 ? `${photos.length} file(s) selected` : 'Up to 4 images. Large photos are compressed.'}
                </span>
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
