import '../css/style.css';
import '../css/pages/adminDashboard.css';
import Navbar from '../components/Navbar';
import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Plus, Trash2 } from 'lucide-react';


type EventItem = {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
};

type ForumPost = {
  _id: string;
  name: string;
  message: string;
  createdAt: string;
};

type Registration = {
  _id: string;
  name: string;
  preferredName?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  email?: string;
  role?: string;
  dob?: string;
  medicalHistory?: string;
  guardianName?: string;
  guardianPhone?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  createdAt?: string;
};

type RegistrationSortKey = 'name' | 'role' | 'createdAt';

function AdminDashboard() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
  });
  const [eventToEdit, setEventToEdit] = useState<EventItem | null>(null);
  const [status, setStatus] = useState('');
  const [activeTab, setActiveTab] = useState<'events' | 'posts' | 'people'>('people');
  const [postToDelete, setPostToDelete] = useState<ForumPost | null>(null);
  const [eventToDelete, setEventToDelete] = useState<EventItem | null>(null);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [peopleQuery, setPeopleQuery] = useState('');
  const [peopleRoleFilter, setPeopleRoleFilter] = useState('all');
  const [peopleSortKey, setPeopleSortKey] = useState<RegistrationSortKey>('name');
  const [peopleSortDir, setPeopleSortDir] = useState<'asc' | 'desc'>('asc');
  const [registrationToEdit, setRegistrationToEdit] = useState<Registration | null>(null);
  const [registrationToDelete, setRegistrationToDelete] = useState<Registration | null>(null);
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    preferredName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
    role: '',
    dob: '',
    medicalHistory: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    guardianName: '',
    guardianPhone: '',
  });

  const token = localStorage.getItem('adminToken');

  const formatEventDate = (value: string) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString(undefined, { timeZone: 'UTC' });
  };

  const formatDateInput = (value?: string) => {
    if (!value) return '';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return '';
    return parsed.toISOString().slice(0, 10);
  };

  const displayValue = (value?: string) => {
    if (value === undefined || value === null) return 'N/A';
    const trimmed = value.toString().trim();
    return trimmed.length > 0 ? trimmed : 'N/A';
  };

  const filteredRegistrations = useMemo(() => {
    const query = peopleQuery.trim().toLowerCase();
    return registrations.filter((registration) => {
      if (peopleRoleFilter !== 'all' && registration.role !== peopleRoleFilter) {
        return false;
      }
      if (!query) return true;
      const haystack = [
        registration.name,
        registration.preferredName,
        registration.role,
        registration.phone,
        registration.email,
        registration.address,
        registration.city,
        registration.state,
        registration.zip,
        registration.guardianName,
        registration.guardianPhone,
        registration.emergencyContactName,
        registration.emergencyContactPhone,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [registrations, peopleQuery, peopleRoleFilter]);

  const sortedRegistrations = useMemo(() => {
    const dir = peopleSortDir === 'asc' ? 1 : -1;
    return [...filteredRegistrations].sort((a, b) => {
      if (peopleSortKey === 'createdAt') {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return (aTime - bTime) * dir;
      }
      const aVal = (a[peopleSortKey] ?? '').toString().toLowerCase();
      const bVal = (b[peopleSortKey] ?? '').toString().toLowerCase();
      if (aVal < bVal) return -1 * dir;
      if (aVal > bVal) return 1 * dir;
      return 0;
    });
  }, [filteredRegistrations, peopleSortKey, peopleSortDir]);

  const loadEvents = async () => {
    const res = await fetch('http://localhost:8082/api/events');
    const data = await res.json();
    setEvents(data ?? []);
  };

  const loadPosts = async () => {
    const res = await fetch('http://localhost:8082/api/forum');
    const data = await res.json();
    setPosts(data ?? []);
  };

  const loadRegistrations = async () => {
    const res = await fetch('http://localhost:8082/api/registration');
    const data = await res.json();
    setRegistrations(data ?? []);
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        navigate('/admin/login');
        return;
      }

      try {
        const res = await fetch('http://localhost:8082/api/admin/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Unauthorized');
        setAuthChecked(true);
      } catch {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    };

    checkAuth();
  }, [navigate, token]);

  useEffect(() => {
    if (!authChecked) return;
    loadEvents();
    loadPosts();
    loadRegistrations();
  }, [authChecked]);

  useEffect(() => {
    if (!postToDelete && !eventModalOpen && !eventToDelete && !registrationToDelete && !registrationToEdit) {
      return undefined;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [postToDelete, eventModalOpen, eventToDelete, registrationToDelete, registrationToEdit]);

  const sortedEvents = useMemo(() => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    return [...events].sort((a, b) => {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();
      const aUpcoming = isNaN(aTime) ? true : aTime >= startOfToday;
      const bUpcoming = isNaN(bTime) ? true : bTime >= startOfToday;
      if (aUpcoming !== bUpcoming) return aUpcoming ? -1 : 1;
      if (isNaN(aTime) && isNaN(bTime)) return 0;
      if (isNaN(aTime)) return 1;
      if (isNaN(bTime)) return -1;
      return aTime - bTime;
    });
  }, [events]);

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    return sortedEvents.filter((event) => {
      const time = new Date(event.date).getTime();
      if (isNaN(time)) return false;
      return time >= startOfToday;
    });
  }, [sortedEvents]);

  const openCreateEventModal = () => {
    setEventToEdit(null);
    setEventForm({ title: '', description: '', date: '', location: '' });
    setEventModalOpen(true);
  };

  const openEditEventModal = (eventItem: EventItem) => {
    const parsedDate = new Date(eventItem.date);
    const dateValue = Number.isNaN(parsedDate.getTime())
      ? ''
      : parsedDate.toISOString().slice(0, 10);
    setEventToEdit(eventItem);
    setEventForm({
      title: eventItem.title ?? '',
      description: eventItem.description ?? '',
      date: dateValue,
      location: eventItem.location ?? '',
    });
    setEventModalOpen(true);
  };

  const closeEventModal = () => {
    setEventModalOpen(false);
    setEventToEdit(null);
  };

  const handleCreateEvent = async (event: FormEvent) => {
    event.preventDefault();
    setStatus('');

    try {
      const endpoint = eventToEdit
        ? `http://localhost:8082/api/events/${eventToEdit._id}`
        : 'http://localhost:8082/api/events/create';
      const res = await fetch(endpoint, {
        method: eventToEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventForm),
      });
      if (!res.ok) throw new Error('Failed to save event');
      setEventForm({ title: '', description: '', date: '', location: '' });
      closeEventModal();
      await loadEvents();
    } catch {
      setStatus('Unable to save event right now.');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    setStatus('');
    try {
      const res = await fetch(`http://localhost:8082/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete event');
      await loadEvents();
    } catch {
      setStatus('Unable to delete event right now.');
    }
  };

  const handleDeletePost = async (id: string) => {
    setStatus('');
    try {
      const res = await fetch(`http://localhost:8082/api/forum/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete post');
      await loadPosts();
    } catch {
      setStatus('Unable to delete post right now.');
    }
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;
    const id = postToDelete._id;
    setPostToDelete(null);
    await handleDeletePost(id);
  };

  const confirmDeleteEvent = async () => {
    if (!eventToDelete) return;
    const id = eventToDelete._id;
    setEventToDelete(null);
    await handleDeleteEvent(id);
  };

  const openEditRegistrationModal = (registration: Registration) => {
    setRegistrationToEdit(registration);
    setRegistrationForm({
      name: registration.name ?? '',
      preferredName: registration.preferredName ?? '',
      address: registration.address ?? '',
      city: registration.city ?? '',
      state: registration.state ?? '',
      zip: registration.zip ?? '',
      phone: registration.phone ?? '',
      email: registration.email ?? '',
      role: registration.role ?? '',
      dob: formatDateInput(registration.dob),
      medicalHistory: registration.medicalHistory ?? '',
      emergencyContactName: registration.emergencyContactName ?? '',
      emergencyContactPhone: registration.emergencyContactPhone ?? '',
      guardianName: registration.guardianName ?? '',
      guardianPhone: registration.guardianPhone ?? '',
    });
  };

  const closeRegistrationModal = () => {
    setRegistrationToEdit(null);
  };

  const handleUpdateRegistration = async (event: FormEvent) => {
    event.preventDefault();
    if (!registrationToEdit) return;
    try {
      const res = await fetch(`http://localhost:8082/api/registration/${registrationToEdit._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(registrationForm),
      });
      if (!res.ok) throw new Error('Failed to update registration');
      setRegistrationToEdit(null);
      await loadRegistrations();
    } catch {
      setStatus('Unable to update registrant right now.');
    }
  };

  const confirmDeleteRegistration = async () => {
    if (!registrationToDelete) return;
    try {
      const res = await fetch(`http://localhost:8082/api/registration/${registrationToDelete._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete registration');
      setRegistrationToDelete(null);
      await loadRegistrations();
    } catch {
      setStatus('Unable to delete registrant right now.');
    }
  };

  if (!authChecked) {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="admin-container">
        <header className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
          </div>
        </header>

        {status && <div className="admin-status">{status}</div>}

        <div className="admin-tabs" role="tablist" aria-label="Admin sections">
          <button
            type="button"
            className={activeTab === 'people' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('people')}
            role="tab"
            aria-selected={activeTab === 'people'}
          >
            People
          </button>
          <button
            type="button"
            className={activeTab === 'events' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('events')}
            role="tab"
            aria-selected={activeTab === 'events'}
          >
            Events
          </button>
          <button
            type="button"
            className={activeTab === 'posts' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('posts')}
            role="tab"
            aria-selected={activeTab === 'posts'}
          >
            Posts
          </button>
        </div>

        {activeTab === 'events' && (
          <div className="admin-grid admin-grid-single" role="tabpanel">
            <section className="admin-section">
              <div className="section-heading">
                <h2>Events</h2>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={openCreateEventModal}
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="admin-list">
                {upcomingEvents.map((item) => (
                  <article className="admin-row" key={item._id}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{formatEventDate(item.date)} - {item.location}</p>
                    </div>
                    <div className="admin-row-actions">
                      <button
                        className="btn btn-secondary btn-icon"
                        type="button"
                        onClick={() => openEditEventModal(item)}
                        aria-label={`Edit event ${item.title}`}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        className="btn btn-secondary btn-icon"
                        type="button"
                        onClick={() => setEventToDelete(item)}
                        aria-label={`Delete event ${item.title}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="admin-grid admin-grid-single" role="tabpanel">
            <section className="admin-section">
              <div className="section-heading">
                <h2>Forum Posts</h2>
              </div>
              <div className="admin-list">
                {posts.map((post) => (
                  <article className="admin-row" key={post._id}>
                    <div>
                      <h3>{post.name}</h3>
                      <p>{post.message}</p>
                      <p className="meta">{new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="admin-row-actions">
                      <button
                        className="btn btn-secondary btn-icon"
                        type="button"
                        onClick={() => setPostToDelete(post)}
                        aria-label={`Delete post by ${post.name}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        {postToDelete && (
          <div className="admin-modal" role="dialog" aria-modal="true">
            <div className="admin-modal-backdrop" onClick={() => setPostToDelete(null)} />
            <div className="admin-modal-card" role="document">
              <div className="admin-modal-header">
                <button
                  type="button"
                  className="admin-modal-close"
                  aria-label="Close modal"
                  onClick={() => setPostToDelete(null)}
                >
                  ×
                </button>
              </div>
              <h3>Delete forum post?</h3>
              <p>
                This will permanently remove the post by {postToDelete.name}.
              </p>
              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setPostToDelete(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-delete"
                  onClick={confirmDeletePost}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'people' && (
          <div className="admin-grid admin-grid-single" role="tabpanel">
            <section className="admin-section">
              <div className="section-heading">
                <h2>Registrants</h2>
              </div>
              <div className="admin-people-controls">
                <label className="field">
                  Search
                  <input
                    type="search"
                    value={peopleQuery}
                    onChange={(event) => setPeopleQuery(event.target.value)}
                    placeholder="Name, email, phone, role..."
                  />
                </label>
                <label className="field">
                  Role
                  <select
                    value={peopleRoleFilter}
                    onChange={(event) => setPeopleRoleFilter(event.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="Youth">Youth</option>
                    <option value="Mentor">Mentor</option>
                  </select>
                </label>
                <label className="field">
                  Sort by
                  <select
                    value={peopleSortKey}
                    onChange={(event) => setPeopleSortKey(event.target.value as RegistrationSortKey)}
                  >
                    <option value="name">Name</option>
                    <option value="role">Role</option>
                    <option value="createdAt">Created</option>
                  </select>
                </label>
                <label className="field">
                  Order
                  <select
                    value={peopleSortDir}
                    onChange={(event) => setPeopleSortDir(event.target.value as 'asc' | 'desc')}
                  >
                    <option value="asc">A–Z</option>
                    <option value="desc">Z–A</option>
                  </select>
                </label>
              </div>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Preferred Name</th>
                      <th>Role</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Address</th>
                      <th>City</th>
                      <th>State</th>
                      <th>Zip</th>
                      <th>DOB</th>
                      <th>Medical History</th>
                      <th>Emergency Contact</th>
                      <th>Emergency Phone</th>
                      <th>Guardian Name</th>
                      <th>Guardian Phone</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRegistrations.map((registration) => (
                      <tr key={registration._id}>
                        <td>{displayValue(registration.name)}</td>
                        <td>{displayValue(registration.preferredName)}</td>
                        <td>{displayValue(registration.role)}</td>
                        <td>{displayValue(registration.phone)}</td>
                        <td>{displayValue(registration.email)}</td>
                        <td>{displayValue(registration.address)}</td>
                        <td>{displayValue(registration.city)}</td>
                        <td>{displayValue(registration.state)}</td>
                        <td>{displayValue(registration.zip)}</td>
                        <td>
                          {registration.dob ? formatEventDate(registration.dob) : 'N/A'}
                        </td>
                        <td>{displayValue(registration.medicalHistory)}</td>
                        <td>{displayValue(registration.emergencyContactName)}</td>
                        <td>{displayValue(registration.emergencyContactPhone)}</td>
                        <td>{displayValue(registration.guardianName)}</td>
                        <td>{displayValue(registration.guardianPhone)}</td>
                        <td>
                          <div className="admin-table-actions">
                            <button
                              type="button"
                              className="btn btn-secondary btn-icon"
                              onClick={() => openEditRegistrationModal(registration)}
                              aria-label={`Edit registrant ${registration.name}`}
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary btn-icon"
                              onClick={() => setRegistrationToDelete(registration)}
                              aria-label={`Delete registrant ${registration.name}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {registrationToEdit && (
          <div className="admin-modal" role="dialog" aria-modal="true">
            <div className="admin-modal-backdrop" onClick={closeRegistrationModal} />
            <div className="admin-modal-card" role="document">
              <div className="admin-modal-header">
                <button
                  type="button"
                  className="admin-modal-close"
                  aria-label="Close modal"
                  onClick={closeRegistrationModal}
                >
                  ×
                </button>
              </div>
              <h3>Edit registrant</h3>
              <form className="admin-form" onSubmit={handleUpdateRegistration}>
                <label className="field">
                  Name
                  <input
                    type="text"
                    value={registrationForm.name}
                    onChange={(event) => setRegistrationForm((prev) => ({ ...prev, name: event.target.value }))}
                    required
                  />
                </label>
                <label className="field">
                  Preferred Name
                  <input
                    type="text"
                    value={registrationForm.preferredName}
                    onChange={(event) => setRegistrationForm((prev) => ({ ...prev, preferredName: event.target.value }))}
                  />
                </label>
                <label className="field">
                  Role
                  <select
                    value={registrationForm.role}
                    onChange={(event) => setRegistrationForm((prev) => ({ ...prev, role: event.target.value }))}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Youth">Youth</option>
                    <option value="Mentor">Mentor</option>
                  </select>
                </label>
                <label className="field">
                  Phone
                  <input
                    type="tel"
                    value={registrationForm.phone}
                    onChange={(event) => setRegistrationForm((prev) => ({ ...prev, phone: event.target.value }))}
                    required
                  />
                </label>
                <label className="field">
                  Email
                  <input
                    type="email"
                    value={registrationForm.email}
                    onChange={(event) => setRegistrationForm((prev) => ({ ...prev, email: event.target.value }))}
                    required
                  />
                </label>
                <label className="field">
                  Address
                  <input
                    type="text"
                    value={registrationForm.address}
                    onChange={(event) => setRegistrationForm((prev) => ({ ...prev, address: event.target.value }))}
                  />
                </label>
                <label className="field">
                  City
                  <input
                    type="text"
                    value={registrationForm.city}
                    onChange={(event) => setRegistrationForm((prev) => ({ ...prev, city: event.target.value }))}
                  />
                </label>
                <label className="field">
                  State
                  <input
                    type="text"
                    value={registrationForm.state}
                    onChange={(event) => setRegistrationForm((prev) => ({ ...prev, state: event.target.value }))}
                  />
                </label>
                <label className="field">
                  Zip
                  <input
                    type="text"
                    value={registrationForm.zip}
                    onChange={(event) => setRegistrationForm((prev) => ({ ...prev, zip: event.target.value }))}
                  />
                </label>
                <label className="field">
                  Date of Birth
                  <input
                    type="date"
                    value={registrationForm.dob}
                    onChange={(event) => setRegistrationForm((prev) => ({ ...prev, dob: event.target.value }))}
                  />
                </label>
                <label className="field">
                  Medical History
                  <textarea
                    rows={4}
                    value={registrationForm.medicalHistory}
                    onChange={(event) => setRegistrationForm((prev) => ({ ...prev, medicalHistory: event.target.value }))}
                    required
                  />
                </label>
                <label className="field">
                  Emergency Contact
                  <input
                    type="text"
                    value={registrationForm.emergencyContactName}
                    onChange={(event) => setRegistrationForm((prev) => ({ ...prev, emergencyContactName: event.target.value }))}
                    required
                  />
                </label>
                <label className="field">
                  Emergency Phone
                  <input
                    type="tel"
                    value={registrationForm.emergencyContactPhone}
                    onChange={(event) => setRegistrationForm((prev) => ({ ...prev, emergencyContactPhone: event.target.value }))}
                    required
                  />
                </label>
                <label className="field">
                  Guardian Name
                  <input
                    type="text"
                    value={registrationForm.guardianName}
                    onChange={(event) => setRegistrationForm((prev) => ({ ...prev, guardianName: event.target.value }))}
                  />
                </label>
                <label className="field">
                  Guardian Phone
                  <input
                    type="tel"
                    value={registrationForm.guardianPhone}
                    onChange={(event) => setRegistrationForm((prev) => ({ ...prev, guardianPhone: event.target.value }))}
                  />
                </label>
                <div className="admin-modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={closeRegistrationModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {registrationToDelete && (
          <div className="admin-modal" role="dialog" aria-modal="true">
            <div className="admin-modal-backdrop" onClick={() => setRegistrationToDelete(null)} />
            <div className="admin-modal-card" role="document">
              <div className="admin-modal-header">
                <button
                  type="button"
                  className="admin-modal-close"
                  aria-label="Close modal"
                  onClick={() => setRegistrationToDelete(null)}
                >
                  ×
                </button>
              </div>
              <h3>Delete registrant?</h3>
              <p>
                This will permanently remove {registrationToDelete.name}.
              </p>
              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setRegistrationToDelete(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-delete"
                  onClick={confirmDeleteRegistration}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {eventToDelete && (
          <div className="admin-modal" role="dialog" aria-modal="true">
            <div className="admin-modal-backdrop" onClick={() => setEventToDelete(null)} />
            <div className="admin-modal-card" role="document">
              <div className="admin-modal-header">
                <button
                  type="button"
                  className="admin-modal-close"
                  aria-label="Close modal"
                  onClick={() => setEventToDelete(null)}
                >
                  ×
                </button>
              </div>
              <h3>Delete event?</h3>
              <p>
                This will permanently remove {eventToDelete.title}.
              </p>
              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEventToDelete(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-delete"
                  onClick={confirmDeleteEvent}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {eventModalOpen && (
          <div className="admin-modal" role="dialog" aria-modal="true">
            <div className="admin-modal-backdrop" onClick={closeEventModal} />
            <div className="admin-modal-card" role="document">
              <div className="admin-modal-header">
                <button
                  type="button"
                  className="admin-modal-close"
                  aria-label="Close modal"
                  onClick={closeEventModal}
                >
                  ×
                </button>
              </div>
              <h3>{eventToEdit ? 'Edit event' : 'Create event'}</h3>
              <form className="admin-form" onSubmit={handleCreateEvent}>
                <label className="field">
                  Title
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(event) => setEventForm((prev) => ({ ...prev, title: event.target.value }))}
                    required
                  />
                </label>
                <label className="field">
                  Description
                  <textarea
                    value={eventForm.description}
                    onChange={(event) => setEventForm((prev) => ({ ...prev, description: event.target.value }))}
                    required
                    rows={4}
                  />
                </label>
                <label className="field">
                  Date
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={(event) => setEventForm((prev) => ({ ...prev, date: event.target.value }))}
                    required
                  />
                </label>
                <label className="field">
                  Location
                  <input
                    type="text"
                    value={eventForm.location}
                    onChange={(event) => setEventForm((prev) => ({ ...prev, location: event.target.value }))}
                    required
                  />
                </label>
                <div className="admin-modal-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeEventModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {eventToEdit ? 'Save' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default AdminDashboard;
