import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { Star, MessageSquare, HeartHandshake, User } from 'lucide-react';

export const CustomerFeedback = () => {
  const { feedback } = useSalon();
  const [filterRating, setFilterRating] = useState('All');

  const filtered = feedback.filter(f => {
    if (filterRating === 'All') return true;
    return f.rating === Number(filterRating);
  });

  const avgRating = feedback.length > 0
    ? (feedback.reduce((acc, curr) => acc + curr.rating, 0) / feedback.length).toFixed(1)
    : '4.9';

  return (
    <div style={{ paddingBottom: '3rem' }}>
      
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif gold-text" style={{ fontSize: '2rem', margin: 0 }}>Customer Ratings & Feedback Log</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Monitor client reviews to optimize salon & elderly home care service quality</p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Average Rating</span>
          <div className="gold-text font-serif" style={{ fontSize: '1.8rem', fontWeight: 800 }}>⭐ {avgRating} / 5.0</div>
        </div>
      </div>

      {/* Filter Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['All', '5', '4', '3'].map(r => (
          <button
            key={r}
            onClick={() => setFilterRating(r)}
            className={filterRating === r ? 'btn-gold' : 'btn-secondary'}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
          >
            {r === 'All' ? 'All Ratings' : `⭐ ${r} Stars`}
          </button>
        ))}
      </div>

      {/* Reviews Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filtered.map(item => (
          <div key={item.id} className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <div style={{ display: 'flex', gap: '0.2rem' }}>
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} size={15} color="#d4af37" fill="#d4af37" />
                ))}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.date}</span>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#fff', fontStyle: 'italic', marginBottom: '1rem', lineHeight: 1.5 }}>
              "{item.comment}"
            </p>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--accent-gold-light)', fontWeight: 600 }}>— {item.customerName}</span>
              <span style={{ color: 'var(--text-muted)' }}>{item.serviceTitle}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
