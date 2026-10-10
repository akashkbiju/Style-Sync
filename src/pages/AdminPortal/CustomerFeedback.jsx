import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { 
  Star, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ShieldAlert, 
  ShieldCheck, 
  User, 
  Phone, 
  Mail, 
  Send,
  Filter
} from 'lucide-react';

export const CustomerFeedback = () => {
  const { feedback, complaints, updateComplaintStatus, currentUser } = useSalon();
  
  // Section toggle: 'complaints' | 'reviews'
  const [activeSection, setActiveSection] = useState('complaints');
  
  // Review filter
  const [filterRating, setFilterRating] = useState('All');

  // Complaint filters
  const [complaintStatusFilter, setComplaintStatusFilter] = useState('All');
  const [complaintCategoryFilter, setComplaintCategoryFilter] = useState('All');

  // Complaint Action editing state
  const [actionInputs, setActionInputs] = useState({});
  const [statusInputs, setStatusInputs] = useState({});
  const [savedActionId, setSavedActionId] = useState(null);

  // Reviews calculations
  const filteredReviews = (feedback || []).filter(f => {
    if (filterRating === 'All') return true;
    return f.rating === Number(filterRating);
  });

  const avgRating = (feedback && feedback.length > 0)
    ? (feedback.reduce((acc, curr) => acc + curr.rating, 0) / feedback.length).toFixed(1)
    : '4.9';

  // Complaints calculations
  const allComplaints = complaints || [];
  const pendingCount = allComplaints.filter(c => c.status === 'Pending Review').length;
  const investigatingCount = allComplaints.filter(c => c.status === 'Investigating').length;
  const resolvedCount = allComplaints.filter(c => c.status === 'Action Taken' || c.status === 'Resolved').length;

  const filteredComplaints = allComplaints.filter(c => {
    const matchesStatus = complaintStatusFilter === 'All' || c.status === complaintStatusFilter;
    const matchesCategory = complaintCategoryFilter === 'All' || c.category === complaintCategoryFilter;
    return matchesStatus && matchesCategory;
  });

  const handleActionNoteChange = (id, text) => {
    setActionInputs(prev => ({ ...prev, [id]: text }));
  };

  const handleStatusChange = (id, st) => {
    setStatusInputs(prev => ({ ...prev, [id]: st }));
  };

  const handleSaveAction = async (complaint) => {
    const newStatus = statusInputs[complaint.id] || complaint.status;
    const actionText = actionInputs[complaint.id] !== undefined ? actionInputs[complaint.id] : (complaint.adminAction || '');
    
    await updateComplaintStatus(
      complaint.id, 
      newStatus, 
      actionText, 
      currentUser?.name || 'Salon Executive Management'
    );

    setSavedActionId(complaint.id);
    setTimeout(() => setSavedActionId(null), 3000);
  };

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'Critical':
        return { bg: 'rgba(239, 68, 68, 0.2)', border: 'rgba(239, 68, 68, 0.5)', text: '#f87171' };
      case 'High':
        return { bg: 'rgba(245, 158, 11, 0.2)', border: 'rgba(245, 158, 11, 0.5)', text: '#fbbf24' };
      default:
        return { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.35)', text: '#60a5fa' };
    }
  };

  return (
    <div style={{ paddingBottom: '3rem' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-gold)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              Executive Quality Control
            </span>
            {pendingCount > 0 && (
              <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.15rem 0.6rem', borderRadius: '9999px', background: '#ef4444', color: '#fff', boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)' }}>
                🚨 {pendingCount} Pending Grievance{pendingCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <h1 className="font-serif gold-text" style={{ fontSize: '2.2rem', margin: 0 }}>Customer Grievance & Feedback Portal</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.95rem' }}>
            Review customer complaints, assign corrective actions, and track overall salon service satisfaction.
          </p>
        </div>

        {/* Quick Tabs: Complaints vs Reviews */}
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button
            onClick={() => setActiveSection('complaints')}
            className={activeSection === 'complaints' ? 'btn-gold' : 'btn-secondary'}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', fontSize: '0.88rem' }}
          >
            <AlertTriangle size={16} /> 
            Complaint Box ({allComplaints.length})
            {pendingCount > 0 && (
              <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.7rem', padding: '0.1rem 0.45rem', borderRadius: '9999px', fontWeight: 800 }}>
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSection('reviews')}
            className={activeSection === 'reviews' ? 'btn-gold' : 'btn-secondary'}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', fontSize: '0.88rem' }}
          >
            <Star size={16} /> Client Reviews ({feedback?.length || 0})
          </button>
        </div>
      </div>

      {/* ── SECTION 1: CUSTOMER COMPLAINTS & GRIEVANCE ACTION ── */}
      {activeSection === 'complaints' && (
        <div>
          {/* KPI Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div className="neon-card" style={{ padding: '1.25rem', borderLeft: '4px solid #60a5fa' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Complaints</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#fff', margin: '0.2rem 0' }}>{allComplaints.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>All logged client issues</div>
            </div>

            <div className="neon-card" style={{ padding: '1.25rem', borderLeft: '4px solid #f59e0b' }}>
              <div style={{ fontSize: '0.8rem', color: '#fbbf24', textTransform: 'uppercase', fontWeight: 600 }}>Pending Review</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#fbbf24', margin: '0.2rem 0' }}>{pendingCount}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Awaiting owner inspection</div>
            </div>

            <div className="neon-card" style={{ padding: '1.25rem', borderLeft: '4px solid #3b82f6' }}>
              <div style={{ fontSize: '0.8rem', color: '#60a5fa', textTransform: 'uppercase', fontWeight: 600 }}>Investigating</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#60a5fa', margin: '0.2rem 0' }}>{investigatingCount}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Action plan in progress</div>
            </div>

            <div className="neon-card" style={{ padding: '1.25rem', borderLeft: '4px solid #10b981' }}>
              <div style={{ fontSize: '0.8rem', color: '#34d399', textTransform: 'uppercase', fontWeight: 600 }}>Action Taken / Resolved</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#34d399', margin: '0.2rem 0' }}>{resolvedCount}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Remedied by management</div>
            </div>
          </div>

          {/* Filters Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            {/* Status Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['All', 'Pending Review', 'Investigating', 'Action Taken', 'Resolved'].map(st => (
                <button
                  key={st}
                  onClick={() => setComplaintStatusFilter(st)}
                  className={complaintStatusFilter === st ? 'btn-gold' : 'btn-secondary'}
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                >
                  {st === 'All' ? 'All Statuses' : st}
                </button>
              ))}
            </div>

            {/* Category Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Category:</span>
              <select
                className="form-select"
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', width: 'auto' }}
                value={complaintCategoryFilter}
                onChange={e => setComplaintCategoryFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Service Quality">Service Quality</option>
                <option value="Staff Conduct">Staff Conduct</option>
                <option value="Cleanliness & Hygiene">Cleanliness & Hygiene</option>
                <option value="Billing & Pricing">Billing & Pricing</option>
                <option value="Appointment Delays">Appointment Delays</option>
                <option value="Elderly Home Care">Elderly Home Care</option>
                <option value="Salon Facility">Salon Facility</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Complaints List */}
          {filteredComplaints.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
              <ShieldCheck size={44} style={{ color: '#10b981', margin: '0 auto 1rem auto' }} />
              <h3 className="font-serif gold-text" style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No Complaints Found</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto' }}>
                There are no grievances matching your active filter criteria. Great job maintaining quality standards!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {filteredComplaints.map(item => {
                const urg = getUrgencyBadge(item.urgency);
                const currentStatus = statusInputs[item.id] || item.status;
                const currentActionNote = actionInputs[item.id] !== undefined ? actionInputs[item.id] : (item.adminAction || '');
                const isSaved = savedActionId === item.id;

                return (
                  <div 
                    key={item.id} 
                    className="glass-panel" 
                    style={{ 
                      padding: '1.75rem', 
                      borderLeft: `5px solid ${item.status === 'Resolved' || item.status === 'Action Taken' ? '#10b981' : item.status === 'Investigating' ? '#3b82f6' : '#f59e0b'}`,
                      background: 'rgba(15, 15, 22, 0.85)'
                    }}
                  >
                    {/* Top Row: Client Info, Category, Urgency, Status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                            {item.category}
                          </span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '4px', background: urg.bg, color: urg.text, border: `1px solid ${urg.border}` }}>
                            {item.urgency} Urgency
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            • Filed {item.date}
                          </span>
                        </div>

                        <h3 style={{ fontSize: '1.3rem', color: '#fff', fontWeight: 700, margin: '0.3rem 0' }}>
                          {item.subject}
                        </h3>

                        {/* Customer Metadata */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-secondary)', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-gold)' }}>
                            <User size={14} /> <strong>{item.customerName}</strong>
                          </span>
                          {item.customerEmail && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <Mail size={13} /> {item.customerEmail}
                            </span>
                          )}
                          {item.customerPhone && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <Phone size={13} /> {item.customerPhone}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status indicator */}
                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.35rem 0.85rem',
                          borderRadius: '9999px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          background: item.status === 'Resolved' || item.status === 'Action Taken' ? 'rgba(16, 185, 129, 0.15)' : item.status === 'Investigating' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          border: `1px solid ${item.status === 'Resolved' || item.status === 'Action Taken' ? 'rgba(16, 185, 129, 0.4)' : item.status === 'Investigating' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
                          color: item.status === 'Resolved' || item.status === 'Action Taken' ? '#34d399' : item.status === 'Investigating' ? '#60a5fa' : '#fbbf24'
                        }}>
                          {item.status === 'Resolved' || item.status === 'Action Taken' ? <CheckCircle size={14} /> : item.status === 'Investigating' ? <Clock size={14} /> : <AlertTriangle size={14} />}
                          {item.status}
                        </span>
                      </div>
                    </div>

                    {/* Complaint Description */}
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.25rem', color: '#e2e8f0', fontSize: '0.92rem', lineHeight: 1.6 }}>
                      "{item.description}"
                    </div>

                    {/* ── ACTION TAKEN BY OWNER / ADMIN ── */}
                    <div style={{
                      background: 'rgba(20, 20, 30, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '1.25rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <ShieldAlert size={16} /> Owner / Admin Action & Corrective Plan
                        </span>
                        {item.adminActionDate && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Last updated on {item.adminActionDate} by <strong>{item.adminName || 'Admin'}</strong>
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                          <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Update Complaint Status</label>
                          <select 
                            className="form-select"
                            value={currentStatus}
                            onChange={e => handleStatusChange(item.id, e.target.value)}
                          >
                            <option value="Pending Review">⏳ Pending Review</option>
                            <option value="Investigating">🔍 Under Investigation</option>
                            <option value="Action Taken">🛡️ Action Taken (Remedy Issued)</option>
                            <option value="Resolved">✅ Closed & Fully Resolved</option>
                          </select>
                        </div>

                        <div>
                          <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Actioned By</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            disabled 
                            value={`${currentUser?.name || 'Salon Owner'} (Management)`} 
                          />
                        </div>
                      </div>

                      <div>
                        <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          Resolution Notes & Action Response (Visible to Client in their Complaint Box)
                        </label>
                        <textarea
                          className="form-textarea"
                          rows={3}
                          placeholder="e.g. Conducted inquiry with senior stylist, sanitized tools, and offered customer a complimentary deep conditioning on next visit..."
                          value={currentActionNote}
                          onChange={e => handleActionNoteChange(item.id, e.target.value)}
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                        {isSaved && (
                          <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <CheckCircle size={15} /> Action Saved & Updated for Client!
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleSaveAction(item)}
                          className="btn-gold"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.5rem', fontSize: '0.85rem' }}
                        >
                          <Send size={15} /> Save Action & Update Status
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── SECTION 2: CLIENT REVIEWS & RATINGS LOG ── */}
      {activeSection === 'reviews' && (
        <div>
          {/* Average Rating Box & Filter Pills */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
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

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Average Rating</span>
              <div className="gold-text font-serif" style={{ fontSize: '1.6rem', fontWeight: 800 }}>⭐ {avgRating} / 5.0</div>
            </div>
          </div>

          {/* Reviews Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {filteredReviews.map(item => (
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
      )}

    </div>
  );
};
