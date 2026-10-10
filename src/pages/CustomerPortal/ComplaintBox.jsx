import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { 
  AlertTriangle, 
  Send, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  MessageSquare, 
  User, 
  FileText, 
  ChevronRight,
  Info,
  Sparkles
} from 'lucide-react';

export const ComplaintBox = () => {
  const { currentUser, complaints, submitComplaint } = useSalon();
  
  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'my-complaints'
  
  // Form State
  const [category, setCategory] = useState('Service Quality');
  const [urgency, setUrgency] = useState('Medium');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Filter complaints filed by this customer
  const myComplaints = complaints.filter(c => 
    (currentUser?.email && c.customerEmail === currentUser.email) ||
    (currentUser?.name && c.customerName === currentUser.name)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      await submitComplaint({
        customerName: currentUser?.name || 'Valued Customer',
        customerEmail: currentUser?.email || '',
        customerPhone: phone || currentUser?.phone || '',
        category,
        urgency,
        subject: subject.trim(),
        description: description.trim()
      });

      setSubmittedSuccess(true);
      setSubject('');
      setDescription('');
    } catch (err) {
      alert("Failed to submit complaint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Action Taken':
      case 'Resolved':
        return {
          bg: 'rgba(16, 185, 129, 0.15)',
          border: 'rgba(16, 185, 129, 0.4)',
          text: '#34d399',
          icon: <CheckCircle size={14} />,
          label: status
        };
      case 'Investigating':
        return {
          bg: 'rgba(59, 130, 246, 0.15)',
          border: 'rgba(59, 130, 246, 0.4)',
          text: '#60a5fa',
          icon: <Clock size={14} />,
          label: 'Under Investigation'
        };
      default:
        return {
          bg: 'rgba(245, 158, 11, 0.15)',
          border: 'rgba(245, 158, 11, 0.4)',
          text: '#fbbf24',
          icon: <AlertTriangle size={14} />,
          label: 'Pending Owner Review'
        };
    }
  };

  return (
    <div style={{ paddingBottom: '4rem', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Header Banner */}
      <div className="neon-panel" style={{ padding: '2rem', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: 'rgba(225, 29, 72, 0.15)', border: '1px solid rgba(225, 29, 72, 0.35)', color: 'var(--accent-red)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            <AlertTriangle size={13} /> Direct Management Grievance Portal
          </div>
          <h1 className="font-serif gold-text" style={{ fontSize: '2.4rem', margin: '0 0 0.5rem 0' }}>
            Salon Complaint & Feedback Box
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0, maxWidth: '700px', lineHeight: 1.6 }}>
            Your experience matters to us. Submit any concern, service grievance, or suggestion directly to the salon owner and executive management for immediate action and accountability.
          </p>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => { setActiveTab('new'); setSubmittedSuccess(false); }}
            className={activeTab === 'new' ? 'btn-gold' : 'btn-secondary'}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}
          >
            <FileText size={16} /> File a Complaint
          </button>

          <button
            onClick={() => setActiveTab('my-complaints')}
            className={activeTab === 'my-complaints' ? 'btn-gold' : 'btn-secondary'}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}
          >
            <ShieldCheck size={16} /> My Filed Complaints ({myComplaints.length})
          </button>
        </div>
      </div>

      {/* Tab 1: New Complaint Form */}
      {activeTab === 'new' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          {submittedSuccess ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                <CheckCircle size={32} style={{ color: '#10b981' }} />
              </div>
              <h2 className="font-serif gold-text" style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>Complaint Submitted Successfully</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '540px', margin: '0 auto 1.75rem auto', lineHeight: 1.6 }}>
                Your grievance has been logged directly with salon executive management. The owner reviews all complaints to ensure proper corrective actions are implemented.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button 
                  onClick={() => setActiveTab('my-complaints')} 
                  className="btn-gold" 
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
                >
                  <ShieldCheck size={16} /> Track Complaint Status
                </button>
                <button 
                  onClick={() => setSubmittedSuccess(false)} 
                  className="btn-secondary" 
                  style={{ padding: '0.75rem 1.5rem' }}
                >
                  Submit Another
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <Info size={16} style={{ color: 'var(--accent-gold)' }} />
                Logged in as <strong>{currentUser?.name || 'Customer'}</strong> ({currentUser?.email || 'Registered User'}). All complaints are confidential.
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                {/* Category */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Category of Grievance <span style={{ color: 'var(--accent-red)' }}>*</span></label>
                  <select 
                    className="form-select" 
                    value={category} 
                    onChange={e => setCategory(e.target.value)}
                    required
                  >
                    <option value="Service Quality">Service Quality (Hair, Styling, Color, Spa)</option>
                    <option value="Staff Conduct">Staff Conduct & Professionalism</option>
                    <option value="Cleanliness & Hygiene">Cleanliness, Sanitization & Hygiene</option>
                    <option value="Billing & Pricing">Billing, Hidden Charges & Pricing</option>
                    <option value="Appointment Delays">Appointment Delays & Waiting Time</option>
                    <option value="Elderly Home Care">Elderly At-Home Care Service Quality</option>
                    <option value="Salon Facility">Salon Facility, Noise or Equipment</option>
                    <option value="Other">Other / General Grievance</option>
                  </select>
                </div>

                {/* Urgency */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Urgency Level</label>
                  <select 
                    className="form-select" 
                    value={urgency} 
                    onChange={e => setUrgency(e.target.value)}
                  >
                    <option value="Low">Low — General feedback or minor suggestion</option>
                    <option value="Medium">Medium — Dissatisfied with service or visit</option>
                    <option value="High">High — Serious issue requiring prompt remedy</option>
                    <option value="Critical">Critical — Severe misconduct or safety issue</option>
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div className="form-group">
                <label className="form-label">Complaint Subject / Summary <span style={{ color: 'var(--accent-red)' }}>*</span></label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Unhygienic grooming tools / 40 minutes delay without notice"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  required
                />
              </div>

              {/* Detailed Description */}
              <div className="form-group">
                <label className="form-label">Detailed Description of What Happened <span style={{ color: 'var(--accent-red)' }}>*</span></label>
                <textarea 
                  className="form-textarea" 
                  rows={5}
                  placeholder="Please describe the incident, including date, time, staff involved (if known), and any expectations for management resolution..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                />
              </div>

              {/* Contact Phone for Follow-up */}
              <div className="form-group">
                <label className="form-label">Direct Callback Phone Number (Optional)</label>
                <input 
                  type="tel" 
                  className="form-input" 
                  placeholder="e.g. +91 9876543210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  🔒 Transmitted directly to salon owner & admin logs
                </span>
                <button 
                  type="submit" 
                  className="btn-gold" 
                  disabled={isSubmitting}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', opacity: isSubmitting ? 0.7 : 1 }}
                >
                  <Send size={16} /> {isSubmitting ? 'Submitting...' : 'Submit Complaint to Owner'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Tab 2: Customer's Filed Complaints & Resolutions */}
      {activeTab === 'my-complaints' && (
        <div>
          {myComplaints.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
              <ShieldCheck size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto' }} />
              <h3 className="font-serif gold-text" style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No Complaints Filed</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
                You have not filed any grievances yet. If you ever face an issue in our salon or home visits, our owner is here to help.
              </p>
              <button onClick={() => setActiveTab('new')} className="btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={16} /> File a Complaint
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {myComplaints.map(item => {
                const badge = getStatusBadge(item.status);
                return (
                  <div key={item.id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: `4px solid ${badge.text}` }}>
                    
                    {/* Top Row: Category + Urgency + Status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.85rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                            {item.category}
                          </span>
                          <span style={{ 
                            fontSize: '0.7rem', 
                            fontWeight: 700, 
                            padding: '0.15rem 0.5rem', 
                            borderRadius: '4px',
                            background: item.urgency === 'Critical' || item.urgency === 'High' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.04)',
                            color: item.urgency === 'Critical' || item.urgency === 'High' ? '#f87171' : 'var(--text-muted)',
                            border: item.urgency === 'Critical' || item.urgency === 'High' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255,255,255,0.06)'
                          }}>
                            {item.urgency} Urgency
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            • Filed on {item.date}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 700, margin: 0 }}>
                          {item.subject}
                        </h3>
                      </div>

                      {/* Status Pill */}
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '9999px',
                        background: badge.bg,
                        border: `1px solid ${badge.border}`,
                        color: badge.text,
                        fontSize: '0.8rem',
                        fontWeight: 700
                      }}>
                        {badge.icon} {badge.label}
                      </span>
                    </div>

                    {/* Complaint Body */}
                    <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.04)', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                      "{item.description}"
                    </div>

                    {/* Owner / Admin Action & Response Box */}
                    {item.adminAction ? (
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(6, 78, 59, 0.15))',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '1.1rem',
                        marginTop: '0.75rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <span style={{ color: '#34d399', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <ShieldCheck size={16} /> Official Management Action Taken:
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                            Action logged on {item.adminActionDate || item.date} by <strong>{item.adminName || 'Salon Owner'}</strong>
                          </span>
                        </div>
                        <p style={{ color: '#ecfdf5', margin: 0, fontSize: '0.9rem', lineHeight: 1.6, fontWeight: 500 }}>
                          "{item.adminAction}"
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', fontSize: '0.8rem', background: 'rgba(245, 158, 11, 0.06)', padding: '0.75rem 1rem', borderRadius: '4px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                        <Clock size={15} />
                        <span>Awaiting salon owner review. Corrective actions will be published here directly once assessed.</span>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
