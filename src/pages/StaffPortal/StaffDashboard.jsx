import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { 
  Calendar, 
  CheckSquare, 
  Users, 
  HelpCircle,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  Phone,
  Scissors,
  Home,
  Check,
  User,
  ShieldAlert,
  LogOut,
  MessageSquare,
  Send
} from 'lucide-react';

export const StaffDashboard = () => {
  const { 
    bookings, updateBookingStatus, currentUser, staff, pendingStaff, 
    addService, feedback, updateStaffProfile, logoutUser,
    staffMessages, sendStaffMessage, markStaffMessagesRead
  } = useSalon();
  
  // Check if staff is approved (exists in active staff roster)
  const isApprovedStaff = staff.some(s => s.name === currentUser?.name || s.email === currentUser?.email);
  const isPendingStaff = pendingStaff.some(p => p.name === currentUser?.name || p.email === currentUser?.email);
  const pendingProfile = pendingStaff.find(p => p.name === currentUser?.name || p.email === currentUser?.email);

  // If staff is not approved, show pending approval screen
  if (!isApprovedStaff) {
    return (
      <div style={{ 
        minHeight: '70vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          maxWidth: '520px',
          width: '100%',
          textAlign: 'center',
          padding: '3rem 2.5rem',
          background: 'linear-gradient(135deg, rgba(20, 20, 28, 0.95), rgba(30, 25, 15, 0.85))',
          border: '1.5px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '16px',
          boxShadow: '0 0 60px rgba(245, 158, 11, 0.08), 0 20px 60px rgba(0,0,0,0.4)'
        }}>
          {/* Animated Clock Icon */}
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 1.5rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.05))',
            border: '2px solid rgba(245, 158, 11, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(245, 158, 11, 0.2)',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            <Clock size={36} style={{ color: '#fbbf24' }} />
          </div>

          <h1 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '2rem', 
            fontWeight: 700, 
            color: '#fbbf24',
            margin: '0 0 0.5rem',
            lineHeight: 1.2
          }}>
            Approval Pending
          </h1>
          
          <p style={{ 
            fontSize: '1rem', 
            color: 'var(--text-secondary)', 
            lineHeight: 1.6,
            margin: '0 0 1.5rem'
          }}>
            Your registration request has been submitted to the salon admin. You'll be able to access the staff portal once your application is reviewed and approved.
          </p>

          {/* Status Card */}
          <div style={{
            padding: '1.25rem',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255,255,255,0.06)',
            textAlign: 'left',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <ShieldAlert size={16} style={{ color: '#f59e0b' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Application Status</span>
            </div>
            
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Name</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{currentUser?.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Role</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{currentUser?.staffRole || pendingProfile?.role || 'Staff'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Status</span>
                <span style={{ 
                  padding: '0.15rem 0.6rem', 
                  background: 'rgba(245, 158, 11, 0.15)', 
                  border: '1px solid rgba(245, 158, 11, 0.3)', 
                  borderRadius: 'var(--radius-full)',
                  color: '#fbbf24',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {isPendingStaff ? '⏳ Under Review' : '📋 Submitted'}
                </span>
              </div>
              {pendingProfile?.experience && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Experience</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{pendingProfile.experience}</span>
                </div>
              )}
            </div>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            💡 The admin will review your experience, specialization, and details before approving your account. Please check back later.
          </p>

          <button
            onClick={logoutUser}
            style={{
              padding: '0.75rem 2rem',
              background: 'rgba(225, 29, 72, 0.1)',
              border: '1px solid rgba(225, 29, 72, 0.3)',
              borderRadius: 'var(--radius-sm)',
              color: '#f43f5e',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>
    );
  }
  
  const [activeSideTab, setActiveSideTab] = useState('schedule'); // 'schedule' | 'tasks' | 'customers' | 'services' | 'reviews' | 'profile' | 'support' | 'chat'
  const [selectedBookingForUpdate, setSelectedBookingForUpdate] = useState(null);
  const [newStatusValue, setNewStatusValue] = useState('In-Progress');

  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('Hair');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = React.useRef(null);

  // Find staff profile
  const staffProfile = staff.find(s => s.name === currentUser?.name || s.email === currentUser?.email) || {
    name: currentUser?.name || 'Stylist Specialist',
    role: currentUser?.staffRole || 'Senior Master Stylist',
    rating: 5.0,
    specialty: 'Hair Styling & Senior Citizen Home Care'
  };

  // Strictly filter bookings for THIS specific logged-in staff member only
  const displayBookings = bookings.filter(b => 
    b.stylistName === staffProfile.name
  );

  // Extract unique customers from ONLY this staff member's bookings
  const uniqueCustomers = Array.from(
    new Map(displayBookings.map(b => [b.customerName, b])).values()
  );

  const [profileSpecialty, setProfileSpecialty] = useState(staffProfile.specialty || '');
  const [profileExperience, setProfileExperience] = useState(staffProfile.experience || '');
  const [profileWorkingHistory, setProfileWorkingHistory] = useState(staffProfile.workingHistory || '');
  const [profileSaved, setProfileSaved] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!staffProfile.id) return;
    try {
      await updateStaffProfile(staffProfile.id, {
        specialty: profileSpecialty,
        experience: profileExperience,
        workingHistory: profileWorkingHistory
      });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err) {
      alert("Error updating profile.");
    }
  };

  // Filter feedback for this staff member
  const staffReviews = feedback ? feedback.filter(f => f.stylistName === staffProfile.name) : [];

  // Chat Data
  const myMessages = staffMessages[staffProfile.id] || [];
  const unreadCount = myMessages.filter(m => m.sender === 'admin' && !m.read).length;

  React.useEffect(() => {
    if (activeSideTab === 'chat' && unreadCount > 0) {
      markStaffMessagesRead(staffProfile.id, 'staff');
    }
    if (activeSideTab === 'chat' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSideTab, myMessages, unreadCount, markStaffMessagesRead, staffProfile.id]);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    sendStaffMessage(staffProfile.id, chatInput.trim(), 'staff');
    setChatInput('');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2.5rem', minHeight: '80vh', padding: '1rem 0' }}>
      
      {/* Left Sidebar */}
      <aside className="neon-panel" style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(10, 10, 15, 0.9)' }}>
        
        {/* Style Sync Logo */}
        <div style={{ marginBottom: '1.5rem', paddingLeft: '0.5rem' }}>
          <div className="brand-logo-text">
            <span className="brand-logo-style" style={{ fontSize: '1.4rem' }}>Style</span>
            <span className="brand-logo-sync" style={{ fontSize: '1.25rem' }}>Sync</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', marginTop: '0.2rem' }}>
            Staff Portal: <strong>{staffProfile.name}</strong>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <button
          onClick={() => setActiveSideTab('schedule')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: activeSideTab === 'schedule' ? '1px solid var(--accent-red)' : 'none',
            background: activeSideTab === 'schedule' ? 'rgba(255, 0, 60, 0.12)' : 'transparent',
            color: activeSideTab === 'schedule' ? 'var(--accent-red)' : 'var(--text-secondary)',
            boxShadow: activeSideTab === 'schedule' ? 'inset 0 0 10px rgba(255, 0, 60, 0.2)' : 'none',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease'
          }}
        >
          <Calendar size={18} /> My Schedule ({displayBookings.length})
        </button>

        <button
          onClick={() => setActiveSideTab('tasks')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: activeSideTab === 'tasks' ? '1px solid var(--accent-red)' : 'none',
            background: activeSideTab === 'tasks' ? 'rgba(255, 0, 60, 0.12)' : 'transparent',
            color: activeSideTab === 'tasks' ? 'var(--accent-red)' : 'var(--text-secondary)',
            boxShadow: activeSideTab === 'tasks' ? 'inset 0 0 10px rgba(255, 0, 60, 0.2)' : 'none',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease'
          }}
        >
          <CheckSquare size={18} /> Task Checklist
        </button>

        <button
          onClick={() => setActiveSideTab('customers')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: activeSideTab === 'customers' ? '1px solid var(--accent-red)' : 'none',
            background: activeSideTab === 'customers' ? 'rgba(255, 0, 60, 0.12)' : 'transparent',
            color: activeSideTab === 'customers' ? 'var(--accent-red)' : 'var(--text-secondary)',
            boxShadow: activeSideTab === 'customers' ? 'inset 0 0 10px rgba(255, 0, 60, 0.2)' : 'none',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease'
          }}
        >
          <Users size={18} /> Clients ({uniqueCustomers.length})
        </button>

        <button
          onClick={() => setActiveSideTab('services')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: activeSideTab === 'services' ? '1px solid var(--accent-red)' : 'none',
            background: activeSideTab === 'services' ? 'rgba(255, 0, 60, 0.12)' : 'transparent',
            color: activeSideTab === 'services' ? 'var(--accent-red)' : 'var(--text-secondary)',
            boxShadow: activeSideTab === 'services' ? 'inset 0 0 10px rgba(255, 0, 60, 0.2)' : 'none',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease'
          }}
        >
          <Scissors size={18} /> Propose Service
        </button>

        <button
          onClick={() => setActiveSideTab('reviews')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: activeSideTab === 'reviews' ? '1px solid var(--accent-red)' : 'none',
            background: activeSideTab === 'reviews' ? 'rgba(255, 0, 60, 0.12)' : 'transparent',
            color: activeSideTab === 'reviews' ? 'var(--accent-red)' : 'var(--text-secondary)',
            boxShadow: activeSideTab === 'reviews' ? 'inset 0 0 10px rgba(255, 0, 60, 0.2)' : 'none',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease'
          }}
        >
          <CheckCircle size={18} /> My Reviews ({staffReviews.length})
        </button>

        <button
          onClick={() => setActiveSideTab('profile')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: activeSideTab === 'profile' ? '1px solid var(--accent-red)' : 'none',
            background: activeSideTab === 'profile' ? 'rgba(255, 0, 60, 0.12)' : 'transparent',
            color: activeSideTab === 'profile' ? 'var(--accent-red)' : 'var(--text-secondary)',
            boxShadow: activeSideTab === 'profile' ? 'inset 0 0 10px rgba(255, 0, 60, 0.2)' : 'none',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease'
          }}
        >
          <User size={18} /> Profile Settings
        </button>

        <button
          onClick={() => setActiveSideTab('support')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: activeSideTab === 'support' ? '1px solid var(--accent-red)' : 'none',
            background: activeSideTab === 'support' ? 'rgba(255, 0, 60, 0.12)' : 'transparent',
            color: activeSideTab === 'support' ? 'var(--accent-red)' : 'var(--text-secondary)',
            boxShadow: activeSideTab === 'support' ? 'inset 0 0 10px rgba(255, 0, 60, 0.2)' : 'none',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease'
          }}
        >
          <HelpCircle size={18} /> Support
        </button>

        <button
          onClick={() => setActiveSideTab('chat')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: activeSideTab === 'chat' ? '1px solid var(--accent-red)' : 'none',
            background: activeSideTab === 'chat' ? 'rgba(255, 0, 60, 0.12)' : 'transparent',
            color: activeSideTab === 'chat' ? 'var(--accent-red)' : 'var(--text-secondary)',
            boxShadow: activeSideTab === 'chat' ? 'inset 0 0 10px rgba(255, 0, 60, 0.2)' : 'none',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <MessageSquare size={18} /> Admin Chat
          </div>
          {unreadCount > 0 && (
            <span style={{
              background: '#e11d48',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 0 10px rgba(225, 29, 72, 0.5)'
            }}>
              {unreadCount}
            </span>
          )}
        </button>

      </aside>

      {/* Main Content Area */}
      <main style={{ width: '100%' }}>
        
        {activeSideTab === 'schedule' ? (
          <div>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 className="font-serif" style={{
                  fontSize: '2.2rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  margin: 0
                }}>
                  YOUR APPOINTMENT SCHEDULE
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
                  Live appointments assigned to <strong>{staffProfile.name}</strong> • Real-time synchronization
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <span className="badge badge-confirmed" style={{ fontSize: '0.8rem' }}>
                  Total: {displayBookings.length}
                </span>
                <span className="badge badge-inshop" style={{ fontSize: '0.8rem' }}>
                  In-Shop: {displayBookings.filter(b => b.type === 'in-shop').length}
                </span>
                <span className="badge badge-home" style={{ fontSize: '0.8rem' }}>
                  Home Care: {displayBookings.filter(b => b.type === 'home-service').length}
                </span>
              </div>
            </div>

            {/* Vertical Timeline Structure */}
            <div style={{ position: 'relative', paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              
              {/* Red Vertical Timeline Guide Line */}
              <div style={{
                position: 'absolute',
                left: '7px',
                top: '15px',
                bottom: '15px',
                width: '2px',
                background: 'rgba(255, 0, 60, 0.4)'
              }} />

              {displayBookings.length === 0 ? (
                <div className="neon-card" style={{ padding: '2rem', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-secondary)' }}>No scheduled appointments at this moment.</p>
                </div>
              ) : (
                displayBookings.map((b, idx) => {
                  const isHome = b.type === 'home-service';
                  const isCompleted = b.status === 'Completed';
                  const isInProgress = b.status === 'In-Progress' || b.status === 'Active';

                  return (
                    <div key={b.id} style={{ position: 'relative' }}>
                      
                      {/* Glowing Dot Indicator on timeline */}
                      <div style={{
                        position: 'absolute',
                        left: '-28px',
                        top: '25px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: isCompleted ? '#10b981' : isInProgress ? '#38bdf8' : 'var(--accent-red)',
                        boxShadow: `0 0 12px ${isCompleted ? 'rgba(16, 185, 129, 0.9)' : isInProgress ? 'rgba(56, 189, 248, 0.9)' : 'rgba(255, 0, 60, 0.9)'}`
                      }} />

                      <div className="neon-card" style={{
                        borderLeft: `8px solid ${isCompleted ? '#10b981' : isInProgress ? '#38bdf8' : 'var(--accent-red)'}`,
                        borderColor: isCompleted ? '#10b981' : isInProgress ? '#38bdf8' : 'var(--accent-red)',
                        boxShadow: `0 0 20px ${isCompleted ? 'rgba(16, 185, 129, 0.15)' : isInProgress ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 0, 60, 0.2)'}`,
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.85rem',
                        maxWidth: '620px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div>
                            <div style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 600 }}>
                              {b.time} — {b.serviceTitle}
                            </div>
                            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                              Client: <strong style={{ color: '#fff' }}>{b.customerName}</strong> {b.customerPhone ? `(${b.customerPhone})` : ''}
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                            {isHome ? (
                              <span className="badge badge-home" style={{ fontSize: '0.75rem' }}>
                                <Home size={12} /> Senior Home Care
                              </span>
                            ) : (
                              <span className="badge badge-inshop" style={{ fontSize: '0.75rem' }}>
                                <Scissors size={12} /> In-Shop
                              </span>
                            )}
                            <span className={`badge ${isCompleted ? 'badge-completed' : isInProgress ? 'badge-scheduled' : 'badge-confirmed'}`} style={{ fontSize: '0.75rem' }}>
                              {b.status}
                            </span>
                          </div>
                        </div>

                        {/* Home Care Address Details */}
                        {isHome && b.address && b.address !== 'N/A (In-Shop Salon Visit)' && (
                          <div style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                            <div style={{ color: '#c084fc', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin size={14} /> Client Address:
                            </div>
                            <div style={{ color: '#e2e8f0', marginTop: '0.2rem' }}>
                              {b.address} {b.landmark ? `(Landmark: ${b.landmark})` : ''}
                            </div>
                          </div>
                        )}

                        {/* Special Care Notes */}
                        {b.specialNotes && (
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: '4px' }}>
                            📝 <em>{b.specialNotes}</em>
                          </div>
                        )}

                        {/* Stylist & Payment Info */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.6rem' }}>
                          <span>Assigned: <strong>{b.stylistName || staffProfile.name}</strong></span>
                          <span>Fee: <strong style={{ color: 'var(--accent-gold)' }}>₹{b.amount}</strong> ({b.paymentStatus || 'Paid'})</span>
                        </div>

                        {/* Action Button */}
                        <button 
                          onClick={() => {
                            setSelectedBookingForUpdate(b);
                            setNewStatusValue(b.status === 'Pending' ? 'In-Progress' : b.status === 'In-Progress' ? 'Completed' : 'In-Progress');
                          }}
                          className="btn-red-neon"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            fontSize: '0.85rem',
                            letterSpacing: '0.08em',
                            marginTop: '0.4rem'
                          }}
                        >
                          UPDATE STATUS
                        </button>
                      </div>
                    </div>
                  );
                })
              )}

            </div>

          </div>
        ) : activeSideTab === 'tasks' ? (
          <div className="neon-panel" style={{ padding: '2rem' }}>
            <h2 className="font-serif" style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '1.5rem' }}>
              Stylist Daily Sanitization & Care Checklist
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                'Sanitize all hair trimming scissors, clippers & combs in UV sterilizer',
                'Prepare Senior Home Visit kit: inflatable shampoo basin, disposable gowns & towels',
                'Check stock of organic Gold glow hydration packs and herbal massage oils',
                'Verify temperature and emergency contact for elderly client home visits',
                'Inspect Razorpay electronic transaction tokens on completed appointments'
              ].map((task, idx) => (
                <div key={idx} className="neon-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input type="checkbox" defaultChecked={idx < 2} style={{ width: '18px', height: '18px', accentColor: 'var(--accent-red)', cursor: 'pointer' }} />
                  <span style={{ color: '#fff', fontSize: '0.95rem' }}>{task}</span>
                </div>
              ))}
            </div>
          </div>
        ) : activeSideTab === 'customers' ? (
          <div className="neon-panel" style={{ padding: '2rem' }}>
            <h2 className="font-serif" style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '1.5rem' }}>
              Client Directory & History
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {uniqueCustomers.map((c, idx) => (
                <div key={idx} className="neon-card">
                  <h4 className="font-serif" style={{ fontSize: '1.15rem', color: '#fff' }}>{c.customerName}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                    📞 {c.customerPhone || 'Contact on file'}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Latest Service: {c.serviceTitle}
                  </p>
                  <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span className="badge badge-confirmed" style={{ fontSize: '0.7rem' }}>
                      {c.type === 'home-service' ? 'Senior Care Client' : 'In-Shop Client'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)' }}>
                      ₹{c.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeSideTab === 'services' ? (
          <div className="neon-panel" style={{ padding: '2rem' }}>
            <h2 className="font-serif" style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '1rem' }}>
              Propose New Service
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Add a new service offering to the salon catalog.
            </p>
            <div className="form-group">
              <label className="form-label">Service Title</label>
              <input type="text" className="form-input" value={newServiceTitle} onChange={e => setNewServiceTitle(e.target.value)} placeholder="e.g. Balayage Highlights" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Price (₹)</label>
                <input type="number" className="form-input" value={newServicePrice} onChange={e => setNewServicePrice(e.target.value)} placeholder="e.g. 1500" />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Category</label>
                <select className="form-select" value={newServiceCategory} onChange={e => setNewServiceCategory(e.target.value)}>
                  <option>Hair</option>
                  <option>Grooming</option>
                  <option>Skincare</option>
                  <option>Nails</option>
                  <option>Senior Care</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" rows={3} value={newServiceDesc} onChange={e => setNewServiceDesc(e.target.value)} placeholder="Short description of the service..." />
            </div>
            <button 
              className="btn-gold" 
              onClick={() => {
                if(!newServiceTitle || !newServicePrice) return alert('Title and Price required');
                addService({
                  title: newServiceTitle,
                  price: Number(newServicePrice),
                  category: newServiceCategory,
                  description: newServiceDesc,
                  duration: '45 mins',
                  image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
                  homeServiceAvailable: newServiceCategory === 'Senior Care'
                });
                setNewServiceTitle('');
                setNewServicePrice('');
                setNewServiceDesc('');
                alert('Service added successfully to the catalog!');
              }}
            >
              Add Service to Catalog
            </button>
          </div>
        ) : activeSideTab === 'reviews' ? (
          <div>
            <h2 className="font-serif gold-text" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>My Customer Reviews</h2>
            {staffReviews.length === 0 ? (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)' }}>You don't have any reviews yet.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {staffReviews.map(rev => (
                  <div key={rev.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: '#fff', fontSize: '1.1rem' }}>{rev.customerName}</strong>
                      <span style={{ color: '#fbbf24', fontSize: '1.1rem' }}>{'★'.repeat(rev.rating)}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <strong>Service:</strong> {rev.serviceTitle} <br/>
                      <strong>Date:</strong> {rev.date}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0, marginTop: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '4px', borderLeft: '2px solid var(--accent-gold)' }}>
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeSideTab === 'profile' ? (
          <div className="neon-panel" style={{ padding: '2rem' }}>
            <h2 className="font-serif gold-text" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Edit Public Profile</h2>
            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label className="form-label">Specialty & Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={profileSpecialty} 
                  onChange={e => setProfileSpecialty(e.target.value)} 
                  placeholder="e.g. Master Stylist & Color Expert" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Experience (Years)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={profileExperience} 
                  onChange={e => setProfileExperience(e.target.value)} 
                  placeholder="e.g. 5+ Years" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Working History & Bio</label>
                <textarea 
                  className="form-textarea" 
                  rows={4} 
                  value={profileWorkingHistory} 
                  onChange={e => setProfileWorkingHistory(e.target.value)} 
                  placeholder="Describe your background and expertise for customers to see..." 
                  required 
                />
              </div>
              <button type="submit" className="btn-gold" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Check size={18} /> Save Profile Settings
              </button>
              {profileSaved && <span style={{ marginLeft: '1rem', color: '#10b981', fontSize: '0.9rem' }}>Profile saved successfully!</span>}
            </form>
          </div>
        ) : activeSideTab === 'chat' ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h1 className="font-serif gold-text" style={{ fontSize: '2rem', margin: 0 }}>Admin Chat</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Communicate directly with salon administration.</p>
              </div>
            </div>

            <div style={{ 
              background: 'linear-gradient(135deg, rgba(20, 20, 28, 0.95), rgba(18, 18, 22, 0.9))',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              height: 'calc(80vh - 120px)',
              minHeight: '500px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
            }}>
              {/* Chat Header */}
              <div style={{ 
                padding: '1.25rem 1.5rem', 
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                background: 'rgba(255,255,255,0.02)'
              }}>
                <div style={{ 
                  width: '45px', height: '45px', borderRadius: '50%', 
                  background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.2), rgba(225, 29, 72, 0.1))',
                  border: '2px solid rgba(225, 29, 72, 0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--accent-red)'
                }}>
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem', fontWeight: 700 }}>StyleSync Admin</h3>
                  <div style={{ fontSize: '0.8rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
                    Online
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div style={{ 
                flex: 1, overflowY: 'auto', padding: '1.5rem', 
                display: 'flex', flexDirection: 'column', gap: '1rem'
              }}>
                {myMessages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
                    <MessageSquare size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <p style={{ fontSize: '0.95rem' }}>No messages yet. Send a message to administration.</p>
                  </div>
                ) : (
                  myMessages.map(msg => {
                    const isMe = msg.sender === 'staff';
                    return (
                      <div key={msg.id} style={{ 
                        alignSelf: isMe ? 'flex-end' : 'flex-start',
                        maxWidth: '75%'
                      }}>
                        <div style={{ 
                          padding: '0.85rem 1.25rem',
                          borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          background: isMe 
                            ? 'linear-gradient(135deg, rgba(225, 29, 72, 0.2), rgba(225, 29, 72, 0.1))' 
                            : 'rgba(255, 255, 255, 0.05)',
                          border: isMe ? '1px solid rgba(225, 29, 72, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                          color: '#fff',
                          fontSize: '0.95rem',
                          lineHeight: 1.5,
                          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                        }}>
                          {msg.text}
                        </div>
                        <div style={{ 
                          fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem',
                          textAlign: isMe ? 'right' : 'left'
                        }}>
                          {isMe ? 'You' : msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div style={{ 
                padding: '1.25rem 1.5rem', 
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(255,255,255,0.01)',
                display: 'flex', gap: '0.75rem'
              }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Type your message..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                  style={{ flex: 1, padding: '0.85rem 1.25rem', fontSize: '0.95rem' }}
                />
                <button 
                  onClick={handleSendChat}
                  disabled={!chatInput.trim()}
                  style={{ 
                    padding: '0 1.5rem',
                    background: chatInput.trim() ? 'linear-gradient(135deg, #ff003c, #c9002b)' : 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    color: chatInput.trim() ? '#fff' : 'var(--text-muted)',
                    cursor: chatInput.trim() ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    fontWeight: 700, transition: 'all 0.2s'
                  }}
                >
                  <Send size={18} /> Send
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="neon-panel" style={{ padding: '2rem' }}>
            <h2 className="font-serif" style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '1rem' }}>
              Staff Helpdesk & Salon Manager Support
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Need assistance with equipment, home visit travel allowance, or client re-scheduling?
            </p>
            <div className="form-group">
              <label className="form-label">Support Ticket Details</label>
              <textarea className="form-textarea" rows={4} placeholder="Describe issue for Salon Admin or Manager..." />
            </div>
            <button className="btn-red-neon" onClick={() => alert('Support ticket dispatched to Admin!')}>
              Submit Staff Ticket
            </button>
          </div>
        )}

      </main>

      {/* UPDATE STATUS Modal */}
      {selectedBookingForUpdate && (
        <div className="modal-overlay" onClick={() => setSelectedBookingForUpdate(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <h3 className="font-serif" style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem' }}>
              Update Service Status
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Booking: <strong>{selectedBookingForUpdate.serviceTitle}</strong> for <strong>{selectedBookingForUpdate.customerName}</strong>
            </p>

            <div className="form-group">
              <label className="form-label">Select Current Status</label>
              <select 
                className="form-select"
                value={newStatusValue}
                onChange={e => setNewStatusValue(e.target.value)}
              >
                <option value="Pending">Pending (Scheduled)</option>
                <option value="In-Progress">In-Progress (Stylist Assigned / In Service)</option>
                <option value="Completed">Completed (Finished & Satisfied)</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button className="btn-secondary" onClick={() => setSelectedBookingForUpdate(null)}>
                Cancel
              </button>
              <button 
                className="btn-red-neon"
                onClick={() => {
                  updateBookingStatus(selectedBookingForUpdate.id, newStatusValue);
                  setSelectedBookingForUpdate(null);
                }}
              >
                Save & Synchronize
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
