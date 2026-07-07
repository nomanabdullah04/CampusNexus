import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { privateAPI } from '../api/api';
import { LogOut, ShoppingBag, Package, AlertCircle, RefreshCw, User } from 'lucide-react';

const ProfileTab = ({ user }) => {
  const [activeTab, setActiveTab] = useState('listings');
  const [listings, setListings] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'listings') {
        const res = await privateAPI.get('/item/my-items');
        if (res.data.success) setListings(res.data.data);
      } else {
        const res = await privateAPI.get('/rental/my-rentals');
        if (res.data.success) setRentals(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching tab data:', err);
    } finally {
      setLoading(false);
    }
  };

  const items = activeTab === 'listings' ? listings : rentals;

  return (
    <div>
      <div className="tab-group mb-4">
        <button className={`tab-btn ${activeTab === 'listings' ? 'active' : ''}`} onClick={() => setActiveTab('listings')} id="tab-listings">
          My Listings
        </button>
        <button className={`tab-btn ${activeTab === 'rentals' ? 'active' : ''}`} onClick={() => setActiveTab('rentals')} id="tab-rentals">
          My Rentals
        </button>
      </div>

      {loading ? (
        <div className="spinner-container"><div className="spinner" /></div>
      ) : items.length === 0 ? (
        <div className="empty-state" style={{ padding: '2rem' }}>
          {activeTab === 'listings' ? <ShoppingBag /> : <Package />}
          <p>No {activeTab === 'listings' ? 'listings' : 'rentals'} yet</p>
          {activeTab === 'listings' && (
            <button className="btn btn-sage btn-sm" onClick={() => navigate('/post')}>Create a Post</button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map((item) => {
            // For rentals tab: item data is nested under item.item (rental object shape)
            // For listings tab: data is flat (item object shape)
            const isRental = activeTab === 'rentals';
            const displayTitle = isRental ? item.item?.title : item.title;
            const displayPicture = isRental ? item.item?.picture : item.picture;
            const displayPrice = isRental ? item.totalPrice : item.price;
            const displaySellingCategory = isRental ? item.item?.sellingCategory : item.sellingCategory;
            const displayObjectCategory = isRental ? item.item?.objectCategory : item.objectCategory;
            const navigateId = isRental ? item.item?.id : item.id;

            return (
              <div key={item.id} className="card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/products/${navigateId}`)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
                  {displayPicture ? (
                    <img src={displayPicture} alt={displayTitle} style={{ width: 72, height: 72, borderRadius: 'var(--radius-md)', objectFit: 'cover', flexShrink: 0 }} onError={(e) => { e.target.style.display = 'none'; }} />
                  ) : (
                    <div style={{ width: 72, height: 72, borderRadius: 'var(--radius-md)', background: 'var(--color-ash)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {isRental ? <Package size={24} color="var(--color-sage)" /> : <ShoppingBag size={24} color="var(--color-sage)" />}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, color: 'var(--color-forest)', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayTitle || 'Untitled'}</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-slate)', marginBottom: '0.25rem' }}>
                      {isRental ? `Total: ৳${displayPrice}` : `৳${displayPrice}`}
                    </p>
                    {isRental && item.startDate && item.endDate && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-slate)', marginBottom: '0.25rem' }}>
                        {new Date(item.startDate).toLocaleDateString()} → {new Date(item.endDate).toLocaleDateString()}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {isRental && item.status && <span className="badge badge-mint" style={{ fontSize: '0.7rem', textTransform: 'capitalize' }}>{item.status}</span>}
                      {!isRental && displayObjectCategory && <span className="badge badge-mint" style={{ fontSize: '0.7rem' }}>{displayObjectCategory}</span>}
                      {displaySellingCategory && <span className="badge badge-sage" style={{ fontSize: '0.7rem' }}>{displaySellingCategory}</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Profile = () => {
  const { user, loading, error, clearUser, fetchUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      clearUser();
      navigate('/sign-in');
    }
  };

  if (loading) return (
    <div className="spinner-container" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div className="spinner" />
      <p className="text-slate">Loading profile...</p>
    </div>
  );

  if (error) return (
    <div className="empty-state" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <AlertCircle style={{ color: 'var(--color-error)' }} />
      <p style={{ color: 'var(--color-error)' }}>{error}</p>
      <button className="btn btn-sage btn-sm" onClick={fetchUser}><RefreshCw size={16} /> Retry</button>
    </div>
  );

  if (!user) return (
    <div className="empty-state" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <User />
      <p>Please login to view your profile</p>
      <button className="btn btn-primary" onClick={() => navigate('/sign-in')}>Sign In</button>
    </div>
  );

  return (
    <div className="page-layout">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">{user.name?.[0]?.toUpperCase()}</div>
        <h1 className="profile-name">{user.name}</h1>
        <p className="profile-email">{user.email}</p>
        {user.activeRole && (
          <span className="badge badge-mint" style={{ marginTop: '0.75rem' }}>{user.activeRole}</span>
        )}
      </div>

      <div className="page-content-narrow">
        {/* Logout Button */}
        <button className="btn btn-danger btn-full mb-6" onClick={handleLogout} id="logout-btn">
          <LogOut size={20} /> Logout
        </button>

        {/* Listings / Rentals */}
        <ProfileTab user={user} />
      </div>
    </div>
  );
};

export default Profile;
