import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { privateAPI } from '../api/api';
import { useUser } from '../context/UserContext';
import { PlusCircle, X, AlertCircle, Image as ImageIcon, ArrowLeft } from 'lucide-react';

const SELLING_CATEGORIES = ['RENT', 'SELL', 'FREE'];
const AVAILABILITY_OPTIONS = ['IN_STOCK', 'UNAVAILABLE'];
const OBJECT_CATEGORIES = ['BOOKS', 'ELECTRONICS', 'FURNITURE', 'CLOTHING', 'SPORTS', 'OTHERS'];

const Post = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    sellingCategory: 'RENT',
    availability: 'IN_STOCK',
    objectCategory: 'BOOKS',
    tags: '',
    picture: '',
  });

  const handleChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    if (!formData.title.trim()) { setError('Please enter a title'); return false; }
    if (!formData.description.trim()) { setError('Please enter a description'); return false; }
    if (!formData.price || parseFloat(formData.price) < 0) { setError('Please enter a valid price'); return false; }
    if (!formData.picture.trim()) { setError('Please enter an image URL'); return false; }
    return true;
  };

  const handlePost = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!user?.id) { navigate('/sign-in'); return; }
    if (!validate()) return;
    setLoading(true);
    try {
      const tagsArray = formData.tags.split(',').map((t) => t.trim()).filter(Boolean);
      const postData = {
        ownerId: user.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        sellingCategory: formData.sellingCategory,
        availability: formData.availability,
        objectCategory: formData.objectCategory,
        tags: tagsArray,
        picture: formData.picture.trim(),
      };
      await privateAPI.post('/item', postData);
      setSuccess('Your post has been created successfully!');
      setFormData({ title: '', description: '', price: '', sellingCategory: 'RENT', availability: 'IN_STOCK', objectCategory: 'BOOKS', tags: '', picture: '' });
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => navigate('/sign-in'), 1500);
      } else {
        setError(err.response?.data?.message || 'Failed to create post. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-layout">
      {/* Header */}
      <div style={{ background: 'var(--color-forest)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', flexShrink: 0 }}>
          <ArrowLeft size={20} />
        </button>
        <h2 style={{ color: 'white', flex: 1, margin: 0, fontSize: '1.25rem' }}>Create Post</h2>
      </div>

      <div className="page-content-narrow">
        {/* User info card */}
        {user && (
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid var(--color-ash)' }}>
            <div className="avatar">{user.name?.[0]?.toUpperCase()}</div>
            <div>
              <p style={{ fontWeight: 600, color: 'var(--color-forest)', fontSize: '0.875rem' }}>Posting as</p>
              <p style={{ color: 'var(--color-slate)', fontSize: '0.875rem' }}>{user.name}</p>
            </div>
          </div>
        )}

        {error && <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertCircle size={18} /> {error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handlePost} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input className="form-input" placeholder="e.g., JavaScript Programming Book" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} disabled={loading} id="post-title" />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea className="form-input" placeholder="Describe your item in detail..." value={formData.description} onChange={(e) => handleChange('description', e.target.value)} rows={4} disabled={loading} id="post-description" />
          </div>

          {/* Price */}
          <div className="form-group">
            <label className="form-label">Price (৳) *</label>
            <input className="form-input" type="number" placeholder="0.00" min="0" step="0.01" value={formData.price} onChange={(e) => handleChange('price', e.target.value)} disabled={loading} id="post-price" />
          </div>

          {/* Selling Category */}
          <div className="form-group">
            <label className="form-label">Selling Category *</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {SELLING_CATEGORIES.map((cat) => (
                <button key={cat} type="button" className={`chip ${formData.sellingCategory === cat ? 'active' : ''}`} onClick={() => handleChange('sellingCategory', cat)} disabled={loading} id={`selling-cat-${cat}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Object Category */}
          <div className="form-group">
            <label className="form-label">Item Category *</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {OBJECT_CATEGORIES.map((cat) => (
                <button key={cat} type="button" className={`chip ${formData.objectCategory === cat ? 'active' : ''}`} onClick={() => handleChange('objectCategory', cat)} disabled={loading} id={`obj-cat-${cat}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="form-group">
            <label className="form-label">Availability *</label>
            <div className="tab-group" style={{ maxWidth: '320px' }}>
              {AVAILABILITY_OPTIONS.map((opt) => (
                <button key={opt} type="button" className={`tab-btn ${formData.availability === opt ? 'active' : ''}`} onClick={() => handleChange('availability', opt)} disabled={loading} id={`avail-${opt}`}>
                  {opt === 'IN_STOCK' ? 'Available' : 'Out of Stock'}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">Tags (comma-separated)</label>
            <input className="form-input" placeholder="e.g., Javascript, Textbook, Programming" value={formData.tags} onChange={(e) => handleChange('tags', e.target.value)} disabled={loading} id="post-tags" />
            <span className="form-hint">Separate tags with commas</span>
          </div>

          {/* Image URL */}
          <div className="form-group">
            <label className="form-label">Image URL *</label>
            <div style={{ position: 'relative' }}>
              <ImageIcon size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-sage)' }} />
              <input className="form-input" placeholder="https://example.com/image.jpg" value={formData.picture} onChange={(e) => handleChange('picture', e.target.value)} disabled={loading} style={{ paddingLeft: '2.75rem' }} id="post-image-url" />
            </div>
            {formData.picture.trim() && (
              <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', marginTop: '0.75rem', border: '1px solid var(--color-ash)' }}>
                <img src={formData.picture} alt="Preview" style={{ width: '100%', height: '200px', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '1rem', paddingBottom: '2rem' }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => navigate(-1)} disabled={loading} id="post-cancel">
              <X size={18} /> Cancel
            </button>
            <button type="submit" className="btn btn-sage" style={{ flex: 2 }} disabled={loading} id="post-submit">
              {loading ? 'Posting...' : <><PlusCircle size={18} /> Create Post</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Post;
