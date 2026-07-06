import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { privateAPI } from '../api/api';
import { useUser } from '../context/UserContext';
import { ShoppingCart, Trash2, CreditCard, ArrowLeft, Package, CalendarDays } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
      return;
    }
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await privateAPI.get('/cart');
      if (res.data.success) {
        setCartItems(res.data.data);
      } else {
        setError('Failed to fetch cart items.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await privateAPI.delete(`/cart/${id}`);
      fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove item');
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return;
    try {
      await privateAPI.delete('/cart/clear');
      setCartItems([]);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to clear cart');
    }
  };

  const handleCheckout = () => {
    const total = calculateTotal();
    navigate(`/payment-gateway?amount=${total}`);
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, curr) => {
      const price = Number(curr.item?.price || 0);
      if (curr.item?.sellingCategory === 'RENT' && curr.startDate && curr.endDate) {
        const days = Math.ceil((new Date(curr.endDate) - new Date(curr.startDate)) / (1000 * 60 * 60 * 24));
        return acc + price * days;
      }
      return acc + price;
    }, 0);
  };

  if (loading) {
    return (
      <div className="spinner-container" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div className="spinner" />
        <p className="text-slate">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="page-layout">
      {/* Header */}
      <div style={{ background: 'var(--color-forest)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', flexShrink: 0 }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={{ color: 'white', margin: 0, fontSize: '1.25rem' }}>My Shopping Cart</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.8125rem' }}>Manage and checkout items</p>
        </div>
      </div>

      <div className="page-content-narrow" style={{ paddingBottom: '3rem' }}>
        {error && <div className="alert alert-error mb-3">{error}</div>}
        {success && <div className="alert alert-success mb-3">{success}</div>}

        {cartItems.length === 0 ? (
          <div className="empty-state" style={{ background: 'white', padding: '3rem 2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-ash)' }}>
            <ShoppingCart size={48} color="var(--color-sage)" />
            <p style={{ color: 'var(--color-slate)', margin: '1rem 0' }}>Your cart is empty.</p>
            <button className="btn btn-sage btn-sm" onClick={() => navigate('/products')}>
              Browse Products
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-slate)', fontWeight: 600 }}>
                {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in cart
              </span>
              <button onClick={handleClear} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
                <Trash2 size={16} /> Clear Cart
              </button>
            </div>

            {/* Cart Items List */}
            {cartItems.map((item) => {
              const days = item.startDate && item.endDate 
                ? Math.ceil((new Date(item.endDate) - new Date(item.startDate)) / (1000 * 60 * 60 * 24)) 
                : 0;

              return (
                <div key={item.id} style={{ display: 'flex', gap: '1rem', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-ash)', padding: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                  {item.item?.picture ? (
                    <img src={item.item.picture} alt={item.item.title} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                  ) : (
                    <div style={{ width: 80, height: 80, background: 'var(--color-ash)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={32} color="var(--color-slate)" />
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--color-forest)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {item.item?.title}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.25rem 0' }}>
                      <span className="badge badge-sage">{item.item?.sellingCategory}</span>
                      <span className="badge badge-mint">৳{item.item?.price}</span>
                    </div>

                    {item.item?.sellingCategory === 'RENT' && item.startDate && item.endDate && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--color-slate)', marginTop: '0.25rem' }}>
                        <CalendarDays size={14} />
                        <span>
                          {new Date(item.startDate).toLocaleDateString()} → {new Date(item.endDate).toLocaleDateString()} ({days} day{days !== 1 ? 's' : ''})
                        </span>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <strong style={{ fontSize: '1.125rem', color: 'var(--color-forest)' }}>
                      ৳{item.item?.sellingCategory === 'RENT' ? (Number(item.item?.price || 0) * days) : item.item?.price}
                    </strong>
                    <button onClick={() => handleRemove(item.id)} style={{ background: 'transparent', border: 'none', color: 'var(--color-slate)', cursor: 'pointer', padding: '0.25rem' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Total & Checkout */}
            <div className="card mt-4" style={{ border: '2px solid var(--color-forest)' }}>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-slate)' }}>Total Amount</span>
                  <strong style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-forest)' }}>
                    ৳{calculateTotal().toFixed(2)}
                  </strong>
                </div>

                <button className="btn btn-sage" style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} onClick={handleCheckout} disabled={checkoutLoading}>
                  <CreditCard size={20} />
                  {checkoutLoading ? 'Processing Checkout...' : 'Confirm Checkout & Pay'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
