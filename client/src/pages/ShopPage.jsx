import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { isLoggedIn } from '../utils/auth';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['Classic Flavors', 'Premium Tubs', 'Dairy-Free', 'Exotic', 'Fruit Specials', 'Limited Edition'];

export default function ShopPage({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState(1000);
  const [sortBy, setSortBy] = useState('Default Sorting');
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    // setLoading(true); // Rely on initial state or set in action handlers


    const params = new URLSearchParams();
    if (selectedCategories.length > 0) {
        params.set('category', selectedCategories[0]);
    }
    if (search) params.set('search', search);
    
    api.get(`/api/products?${params}`)
      .then(data => {
        let filtered = data.filter(p => p.price <= priceRange);
        setProducts(filtered);
        setCurrentPage(1); // Reset to page 1 on filter change
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedCategories, search, priceRange]);

  const handleCategoryToggle = (cat) => {
    setLoading(true);
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };


  const handleAddToCart = async (product) => {
    if (!isLoggedIn()) { navigate('/login'); return; }
    try {
      await api.post('/api/cart', { productId: product.id, quantity: 1 });
      if (onAddToCart) onAddToCart();
    } catch (err) {
      alert(err.message);
    }
  };

  // Sorting & Pagination Logic
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    if (sortBy === 'Newest First') return new Date(b.createdAt) - new Date(a.createdAt);
    return 0; // Default
  });

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="page" style={{ background: '#fff' }}>
      <div className="hero" style={{ padding: '3rem 1.5rem', textAlign: 'center', background: '#f8fafc', borderBottom: 'none', marginBottom: '0' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Shop</h1>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Home / Shop</div>
      </div>

      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <div className="shop-layout">
          {/* Sidebar */}
          <aside className="filter-sidebar">
            <div className="filter-group">
              <span className="filter-group-title">Search Products</span>
              <div className="dash-search" style={{ position: 'relative', marginBottom: '1rem' }}>
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={search} 
                  onChange={(e) => {
                    setLoading(true);
                    setSearch(e.target.value);
                  }}
                  style={{ width: '100%', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>
            </div>
            <div className="filter-group">

              <span className="filter-group-title">By Categories</span>
              <div className="filter-options-list">
                {CATEGORIES.map(cat => (
                  <label key={cat} className="filter-checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes(cat)} 
                      onChange={() => handleCategoryToggle(cat)}
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <span className="filter-group-title">Price</span>
              <div className="price-range-wrap">
                <input 
                  type="range" 
                  className="range-slider" 
                  min="0" max="1000" 
                  value={priceRange} 
                  onChange={(e) => {
                    setLoading(true);
                    setPriceRange(e.target.value);
                  }}
                />

                <div className="price-labels">
                  <span>₹0</span>
                  <span>₹{priceRange}</span>
                </div>
              </div>
            </div>

            <div className="filter-group">
                <span className="filter-group-title">Availability</span>
                <label className="filter-checkbox-label">
                    <input type="checkbox" defaultChecked /> In Stock
                </label>
                <label className="filter-checkbox-label">
                    <input type="checkbox" /> Out of Stocks
                </label>
            </div>
          </aside>

          {/* Main Content */}
          <main className="shop-main">
            <div className="shop-main-header">
              <div className="results-count">
                Showing {products.length > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + ITEMS_PER_PAGE, products.length)} of {products.length} results
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Sort by :</span>
                <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option>Default Sorting</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                </select>
              </div>
            </div>

            {selectedCategories.length > 0 && (
              <div className="active-filters-bar">
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Active Filter</span>
                {selectedCategories.map(cat => (
                  <div key={cat} className="active-filter-tag">
                    {cat}
                    <button onClick={() => handleCategoryToggle(cat)}>×</button>
                  </div>
                ))}
                <button className="clear-all-btn" onClick={() => setSelectedCategories([])}>Clear All</button>
              </div>
            )}

            {loading ? (
              <div className="spinner-wrap"><div className="spinner" /></div>
            ) : paginatedProducts.length === 0 ? (
              <div className="empty-state">
                <h3>No products found</h3>
                <p>Try adjusting your filters</p>
              </div>
            ) : (
              <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
                {paginatedProducts.map(p => (
                  <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="pagination-wrap">
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i + 1} 
                    className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => {
                        setCurrentPage(i + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
                {currentPage < totalPages && (
                  <button className="page-btn" onClick={() => setCurrentPage(currentPage + 1)}>❯</button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

