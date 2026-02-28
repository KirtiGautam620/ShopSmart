import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { isLoggedIn } from '../utils/auth';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Celebration Cakes', 'Pastries', 'Cupcakes', 'Wedding Cakes', 'Macarons', 'Gifts'];

export default function HomePage({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams();
    if (category !== 'All') params.set('category', category.toLowerCase());
    if (search) params.set('search', search);
    api.get(`/api/products?${params}`)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, search]);

  const handleAddToCart = async (product) => {
    if (!isLoggedIn()) { navigate('/login'); return; }
    try {
      await api.post('/api/cart', { productId: product.id, quantity: 1 });
      if (onAddToCart) onAddToCart();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="page" style={{paddingTop: 0}}>
      <div className="hero" style={{padding: '5rem 1.5rem', textAlign: 'center', background: '#fff', borderBottom: '1px solid var(--border)', marginBottom: '4rem'}}>
        <div className="container">
          <span className="product-category" style={{marginBottom: '1rem', display: 'block'}}>Chill & Indulge</span>
          <h1 style={{fontSize: '4rem', fontWeight: 950, color: 'var(--text)', marginBottom: '1rem', lineHeight: 1.1}}>Freshly Scooped Happiness</h1>
          <p style={{fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2.5rem'}}>Diving into the creamy goodness of our classic and premium flavors. Made with love, fresh ingredients, and a sprinkle of joy.</p>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>Shop Now</button>
        </div>
      </div>

      <div className="container">
        <div className="page-header">
          <h2 className="section-title">Explore Our Creations</h2>
        </div>

        <div className="filter-bar">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3>No products found</h3>
            <p>Try a different search or category</p>
            <button
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
              onClick={() => navigate('/add-product')}
            >
              Add First Product
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {products.map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
