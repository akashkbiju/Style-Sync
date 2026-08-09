import React, { useState } from 'react';
import { Star, X, CheckCircle2 } from 'lucide-react';
import { useSalon } from '../context/SalonContext';

export const FeedbackModal = ({ booking, onClose }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { addFeedback } = useSalon();

  const handleSubmit = (e) => {
    e.preventDefault();
    addFeedback({
      customerName: booking?.customerName || 'Valued Customer',
      serviceTitle: booking?.serviceTitle || 'Salon Service',
      rating,
      comment
    });
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '480px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 className="font-serif gold-text" style={{ fontSize: '1.35rem', margin: 0 }}>Service Feedback</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Help us refine our salon & home care experience</span>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {isSubmitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>Thank You for Your Feedback!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Your ratings help us maintain top-tier service quality.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            
            {/* Target Service Info */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Service Rated</div>
              <div style={{ fontWeight: 600, color: '#fff' }}>{booking?.serviceTitle}</div>
            </div>

            {/* Star Selection */}
            <div className="form-group" style={{ alignItems: 'center' }}>
              <label className="form-label">Overall Rating</label>
              <div style={{ display: 'flex', gap: '0.5rem', margin: '0.5rem 0' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={32}
                    cursor="pointer"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    color={(hoverRating || rating) >= star ? '#d4af37' : '#4b5563'}
                    fill={(hoverRating || rating) >= star ? '#d4af37' : 'none'}
                    style={{ transition: 'all 0.15s ease' }}
                  />
                ))}
              </div>
            </div>

            {/* Comments */}
            <div className="form-group">
              <label className="form-label">Your Review & Remarks</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Share your experience regarding staff politeness, punctuality, and service quality..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
              Submit Feedback
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
