import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { publicAPI } from '../api/api';
import { Search, Filter, X, ShoppingBag, RefreshCw, AlertCircle } from 'lucide-react';

const CATEGORIES = ['ALL', 'ELECTRONICS', 'BOOKS', 'FURNITURE', 'CLOTHING', 'OTHERS'];
const SELLING_TYPES = ['ALL', 'SELL', 'RENT', 'FREE'];
const SORT_OPTIONS = [
  { label: 'Newest First', value: 'createdAt', order: 'desc' },
  { label: 'Oldest First', value: 'createdAt', order: 'asc' },
  { label: 'Price: Low → High', value: 'price', order: 'asc' },
  { label: 'Price: High → Low', value: 'price', order: 'desc' },
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [sellingType, setSellingType] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Debounced search: wait 450ms after last keystroke before fetching
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 450);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => { fetchProducts(); }, [debouncedSearch, category, sellingType, maxPrice, sortBy, sortOrder]);

  const fetchProducts = async () => {
    try {
      setLoading(true); setError(null);
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (category !== 'ALL') params.append('category', category);
      if (sellingType !== 'ALL') params.append('sellingCategory', sellingType);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);
      const res = await publicAPI.get(`/item?${params.toString()}`);
      if (res.data.success) setProducts(res.data.data);
      else setError('Failed to fetch products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally { setLoading(false); }
  };

  const resetFilters = () => { setSearch(''); setCategory('ALL'); setSellingType('ALL'); setMaxPrice(''); setSortBy('createdAt'); setSortOrder('desc'); };

  return (
    <div className="page-layout">
      <div className="page-header">
        <h1>All Items</h1>
        <p>Browse and discover items from your campus community</p>
      </div>

      {/* Search + Filter Bar */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--color-ash)', padding: '1rem 1.5rem', position: 'sticky', top: 64, zIndex: 50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="search-bar" style={{ flex: 1, minWidth: '200px' }}>
            <Search size={20} />
            <input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} id="products-search" />
            {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-sage)' }}><X size={16} /></button>}
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => setShowFilters(!showFilters)} id="filters-toggle">
            <Filter size={16} /> Filters {showFilters ? '▲' : '▼'}
          </button>
          <button className="btn btn-outline btn-sm" onClick={fetchProducts} title="Refresh" id="products-refresh">
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div style={{ maxWidth: '1200px', margin: '1rem auto 0', padding: '1rem', background: 'var(--color-pearl)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
              {/* Category */}
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-forest)' }}>Category</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {CATEGORIES.map((c) => <button key={c} className={`chip ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>)}
                </div>
              </div>
              {/* Selling Type */}
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-forest)' }}>Type</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {SELLING_TYPES.map((t) => <button key={t} className={`chip ${sellingType === t ? 'active' : ''}`} onClick={() => setSellingType(t)}>{t}</button>)}
                </div>
              </div>
              {/* Sort */}
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-forest)' }}>Sort By</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {SORT_OPTIONS.map((s) => (
                    <button key={s.label} className={`chip ${sortBy === s.value && sortOrder === s.order ? 'active' : ''}`} onClick={() => { setSortBy(s.value); setSortOrder(s.order); }}>{s.label}</button>
                  ))}
                </div>
              </div>
              {/* Max Price */}
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-forest)' }}>Max Price (৳)</p>
                <input className="form-input" style={{ width: '140px', padding: '0.5rem 0.75rem' }} type="number" placeholder="e.g. 100" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} id="max-price-input" />
              </div>
            </div>
            <button className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start' }} onClick={resetFilters} id="reset-filters">Reset Filters</button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="page-content">
        {loading ? (
          <div className="spinner-container"><div className="spinner" /><p className="text-slate">Loading products...</p></div>
        ) : error ? (
          <div className="empty-state"><AlertCircle /><p style={{ color: 'var(--color-error)' }}>{error}</p><button className="btn btn-sage btn-sm" onClick={fetchProducts}>Retry</button></div>
        ) : products.length === 0 ? (
          <div className="empty-state"><ShoppingBag /><p>No products found</p><p style={{ fontSize: '0.875rem' }}>Try adjusting your filters or search terms</p></div>
        ) : (
          <>
            <p style={{ color: 'var(--color-slate)', marginBottom: '1rem', fontWeight: 500 }}>{products.length} item{products.length !== 1 ? 's' : ''} found</p>
            <div className="product-card-grid">
              {products.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`} className="product-card">
                  <div className="card">
                    {product.picture ? (
                      <img src={product.picture} alt={product.title} className="product-card-img" onError={e => { e.target.style.display = 'none'; }} />
                    ) : (
                      <div className="product-card-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-ash)' }}>
                        <ShoppingBag size={40} color="var(--color-sage)" />
                      </div>
                    )}
                    <div className="product-card-info">
                      <p className="product-title">{product.title}</p>
                      <p className="product-desc">{product.description}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span className="product-price">৳{product.price}</span>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {product.objectCategory && <span className="badge badge-mint">{product.objectCategory}</span>}
                          {product.sellingCategory && <span className="badge badge-sage">{product.sellingCategory}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
