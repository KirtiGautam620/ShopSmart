import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

const CATEGORIES = ['Electronics', 'Clothing', 'Food', 'Books', 'Sports', 'Home', 'Beauty'];

export default function AddProductPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', price: '', category: 'Electronics',
    description: '', image: '', stock: '100',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const product = await api.post('/api/products', form);
      navigate(`/products/${product.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="add-product-wrap">
          <div className="page-header">
            <h1>Add New Product</h1>
            <p>Fill in the details below</p>
          </div>

          <div className="card" style={{ marginTop: '1rem' }}>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name *</label>
                <input type="text" placeholder="e.g. Wireless Headphones" required value={form.name} onChange={set('name')} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input type="number" placeholder="0.00" min="0" step="0.01" required value={form.price} onChange={set('price')} />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input type="number" placeholder="100" min="0" value={form.stock} onChange={set('stock')} />
                </div>
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select value={form.category} onChange={set('category')}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea rows={3} placeholder="Describe the product..." value={form.description} onChange={set('description')} style={{ resize: 'vertical' }} />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input type="url" placeholder="https://example.com/image.jpg" value={form.image} onChange={set('image')} />
              </div>

              {error && <p className="form-error">{error}</p>}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
                  {loading ? 'Adding…' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
