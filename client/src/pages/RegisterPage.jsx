import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { setToken, setUser } from '../utils/auth';

export default function RegisterPage({ onLogin }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/api/auth/register', form);
      // auto-login after register
      const data = await api.post('/api/auth/login', { email: form.email, password: form.password });
      setToken(data.token);
      setUser(data.user);
      if (onLogin) onLogin();
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-info">
        <img
          src="https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=1080&q=100"
          alt="Premium Cake"
          className="auth-info-img"
        />
        <div className="auth-info-content">
          <h2 className="display-font">SweetCrumbs</h2>
          <p>Join our family of dessert lovers. Be the first to taste our seasonal specials and exclusive artisanal creations.</p>
        </div>
      </div>

      <div className="auth-form-container">
        <div className="auth-form-card">
          <h1>Create Account</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group-minimal">
              <label>Full Name</label>
              <input
                type="text" placeholder="Your name" required
                className="input-minimal"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="form-group-minimal">
              <label>Email Address</label>
              <input
                type="email" placeholder="you@example.com" required
                className="input-minimal"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="form-group-minimal">
              <label>Password</label>
              <input
                type="password" placeholder="At least 6 characters" required minLength={6}
                className="input-minimal"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
            </div>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{marginTop:'1.5rem', borderRadius: '100px', padding: '1rem'}}>
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
