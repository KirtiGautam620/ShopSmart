import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { getUser } from '../utils/auth';
import { Link } from 'react-router-dom';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    api.get('/api/orders')
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const recentItems = orders.flatMap(o => o.items.map(i => ({ ...i, date: o.createdAt }))).slice(0, 5);

  return (
    <div className="dash-layout">
      {/* ── Left Sidebar ── */}
      <aside className="dash-sidebar">
        <div className="dash-nav-item active">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          Dashboard
        </div>
        <Link to="/" className="dash-nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          Products
        </Link>
        <div className="dash-nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Messages
        </div>
        <div className="dash-nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          Settings
        </div>

        <div className="dash-promo-card">
          <p style={{fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.8rem'}}>Upgrade to premium and get 50% discount</p>
          <button className="btn btn-primary btn-sm" style={{borderRadius: '100px', width: '100%'}}>Upgrade Now</button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="dash-main">
        <header className="dash-header">
          <div className="dash-search">
            <svg style={{position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8'}} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" placeholder="Search for products, transactions..." />
          </div>
        </header>

        <section className="dash-banner">
          <div className="dash-banner-content">
            <h2>Easy Shopping Easy</h2>
            <p style={{color: '#64748b', marginBottom: '1.5rem', maxWidth: '400px'}}>Find your awesome experience while shopping with SweetCrumbs’s artisanal collection.</p>
            <button className="btn btn-primary" style={{borderRadius: '100px'}}>Explore Now</button>
          </div>
          <div style={{fontSize: '5rem', opacity: 0.8}}>🛍️</div>
        </section>

        <div className="section-header">
          <h3 style={{fontWeight: 900}}>Recent Purchases</h3>
          <span style={{fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700}}>View All</span>
        </div>

        <div className="card" style={{padding: '0', overflow: 'hidden'}}>
          {orders.length === 0 ? (
            <div style={{padding: '3rem', textAlign: 'center', color: '#64748b'}}>No orders found yet.</div>
          ) : (
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{textAlign: 'left', borderBottom: '1px solid #f1f5f9'}}>
                  <th style={{padding: '1.2rem', fontSize: '0.8rem', color: '#64748b'}}>Product</th>
                  <th style={{padding: '1.2rem', fontSize: '0.8rem', color: '#64748b'}}>Quantity</th>
                  <th style={{padding: '1.2rem', fontSize: '0.8rem', color: '#64748b'}}>Price</th>
                  <th style={{padding: '1.2rem', fontSize: '0.8rem', color: '#64748b'}}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 4).flatMap(o => o.items).slice(0, 4).map((item, idx) => (
                  <tr key={idx} style={{borderBottom: '1px solid #f1f5f9'}}>
                    <td style={{padding: '1.2rem', fontWeight: 700}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.8rem'}}>
                        <div style={{width: '32px', height: '32px', background: '#f1f5f9', borderRadius: '8px', overflow: 'hidden'}}>
                          <img src={item.product.image} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                        </div>
                        {item.product.name}
                      </div>
                    </td>
                    <td style={{padding: '1.2rem', color: '#64748b'}}>{item.quantity} sold</td>
                    <td style={{padding: '1.2rem', fontWeight: 800}}>₹{item.price.toFixed(2)}</td>
                    <td style={{padding: '1.2rem'}}><span className="badge-dash">Completed</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* ── Right Panel ── */}
      <aside className="dash-right">
        <div className="user-profile">
          <div className="user-info">
            <div className="user-avatar">
              <div style={{width: '100%', height: '100%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#fff', fontWeight: 900, fontSize: '1.2rem', textAlign: 'center', lineHeight: '48px'}}>
                {user?.name?.[0] || 'U'}
              </div>
            </div>
            <div>
              <div style={{fontWeight: 800, fontSize: '0.95rem'}}>Hi, {user?.name || 'Shopper'}!</div>
              <div style={{fontSize: '0.75rem', color: '#94a3b8'}}>Premium Member</div>
            </div>
          </div>
          <div style={{width: '40px', height: '40px', borderRadius: '100px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          </div>
        </div>

        <div className="balance-card">
          <p>Total Lifetime Spent</p>
          <h3>₹{totalSpent.toLocaleString()}</h3>
          <button className="btn" style={{background: '#fff', color: '#ff5c28', borderRadius: '100px', width: '100%', fontWeight: 800}}>Top Up</button>
        </div>

        <div>
          <div className="section-header">
            <h4 style={{fontWeight: 900}}>New Activities</h4>
            <span style={{fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700}}>View All</span>
          </div>
          <div className="activity-list">
            {recentItems.length === 0 ? (
              <div style={{fontSize: '0.85rem', color: '#94a3b8'}}>No recent activity.</div>
            ) : (
              recentItems.map((item, idx) => (
                <div key={idx} className="activity-item">
                  <div className="activity-thumb">
                    <img src={item.product.image} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  </div>
                  <div className="activity-details">
                    <div className="activity-name">{item.product.name}</div>
                    <div className="activity-meta">Bought {new Date(item.date).toLocaleDateString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
