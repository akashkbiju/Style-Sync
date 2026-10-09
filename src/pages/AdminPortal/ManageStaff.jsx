import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSalon } from '../../context/SalonContext';
import {
  Briefcase, Plus, Star, UserCheck, X, Clock, CheckCircle, XCircle, Eye,
  AlertCircle, Shield, Award, Mail, Trash2, ChevronUp, ChevronDown,
  MessageCircle, Send, ArrowUpCircle, ArrowDownCircle, Activity,
  Calendar, TrendingUp, UserMinus
} from 'lucide-react';
import { sendApprovalEmail, sendRejectionEmail } from '../../firebase/emailService';

const STAFF_LEVELS = ['Junior', 'Mid-Level', 'Senior', 'Lead'];
const levelColors = {
  'Junior':    { bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.35)', text: '#60a5fa' },
  'Mid-Level': { bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.35)', text: '#34d399' },
  'Senior':    { bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.35)', text: '#fbbf24' },
  'Lead':      { bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.35)', text: '#c084fc' },
};

export const ManageStaff = () => {
  const {
    staff, addStaffMember, removeStaffMember, updateStaffLevel,
    pendingStaff, approvePendingStaff, rejectPendingStaff,
    bookings, feedback, staffMessages, sendStaffMessage, markStaffMessagesRead
  } = useSalon();

  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedPendingId, setExpandedPendingId] = useState(null);
  const [confirmRejectId, setConfirmRejectId] = useState(null);
  const [emailToast, setEmailToast] = useState(null);
  const [expandedStaffId, setExpandedStaffId] = useState(null);
  const [confirmRemoveId, setConfirmRemoveId] = useState(null);
  const [chatStaffId, setChatStaffId] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  const [name, setName] = useState('');
  const [role, setRole] = useState('Senior Master Stylist');
  const [specialty, setSpecialty] = useState('Hair & Beard Sculpting');
  const [experience, setExperience] = useState('5 Years');

  // Scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatStaffId, staffMessages]);

  // Staff activity data
  const getStaffActivity = (staffName) => {
    const staffBookings = bookings.filter(b => b.stylistName === staffName);
    const completed = staffBookings.filter(b => b.status === 'Completed');
    const pending = staffBookings.filter(b => b.status === 'Pending');
    const inProgress = staffBookings.filter(b => b.status === 'In-Progress');
    const revenue = completed.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
    const homeVisits = staffBookings.filter(b => b.type === 'home-service').length;
    const staffReviews = feedback ? feedback.filter(f => f.stylistName === staffName) : [];
    const avgRating = staffReviews.length > 0
      ? (staffReviews.reduce((s, r) => s + (r.rating || 5), 0) / staffReviews.length).toFixed(1)
      : 'N/A';
    return { staffBookings, completed, pending, inProgress, revenue, homeVisits, staffReviews, avgRating };
  };

  // Unread count for chat badge
  const getUnreadCount = (staffId) => {
    const msgs = staffMessages[staffId] || [];
    return msgs.filter(m => m.sender === 'staff' && !m.read).length;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!name) return;
    addStaffMember({
      name, role, specialty, experience, level: 'Junior',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    });
    setShowAddModal(false);
    setName('');
  };

  const showToast = (type, memberName, memberEmail) => {
    setEmailToast({ type, name: memberName, email: memberEmail });
    setTimeout(() => setEmailToast(null), 5000);
  };

  const handleApprove = async (id) => {
    const pm = pendingStaff.find(p => p.id === id);
    await approvePendingStaff(id);
    if (pm?.email) { await sendApprovalEmail(pm); showToast('approved', pm.name, pm.email); }
  };

  const handleReject = async (id) => {
    const pm = pendingStaff.find(p => p.id === id);
    await rejectPendingStaff(id);
    setConfirmRejectId(null);
    if (pm?.email) { await sendRejectionEmail(pm); showToast('rejected', pm.name, pm.email); }
  };

  const handleSendChat = (staffId) => {
    if (!chatInput.trim()) return;
    sendStaffMessage(staffId, chatInput.trim(), 'admin');
    setChatInput('');
  };

  const handleRemoveStaff = async (id) => {
    await removeStaffMember(id);
    setConfirmRemoveId(null);
    setExpandedStaffId(null);
  };

  const handleLevelChange = async (staffId, newLevel) => {
    await updateStaffLevel(staffId, newLevel);
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Unknown';
    const d = new Date(isoString);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) +
      ' at ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatChatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ paddingBottom: '3rem' }}>

      {/* Toast */}
      {emailToast && (
        <div style={{
          position: 'fixed', top: '5.5rem', right: '1.5rem', zIndex: 9999,
          padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)',
          background: emailToast.type === 'approved'
            ? 'linear-gradient(135deg, rgba(16,185,129,0.95), rgba(5,150,105,0.95))'
            : 'linear-gradient(135deg, rgba(239,68,68,0.95), rgba(185,28,28,0.95))',
          color: '#fff', boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', gap: '0.75rem', maxWidth: '420px',
          animation: 'fadeIn 0.3s ease', backdropFilter: 'blur(10px)'
        }}>
          <Mail size={20} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
              {emailToast.type === 'approved' ? '✅ Approval Email Sent' : '📧 Rejection Email Sent'}
            </div>
            <div style={{ fontSize: '0.78rem', opacity: 0.9, marginTop: '0.15rem' }}>
              Notification sent to <strong>{emailToast.name}</strong> ({emailToast.email})
            </div>
          </div>
          <button onClick={() => setEmailToast(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif gold-text" style={{ fontSize: '2rem', margin: 0 }}>Salon Staff Management</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Approve, promote, chat, and manage your team</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-gold">
          <Plus size={18} /> Add New Staff
        </button>
      </div>

      {/* ═════════════════════════════════════════════════════════════════
          PENDING APPROVALS
          ═════════════════════════════════════════════════════════════════ */}
      {pendingStaff.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem',
            padding: '1rem 1.25rem',
            background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.04))',
            border: '1px solid rgba(245,158,11,0.3)', borderRadius: 'var(--radius-md)'
          }}>
            <Clock size={18} style={{ color: '#f59e0b' }} />
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#fbbf24', fontFamily: 'var(--font-serif)' }}>
                Pending Approval Requests
              </h2>
              <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {pendingStaff.length} registration{pendingStaff.length > 1 ? 's' : ''} awaiting review
              </p>
            </div>
            <span style={{ padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.4)', color: '#fbbf24', fontSize: '0.8rem', fontWeight: 700 }}>
              {pendingStaff.length} Pending
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingStaff.map(pending => {
              const isExp = expandedPendingId === pending.id;
              const isConfirm = confirmRejectId === pending.id;
              return (
                <div key={pending.id} style={{ background: 'linear-gradient(135deg, rgba(20,20,28,0.95), rgba(25,22,16,0.9))', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <div onClick={() => setExpandedPendingId(isExp ? null : pending.id)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', cursor: 'pointer' }}>
                    <img src={pending.avatar} alt={pending.name} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(245,158,11,0.4)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                        <h3 style={{ color: '#fff', margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>{pending.name}</h3>
                        <span style={{ padding: '0.2rem 0.6rem', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.35)', borderRadius: 'var(--radius-full)', color: '#fbbf24', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>⏳ Pending</span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{pending.role || pending.staffRole}</div>
                    </div>
                    <Eye size={16} style={{ color: 'var(--text-muted)', transform: isExp ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
                  </div>
                  {isExp && (
                    <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)', animation: 'fadeIn 0.3s ease' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', padding: '1rem 0' }}>
                        {[
                          { label: 'Email', val: pending.email || 'Not provided' },
                          { label: 'Phone', val: pending.phone || 'Not provided' },
                          { label: 'Specialization', val: pending.specialty || pending.role || 'N/A' },
                          { label: 'Experience', val: pending.experience || 'Not specified', highlight: true }
                        ].map((d, i) => (
                          <div key={i} style={{ padding: '0.75rem', background: d.highlight ? 'rgba(168,85,247,0.06)' : 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: `1px solid ${d.highlight ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.06)'}` }}>
                            <div style={{ fontSize: '0.65rem', color: d.highlight ? 'var(--accent-purple)' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem', fontWeight: 600 }}>{d.label}</div>
                            <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>{d.val}</div>
                          </div>
                        ))}
                      </div>
                      {pending.workingHistory && pending.workingHistory !== 'New to the team' && (
                        <div style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '1rem' }}>
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem', fontWeight: 600 }}>Working History</div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{pending.workingHistory}</p>
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        {isConfirm ? (
                          <>
                            <span style={{ fontSize: '0.82rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.4rem', marginRight: 'auto' }}><AlertCircle size={15} /> Confirm rejection?</span>
                            <button onClick={() => setConfirmRejectId(null)} style={{ padding: '0.6rem 1.15rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                            <button onClick={() => handleReject(pending.id)} style={{ padding: '0.6rem 1.15rem', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 'var(--radius-sm)', color: '#f87171', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><XCircle size={15} /> Yes, Reject</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => setConfirmRejectId(pending.id)} style={{ padding: '0.6rem 1.35rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', color: '#f87171', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><XCircle size={15} /> Reject</button>
                            <button onClick={() => handleApprove(pending.id)} style={{ padding: '0.6rem 1.35rem', background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.1))', border: '1.5px solid rgba(16,185,129,0.5)', borderRadius: 'var(--radius-sm)', color: '#34d399', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 0 15px rgba(16,185,129,0.15)' }}><CheckCircle size={15} /> Approve & Add</button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          ACTIVE STAFF ROSTER (Enhanced)
          ═════════════════════════════════════════════════════════════════ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', padding: '0.85rem 1.25rem', background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.02))', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--radius-md)' }}>
        <Shield size={18} style={{ color: '#34d399' }} />
        <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#34d399', fontFamily: 'var(--font-serif)' }}>
          Active Staff Roster ({staff.length})
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {staff.map(stf => {
          const isExp = expandedStaffId === stf.id;
          const act = getStaffActivity(stf.name);
          const currentLevel = stf.level || 'Junior';
          const lc = levelColors[currentLevel] || levelColors['Junior'];
          const unread = getUnreadCount(stf.id);

          return (
            <div key={stf.id} style={{
              background: 'linear-gradient(135deg, rgba(20,20,28,0.95), rgba(18,18,22,0.9))',
              border: isExp ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.06)',
              borderRadius: 'var(--radius-md)', overflow: 'hidden', transition: 'all 0.3s ease'
            }}>
              {/* Staff Row Header */}
              <div onClick={() => setExpandedStaffId(isExp ? null : stf.id)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.1rem 1.25rem', cursor: 'pointer' }}>
                <img src={stf.avatar} alt={stf.name} style={{ width: '58px', height: '58px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-gold)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <h3 style={{ color: '#fff', margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>{stf.name}</h3>
                    {/* Level Badge */}
                    <span style={{ padding: '0.18rem 0.6rem', background: lc.bg, border: `1px solid ${lc.border}`, borderRadius: 'var(--radius-full)', color: lc.text, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      {currentLevel}
                    </span>
                    {stf.isLoggedIn && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{stf.role}</div>
                </div>
                {/* Quick Stats */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-red)' }}>{act.staffBookings.length}</div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Bookings</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#34d399' }}>₹{act.revenue.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Revenue</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fbbf24' }}>⭐{act.avgRating}</div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rating</div>
                  </div>
                  {/* Chat badge */}
                  {unread > 0 && (
                    <div style={{ minWidth: '22px', height: '22px', borderRadius: '11px', background: '#e11d48', color: '#fff', fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px', boxShadow: '0 0 10px rgba(225,29,72,0.5)' }}>
                      {unread}
                    </div>
                  )}
                  {isExp ? <ChevronUp size={18} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />}
                </div>
              </div>

              {/* Expanded Panel */}
              {isExp && (
                <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)', animation: 'fadeIn 0.3s ease' }}>

                  {/* Activity Stats Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', padding: '1rem 0' }}>
                    {[
                      { label: 'Total Bookings', val: act.staffBookings.length, color: 'var(--accent-red)', icon: <Calendar size={14} /> },
                      { label: 'Completed', val: act.completed.length, color: '#34d399', icon: <CheckCircle size={14} /> },
                      { label: 'In Progress', val: act.inProgress.length, color: '#60a5fa', icon: <Activity size={14} /> },
                      { label: 'Pending', val: act.pending.length, color: '#fbbf24', icon: <Clock size={14} /> },
                      { label: 'Home Visits', val: act.homeVisits, color: '#c084fc', icon: <Briefcase size={14} /> },
                      { label: 'Revenue', val: `₹${act.revenue.toLocaleString('en-IN')}`, color: '#34d399', icon: <TrendingUp size={14} /> },
                    ].map((stat, i) => (
                      <div key={i} style={{ padding: '0.7rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', color: stat.color, marginBottom: '0.3rem' }}>{stat.icon}</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: stat.color }}>{stat.val}</div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Staff Details Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ padding: '0.7rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem', fontWeight: 600 }}>Specialty</div>
                      <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>{stf.specialty || stf.role}</div>
                    </div>
                    <div style={{ padding: '0.7rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem', fontWeight: 600 }}>Experience</div>
                      <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>{stf.experience || 'N/A'}</div>
                    </div>
                    <div style={{ padding: '0.7rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem', fontWeight: 600 }}>Email</div>
                      <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>{stf.email || 'N/A'}</div>
                    </div>
                    <div style={{ padding: '0.7rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem', fontWeight: 600 }}>Reviews</div>
                      <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>{act.staffReviews.length} reviews • ⭐ {act.avgRating}</div>
                    </div>
                  </div>

                  {/* Recent Feedback */}
                  {act.staffReviews.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ color: '#fbbf24', fontSize: '0.8rem', fontWeight: 700, margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Star size={13} /> Recent Reviews</h4>
                      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                        {act.staffReviews.slice(0, 3).map((r, i) => (
                          <div key={i} style={{ minWidth: '220px', padding: '0.6rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ fontSize: '0.7rem', color: '#fbbf24', marginBottom: '0.2rem' }}>{'⭐'.repeat(r.rating || 5)}</div>
                            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{r.comment || r.message}</p>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>— {r.customerName}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Promote / Demote Level */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', padding: '0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Staff Level:</span>
                    {STAFF_LEVELS.map(lvl => {
                      const lCol = levelColors[lvl];
                      const isActive = currentLevel === lvl;
                      return (
                        <button
                          key={lvl}
                          onClick={() => handleLevelChange(stf.id, lvl)}
                          style={{
                            padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)',
                            background: isActive ? lCol.bg : 'transparent',
                            border: isActive ? `1.5px solid ${lCol.border}` : '1px solid rgba(255,255,255,0.1)',
                            color: isActive ? lCol.text : 'var(--text-muted)',
                            fontSize: '0.75rem', fontWeight: isActive ? 700 : 500,
                            cursor: 'pointer', transition: 'all 0.2s ease'
                          }}
                        >
                          {lvl}
                        </button>
                      );
                    })}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    {/* Chat Button */}
                    <button onClick={(e) => { e.stopPropagation(); setChatStaffId(stf.id); markStaffMessagesRead(stf.id, 'admin'); }} style={{
                      padding: '0.55rem 1.2rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)',
                      borderRadius: 'var(--radius-sm)', color: '#60a5fa', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s ease', position: 'relative'
                    }}>
                      <MessageCircle size={15} /> Chat
                      {unread > 0 && <span style={{ minWidth: '16px', height: '16px', borderRadius: '50%', background: '#e11d48', color: '#fff', fontSize: '0.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unread}</span>}
                    </button>

                    {/* Remove Button */}
                    {confirmRemoveId === stf.id ? (
                      <>
                        <span style={{ fontSize: '0.78rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><AlertCircle size={14} /> Remove permanently?</span>
                        <button onClick={() => setConfirmRemoveId(null)} style={{ padding: '0.55rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                        <button onClick={() => handleRemoveStaff(stf.id)} style={{ padding: '0.55rem 1rem', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 'var(--radius-sm)', color: '#f87171', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Trash2 size={14} /> Yes, Remove</button>
                      </>
                    ) : (
                      <button onClick={() => setConfirmRemoveId(stf.id)} style={{ padding: '0.55rem 1.2rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--radius-sm)', color: '#f87171', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <UserMinus size={15} /> Remove Staff
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ═════════════════════════════════════════════════════════════════
          CHAT MODAL
          ═════════════════════════════════════════════════════════════════ */}
      {chatStaffId && (() => {
        const chatStaff = staff.find(s => s.id === chatStaffId);
        const msgs = staffMessages[chatStaffId] || [];
        return (
          <div className="modal-overlay" onClick={() => setChatStaffId(null)}>
            <div onClick={e => e.stopPropagation()} style={{
              width: '100%', maxWidth: '480px',
              background: 'linear-gradient(135deg, rgba(15,15,22,0.98), rgba(20,18,12,0.95))',
              border: '1.5px solid rgba(59,130,246,0.3)', borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column',
              maxHeight: '75vh', overflow: 'hidden'
            }}>
              {/* Chat Header */}
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '0.85rem', flexShrink: 0 }}>
                <img src={chatStaff?.avatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(59,130,246,0.4)' }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: '1rem', fontWeight: 700 }}>{chatStaff?.name}</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{chatStaff?.role} • {chatStaff?.level || 'Junior'}</div>
                </div>
                <button onClick={() => setChatStaffId(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', minHeight: '200px' }}>
                {msgs.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                    <MessageCircle size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                    <p style={{ fontSize: '0.85rem' }}>No messages yet. Start a conversation!</p>
                  </div>
                )}
                {msgs.map(msg => (
                  <div key={msg.id} style={{
                    alignSelf: msg.sender === 'admin' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%'
                  }}>
                    <div style={{
                      padding: '0.65rem 1rem',
                      borderRadius: msg.sender === 'admin' ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
                      background: msg.sender === 'admin'
                        ? 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(59,130,246,0.12))'
                        : 'rgba(255,255,255,0.06)',
                      border: msg.sender === 'admin' ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(255,255,255,0.08)',
                      color: '#fff', fontSize: '0.85rem', lineHeight: 1.5
                    }}>
                      {msg.text}
                    </div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '0.2rem', textAlign: msg.sender === 'admin' ? 'right' : 'left' }}>
                      {msg.senderName} • {formatChatTime(msg.timestamp)}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div style={{ padding: '0.85rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Type a message..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendChat(chatStaffId)}
                  style={{ flex: 1 }}
                  autoFocus
                />
                <button onClick={() => handleSendChat(chatStaffId)} style={{
                  padding: '0.6rem 1rem', background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(59,130,246,0.15))',
                  border: '1px solid rgba(59,130,246,0.4)', borderRadius: 'var(--radius-sm)',
                  color: '#60a5fa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
                  fontWeight: 700, fontSize: '0.85rem'
                }}>
                  <Send size={15} />
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ═════════════════════════════════════════════════════════════════
          ADD STAFF MODAL
          ═════════════════════════════════════════════════════════════════ */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="font-serif gold-text" style={{ fontSize: '1.4rem', margin: 0 }}>Add New Staff Member</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', padding: '0.6rem 0.8rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--radius-sm)' }}>
              <CheckCircle size={13} style={{ color: '#34d399', verticalAlign: 'middle', marginRight: '0.4rem' }} />
              Staff added by admin are <strong style={{ color: '#34d399' }}>automatically approved</strong>.
            </p>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group"><label className="form-label">Full Name</label><input type="text" className="form-input" placeholder="e.g. David Miller" value={name} onChange={e => setName(e.target.value)} required /></div>
              <div className="form-group"><label className="form-label">Role Title</label><input type="text" className="form-input" value={role} onChange={e => setRole(e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Specialty</label><input type="text" className="form-input" value={specialty} onChange={e => setSpecialty(e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Experience</label><input type="text" className="form-input" value={experience} onChange={e => setExperience(e.target.value)} /></div>
              <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>Save Staff Profile</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
