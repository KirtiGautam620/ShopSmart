import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { isLoggedIn } from '../utils/auth';

const EMOJI_MAP = {
  electronics: '💻', clothing: '👕', food: '🍕',
  books: '📚', sports: '⚽', home: '🏠', beauty: '💄',
};

export default function ProductDetailPage({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.get(`/api/products/${id}`)
      .then(setProduct)
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!isLoggedIn()) { navigate('/login'); return; }
    setAdding(true);
    try {
      await api.post('/api/cart', { productId: product.id, quantity: 1 });
      if (onAddToCart) onAddToCart();
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/api/products/${id}`);
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!product) return null;

  const emoji = EMOJI_MAP[product.category?.toLowerCase()] || '📦';

  return (
    <div className="page">
      <div className="container">
        <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
          ← Back
        </button>

        <div className="product-detail-layout">
          {product.image ? (
            <img src={product.image} alt={product.name} className="product-detail-img" />
          ) : (
            <div className="product-detail-placeholder">{emoji}</div>
          )}

          <div className="product-detail-info">
            <span className="product-category">{product.category}</span>
            <h1 className="product-detail-name">{product.name}</h1>
            <div className="product-detail-price">₹{product.price.toFixed(2)}</div>
            <p className="product-detail-desc">
              {product.description || 'No description available for this product.'}
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <span className="badge badge-primary">Stock: {product.stock}</span>
              <span className="badge badge-accent">
                Added {new Date(product.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                onClick={handleAddToCart}
                disabled={adding}
                style={{ flex: 1, minWidth: '160px' }}
              >
                {added ? '✓ Added!' : adding ? 'Adding…' : '🛒 Add to Cart'}
              </button>
              {isLoggedIn() && (
                <>
                  <button className="btn btn-outline" onClick={() => navigate(`/products/${id}/edit`)}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={handleDelete}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
