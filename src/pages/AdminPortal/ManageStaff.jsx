import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSalon } from '../../context/SalonContext';
import {
  Briefcase, Plus, Star, UserCheck, X, Clock, CheckCircle, XCircle, Eye,
  AlertCircle, Shield, Award, Mail, Trash2, ChevronUp, ChevronDown,
  MessageCircle, Send, ArrowUpCircle, ArrowDownCircle, Activity,
  Calendar, TrendingUp, UserMinus, DollarSign, Save, Sliders, Settings,
  FileText, Check, Download, CreditCard, Wallet, Search, Filter, RefreshCw
} from 'lucide-react';
import { 
  sendApprovalEmail, 
  sendRejectionEmail, 
  getStaffApprovalMailtoUrl, 
  getStaffRejectionMailtoUrl 
} from '../../firebase/emailService';

const STAFF_LEVELS = ['Junior', 'Mid-Level', 'Senior', 'Lead'];
const levelColors = {
  'Junior':    { bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.35)', text: '#60a5fa' },
  'Mid-Level': { bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.35)', text: '#34d399' },
  'Senior':    { bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.35)', text: '#fbbf24' },
  'Lead':      { bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.35)', text: '#c084fc' },
};

export const ManageStaff = ({ initialTab = 'roster' }) => {
  const {
    staff, addStaffMember, removeStaffMember, updateStaffLevel,
    pendingStaff, approvePendingStaff, rejectPendingStaff,
    bookings, feedback, staffMessages, sendStaffMessage, markStaffMessagesRead,
    staffAttendance, leaveRequests, updateLeaveRequestStatus, currentUser,
    updateStaffSalary, calcSalaryBreakdown, salarySettings, updateSalarySettings,
    salaryDisbursements, recordSalaryPayout
  } = useSalon();

  const [staffAdminTab, setStaffAdminTab] = useState(initialTab); // 'roster' | 'attendance' | 'leaves' | 'salary'
  const [leaveRemarksMap, setLeaveRemarksMap] = useState({});
  const [leaveFilter, setLeaveFilter] = useState('All');
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().split('T')[0]);
  // Salary editing state per staff id: { [staffId]: monthlySalaryString }
  const [salaryEditMap, setSalaryEditMap] = useState({});
  const [salarySavedId, setSalarySavedId] = useState(null);

  // Salary & Payroll Tab State
  const [selectedSalaryMonth, setSelectedSalaryMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [salarySearchTerm, setSalarySearchTerm] = useState('');
  const [salaryFilterLevel, setSalaryFilterLevel] = useState('All');
  const [activeEditingSalaryId, setActiveEditingSalaryId] = useState(null);

  // Global Salary Settings Modal State
  const [showSalarySettingsModal, setShowSalarySettingsModal] = useState(false);
  const [tempSalarySettings, setTempSalarySettings] = useState(null);
  const [settingsSaveSuccess, setSettingsSaveSuccess] = useState(false);

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

  const showToast = (type, memberName, memberEmail, mailtoUrl = '') => {
    setEmailToast({ type, name: memberName, email: memberEmail, mailtoUrl });
    setTimeout(() => setEmailToast(null), 8000);
  };

  const handleApprove = async (id) => {
    const pm = pendingStaff.find(p => p.id === id);
    await approvePendingStaff(id);
    if (pm?.email) {
      const mailtoUrl = getStaffApprovalMailtoUrl(pm);
      await sendApprovalEmail(pm);
      showToast('approved', pm.name, pm.email, mailtoUrl);
    }
  };

  const handleReject = async (id) => {
    const pm = pendingStaff.find(p => p.id === id);
    await rejectPendingStaff(id);
    setConfirmRejectId(null);
    if (pm?.email) {
      const mailtoUrl = getStaffRejectionMailtoUrl(pm);
      await sendRejectionEmail(pm);
      showToast('rejected', pm.name, pm.email, mailtoUrl);
    }
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

  const handleSalarySave = async (staffId) => {
    const raw = salaryEditMap[staffId];
    const monthlySalary = parseFloat(raw);
    if (!raw || isNaN(monthlySalary) || monthlySalary < 0) return;
    await updateStaffSalary(staffId, monthlySalary);
    setSalarySavedId(staffId);
    setTimeout(() => setSalarySavedId(null), 2500);
  };

  const handleOpenSalarySettings = () => {
    setTempSalarySettings({
      workingDaysPerMonth: salarySettings?.workingDaysPerMonth || 26,
      halfDayDeductionRate: salarySettings?.halfDayDeductionRate !== undefined ? salarySettings.halfDayDeductionRate : 0.5,
      autoDeductLeaves: salarySettings?.autoDeductLeaves !== false,
      payCycleDay: salarySettings?.payCycleDay || 1,
      minimumWageThreshold: salarySettings?.minimumWageThreshold || 10000,
      currencySymbol: salarySettings?.currencySymbol || '₹',
    });
    setShowSalarySettingsModal(true);
  };

  const handleSaveSalarySettings = async (e) => {
    e.preventDefault();
    if (!tempSalarySettings) return;
    await updateSalarySettings({
      ...tempSalarySettings,
      workingDaysPerMonth: Math.max(15, Math.min(31, parseInt(tempSalarySettings.workingDaysPerMonth) || 26)),
      halfDayDeductionRate: parseFloat(tempSalarySettings.halfDayDeductionRate) || 0.5,
      minimumWageThreshold: Math.max(0, parseInt(tempSalarySettings.minimumWageThreshold) || 10000),
      payCycleDay: Math.max(1, Math.min(31, parseInt(tempSalarySettings.payCycleDay) || 1))
    });
    setSettingsSaveSuccess(true);
    setTimeout(() => {
      setSettingsSaveSuccess(false);
      setShowSalarySettingsModal(false);
    }, 1200);
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

  const handleApproveLeave = async (leaveId) => {
    const remarks = leaveRemarksMap[leaveId] || 'Approved by Salon Administration';
    await updateLeaveRequestStatus(leaveId, 'Approved', remarks, currentUser?.name || 'Salon Admin');
  };

  const handleRejectLeave = async (leaveId) => {
    const remarks = leaveRemarksMap[leaveId] || 'Rejected due to salon booking schedule';
    await updateLeaveRequestStatus(leaveId, 'Rejected', remarks, currentUser?.name || 'Salon Admin');
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const pendingLeavesCount = (leaveRequests || []).filter(l => l.status === 'Pending').length;
  const filteredLeaves = (leaveRequests || []).filter(l => leaveFilter === 'All' ? true : l.status === leaveFilter);

  return (
    <div style={{ paddingBottom: '3rem' }}>

      {/* Toast */}
      {emailToast && (
        <div style={{
          position: 'fixed', top: '5.5rem', right: '1.5rem', zIndex: 9999,
          padding: '1rem 1.35rem', borderRadius: 'var(--radius-md)',
          background: emailToast.type === 'approved'
            ? 'linear-gradient(135deg, rgba(16,185,129,0.95), rgba(5,150,105,0.95))'
            : 'linear-gradient(135deg, rgba(239,68,68,0.95), rgba(185,28,28,0.95))',
          color: '#fff', boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'flex-start', gap: '0.75rem', maxWidth: '440px',
          animation: 'fadeIn 0.3s ease', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <Mail size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
              {emailToast.type === 'approved' ? '✅ Approval Notice Dispatched' : '📧 Rejection Notice Dispatched'}
            </div>
            <div style={{ fontSize: '0.78rem', opacity: 0.95, marginTop: '0.2rem', lineHeight: 1.4 }}>
              Dispatched to registered staff email: <br/>
              <strong style={{ color: '#fff', textDecoration: 'underline' }}>{emailToast.email}</strong>
            </div>
            {emailToast.mailtoUrl && (
              <div style={{ marginTop: '0.5rem' }}>
                <a
                  href={emailToast.mailtoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.3rem 0.65rem',
                    borderRadius: '4px',
                    background: 'rgba(255,255,255,0.22)',
                    border: '1px solid rgba(255,255,255,0.35)',
                    color: '#fff',
                    fontSize: '0.73rem',
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  <Send size={12} /> Open in Mail Client (Direct) ↗
                </a>
              </div>
            )}
          </div>
          <button onClick={() => setEmailToast(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px', flexShrink: 0 }}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif gold-text" style={{ fontSize: '2rem', margin: 0 }}>Salon Staff Management</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Roster, Daily Attendance Tracking, and Leave Approval Administration</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-gold">
          <Plus size={18} /> Add New Staff
        </button>
      </div>

      {/* Section Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
        <button
          type="button"
          onClick={() => setStaffAdminTab('roster')}
          style={{
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            border: staffAdminTab === 'roster' ? '1.5px solid var(--accent-red)' : '1px solid rgba(225, 29, 72, 0.35)',
            background: staffAdminTab === 'roster' ? 'rgba(225, 29, 72, 0.15)' : 'rgba(225, 29, 72, 0.03)',
            color: staffAdminTab === 'roster' ? 'var(--accent-red)' : 'var(--text-secondary)',
            boxShadow: staffAdminTab === 'roster' ? '0 0 15px var(--accent-red-glow)' : 'none',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
        >
          <Briefcase size={16} /> Team Roster ({staff.length})
          {pendingStaff.length > 0 && (
            <span className="badge" style={{ background: '#f59e0b', color: '#000', fontSize: '0.7rem', padding: '0.1rem 0.45rem', fontWeight: 800 }}>
              {pendingStaff.length} New
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setStaffAdminTab('attendance')}
          style={{
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            border: staffAdminTab === 'attendance' ? '1.5px solid var(--accent-red)' : '1px solid rgba(225, 29, 72, 0.35)',
            background: staffAdminTab === 'attendance' ? 'rgba(225, 29, 72, 0.15)' : 'rgba(225, 29, 72, 0.03)',
            color: staffAdminTab === 'attendance' ? 'var(--accent-red)' : 'var(--text-secondary)',
            boxShadow: staffAdminTab === 'attendance' ? '0 0 15px var(--accent-red-glow)' : 'none',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
        >
          <Clock size={16} /> Daily Attendance Logs ({(staffAttendance || []).filter(a => a.date === todayStr).length} Active)
        </button>

        <button
          type="button"
          onClick={() => setStaffAdminTab('leaves')}
          style={{
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            border: staffAdminTab === 'leaves' ? '1.5px solid var(--accent-red)' : '1px solid rgba(225, 29, 72, 0.35)',
            background: staffAdminTab === 'leaves' ? 'rgba(225, 29, 72, 0.15)' : 'rgba(225, 29, 72, 0.03)',
            color: staffAdminTab === 'leaves' ? 'var(--accent-red)' : 'var(--text-secondary)',
            boxShadow: staffAdminTab === 'leaves' ? '0 0 15px var(--accent-red-glow)' : 'none',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
        >
          <Calendar size={16} /> Leave Requests ({(leaveRequests || []).length})
          {pendingLeavesCount > 0 && (
            <span className="badge" style={{ background: '#e11d48', color: '#fff', fontSize: '0.7rem', padding: '0.1rem 0.5rem', fontWeight: 800 }}>
              {pendingLeavesCount} Pending
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setStaffAdminTab('salary')}
          style={{
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            border: staffAdminTab === 'salary' ? '1.5px solid #10b981' : '1px solid rgba(16, 185, 129, 0.35)',
            background: staffAdminTab === 'salary' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.03)',
            color: staffAdminTab === 'salary' ? '#34d399' : 'var(--text-secondary)',
            boxShadow: staffAdminTab === 'salary' ? '0 0 15px rgba(16, 185, 129, 0.3)' : 'none',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
        >
          <DollarSign size={16} /> Salary &amp; Payroll ({staff.filter(s => s.monthlySalary > 0).length}/{staff.length} Active)
        </button>
      </div>

      {/* TAB 1: ROSTER & REGISTRATION APPROVALS */}
      {staffAdminTab === 'roster' && (
        <>
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

                  {/* ── Salary Management Section ── */}
                  <div style={{
                    padding: '1rem 1.1rem',
                    marginBottom: '1rem',
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.07), rgba(16,185,129,0.02))',
                    border: '1px solid rgba(16,185,129,0.2)',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <DollarSign size={15} style={{ color: '#34d399' }} />
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Salary Management</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '180px' }}>
                        <label style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>Monthly Gross Salary (₹)</label>
                        <input
                          type="number"
                          min="0"
                          placeholder={stf.monthlySalary ? String(stf.monthlySalary) : 'e.g. 25000'}
                          value={salaryEditMap[stf.id] !== undefined ? salaryEditMap[stf.id] : (stf.monthlySalary || '')}
                          onChange={e => setSalaryEditMap(prev => ({ ...prev, [stf.id]: e.target.value }))}
                          className="form-input"
                          style={{ padding: '0.45rem 0.75rem', fontSize: '0.9rem', fontWeight: 700, color: '#34d399' }}
                        />
                      </div>
                      <div style={{ textAlign: 'center', minWidth: '110px' }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem', fontWeight: 600 }}>Per-Day Deduction</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f87171' }}>
                          ₹{stf.monthlySalary ? Math.round(stf.monthlySalary / 26).toLocaleString('en-IN') : '—'}
                        </div>
                        <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>per leave day (÷26)</div>
                      </div>
                      <button
                        onClick={() => handleSalarySave(stf.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: salarySavedId === stf.id ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.1)',
                          border: `1.5px solid ${salarySavedId === stf.id ? 'rgba(16,185,129,0.6)' : 'rgba(16,185,129,0.35)'}`,
                          borderRadius: 'var(--radius-sm)',
                          color: '#34d399',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          transition: 'all 0.2s ease',
                          boxShadow: salarySavedId === stf.id ? '0 0 12px rgba(16,185,129,0.3)' : 'none'
                        }}
                      >
                        {salarySavedId === stf.id ? <><CheckCircle size={14} /> Saved!</> : <><Save size={14} /> Save Salary</>}
                      </button>
                    </div>
                    {stf.monthlySalary > 0 && (() => {
                      // Count approved leaves for this staff in the current month
                      const now = new Date();
                      const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                      const approvedLeaves = (leaveRequests || []).filter(l =>
                        (l.staffId === stf.id || l.staffName === stf.name) &&
                        l.status === 'Approved' &&
                        (l.startDate || '').startsWith(monthStr)
                      );
                      const leaveDays = approvedLeaves.reduce((sum, l) => {
                        if (!l.startDate) return sum;
                        const start = new Date(l.startDate);
                        const end = l.endDate ? new Date(l.endDate) : start;
                        const days = Math.max(1, Math.round((end - start) / 86400000) + 1);
                        return sum + (l.session === 'Morning' || l.session === 'Afternoon' ? 0.5 : days);
                      }, 0);
                      const perDay = Math.round(stf.monthlySalary / 26);
                      const deduction = Math.round(leaveDays * perDay);
                      const net = stf.monthlySalary - deduction;
                      return leaveDays > 0 ? (
                        <div style={{ marginTop: '0.85rem', padding: '0.65rem 0.85rem', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-sm)', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                          <div><div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Leave Days (this month)</div><div style={{ fontSize: '1rem', fontWeight: 800, color: '#fbbf24' }}>{leaveDays}d</div></div>
                          <div><div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Total Deduction</div><div style={{ fontSize: '1rem', fontWeight: 800, color: '#f87171' }}>−₹{deduction.toLocaleString('en-IN')}</div></div>
                          <div><div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Net Payable</div><div style={{ fontSize: '1rem', fontWeight: 800, color: '#34d399' }}>₹{net.toLocaleString('en-IN')}</div></div>
                        </div>
                      ) : null;
                    })()}
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
    </>
  )}

  {/* ═════════════════════════════════════════════════════════════════
      TAB 2: DAILY ATTENDANCE LOGS (ADMIN VIEW)
      ═════════════════════════════════════════════════════════════════ */}
  {staffAdminTab === 'attendance' && (() => {
    const dateAttendance = (staffAttendance || []).filter(a => a.date === attendanceDate);
    const presentCount = dateAttendance.filter(a => a.status === 'Present' || a.status === 'Completed').length;
    const completedCount = dateAttendance.filter(a => a.checkOutTime).length;

    return (
      <div style={{ animation: 'fadeIn 0.3s ease' }}>
        
        {/* Top Control Bar */}
        <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 className="font-serif gold-text" style={{ fontSize: '1.4rem', margin: 0 }}>
              Staff Attendance Ledger
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
              Real-time daily punch-in &amp; punch-out logs for all verified stylists
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Select Date:</span>
            <input 
              type="date"
              className="form-input"
              value={attendanceDate}
              onChange={e => setAttendanceDate(e.target.value)}
              style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
            />
            {attendanceDate !== todayStr && (
              <button 
                type="button" 
                onClick={() => setAttendanceDate(todayStr)}
                className="btn-secondary"
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.78rem' }}
              >
                Today
              </button>
            )}
          </div>
        </div>

        {/* Attendance Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Roster</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginTop: '0.2rem' }}>{staff.length}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Registered specialists</div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Present on {attendanceDate}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '0.2rem' }}>{presentCount}</div>
            <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.2rem' }}>✓ Punched in for shift</div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Completed Shifts</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-gold)', marginTop: '0.2rem' }}>{completedCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Punched in &amp; out</div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Absent / Off</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f87171', marginTop: '0.2rem' }}>
              {Math.max(0, staff.length - presentCount)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>No log recorded</div>
          </div>
        </div>

        {/* Attendance Ledger Table */}
        <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Stylist Member</th>
                <th style={{ padding: '0.75rem 1rem' }}>Role &amp; Seniority</th>
                <th style={{ padding: '0.75rem 1rem' }}>Punch In</th>
                <th style={{ padding: '0.75rem 1rem' }}>Punch Out</th>
                <th style={{ padding: '0.75rem 1rem' }}>Shift Status</th>
                <th style={{ padding: '0.75rem 1rem' }}>Shift Remarks</th>
              </tr>
            </thead>
            <tbody>
              {staff.map(stf => {
                const log = dateAttendance.find(a => a.staffId === stf.id || a.staffName === stf.name);
                const isPresent = Boolean(log?.checkInTime);
                const isOut = Boolean(log?.checkOutTime);

                return (
                  <tr key={stf.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img 
                          src={stf.avatar} 
                          alt={stf.name} 
                          style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: isPresent ? '2px solid #10b981' : '1px solid var(--border-subtle)' }} 
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: '#fff' }}>{stf.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stf.phone || stf.email || 'Stylist'}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{stf.role}</div>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.05rem 0.45rem', borderRadius: '9999px', background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)', display: 'inline-block', marginTop: '0.15rem' }}>
                        {stf.level || 'Junior'}
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: isPresent ? '#34d399' : 'var(--text-muted)' }}>
                      {log?.checkInTime || '-- : --'}
                    </td>

                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: isOut ? '#60a5fa' : 'var(--text-muted)' }}>
                      {log?.checkOutTime || (isPresent ? 'On Duty' : '-- : --')}
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      {isOut ? (
                        <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.35)', fontSize: '0.72rem' }}>
                          ✓ Shift Finished
                        </span>
                      ) : isPresent ? (
                        <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.35)', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
                          🟢 Active / Present
                        </span>
                      ) : (
                        <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)', fontSize: '0.72rem' }}>
                          ⚪ Not Marked
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {log?.notes || 'No remarks'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    );
  })()}

  {/* ═════════════════════════════════════════════════════════════════
      TAB 3: LEAVE REQUESTS APPROVAL DASHBOARD (ADMIN VIEW)
      ═════════════════════════════════════════════════════════════════ */}
  {staffAdminTab === 'leaves' && (() => {
    return (
      <div style={{ animation: 'fadeIn 0.3s ease' }}>
        
        {/* Header & Filter Bar */}
        <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 className="font-serif gold-text" style={{ fontSize: '1.4rem', margin: 0 }}>
              Staff Leave Requests &amp; Approvals
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
              Review stylist date and time leave applications, add notes, and grant official authorization
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(255,255,255,0.04)', padding: '3px', borderRadius: '6px' }}>
            {['All', 'Pending', 'Approved', 'Rejected'].map(st => (
              <button
                key={st}
                type="button"
                onClick={() => setLeaveFilter(st)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: leaveFilter === st ? '1px solid var(--accent-red)' : '1px solid rgba(225, 29, 72, 0.3)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: leaveFilter === st ? 'rgba(225, 29, 72, 0.2)' : 'transparent',
                  color: leaveFilter === st ? '#ffffff' : 'var(--text-secondary)',
                  boxShadow: leaveFilter === st ? '0 0 10px var(--accent-red-glow)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        {filteredLeaves.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
            <Calendar size={42} style={{ opacity: 0.25, marginBottom: '0.75rem' }} />
            <h4 style={{ color: '#fff', margin: '0 0 0.3rem 0' }}>No Leave Requests Found</h4>
            <p style={{ fontSize: '0.85rem', margin: 0 }}>There are currently no staff applications under "{leaveFilter}".</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredLeaves.map(leave => {
              const matchedStaff = staff.find(s => s.id === leave.staffId || s.name === leave.staffName);
              const avatarUrl = matchedStaff?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
              const currentRemarks = leaveRemarksMap[leave.id] !== undefined ? leaveRemarksMap[leave.id] : (leave.adminRemarks || '');

              return (
                <div 
                  key={leave.id} 
                  className="glass-panel" 
                  style={{ 
                    padding: '1.5rem',
                    border: leave.status === 'Pending' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-subtle)',
                    background: leave.status === 'Pending' ? 'linear-gradient(135deg, rgba(20,20,28,0.95), rgba(30,24,14,0.9))' : 'var(--bg-glass)'
                  }}
                >
                  
                  {/* Top Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <img 
                        src={avatarUrl} 
                        alt={leave.staffName} 
                        style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-gold)' }} 
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <h4 style={{ color: '#fff', margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                            {leave.staffName}
                          </h4>
                          <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.45rem', borderRadius: '9999px', background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' }}>
                            {leave.staffRole || 'Stylist'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                          Applied on: {leave.submittedAt}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {leave.status === 'Approved' ? (
                        <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)', fontSize: '0.8rem', padding: '0.35rem 0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          <CheckCircle size={14} /> Approved
                        </span>
                      ) : leave.status === 'Rejected' ? (
                        <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.4)', fontSize: '0.8rem', padding: '0.35rem 0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          <XCircle size={14} /> Rejected
                        </span>
                      ) : (
                        <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.18)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)', fontSize: '0.8rem', padding: '0.35rem 0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Clock size={14} /> Pending Admin Decision
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details Card */}
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '0.75rem' }}>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Requested Leave Dates</div>
                        <div style={{ fontWeight: 700, color: 'var(--accent-gold)', fontSize: '0.95rem', marginTop: '0.15rem' }}>
                          {leave.startDate} {leave.endDate !== leave.startDate ? `➔ ${leave.endDate}` : ''}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category &amp; Session</div>
                        <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.92rem', marginTop: '0.15rem' }}>
                          {leave.leaveType} • {leave.session === 'Custom' ? `${leave.startTime} - ${leave.endTime}` : leave.session}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Reason Given by Stylist</div>
                      <div style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.4, fontStyle: 'italic' }}>
                        "{leave.reason}"
                      </div>
                    </div>
                  </div>

                  {/* Admin Decision Action Area */}
                  {leave.status === 'Pending' ? (
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input 
                        type="text"
                        className="form-input"
                        placeholder="Add remarks or instructions (e.g. Approved, appointments reassigned to Ananya)..."
                        value={currentRemarks}
                        onChange={e => setLeaveRemarksMap(prev => ({ ...prev, [leave.id]: e.target.value }))}
                        style={{ flex: 1, minWidth: '260px', padding: '0.65rem 0.85rem', fontSize: '0.85rem' }}
                      />

                      <button
                        type="button"
                        onClick={() => handleApproveLeave(leave.id)}
                        className="btn-gold"
                        style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <CheckCircle size={15} /> Approve Leave
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRejectLeave(leave.id)}
                        style={{
                          padding: '0.65rem 1.25rem',
                          fontSize: '0.85rem',
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                          color: '#f87171',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <XCircle size={15} /> Reject
                      </button>
                    </div>
                  ) : (
                    <div style={{ padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Decision finalized on {leave.adminActionDate || 'Recent'} by <strong>{leave.adminName || 'Admin'}</strong>
                      {leave.adminRemarks && (
                        <div style={{ marginTop: '0.2rem', color: leave.status === 'Approved' ? '#34d399' : '#f87171' }}>
                          Remarks: "{leave.adminRemarks}"
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    );
  })()}

      {/* ═════════════════════════════════════════════════════════════════
          TAB 4: SALARY & PAYROLL MANAGEMENT
          ═════════════════════════════════════════════════════════════════ */}
      {staffAdminTab === 'salary' && (() => {
        const workingDays = salarySettings?.workingDaysPerMonth || 26;

        // Filter staff based on search and level
        const filteredStaff = staff.filter(s => {
          const matchesSearch = (s.name || '').toLowerCase().includes(salarySearchTerm.toLowerCase()) ||
                                (s.specialty || '').toLowerCase().includes(salarySearchTerm.toLowerCase()) ||
                                (s.role || '').toLowerCase().includes(salarySearchTerm.toLowerCase());
          const matchesLevel = salaryFilterLevel === 'All' || (s.level || 'Junior') === salaryFilterLevel;
          return matchesSearch && matchesLevel;
        });

        // Totals for selected month
        let totalGross = 0;
        let totalDeductions = 0;
        let totalNet = 0;
        let configuredCount = 0;

        staff.forEach(s => {
          const b = calcSalaryBreakdown(s, selectedSalaryMonth, leaveRequests);
          totalGross += b.monthly;
          totalDeductions += b.deduction;
          totalNet += b.net;
          if (b.monthly > 0) configuredCount++;
        });

        return (
          <div>
            {/* Header / Subtitle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 className="font-serif gold-text" style={{ fontSize: '1.6rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <DollarSign size={24} style={{ color: '#34d399' }} /> Salon Payroll &amp; Staff Compensation
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                  Manage base monthly salaries, real-time leave deduction calculations, and compensation records for <strong>{selectedSalaryMonth}</strong>.
                </p>
              </div>

              {/* Month Selector & Working Days Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.04)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Calendar size={15} style={{ color: 'var(--accent-gold)' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>PAYROLL MONTH:</span>
                  <input
                    type="month"
                    value={selectedSalaryMonth}
                    onChange={e => setSelectedSalaryMonth(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#fff',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(16,185,129,0.08)',
                  border: '1px solid rgba(16,185,129,0.25)',
                  fontSize: '0.75rem',
                  color: '#34d399',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  <Clock size={14} /> Standard Basis: <strong>{workingDays} Working Days/Mo</strong>
                </div>

                <button
                  type="button"
                  onClick={handleOpenSalarySettings}
                  className="btn-gold"
                  style={{
                    padding: '0.45rem 0.95rem',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer'
                  }}
                >
                  <Settings size={14} /> Policy &amp; Rules
                </button>
              </div>
            </div>

            {/* Top 4 KPI Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {/* Gross Payroll */}
              <div className="neon-card" style={{ padding: '1.25rem', background: 'rgba(16, 16, 24, 0.85)', borderLeft: '4px solid #60a5fa' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Total Gross Payroll
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#60a5fa' }}>
                  ₹{totalGross.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                  Base contract value for {staff.length} staff
                </div>
              </div>

              {/* Total Deductions */}
              <div className="neon-card" style={{ padding: '1.25rem', background: 'rgba(16, 16, 24, 0.85)', borderLeft: '4px solid #f87171' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Leave Deductions ({selectedSalaryMonth})
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f87171' }}>
                  −₹{totalDeductions.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                  Deducted for approved absences &amp; leaves
                </div>
              </div>

              {/* Net Disbursable */}
              <div className="neon-card" style={{ padding: '1.25rem', background: 'rgba(16, 16, 24, 0.85)', borderLeft: '4px solid #34d399' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Net Payroll Payable
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399' }}>
                  ₹{totalNet.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                  Estimated total net salon outlay
                </div>
              </div>

              {/* Salary Setup Progress */}
              <div className="neon-card" style={{ padding: '1.25rem', background: 'rgba(16, 16, 24, 0.85)', borderLeft: '4px solid var(--accent-gold)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Staff Salary Setup
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                  {configuredCount} / {staff.length}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                  {configuredCount === staff.length ? '100% staff salaries assigned' : `${staff.length - configuredCount} pending salary definition`}
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="glass-panel" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flex: 1, minWidth: '240px' }}>
                <Search size={16} style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search staff by name, role, or specialty..."
                  value={salarySearchTerm}
                  onChange={e => setSalarySearchTerm(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', maxWidth: '360px', padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Filter Level:</span>
                {['All', ...STAFF_LEVELS].map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSalaryFilterLevel(lvl)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: salaryFilterLevel === lvl ? '1px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.1)',
                      background: salaryFilterLevel === lvl ? 'rgba(217, 119, 6, 0.2)' : 'rgba(255,255,255,0.03)',
                      color: salaryFilterLevel === lvl ? 'var(--accent-gold)' : 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Staff Salary Table */}
            <div className="neon-card" style={{ padding: '0', overflowX: 'auto', background: 'rgba(16, 16, 24, 0.95)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '820px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
                    <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Staff Specialist</th>
                    <th style={{ padding: '1rem 1rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Level</th>
                    <th style={{ padding: '1rem 1rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, minWidth: '190px' }}>Monthly Gross (₹)</th>
                    <th style={{ padding: '1rem 1rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Daily Rate</th>
                    <th style={{ padding: '1rem 1rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Leaves Used</th>
                    <th style={{ padding: '1rem 1rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Deduction</th>
                    <th style={{ padding: '1rem 1rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Net Payable</th>
                    <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No staff members found matching your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredStaff.map(stf => {
                      const breakdown = calcSalaryBreakdown(stf, selectedSalaryMonth, leaveRequests);
                      const currentVal = salaryEditMap[stf.id] !== undefined ? salaryEditMap[stf.id] : (stf.monthlySalary || '');
                      const lvl = stf.level || 'Junior';
                      const color = levelColors[lvl] || levelColors['Junior'];
                      const isSaved = salarySavedId === stf.id;

                      // Check if already marked as paid
                      const disbursement = (salaryDisbursements || []).find(d => d.staffId === stf.id && d.monthStr === selectedSalaryMonth);

                      return (
                        <tr key={stf.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s ease' }}>
                          {/* Staff Info */}
                          <td style={{ padding: '1rem 1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <img
                                src={stf.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                                alt={stf.name}
                                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--accent-red)' }}
                              />
                              <div>
                                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>{stf.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{stf.role} • {stf.specialty}</div>
                              </div>
                            </div>
                          </td>

                          {/* Level */}
                          <td style={{ padding: '1rem 1rem' }}>
                            <span style={{
                              padding: '0.2rem 0.55rem',
                              borderRadius: '4px',
                              background: color.bg,
                              border: `1px solid ${color.border}`,
                              color: color.text,
                              fontSize: '0.72rem',
                              fontWeight: 700
                            }}>
                              {lvl}
                            </span>
                          </td>

                          {/* Monthly Gross Salary (Inline Editable) */}
                          <td style={{ padding: '1rem 1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>₹</span>
                              <input
                                type="number"
                                min="0"
                                placeholder="e.g. 25000"
                                value={currentVal}
                                onChange={e => setSalaryEditMap(prev => ({ ...prev, [stf.id]: e.target.value }))}
                                className="form-input"
                                style={{
                                  padding: '0.35rem 0.6rem',
                                  fontSize: '0.88rem',
                                  fontWeight: 700,
                                  color: '#34d399',
                                  width: '120px'
                                }}
                              />
                              <button
                                onClick={() => handleSalarySave(stf.id)}
                                title="Save Salary to Database"
                                style={{
                                  padding: '0.38rem 0.65rem',
                                  background: isSaved ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.06)',
                                  border: `1px solid ${isSaved ? '#34d399' : 'rgba(255,255,255,0.15)'}`,
                                  borderRadius: 'var(--radius-sm)',
                                  color: isSaved ? '#34d399' : 'var(--text-secondary)',
                                  cursor: 'pointer',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                {isSaved ? <Check size={13} /> : <Save size={13} />}
                              </button>
                            </div>
                          </td>

                          {/* Daily Rate */}
                          <td style={{ padding: '1rem 1rem' }}>
                            <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>
                              {breakdown.perDay ? `₹${breakdown.perDay.toLocaleString('en-IN')}` : '—'}
                            </div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>÷{workingDays} days</div>
                          </td>

                          {/* Leaves Used */}
                          <td style={{ padding: '1rem 1rem' }}>
                            {breakdown.leaveDays > 0 ? (
                              <span style={{
                                padding: '0.2rem 0.55rem',
                                borderRadius: '4px',
                                background: 'rgba(245, 158, 11, 0.12)',
                                border: '1px solid rgba(245, 158, 11, 0.35)',
                                color: '#fbbf24',
                                fontSize: '0.75rem',
                                fontWeight: 700
                              }}>
                                {breakdown.leaveDays} {breakdown.leaveDays === 1 ? 'day' : 'days'}
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>0 days</span>
                            )}
                          </td>

                          {/* Deduction */}
                          <td style={{ padding: '1rem 1rem' }}>
                            {breakdown.deduction > 0 ? (
                              <span style={{ fontWeight: 700, color: '#f87171', fontSize: '0.88rem' }}>
                                −₹{breakdown.deduction.toLocaleString('en-IN')}
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>₹0</span>
                            )}
                          </td>

                          {/* Net Payable */}
                          <td style={{ padding: '1rem 1rem' }}>
                            <div style={{
                              fontWeight: 800,
                              color: breakdown.net > 0 ? '#34d399' : 'var(--text-muted)',
                              fontSize: '1rem'
                            }}>
                              ₹{breakdown.net.toLocaleString('en-IN')}
                            </div>
                          </td>

                          {/* Actions / Status */}
                          <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                            {disbursement ? (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                padding: '0.3rem 0.65rem',
                                borderRadius: '4px',
                                background: 'rgba(16, 185, 129, 0.15)',
                                border: '1px solid rgba(16, 185, 129, 0.35)',
                                color: '#34d399',
                                fontSize: '0.72rem',
                                fontWeight: 700
                              }}>
                                <Check size={12} /> Disbursed
                              </span>
                            ) : (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                padding: '0.3rem 0.65rem',
                                borderRadius: '4px',
                                background: 'rgba(245, 158, 11, 0.12)',
                                border: '1px solid rgba(245, 158, 11, 0.35)',
                                color: '#fbbf24',
                                fontSize: '0.72rem',
                                fontWeight: 700
                              }}>
                                Ready for Payout
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Salary Calculation Policy Note Footer */}
            <div style={{
              marginTop: '1.25rem',
              padding: '0.85rem 1.15rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <div>
                💡 <strong>Salary Policy:</strong> Daily wage rate is calculated as <code style={{ color: '#60a5fa' }}>Monthly Gross ÷ {workingDays} working days</code>. Half-day leaves (Morning/Afternoon) are calculated at 0.5 days.
              </div>
              <div>
                Total Monthly Payroll: <strong style={{ color: '#34d399' }}>₹{totalNet.toLocaleString('en-IN')}</strong>
              </div>
            </div>
          </div>
        );
      })()}

  {/* ═════════════════════════════════════════════════════════════════

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

      {/* ═════════════════════════════════════════════════════════════════
          SALARY SETTINGS & DEDUCTION RULES MODAL
          ═════════════════════════════════════════════════════════════════ */}
      {showSalarySettingsModal && tempSalarySettings && (
        <div className="modal-overlay" onClick={() => setShowSalarySettingsModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px', background: 'rgba(12, 12, 18, 0.98)', border: '1.5px solid var(--accent-gold)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sliders size={20} style={{ color: 'var(--accent-gold)' }} />
                <h3 className="font-serif gold-text" style={{ fontSize: '1.35rem', margin: 0 }}>Salon Salary &amp; Deduction Policy</h3>
              </div>
              <button onClick={() => setShowSalarySettingsModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSalarySettings}>
              {/* Setting 1: Working Days Per Month */}
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <label className="form-label" style={{ margin: 0, fontWeight: 700 }}>Standard Working Days Per Month</label>
                  <span style={{ fontSize: '0.9rem', color: '#34d399', fontWeight: 800 }}>{tempSalarySettings.workingDaysPerMonth} Days</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="30"
                  step="1"
                  value={tempSalarySettings.workingDaysPerMonth}
                  onChange={e => setTempSalarySettings(p => ({ ...p, workingDaysPerMonth: parseInt(e.target.value) }))}
                  style={{ width: '100%', accentColor: 'var(--accent-gold)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  <span>20 Days (4-day week)</span>
                  <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>26 Days (Salon Default)</span>
                  <span>30 Days (Full calendar)</span>
                </div>
                <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', margin: '0.35rem 0 0 0' }}>
                  Determines daily wage rate (<code style={{ color: '#60a5fa' }}>Monthly ÷ {tempSalarySettings.workingDaysPerMonth}</code>) deducted per approved unpaid leave day.
                </p>
              </div>

              {/* Setting 2: Half-Day Deduction Rate */}
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Half-Day Leave Deduction Ratio</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setTempSalarySettings(p => ({ ...p, halfDayDeductionRate: 0.5 }))}
                    style={{
                      padding: '0.6rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      border: tempSalarySettings.halfDayDeductionRate === 0.5 ? '1.5px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.1)',
                      background: tempSalarySettings.halfDayDeductionRate === 0.5 ? 'rgba(217, 119, 6, 0.15)' : 'rgba(255,255,255,0.03)',
                      color: tempSalarySettings.halfDayDeductionRate === 0.5 ? 'var(--accent-gold)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      textAlign: 'center'
                    }}
                  >
                    50% Deduction (0.5 Days)
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Standard salon practice</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempSalarySettings(p => ({ ...p, halfDayDeductionRate: 0.33 }))}
                    style={{
                      padding: '0.6rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      border: tempSalarySettings.halfDayDeductionRate === 0.33 ? '1.5px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.1)',
                      background: tempSalarySettings.halfDayDeductionRate === 0.33 ? 'rgba(217, 119, 6, 0.15)' : 'rgba(255,255,255,0.03)',
                      color: tempSalarySettings.halfDayDeductionRate === 0.33 ? 'var(--accent-gold)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      textAlign: 'center'
                    }}
                  >
                    33% Deduction (0.33 Days)
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Lenient half-day allowance</div>
                  </button>
                </div>
              </div>

              {/* Setting 3: Auto-Deduct Toggle */}
              <div style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem'
              }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>Auto-Deduct Approved Leaves</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Automatically reduce net payable salary when leaves are approved</div>
                </div>
                <input
                  type="checkbox"
                  checked={tempSalarySettings.autoDeductLeaves}
                  onChange={e => setTempSalarySettings(p => ({ ...p, autoDeductLeaves: e.target.checked }))}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#10b981' }}
                />
              </div>

              {/* Setting 4: Pay Cycle Cutoff Date */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Monthly Pay Cycle Disbursal Day</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={tempSalarySettings.payCycleDay}
                    onChange={e => setTempSalarySettings(p => ({ ...p, payCycleDay: parseInt(e.target.value) || 1 }))}
                    className="form-input"
                    style={{ width: '100px', fontWeight: 700 }}
                  />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    of every calendar month (default: 1st)
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowSalarySettingsModal(false)}
                  className="btn-outline"
                  style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold"
                  style={{ padding: '0.55rem 1.35rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  {settingsSaveSuccess ? (
                    <><Check size={16} style={{ color: '#34d399' }} /> Policy Saved!</>
                  ) : (
                    <><Save size={16} /> Save Salary Policy</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
