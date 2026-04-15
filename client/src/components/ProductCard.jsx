import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();

  // Simple logic to determine a badge label based on category or other data
  const badgeLabel = product.category === 'Cupcakes' ? 'Top Pick' : 
                     product.category === 'Pastries' ? 'Veg' : 
                     product.category === 'Celebration Cakes' ? 'Best Seller' : product.category;

  return (
    <div className="product-card" onClick={() => navigate(`/products/${product.id}`)}>
      {/* Badge at top left */}
      <div className="product-badge">{badgeLabel}</div>
      
      {/* Wishlist icon at top right */}
      <button 
        className="wishlist-btn" 
        onClick={(e) => { e.stopPropagation(); /* Wishlist logic here */ }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>

      <div className="product-img-wrap">
        {product.image ? (
          <img src={product.image} alt={product.name} className="product-img" loading="lazy" />
        ) : (
          <div style={{fontSize: '5rem'}}>🍔</div>
        )}
        {/* Dark gradient overlay for text readability */}
        <div className="product-overlay"></div>
      </div>

      <div className="product-body">
        {/* Name and Description over the dark overlay area */}
        <div className="product-name">{product.name}</div>
        <div className="product-desc">{product.description || "Freshly made with premium ingredients, served with a perfect side. Perfect for those who love high-quality flavors!"}</div>
        
        <div className="product-footer">
          {/* White pill-shaped button */}
          <button
            className="btn-pill-action"
            onClick={(e) => { e.stopPropagation(); onAddToCart && onAddToCart(product); }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

