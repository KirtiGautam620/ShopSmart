import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import { api } from './utils/api';
import { isLoggedIn } from './utils/auth';

function App() {
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = useCallback(() => {
    if (!isLoggedIn()) { setCartCount(0); return; }
    api.get('/api/cart')
      .then(items => setCartCount(items.reduce((sum, i) => sum + i.quantity, 0)))
      .catch(() => setCartCount(0));
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { refreshCartCount(); }, [refreshCartCount]);

  return (
    <BrowserRouter>
      <Navbar cartCount={cartCount} onLogout={() => setCartCount(0)} />
      <Routes>
        <Route path="/" element={<HomePage onAddToCart={refreshCartCount} />} />
        <Route path="/login" element={<LoginPage onLogin={refreshCartCount} />} />
        <Route path="/register" element={<RegisterPage onLogin={refreshCartCount} />} />
        <Route path="/products/:id" element={<ProductDetailPage onAddToCart={refreshCartCount} />} />
        <Route path="/cart" element={
          <ProtectedRoute><CartPage onCartChange={refreshCartCount} /></ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute><OrdersPage /></ProtectedRoute>
        } />
        <Route path="/add-product" element={
          <ProtectedRoute><AddProductPage /></ProtectedRoute>
        } />
        <Route path="/products/:id/edit" element={
          <ProtectedRoute><EditProductPage /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
