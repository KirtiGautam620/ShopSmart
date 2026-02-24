import { Link, useNavigate } from 'react-router-dom';
import { isLoggedIn, logout, getUser } from '../utils/auth';

export default function Navbar({ cartCount }) {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">SweetCrumbs</Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Shop</Link>
          {isLoggedIn() ? (
            <>
              <Link to="/orders" className="nav-link">Account</Link>
              <button onClick={handleLogout} className="nav-link" style={{background: 'none', cursor: 'pointer'}}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="nav-link">Login</Link>
          )}
        </div>

        <Link to="/cart" className="cart-btn">
          Cart ({cartCount})
        </Link>
      </div>
    </nav>
  );
}
