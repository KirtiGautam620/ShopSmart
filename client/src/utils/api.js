const BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  
  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    return;
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  get:    (path)         => request(path, { method: 'GET' }),
  post:   (path, body)   => request(path, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (path, body)   => request(path, { method: 'PUT',    body: JSON.stringify(body) }),
  delete: (path)         => request(path, { method: 'DELETE' }),
};
