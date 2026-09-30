import React, { useState, useEffect } from 'react';
import { useSalon } from '../../context/SalonContext';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  LogOut, 
  LogIn, 
  AlertCircle, 
  Sparkles, 
  History,
  Timer,
  CheckCircle
} from 'lucide-react';

export const StaffAttendance = ({ staffProfile }) => {
  const { staffAttendance, markStaffAttendance } = useSalon();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [punchNote, setPunchNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionAlert, setActionAlert] = useState(null);

  // Live ticking clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  // Find today's log for current staff
  const staffId = staffProfile?.id || staffProfile?.uid || 'staff';
  const staffName = staffProfile?.name || 'Staff Member';

  const myLogs = (staffAttendance || []).filter(
    a => a.staffId === staffId || a.staffName === staffName
  );

  const todayLog = myLogs.find(a => a.date === todayStr);

  const isCheckedIn = Boolean(todayLog?.checkInTime);
  const isCheckedOut = Boolean(todayLog?.checkOutTime);

  const handlePunch = async (type) => {
    setIsSubmitting(true);
    try {
      await markStaffAttendance({
        staffId,
        staffName,
        type,
        notes: punchNote.trim()
      });

      setPunchNote('');
      setActionAlert({
        type: 'success',
        message: type === 'check-in' 
          ? `Punch In successful at ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}! Have a wonderful day.`
          : `Punch Out recorded at ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}. Great job today!`
      });

      setTimeout(() => setActionAlert(null), 4000);
    } catch (err) {
      console.error(err);
      setActionAlert({
        type: 'error',
        message: 'Unable to update attendance. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stats
  const totalDaysPresent = myLogs.filter(l => l.status === 'Present' || l.status === 'Completed').length;
  const shiftsCompleted = myLogs.filter(l => l.checkOutTime).length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge" style={{ background: 'rgba(225, 29, 72, 0.15)', color: '#fb7185', border: '1px solid rgba(225, 29, 72, 0.35)', marginBottom: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={13} /> Daily Attendance Management
          </span>
          <h1 className="font-serif" style={{ fontSize: '2.2rem', color: '#fff', margin: '0.2rem 0' }}>
            Staff Punch In &amp; Attendance
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Record your daily shift check-in and check-out timestamps with official Salon Admin sync.
          </p>
        </div>
      </div>

      {actionAlert && (
        <div style={{
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: actionAlert.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          border: `1px solid ${actionAlert.type === 'success' ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
          color: actionAlert.type === 'success' ? '#34d399' : '#f87171'
        }}>
          <CheckCircle2 size={18} />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{actionAlert.message}</span>
        </div>
      )}

      {/* Grid: Live Clock + Punch Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Live Clock & Date Card */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(225, 29, 72, 0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
          
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
            {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          
          <div className="font-serif gold-text" style={{ fontSize: '3.2rem', fontWeight: 800, letterSpacing: '0.02em', margin: '0.2rem 0' }}>
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>

          <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.65rem', background: 'rgba(255,255,255,0.05)', borderRadius: '9999px', color: '#cbd5e1' }}>
              📍 StyleSync Salon Floor
            </span>
            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.65rem', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', borderRadius: '9999px' }}>
              ⚡ Real-time Timestamp
            </span>
          </div>
        </div>

        {/* Daily Punch Card */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: '#fff', margin: 0 }}>
              Today's Punch Status
            </h3>
            
            {/* Status Pill */}
            {isCheckedOut ? (
              <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.35)', fontWeight: 700 }}>
                ✓ Shift Completed
              </span>
            ) : isCheckedIn ? (
              <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.35)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                🟢 Active Shift (Present)
              </span>
            ) : (
              <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.35)', fontWeight: 700 }}>
                ⏳ Not Checked In
              </span>
            )}
          </div>

          {/* Time Displays */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.9rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Punch In Time</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: isCheckedIn ? '#34d399' : 'var(--text-secondary)', marginTop: '0.2rem' }}>
                {todayLog?.checkInTime || '-- : --'}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.9rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Punch Out Time</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: isCheckedOut ? '#60a5fa' : 'var(--text-secondary)', marginTop: '0.2rem' }}>
                {todayLog?.checkOutTime || '-- : --'}
              </div>
            </div>
          </div>

          {/* Note Input */}
          <div style={{ marginBottom: '1.25rem' }}>
            <input 
              type="text"
              className="form-input"
              placeholder="Optional remark / shift note (e.g. Morning opening shift, Client home care)..."
              value={punchNote}
              onChange={e => setPunchNote(e.target.value)}
              style={{ fontSize: '0.85rem', padding: '0.65rem 0.85rem' }}
            />
          </div>

          {/* Punch Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {!isCheckedIn ? (
              <button
                type="button"
                onClick={() => handlePunch('check-in')}
                disabled={isSubmitting}
                className="btn-gold"
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontSize: '0.95rem',
                  fontWeight: 700
                }}
              >
                <LogIn size={18} /> Punch In (Mark Present)
              </button>
            ) : !isCheckedOut ? (
              <button
                type="button"
                onClick={() => handlePunch('check-out')}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                  color: '#fff',
                  border: '1.5px solid var(--accent-red)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 0 20px var(--accent-red-glow)'
                }}
              >
                <LogOut size={18} /> Punch Out (End Shift)
              </button>
            ) : (
              <div style={{ flex: 1, textAlign: 'center', padding: '0.75rem', background: 'rgba(59, 130, 246, 0.08)', borderRadius: 'var(--radius-sm)', color: '#93c5fd', fontSize: '0.85rem' }}>
                🎉 You have completed your shift for today. Great work!
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Shifts Logged</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginTop: '0.2rem' }}>{myLogs.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.3rem' }}>✓ Recorded in Firestore</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Days Present</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '0.2rem' }}>{totalDaysPresent}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>Active salon attendance</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Completed Shifts</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-gold)', marginTop: '0.2rem' }}>{shiftsCompleted}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>Punched in &amp; out</div>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 className="font-serif" style={{ fontSize: '1.35rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <History size={18} color="var(--accent-gold)" /> Attendance History Log
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Showing {myLogs.length} entries
          </span>
        </div>

        {myLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <Clock size={40} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
            <p style={{ margin: 0 }}>No attendance logs recorded yet. Punch In above to begin tracking!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Date</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Punch In</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Punch Out</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Remarks / Notes</th>
                </tr>
              </thead>
              <tbody>
                {myLogs.map((log, idx) => (
                  <tr key={log.id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#fff' }}>
                      {log.date === todayStr ? <span style={{ color: 'var(--accent-gold)' }}>Today ({log.date})</span> : log.date}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#34d399', fontWeight: 600 }}>
                      {log.checkInTime || '--'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: log.checkOutTime ? '#60a5fa' : 'var(--text-muted)', fontWeight: 600 }}>
                      {log.checkOutTime || 'Active...'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="badge" style={{
                        background: log.status === 'Completed' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: log.status === 'Completed' ? '#60a5fa' : '#34d399',
                        fontSize: '0.72rem'
                      }}>
                        {log.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                      {log.notes || 'Normal daily shift'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
