import React, { useEffect, useState } from 'react';
import { publicAPI, privateAPI } from '../api/api';
import { useUser } from '../context/UserContext';
import { Star, Send, MessageSquare } from 'lucide-react';

const StarRating = ({ value, onChange, size = 24 }) => (
  <div style={{ display: 'flex', gap: '0.25rem' }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange?.(star)}
        style={{
          background: 'none',
          border: 'none',
          cursor: onChange ? 'pointer' : 'default',
          padding: 0,
          color: star <= value ? '#F59E0B' : '#D1D5DB',
          transition: 'color 0.15s',
        }}
      >
        <Star size={size} fill={star <= value ? '#F59E0B' : 'none'} strokeWidth={1.5} />
      </button>
    ))}
  </div>
);

const ReviewSection = ({ itemId, completedRentalId }) => {
  const { user } = useUser();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hovered, setHovered] = useState(0);

  useEffect(() => {
    if (itemId) fetchReviews();
  }, [itemId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await publicAPI.get(`/review/${itemId}`);
      if (res.data.success) setReviews(res.data.data);
    } catch (err) {
      console.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) { setError('Please select a star rating'); return; }
    if (!completedRentalId) { setError('No completed rental found for this item'); return; }
    setSubmitting(true);
    setError('');
    try {
      await privateAPI.post('/review', {
        itemId,
        rentalId: completedRentalId,
        rating,
        comment,
      });
      setSuccess('Review submitted! Thank you.');
      setRating(0);
      setComment('');
      await fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="card mb-4">
      <div className="card-body">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <MessageSquare size={20} color="var(--color-forest)" />
          <h3 style={{ color: 'var(--color-forest)', margin: 0, fontSize: '1rem' }}>
            Reviews {reviews.length > 0 && `(${reviews.length})`}
          </h3>
          {reviews.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: 'auto' }}>
              <Star size={16} fill="#F59E0B" color="#F59E0B" />
              <span style={{ fontWeight: 700, color: 'var(--color-forest)' }}>{avgRating}</span>
            </div>
          )}
        </div>

        {/* Submit Review (only when completedRentalId is provided) */}
        {user && completedRentalId && (
          <form onSubmit={handleSubmit} style={{ background: '#F0FDF4', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              Leave a Review
            </p>
            {error && <div className="alert alert-error" style={{ marginBottom: '0.75rem', fontSize: '0.8125rem' }}>{error}</div>}
            {success && <div className="alert alert-success" style={{ marginBottom: '0.75rem', fontSize: '0.8125rem' }}>{success}</div>}

            <div style={{ marginBottom: '0.75rem' }}>
              <div
                style={{ display: 'flex', gap: '0.25rem' }}
                onMouseLeave={() => setHovered(0)}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHovered(star)}
                    onClick={() => setRating(star)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      color: star <= (hovered || rating) ? '#F59E0B' : '#D1D5DB',
                      transition: 'color 0.1s',
                    }}
                  >
                    <Star size={28} fill={star <= (hovered || rating) ? '#F59E0B' : 'none'} strokeWidth={1.5} />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              className="form-input"
              placeholder="Share your experience... (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              style={{ marginBottom: '0.75rem', resize: 'vertical' }}
              disabled={submitting}
            />
            <button type="submit" className="btn btn-sage btn-sm" disabled={submitting || !rating} id="submit-review-btn">
              {submitting ? 'Submitting...' : <><Send size={15} /> Submit Review</>}
            </button>
          </form>
        )}

        {/* Reviews List */}
        {loading ? (
          <p style={{ color: 'var(--color-slate)', fontSize: '0.875rem' }}>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p style={{ color: 'var(--color-slate)', fontSize: '0.875rem', textAlign: 'center', padding: '1rem 0' }}>
            No reviews yet. Be the first to review!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reviews.map((review) => (
              <div key={review.id} style={{ borderTop: '1px solid var(--color-ash)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem' }}>
                  <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>
                    {(review.reviewerId?.name?.[0] || 'U').toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-forest)', margin: 0 }}>
                      {review.reviewerId?.name || 'Student'}
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-slate)', margin: 0 }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <StarRating value={review.rating} size={14} />
                  </div>
                </div>
                {review.comment && (
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-slate)', margin: 0, lineHeight: 1.6 }}>
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
