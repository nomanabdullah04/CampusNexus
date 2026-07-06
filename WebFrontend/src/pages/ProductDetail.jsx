import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicAPI, privateAPI } from '../api/api';
import { ArrowLeft, Share2, MessageCircle, ShoppingCart, BadgePercent, AlertCircle, Package, Star, CalendarDays, Send } from 'lucide-react';
import { useUser } from '../context/UserContext';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import ReviewSection from '../components/ReviewSection';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Rental form state
  const [rentalRange, setRentalRange] = useState({ startDate: null, endDate: null });
  const [rentalMessage, setRentalMessage] = useState('');
  const [rentalLoading, setRentalLoading] = useState(false);
  const [rentalError, setRentalError] = useState('');
  const [rentalSuccess, setRentalSuccess] = useState('');

  // Completed rental for review
  const [completedRentalId, setCompletedRentalId] = useState(null);

  useEffect(() => { fetchProduct(); }, [productId]);
  useEffect(() => {
    if (user && productId) fetchMyCompletedRental();
  }, [user, productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await publicAPI.get(`/item/${productId}`);
      if (res.data.success) setProduct(res.data.data);
      else setError('Failed to load product');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  const fetchMyCompletedRental = async () => {
    try {
      const res = await privateAPI.get('/rental/my-rentals');
      if (res.data.success) {
        const completed = res.data.data.find(
          r => (r.item?.id === Number(productId) || r.itemId === Number(productId)) && r.status === 'COMPLETED'
        );
        if (completed) setCompletedRentalId(completed.id);
      }
    } catch (err) {}
  };

  const handleContact = () => {
    const userId = user?.id;
    if (product?.ownerInfo?.id && userId) {
      navigate(`/chat?buyerId=${userId}&sellerId=${product.ownerInfo.id}&sellerName=${encodeURIComponent(product.ownerInfo.name || '')}&sellerEmail=${encodeURIComponent(product.ownerInfo.email || '')}`);
    } else {
      alert('Please sign in to contact the seller.');
      navigate('/sign-in');
    }
  };

  const handleReport = () => {
    if (!user) { navigate('/sign-in'); return; }
    const reason = prompt('Reason for report (FRAUD, INAPPROPRIATE, SPAM, WRONG_INFO, OTHER):');
    if (!reason) return;
    const validReasons = ['FRAUD', 'INAPPROPRIATE', 'SPAM', 'WRONG_INFO', 'OTHER'];
    const finalReason = validReasons.includes(reason.toUpperCase()) ? reason.toUpperCase() : 'OTHER';
    privateAPI.post('/report', {
      targetType: 'ITEM',
      targetId: Number(productId),
      reason: finalReason,
      details: reason,
    })
      .then(() => alert('✅ Report submitted. Our team will review it.'))
      .catch(err => alert(err.response?.data?.message || 'Failed to submit report'));
  };

  const handleAddToCart = async () => {
    if (!user) { navigate('/sign-in'); return; }
    try {
      await privateAPI.post('/cart/add', { itemId: Number(productId) });
      alert('✅ Item added to cart!');
      navigate('/cart');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add item to cart');
    }
  };

  const handleRentRequest = async () => {
    if (!user) { navigate('/sign-in'); return; }
    if (!rentalRange.startDate || !rentalRange.endDate) {
      setRentalError('Please select a start and end date on the calendar');
      return;
    }
    setRentalLoading(true);
    setRentalError('');
    setRentalSuccess('');
    try {
      await privateAPI.post('/rental', {
        itemId: Number(productId),
        startDate: rentalRange.startDate,
        endDate: rentalRange.endDate,
        message: rentalMessage,
      });
      setRentalSuccess('✅ Rental request sent! The owner will review it shortly.');
      setRentalRange({ startDate: null, endDate: null });
      setRentalMessage('');
    } catch (err) {
      setRentalError(err.response?.data?.message || 'Failed to send rental request');
    } finally {
      setRentalLoading(false);
    }
  };

  const getDays = () => {
    if (!rentalRange.startDate || !rentalRange.endDate) return 0;
    return Math.ceil((new Date(rentalRange.endDate) - new Date(rentalRange.startDate)) / (1000 * 60 * 60 * 24));
  };

  if (loading) return <div className="spinner-container" style={{ minHeight: 'calc(100vh - 64px)' }}><div className="spinner" /><p className="text-slate">Loading product details...</p></div>;
  if (error) return <div className="empty-state" style={{ minHeight: 'calc(100vh - 64px)' }}><AlertCircle style={{ color: 'var(--color-error)' }} /><p style={{ color: 'var(--color-error)' }}>{error}</p><button className="btn btn-sage btn-sm" onClick={fetchProduct}>Retry</button></div>;
  if (!product) return <div className="empty-state" style={{ minHeight: 'calc(100vh - 64px)' }}><Package /><p>Product not found</p></div>;

  const isRentItem = product.sellingCategory === 'RENT';
  const isOwner = user && product && (user.id === product.ownerId || user.id === product.ownerInfo?.id);
  const days = getDays();

  return (
    <div className="page-layout">
      {/* Header */}
      <div style={{ background: 'var(--color-forest)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', color: 'white' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', flexShrink: 0 }}>
          <ArrowLeft size={20} />
        </button>
        <h2 style={{ color: 'white', flex: 1, margin: 0, fontSize: '1.25rem' }}>Product Details</h2>
        <button onClick={() => navigator.share?.({ title: product.title, url: window.location.href })} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
          <Share2 size={18} />
        </button>
      </div>

      <div className="page-content-narrow" style={{ paddingBottom: isRentItem ? '2rem' : '6rem' }}>
        {/* Product Image */}
        {product.picture && (
          <div className="card mb-4" style={{ overflow: 'hidden' }}>
            <img src={product.picture} alt={product.title} style={{ width: '100%', height: '380px', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
          </div>
        )}

        {/* Product Info */}
        <div className="card mb-4">
          <div className="card-body">
            <h1 style={{ fontSize: '1.5rem', color: 'var(--color-forest)', marginBottom: '0.5rem' }}>{product.title}</h1>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.5rem' }}>
              ৳{product.price}{isRentItem ? <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--color-slate)' }}>/day</span> : ''}
            </p>

            {/* Avg Rating */}
            {product.avgRating > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '1rem' }}>
                <Star size={16} fill="#F59E0B" color="#F59E0B" />
                <span style={{ fontWeight: 700, color: '#92400E' }}>{product.avgRating.toFixed(1)}</span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-slate)' }}>({product.reviewCount} reviews)</span>
              </div>
            )}

            {/* Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {product.objectCategory && <span className="badge badge-mint">{product.objectCategory}</span>}
              {product.sellingCategory && <span className="badge badge-sage">{product.sellingCategory}</span>}
              {product.availability && <span className="badge" style={{ background: product.availability === 'IN_STOCK' ? '#D1FAE5' : '#FEE2E2', color: product.availability === 'IN_STOCK' ? '#065F46' : '#991B1B' }}>{product.availability === 'IN_STOCK' ? 'In Stock' : 'Out of Stock'}</span>}
            </div>

            <h3 style={{ color: 'var(--color-forest)', marginBottom: '0.5rem', fontSize: '1rem' }}>Description</h3>
            <p style={{ color: 'var(--color-slate)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{product.description || 'No description available.'}</p>

            {product.tags?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {product.tags.map((tag, i) => <span key={i} className="badge badge-ash">#{tag}</span>)}
              </div>
            )}

            <hr className="divider" />

            <h3 style={{ color: 'var(--color-forest)', marginBottom: '1rem', fontSize: '1rem' }}>Seller Information</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="avatar">{(product.ownerInfo?.name?.[0] || 'U').toUpperCase()}</div>
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--color-forest)' }}>{product.ownerInfo?.name || 'Unknown Seller'}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-slate)' }}>{product.ownerInfo?.email}</p>
                </div>
              </div>
              {user && (
                <button
                  id="report-item-btn"
                  onClick={handleReport}
                  style={{ background: 'transparent', border: '1px solid #EF4444', color: '#EF4444', borderRadius: 'var(--radius-sm)', padding: '0.35rem 0.75rem', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  ⚠️ Report
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Availability Calendar (RENT items only) */}
        {isRentItem && (
          <div className="mb-4">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
              <CalendarDays size={18} color="var(--color-forest)" />
              <h3 style={{ color: 'var(--color-forest)', margin: 0, fontSize: '1rem' }}>Check Availability & Book</h3>
            </div>
            <AvailabilityCalendar itemId={productId} onRangeSelect={setRentalRange} />

            {/* Rental Request Form */}
            <div className="card mt-3">
              <div className="card-body">
                {rentalError && <div className="alert alert-error mb-3" style={{ fontSize: '0.875rem' }}>{rentalError}</div>}
                {rentalSuccess && <div className="alert alert-success mb-3" style={{ fontSize: '0.875rem' }}>{rentalSuccess}</div>}

                {rentalRange.startDate && rentalRange.endDate && (
                  <div style={{ background: '#F0FDF4', borderRadius: 'var(--radius-md)', padding: '0.75rem', marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-forest)', fontWeight: 600, margin: 0 }}>
                      📅 {new Date(rentalRange.startDate).toLocaleDateString()} → {new Date(rentalRange.endDate).toLocaleDateString()}
                    </p>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-slate)', margin: '0.25rem 0 0' }}>
                      {days} day{days !== 1 ? 's' : ''} × ৳{product.price} = <strong style={{ color: 'var(--color-forest)' }}>৳{days * product.price}</strong>
                    </p>
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ fontSize: '0.875rem' }}>Message to owner (optional)</label>
                  <textarea
                    className="form-input"
                    placeholder="Tell the owner why you need it..."
                    value={rentalMessage}
                    onChange={e => setRentalMessage(e.target.value)}
                    rows={2}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button
                  className="btn btn-sage"
                  style={{ width: '100%' }}
                  onClick={handleRentRequest}
                  disabled={rentalLoading || !rentalRange.startDate || !rentalRange.endDate}
                  id="send-rent-request-btn"
                >
                  {rentalLoading ? 'Sending Request...' : <><Send size={16} /> Send Rental Request</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reviews */}
        <ReviewSection itemId={productId} completedRentalId={completedRentalId} />
      </div>

      {/* Action Bar (for non-rent items) */}
      {!isRentItem && !isOwner && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid var(--color-ash)', padding: '1rem 1.5rem', display: 'flex', gap: '1rem', zIndex: 50 }}>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={handleContact} id="contact-seller-btn">
            <MessageCircle size={20} /> Contact Seller
          </button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAddToCart} id="add-to-cart-btn">
            <ShoppingCart size={20} /> Add to Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
