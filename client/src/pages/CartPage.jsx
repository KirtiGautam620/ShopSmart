import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

export default function CartPage({ onCartChange }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [activeActionId, setActiveActionId] = useState(null);
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
      setActiveActionId(null);
    } catch (err) { alert(err.message); }
  };

  const handlePromoApply = () => {
    if (promoCode.toUpperCase() === 'DIS-20' || promoCode.toUpperCase() === 'DIS -20') {
      setDiscount(20);
      alert('Promo code applied successfully!');
    } else {
      alert('Invalid promo code');
      setDiscount(0);
    }
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      await api.post('/api/orders', { discount });
      setItems([]);
      if (onCartChange) onCartChange();
      navigate('/orders');
    } catch (err) {
      alert(err.message);
    } finally {
      setPlacing(false);
    }
  };

  const addToWishlist = async (item) => {
    try {
      await api.post('/api/wishlist', { productId: item.productId });
      alert(`${item.product.name} added to wishlist!`);
      removeItem(item);
    } catch (error) { alert(error.message); }
  };

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const shipping = items.length > 0 ? 10 : 0;
  const grandTotal = Math.max(0, subtotal - discount + shipping);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div className="page" style={{ background: '#fcfcfc' }}>
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <header className="cart-header-premium">
          <h1>My Bag</h1>
        </header>

        {items.length === 0 ? (
          <div className="empty-state">
            <h3>Your bag is empty</h3>
            <p>Looks like you haven&apos;t added any sweet treats yet!</p>
            <button className="btn btn-primary" style={{ marginTop: '2rem' }} onClick={() => navigate('/shop')}>
              Explore Shop
            </button>
          </div>
        ) : (
          <div className="cart-container-premium">
            {/* Table Header */}
            <div className="cart-table-header">
              <span>Product</span>
              <span>Quantity</span>
              <span>Price</span>
              <span style={{ textAlign: 'right' }}>Action</span>
            </div>

            {/* Items List */}
            <div className="cart-items-list">
              {items.map(item => (
                <div key={item.id} className="cart-item-premium" style={{ position: 'relative' }}>
                  <div className="cart-item-product">
                    <div className="cart-item-img-wrap">
                      <img src={item.product.image} alt={item.product.name} />
                    </div>
                    <div className="cart-item-info-text">
                      <span className="cart-item-category">{item.product.category}</span>
                      <span className="cart-item-name-text">{item.product.name}</span>
                      <span className="cart-item-brand">Authentic {item.product.category}</span>
                    </div>
                  </div>

                  <div className="cart-qty-selector">
                    <div className="cart-qty-val">{item.quantity}</div>
                    <div className="cart-qty-btns">
                      <button className="cart-qty-btn-sub" onClick={() => updateQty(item, item.quantity + 1)}>+</button>
                      <button className="cart-qty-btn-sub" onClick={() => updateQty(item, item.quantity - 1)}>−</button>
                    </div>
                  </div>

                  <div className="cart-item-price-text">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </div>

                  <div className="cart-item-actions">
                    <button className="cart-dots-btn" onClick={() => setActiveActionId(activeActionId === item.id ? null : item.id)}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>...</span>
                    </button>
                    
                    {activeActionId === item.id && (
                      <div className="action-dropdown" style={{
                        position: 'absolute',
                        right: '0',
                        top: '70%',
                        background: '#fff',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        zIndex: 100,
                        width: '160px',
                        padding: '0.5rem 0'
                      }}>
                        <button style={{ width: '100%', padding: '0.6rem 1rem', textAlign: 'left', background: 'none', fontSize: '0.9rem', fontWeight: 600 }} onClick={() => alert('Edit feature coming soon!')}>Edit</button>
                        <button style={{ width: '100%', padding: '0.6rem 1rem', textAlign: 'left', background: 'none', fontSize: '0.9rem', fontWeight: 600, color: 'var(--danger)' }} onClick={() => removeItem(item)}>Remove</button>
                        <button style={{ width: '100%', padding: '0.6rem 1rem', textAlign: 'left', background: 'none', fontSize: '0.9rem', fontWeight: 600, color: '#ff4d6d' }} onClick={() => addToWishlist(item)}>Add to Wishlist</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer / Summary Section */}
            <div className="cart-footer-premium">
              {/* Promo Code Box */}
              <div className="promo-section">
                <span className="promo-title">Have a promo code?</span>
                <span className="promo-subtitle">Apply promocode to get discount</span>
                <div className="promo-input-group">
                  <input 
                    type="text" 
                    placeholder="DIS -20" 
                    value={promoCode} 
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button className="promo-apply-btn" onClick={handlePromoApply}>Apply</button>
                </div>
              </div>

              {/* Total Breakdown */}
              <div className="cart-total-section">
                <div className="total-row">
                  <span>Sub total</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Promo code</span>
                  <span style={{ color: '#ff4d6d' }}>-₹{discount.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Shipping charge</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </div>
                <div className="total-row grand-total">
                  <span>Grand total</span>
                  <span className="amount">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Final Buttons */}
            <div className="cart-final-actions">
              <button className="btn-continue" onClick={() => navigate('/shop')}>Continue shopping</button>
              <button 
                className="btn-checkout" 
                onClick={placeOrder}
                disabled={placing}
              >
                {placing ? 'Processing...' : 'Checkout'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

