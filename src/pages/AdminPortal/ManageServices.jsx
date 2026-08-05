import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { Scissors, Plus, Trash2, Clock, HeartHandshake, CheckCircle2, X } from 'lucide-react';

export const ManageServices = () => {
  const { services, addService, deleteService } = useSalon();
  const [showAddModal, setShowAddModal] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Hair');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('45 mins');
  const [description, setDescription] = useState('');
  const [homeServiceAvailable, setHomeServiceAvailable] = useState(true);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!title || !price) return;
    addService({
      title,
      category,
      price: Number(price),
      duration,
      description,
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
      homeServiceAvailable
    });
    setShowAddModal(false);
    setTitle('');
    setPrice('');
    setDescription('');
  };

  return (
    <div style={{ paddingBottom: '3rem' }}>
      
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif gold-text" style={{ fontSize: '2rem', margin: 0 }}>Salon Service Catalog Management</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Add, edit, or remove salon services & pricing tiers</p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn-gold">
          <Plus size={18} /> Add New Salon Service
        </button>
      </div>

      {/* Services Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem' }}>Service Title</th>
                <th style={{ padding: '0.75rem' }}>Category</th>
                <th style={{ padding: '0.75rem' }}>Price</th>
                <th style={{ padding: '0.75rem' }}>Duration</th>
                <th style={{ padding: '0.75rem' }}>Home Service</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {services.map(srv => (
                <tr key={srv.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600, color: '#fff' }}>{srv.title}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{srv.category}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--accent-gold)' }}>₹{srv.price}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{srv.duration}</td>
                  <td style={{ padding: '0.75rem' }}>
                    {srv.homeServiceAvailable ? (
                      <span className="badge badge-home" style={{ fontSize: '0.7rem' }}>
                        <HeartHandshake size={12} /> Yes
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>In-Shop Only</span>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    <button 
                      onClick={() => {
                        if (window.confirm(`Delete service "${srv.title}"?`)) {
                          deleteService(srv.id);
                        }
                      }}
                      style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="font-serif gold-text" style={{ fontSize: '1.4rem', margin: 0 }}>Add New Service</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">Service Title</label>
                <input type="text" className="form-input" placeholder="e.g. Organic Hair Spa & Reflexology" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option>Hair</option>
                    <option>Skincare</option>
                    <option>Nails</option>
                    <option>Grooming</option>
                    <option>Special Care</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input type="number" className="form-input" placeholder="850" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Duration</label>
                <input type="text" className="form-input" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="45 mins" />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" rows={3} placeholder="Service benefits and procedures..." value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>

              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.6rem' }}>
                <input type="checkbox" id="homeEligible" checked={homeServiceAvailable} onChange={(e) => setHomeServiceAvailable(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                <label htmlFor="homeEligible" style={{ color: '#fff', fontSize: '0.9rem', cursor: 'pointer' }}>
                  Eligible for Elderly / Home Service Visits
                </label>
              </div>

              <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                Add Service to Catalog
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
