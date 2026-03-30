/**
 * DRDO Innovation Hub — API Service Layer
 * Central place for all backend calls.
 * Base URL is read from .env: VITE_API_URL
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Token helpers ───────────────────────────────────────────
export function getToken()          { return localStorage.getItem('drdo_token'); }
export function setToken(t)         { localStorage.setItem('drdo_token', t); }
export function removeToken()       { localStorage.removeItem('drdo_token'); }

// ── Core fetch wrapper ──────────────────────────────────────
async function request(method, path, body = null, isFormData = false) {
  const token   = getToken();
  const headers = {};

  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData) headers['Content-Type'] = 'application/json';

  const options = { method, headers };
  if (body) options.body = isFormData ? body : JSON.stringify(body);

  const res  = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `HTTP ${res.status}`);
  }
  return data;
}

const get    = (path)        => request('GET',    path);
const post   = (path, body)  => request('POST',   path, body);
const put    = (path, body)  => request('PUT',    path, body);
const del    = (path)        => request('DELETE', path);

// ── Auth ────────────────────────────────────────────────────
export const authAPI = {
  login:          (email, password) => post('/auth/login', { email, password }),
  me:             ()                => get('/auth/me'),
  changePassword: (currentPassword, newPassword) => put('/auth/change-password', { currentPassword, newPassword }),
  updateProfile:  (data)            => put('/auth/profile', data),
};

// ── Dashboard ───────────────────────────────────────────────
export const dashboardAPI = {
  stats: () => get('/dashboard/stats'),
};

// ── Startups ────────────────────────────────────────────────
export const startupAPI = {
  list:           (params = {}) => get(`/startups?${new URLSearchParams(params)}`),
  get:            (id)          => get(`/startups/${id}`),
  create:         (data)        => post('/startups', data),
  update:         (id, data)    => put(`/startups/${id}`, data),
  delete:         (id)          => del(`/startups/${id}`),
  getEvaluations: (id)          => get(`/startups/${id}/evaluations`),
};

// ── Evaluations ─────────────────────────────────────────────
export const evaluationAPI = {
  list:   (params = {}) => get(`/evaluations?${new URLSearchParams(params)}`),
  create: (data)        => post('/evaluations', data),
  update: (id, data)    => put(`/evaluations/${id}`, data),
};

// ── Cohorts ─────────────────────────────────────────────────
export const cohortAPI = {
  list:       ()                => get('/cohorts'),
  get:        (id)              => get(`/cohorts/${id}`),
  create:     (data)            => post('/cohorts', data),
  addStartup: (id, startup_id)  => post(`/cohorts/${id}/startups`, { startup_id }),
};

// ── Mentors ─────────────────────────────────────────────────
export const mentorAPI = {
  list:   (params = {}) => get(`/mentors?${new URLSearchParams(params)}`),
  get:    (id)          => get(`/mentors/${id}`),
  create: (data)        => post('/mentors', data),
  assign: (id, startup_id) => post(`/mentors/${id}/assign`, { startup_id }),
};

// ── Projects ────────────────────────────────────────────────
export const projectAPI = {
  list:       ()           => get('/projects'),
  get:        (id)         => get(`/projects/${id}`),
  create:     (data)       => post('/projects', data),
  update:     (id, data)   => put(`/projects/${id}`, data),
  createTask: (id, data)   => post(`/projects/${id}/tasks`, data),
};

// ── Messaging ───────────────────────────────────────────────
export const messageAPI = {
  listConversations:  ()           => get('/conversations'),
  createConversation: (data)       => post('/conversations', data),
  getMessages:        (id)         => get(`/conversations/${id}/messages`),
  sendMessage:        (id, content) => post(`/conversations/${id}/messages`, { content }),
};

// ── Events ──────────────────────────────────────────────────
export const eventAPI = {
  list:     (params = {}) => get(`/events?${new URLSearchParams(params)}`),
  get:      (id)          => get(`/events/${id}`),
  create:   (data)        => post('/events', data),
  register: (id)          => post(`/events/${id}/register`),
};

// ── Feedback ────────────────────────────────────────────────
export const feedbackAPI = {
  list:      (params = {}) => get(`/feedback?${new URLSearchParams(params)}`),
  create:    (data)        => post('/feedback', data),
  respond:   (id, response) => put(`/feedback/${id}/respond`, { response }),
  analytics: ()            => get('/feedback/analytics'),
};

// ── SME Experts ─────────────────────────────────────────────
export const smeAPI = {
  list:   (params = {}) => get(`/sme?${new URLSearchParams(params)}`),
  get:    (id)          => get(`/sme/${id}`),
  create: (data)        => post('/sme', data),
  update: (id, data)    => put(`/sme/${id}`, data),
};

// ── IPR Records ───────────────────────────────────────────────
export const iprAPI = {
  list:   (params = {}) => get(`/ipr?${new URLSearchParams(params)}`),
  get:    (id)          => get(`/ipr/${id}`),
  create: (data)        => post('/ipr', data),
  update: (id, data)    => put(`/ipr/${id}`, data),
};

// ── Infrastructure ────────────────────────────────────────────
export const infrastructureAPI = {
  list:          (params = {}) => get(`/infrastructure?${new URLSearchParams(params)}`),
  get:           (id)          => get(`/infrastructure/${id}`),
  create:        (data)        => post('/infrastructure', data),
  createBooking: (id, data)    => post(`/infrastructure/${id}/bookings`, data),
};

// ── Knowledge Base ────────────────────────────────────────────
export const knowledgeAPI = {
  list:   (params = {}) => get(`/knowledge?${new URLSearchParams(params)}`),
  get:    (id)          => get(`/knowledge/${id}`),
  create: (data)        => post('/knowledge', data),
  update: (id, data)    => put(`/knowledge/${id}`, data),
};

// ── Documents ─────────────────────────────────────────────────
export const documentAPI = {
  list:   (params = {}) => get(`/documents?${new URLSearchParams(params)}`),
  get:    (id)          => get(`/documents/${id}`),
  create: (data)        => post('/documents', data),
  update: (id, data)    => put(`/documents/${id}`, data),
  remove: (id)          => del(`/documents/${id}`),
};

// ── Watchlists ────────────────────────────────────────────────
export const watchlistAPI = {
  list:           ()           => get('/watchlists'),
  get:            (id)         => get(`/watchlists/${id}`),
  create:         (data)       => post('/watchlists', data),
  remove:         (id)         => del(`/watchlists/${id}`),
  addStartup:     (id, sid)    => post(`/watchlists/${id}/startups`, { startup_id: sid }),
  removeStartup:  (id, sid)    => del(`/watchlists/${id}/startups/${sid}`),
};

// ── DeepTech Assessments ──────────────────────────────────────
export const deeptechAPI = {
  list:   (params = {}) => get(`/deeptech?${new URLSearchParams(params)}`),
  get:    (id)          => get(`/deeptech/${id}`),
  create: (data)        => post('/deeptech', data),
};

// ── Govt API Integrations ─────────────────────────────────────
export const govtIntegrationAPI = {
  list: ()    => get('/integrations'),
  sync: (id)  => post(`/integrations/${id}/sync`),
  logs: ()    => get('/integrations/logs'),
};

// ── Crawling ────────────────────────────────────────────────
export const crawlAPI = {
  stats:           ()                => get('/crawl/stats'),
  listSources:     ()                => get('/crawl/sources'),
  createSource:    (data)            => post('/crawl/sources', data),
  toggleSource:    (id)              => put(`/crawl/sources/${id}/toggle`),
  triggerCrawl:    (id)              => post(`/crawl/sources/${id}/trigger`),
  listStartups:    (params = {})     => get(`/crawl/startups?${new URLSearchParams(params)}`),
  getStartup:      (id)              => get(`/crawl/startups/${id}`),
  approveStartup:  (id)              => put(`/crawl/startups/${id}/approve`),
  rejectStartup:   (id, reason)      => put(`/crawl/startups/${id}/reject`, { reason }),
  listJobs:        ()                => get('/crawl/jobs'),
};
