import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { setToken, setUser } from '../utils/auth';

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.post('/api/auth/login', form);
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
          <p>Indulge in our exquisite collection of artisanal treats. Handcrafted with passion, delivered with love.</p>
        </div>
      </div>

      <div className="auth-form-container">
        <div className="auth-form-card">
          <h1>Sign In</h1>
          
          <form onSubmit={handleSubmit}>
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
                type="password" placeholder="••••••••" required
                className="input-minimal"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
            </div>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{marginTop:'1.5rem', borderRadius: '100px', padding: '1rem'}}>
              {loading ? 'Entering Bakery…' : 'Sign In'}
            </button>
          </form>

          <p className="auth-footer">
            Don&apos;t have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
