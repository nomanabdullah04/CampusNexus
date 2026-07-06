import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { privateAPI } from '../api/api';
import { useUser } from '../context/UserContext';
import { ClipboardList, Package, ArrowLeft, Check, X, ChevronRight, Clock } from 'lucide-react';

const STATUS_COLORS = {
  REQUESTED: { bg: '#FEF3C7', text: '#92400E' },
  APPROVED: { bg: '#DBEAFE', text: '#1E40AF' },
  ACTIVE: { bg: '#D1FAE5', text: '#065F46' },
  RETURNED: { bg: '#EDE9FE', text: '#5B21B6' },
  COMPLETED: { bg: '#D1FAE5', text: '#065F46' },
  REJECTED: { bg: '#FEE2E2', text: '#991B1B' },
  CANCELLED: { bg: '#F3F4F6', text: '#374151' },
};

const StatusBadge = ({ status }) => {
  const c = STATUS_COLORS[status] || { bg: '#F3F4F6', text: '#374151' };
  return (
    <span style={{ background: c.bg, color: c.text, borderRadius: 999, padding: '0.2rem 0.625rem', fontSize: '0.7rem', fontWeight: 700 }}>
      {status}
    </span>
  );
};

const RentalCard = ({ rental, onAction, isOwner }) => {
  const [loading, setLoading] = useState(false);

  const doAction = async (status) => {
    setLoading(true);
    await onAction(rental.id, status);
    setLoading(false);
  };

  const item = rental.item;
  const other = isOwner ? rental.renter : rental.owner;

  return (
    <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-ash)', overflow: 'hidden', marginBottom: '1rem' }}>
      {/* Item row */}
      <div style={{ display: 'flex', gap: '0.875rem', padding: '1rem' }}>
        {item?.picture ? (
          <img src={item.picture} alt="" style={{ width: 64, height: 64, borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0 }} onError={e => e.target.style.display = 'none'} />
        ) : (
          <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-sm)', background: 'var(--color-ash)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={24} color="var(--color-slate)" />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 700, color: 'var(--color-forest)', margin: 0, fontSize: '0.9375rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item?.title || 'Item'}
          </p>
          <p style={{ color: 'var(--color-slate)', fontSize: '0.8rem', margin: '0.15rem 0' }}>
            {isOwner ? '👤 From: ' : '🏠 Owner: '}{other?.name || 'Unknown'} · {other?.email}
          </p>
          <p style={{ color: 'var(--color-slate)', fontSize: '0.8rem', margin: 0 }}>
            📅 {new Date(rental.startDate).toLocaleDateString()} → {new Date(rental.endDate).toLocaleDateString()}
          </p>
        </div>
        <StatusBadge status={rental.status} />
      </div>

      {/* Price + Message */}
      <div style={{ padding: '0 1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-ash)' }}>
        <p style={{ color: 'var(--color-forest)', fontWeight: 700, fontSize: '1rem', margin: 0 }}>৳{rental.totalPrice}</p>
        {rental.message && (
          <p style={{ color: 'var(--color-slate)', fontSize: '0.8rem', margin: '0.25rem 0 0', fontStyle: 'italic' }}>
            "{rental.message}"
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ padding: '0.75rem 1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {/* Owner actions */}
        {isOwner && rental.status === 'REQUESTED' && (
          <>
            <button
              className="btn btn-sage btn-sm"
              onClick={() => doAction('APPROVED')}
              disabled={loading}
              id={`approve-rental-${rental.id}`}
            >
              <Check size={14} /> Approve
            </button>
            <button
              className="btn btn-outline btn-sm"
              style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }}
              onClick={() => doAction('REJECTED')}
              disabled={loading}
              id={`reject-rental-${rental.id}`}
            >
              <X size={14} /> Reject
            </button>
          </>
        )}
        {isOwner && rental.status === 'APPROVED' && (
          <button
            className="btn btn-sage btn-sm"
            onClick={() => doAction('ACTIVE')}
            disabled={loading}
            id={`activate-rental-${rental.id}`}
          >
            <ChevronRight size={14} /> Mark Active
          </button>
        )}
        {isOwner && rental.status === 'RETURNED' && (
          <button
            className="btn btn-sage btn-sm"
            onClick={() => doAction('COMPLETED')}
            disabled={loading}
            id={`complete-rental-${rental.id}`}
          >
            <Check size={14} /> Mark Completed
          </button>
        )}

        {/* Renter actions */}
        {!isOwner && rental.status === 'ACTIVE' && (
          <button
            className="btn btn-outline btn-sm"
            onClick={() => doAction('RETURNED')}
            disabled={loading}
            id={`return-rental-${rental.id}`}
          >
            <Clock size={14} /> Mark Returned
          </button>
        )}
        {!isOwner && ['REQUESTED', 'APPROVED'].includes(rental.status) && (
          <button
            className="btn btn-outline btn-sm"
            style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }}
            onClick={() => doAction('CANCELLED')}
            disabled={loading}
            id={`cancel-rental-${rental.id}`}
          >
            <X size={14} /> Cancel
          </button>
        )}
        {/* Refund request — renter can request on completed/active rentals */}
        {!isOwner && ['COMPLETED', 'ACTIVE'].includes(rental.status) && (
          <button
            className="btn btn-outline btn-sm"
            style={{ color: '#7C3AED', borderColor: '#7C3AED', fontSize: '0.75rem' }}
            onClick={() => {
              const reason = prompt('Please describe the reason for your refund request:');
              if (!reason || !reason.trim()) return;
              privateAPI.post('/refund', { rentalId: rental.id, reason: reason.trim() })
                .then(() => alert('✅ Refund request submitted successfully!'))
                .catch(err => alert(err.response?.data?.message || 'Failed to submit refund'));
            }}
            id={`refund-rental-${rental.id}`}
          >
            💰 Request Refund
          </button>
        )}
      </div>
    </div>
  );
};

