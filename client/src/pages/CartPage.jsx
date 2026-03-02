import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

export default function CartPage({ onCartChange }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  const fetchCart = () => {
    api.get('/api/cart')
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCart(); }, []);

  const updateQty = async (item, qty) => {
    if (qty < 1) return removeItem(item);
    try {
      const updated = await api.put(`/api/cart/${item.id}`, { quantity: qty });
      setItems(prev => prev.map(i => i.id === item.id ? updated : i));
      if (onCartChange) onCartChange();
    } catch (err) { alert(err.message); }
  };

  const removeItem = async (item) => {
    try {
      await api.delete(`/api/cart/${item.id}`);
      setItems(prev => prev.filter(i => i.id !== item.id));
      if (onCartChange) onCartChange();
    } catch (err) { alert(err.message); }
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      await api.post('/api/orders', {});
      setItems([]);
      if (onCartChange) onCartChange();
      navigate('/orders');
    } catch (err) {
      alert(err.message);
    } finally {
      setPlacing(false);
    }
  };

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Your Cart</h1>
          <p>{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            <h3>Your cart is empty</h3>
            <p>Browse products and add something!</p>
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>
              Browse Products
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            <div>
              {items.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-img">
                    {item.product.image
                      ? <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                      : '📦'
                    }
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.product.name}</div>
                    <div className="cart-item-price">₹{item.product.price.toFixed(2)}</div>
                  </div>
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => updateQty(item, item.quantity - 1)}>−</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQty(item, item.quantity + 1)}>+</button>
                  </div>
                  <div style={{ marginLeft: '0.5rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--accent)' }}>
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <button className="btn btn-danger btn-sm" style={{ marginLeft: '0.5rem' }} onClick={() => removeItem(item)}>✕</button>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <h3>Order Summary</h3>
              {items.map(item => (
                <div key={item.id} className="summary-row">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>₹{(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <button
                className="btn btn-primary btn-full"
                style={{ marginTop: '1.25rem' }}
                onClick={placeOrder}
                disabled={placing}
              >
                {placing ? 'Placing order…' : '🎉 Place Order'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
