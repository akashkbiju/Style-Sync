import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { Briefcase, Plus, Star, UserCheck, X } from 'lucide-react';

export const ManageStaff = () => {
  const { staff, addStaffMember } = useSalon();
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState('');
  const [role, setRole] = useState('Senior Master Stylist');
  const [specialty, setSpecialty] = useState('Hair & Beard Sculpting');
  const [experience, setExperience] = useState('5 Years');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!name) return;
    addStaffMember({
      name,
      role,
      specialty,
      experience,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    });
    setShowAddModal(false);
    setName('');
  };

  return (
    <div style={{ paddingBottom: '3rem' }}>
      
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif gold-text" style={{ fontSize: '2rem', margin: 0 }}>Salon Staff Roster Management</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Manage stylists, roles, specialties, and active availability</p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn-gold">
          <Plus size={18} /> Add New Stylist / Staff
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {staff.map(stf => (
          <div key={stf.id} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img 
              src={stf.avatar} 
              alt={stf.name} 
              style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-gold)' }} 
            />
            <div>
              <h3 style={{ color: '#fff', margin: 0, fontSize: '1.1rem' }}>{stf.name}</h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{stf.role}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Specialty: {stf.specialty}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
                <span className="badge badge-completed" style={{ fontSize: '0.7rem' }}>⭐ {stf.rating}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stf.experience} Exp</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="font-serif gold-text" style={{ fontSize: '1.4rem', margin: 0 }}>Add New Staff Member</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">Stylist Full Name</label>
                <input type="text" className="form-input" placeholder="e.g. David Miller" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Role Title</label>
                <input type="text" className="form-input" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Hair Care & Styling Specialist" />
              </div>

              <div className="form-group">
                <label className="form-label">Specialty & Skills</label>
                <input type="text" className="form-input" value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="e.g. Home Visit Specialist for Senior Citizens" />
              </div>

              <div className="form-group">
                <label className="form-label">Experience</label>
                <input type="text" className="form-input" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="5 Years" />
              </div>

              <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                Save Staff Profile
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
