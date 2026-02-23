import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();

  return (
    <div className="product-card" onClick={() => navigate(`/products/${product.id}`)}>
      <div className="product-img-wrap">
        {product.image ? (
          <img src={product.image} alt={product.name} className="product-img" />
        ) : (
          <div style={{fontSize: '3rem'}}>🧁</div>
        )}
      </div>
      <div className="product-body">
        <span className="product-category">{product.category}</span>
        <div className="product-name">{product.name}</div>
        <div className="product-price">₹{product.price.toFixed(2)}</div>
      </div>
      <div className="product-footer" style={{marginTop: '1.2rem'}}>
        <button
          className="btn btn-primary btn-sm btn-full"
          onClick={(e) => { e.stopPropagation(); onAddToCart && onAddToCart(product); }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
