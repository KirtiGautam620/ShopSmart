import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { isLoggedIn } from '../utils/auth';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    setLoading(true);
    api.get(`/api/products/${id}`)
      .then(data => {
        setProduct(data);
        // Fetch related products (same category)
        return api.get(`/api/products?category=${data.category}`);
      })
      .then(data => {
        setRelatedProducts(data.filter(p => p.id !== Number(id)).slice(0, 4));
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!isLoggedIn()) { navigate('/login'); return; }
    setAdding(true);
    try {
      await api.post('/api/cart', { productId: product.id, quantity: qty });
      if (onAddToCart) onAddToCart();
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!product) return null;

  return (
    <div className="page">
      <div className="container">
        <nav style={{ marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          Home / Shop / <span style={{ color: 'var(--text)' }}>{product.name}</span>
        </nav>

        <div className="product-detail-layout">
          {/* Left: Gallery */}
          <div className="product-detail-gallery">
            <div className="product-detail-img-container">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-thumbnails">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`thumb-img ${i === 1 ? 'active' : ''}`}>
                  <img src={product.image} alt={product.name} />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="product-detail-info">
            <header className="product-info-header">
              <span className="category">{product.category}</span>
              <h1>{product.name}</h1>
              <div className="rating-row">
                <div className="stars">★★★★★</div>
                <span className="review-count">4.8 (245 Reviews)</span>
                <span className="in-stock-badge">In Stock</span>
              </div>
            </header>

            <div className="price-row">
              <div className="current-price">₹{product.price.toFixed(2)}</div>
              <div className="old-price">₹{(product.price * 1.2).toFixed(2)}</div>
            </div>

            <p className="product-detail-desc">
              {product.description || 'Experience the ultimate indulgence with our artisanal creation. Made with premium ingredients for a taste that lingers.'}
            </p>

            <div className="options-section">
              <span className="option-label">Size/Volume</span>
              <div className="size-chips">
                {['30ml', '60ml', '80ml', '100ml'].map(s => (
                  <div key={s} className={`chip ${s === '30ml' ? 'active' : ''}`}>{s}</div>
                ))}
              </div>
            </div>

            <div className="action-row">
              <div className="qty-input">
                <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                <div className="qty-value">{qty}</div>
                <button className="qty-btn" onClick={() => setQty(qty + 1)}>+</button>
              </div>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1 }} 
                onClick={handleAddToCart}
                disabled={adding}
              >
                {added ? '✓ Added' : adding ? 'Adding...' : 'Add To Cart'}
              </button>
              <button className="btn btn-primary btn-buy-now">Buy Now</button>
              <button className="wishlist-btn" style={{ position: 'static', background: 'var(--bg)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>

            <div className="product-meta-table">
              <div className="meta-row"><span className="meta-label">SKU :</span> <span className="meta-value">GRFR85648HGJ</span></div>
              <div className="meta-row"><span className="meta-label">Tags :</span> <span className="meta-value">{product.category}, Premium</span></div>
              <div className="meta-row"><span className="meta-label">Share :</span> <span className="meta-value">FB TW PIN IG</span></div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="product-tabs">
          <button className={`tab-btn ${activeTab === 'desc' ? 'active' : ''}`} onClick={() => setActiveTab('desc')}>Description</button>
          <button className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>Additional Information</button>
          <button className={`tab-btn ${activeTab === 'review' ? 'active' : ''}`} onClick={() => setActiveTab('review')}>Review</button>
        </div>

        <div className="tab-content-panel">
          {activeTab === 'info' && (
            <table className="attribute-table">
              <thead>
                <tr><th>Attribute</th><th>Details</th></tr>
              </thead>
              <tbody>
                <tr><td>Category</td><td>{product.category}</td></tr>
                <tr><td>Ingredients</td><td>Premium milk, cream, sugar, and natural flavors.</td></tr>
                <tr><td>Shelf Life</td><td>12 months from manufacture</td></tr>
                <tr><td>Packaging</td><td>Recyclable Eco-friendly container</td></tr>
              </tbody>
            </table>
          )}
          {activeTab === 'desc' && <p style={{lineHeight: 1.8, color: 'var(--text-muted)'}}>{product.description}</p>}
          {activeTab === 'review' && <p style={{textAlign: 'center', color: 'var(--text-muted)'}}>No reviews yet. Be the first to review!</p>}
        </div>

        {/* Related Products */}
        <section className="related-section">
          <h2>Explore <span>Related Products</span></h2>
          <div className="product-grid">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
