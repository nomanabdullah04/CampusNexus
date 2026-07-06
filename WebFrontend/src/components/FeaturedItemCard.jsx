import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { publicAPI } from '../api/api';
import { ShoppingBag, AlertCircle } from 'lucide-react';

const FeaturedItemCard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await publicAPI.get('/item?sortBy=createdAt&sortOrder=desc');
        if (res.data.success) setItems(res.data.data.slice(0, 6));
        else setError('Failed to load items');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load items');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (loading) return (
    <div className="spinner-container">
      <div className="spinner" />
      <p className="text-slate">Loading featured items...</p>
    </div>
  );

  if (error) return (
    <div className="empty-state">
      <AlertCircle />
      <p>{error}</p>
    </div>
  );

  if (!items.length) return (
    <div className="empty-state">
      <ShoppingBag />
      <p>No items available yet. Be the first to post!</p>
    </div>
  );

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2 style={{ color: 'var(--color-forest)' }}>Featured Items</h2>
        <Link to="/products" style={{ color: 'var(--color-sage)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>View All →</Link>
      </div>
      <div className="product-card-grid">
        {items.map((item) => (
          <Link key={item.id} to={`/products/${item.id}`} className="product-card">
            <div className="card">
              {item.picture ? (
                <img src={item.picture} alt={item.title} className="product-card-img" onError={e => { e.target.style.display = 'none'; }} />
              ) : (
                <div className="product-card-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-ash)' }}>
                  <ShoppingBag size={40} color="var(--color-sage)" />
                </div>
              )}
              <div className="product-card-info">
                <p className="product-title">{item.title}</p>
                <p className="product-desc">{item.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span className="product-price">৳{item.price}</span>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {item.objectCategory && <span className="badge badge-mint">{item.objectCategory}</span>}
                    {item.sellingCategory && <span className="badge badge-sage">{item.sellingCategory}</span>}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedItemCard;