const RentalManagement = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [tab, setTab] = useState('my-rentals');
  const [myRentals, setMyRentals] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { navigate('/sign-in'); return; }
    fetchAll();
  }, [user]);

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [rentalsRes, listingsRes] = await Promise.all([
        privateAPI.get('/rental/my-rentals'),
        privateAPI.get('/rental/my-listings'),
      ]);
      if (rentalsRes.data.success) setMyRentals(rentalsRes.data.data);
      if (listingsRes.data.success) setMyListings(listingsRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load rentals');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (rentalId, status) => {
    try {
      await privateAPI.patch(`/rental/${rentalId}/status`, { status });
      await fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const pendingCount = myListings.filter(r => r.status === 'REQUESTED').length;

  return (
    <div className="page-layout">
      {/* Header */}
      <div style={{ background: 'var(--color-forest)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', flexShrink: 0 }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={{ color: 'white', margin: 0, fontSize: '1.25rem' }}>Rental Management</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.8125rem' }}>Track and manage your rentals</p>
        </div>
      </div>

      <div className="page-content-narrow" style={{ paddingBottom: '2rem' }}>
        {/* Tabs */}
        <div className="tab-group" style={{ marginBottom: '1.25rem' }}>
          <button
            className={`tab-btn ${tab === 'my-rentals' ? 'active' : ''}`}
            onClick={() => setTab('my-rentals')}
            id="tab-my-rentals"
          >
            <ClipboardList size={16} /> My Rentals ({myRentals.length})
          </button>
          <button
            className={`tab-btn ${tab === 'my-listings' ? 'active' : ''}`}
            onClick={() => setTab('my-listings')}
            id="tab-my-listings"
          >
            <Package size={16} /> Incoming Requests
            {pendingCount > 0 && (
              <span style={{ background: '#EF4444', color: 'white', borderRadius: 999, padding: '0 5px', fontSize: '0.65rem', fontWeight: 700, marginLeft: 4 }}>
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {error && <div className="alert alert-error mb-3">{error}</div>}

        {loading ? (
          <div className="spinner-container" style={{ minHeight: 200 }}>
            <div className="spinner" /><p className="text-slate">Loading...</p>
          </div>
        ) : tab === 'my-rentals' ? (
          myRentals.length === 0 ? (
            <div className="empty-state">
              <ClipboardList size={40} />
              <p>You haven't rented anything yet</p>
              <button className="btn btn-sage btn-sm" onClick={() => navigate('/products')}>Browse Products</button>
            </div>
          ) : (
            myRentals.map(r => <RentalCard key={r.id} rental={r} onAction={handleAction} isOwner={false} />)
          )
        ) : (
          myListings.length === 0 ? (
            <div className="empty-state">
              <Package size={40} />
              <p>No rental requests on your listings</p>
              <button className="btn btn-sage btn-sm" onClick={() => navigate('/post')}>Post an Item</button>
            </div>
          ) : (
            myListings.map(r => <RentalCard key={r.id} rental={r} onAction={handleAction} isOwner={true} />)
          )
        )}
      </div>
    </div>
  );
};

export default RentalManagement;
