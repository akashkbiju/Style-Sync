import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { 
  Calendar, 
  Clock, 
  Send, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileText, 
  Plus, 
  Filter,
  User,
  ShieldCheck,
  Check
} from 'lucide-react';

export const StaffLeaveRequest = ({ staffProfile }) => {
  const { leaveRequests, submitLeaveRequest } = useSalon();

  // Tomorrow as default start date
  const tomorrowStr = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  })();

  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [startDate, setStartDate] = useState(tomorrowStr);
  const [endDate, setEndDate] = useState(tomorrowStr);
  const [session, setSession] = useState('Full Day'); // 'Full Day' | 'Morning' | 'Afternoon' | 'Custom'
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('01:30 PM');
  const [reason, setReason] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  const staffId = staffProfile?.id || staffProfile?.uid || 'staff';
  const staffName = staffProfile?.name || 'Staff Member';
  const staffRole = staffProfile?.role || 'Senior Stylist';

  // Filter requests belonging to this staff member
  const myLeaves = (leaveRequests || []).filter(
    l => l.staffId === staffId || l.staffName === staffName
  );

  const displayedLeaves = filterStatus === 'All' 
    ? myLeaves 
    : myLeaves.filter(l => l.status === filterStatus);

  const pendingCount = myLeaves.filter(l => l.status === 'Pending').length;
  const approvedCount = myLeaves.filter(l => l.status === 'Approved').length;
  const rejectedCount = myLeaves.filter(l => l.status === 'Rejected').length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate) {
      alert('Please specify the starting date of your leave.');
      return;
    }
    if (!reason.trim()) {
      alert('Please enter a reason for your leave request so the salon manager can review it.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitLeaveRequest({
        staffId,
        staffName,
        staffRole,
        leaveType,
        startDate,
        endDate: endDate || startDate,
        session,
        startTime: session === 'Custom' ? startTime : '',
        endTime: session === 'Custom' ? endTime : '',
        reason: reason.trim()
      });

      setReason('');
      setAlertMsg({
        type: 'success',
        text: 'Leave application submitted to Salon Administration! You will see status updates below.'
      });
      setTimeout(() => setAlertMsg(null), 5000);
    } catch (err) {
      console.error(err);
      setAlertMsg({
        type: 'error',
        text: 'Failed to submit leave request. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Page Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge" style={{ background: 'rgba(217, 119, 6, 0.15)', color: '#fbbf24', border: '1px solid rgba(217, 119, 6, 0.35)', marginBottom: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={13} /> Staff Portal • Absence Workflow
          </span>
          <h1 className="font-serif" style={{ fontSize: '2.2rem', color: '#fff', margin: '0.2rem 0' }}>
            Leave Application &amp; Requests
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Submit date and time-specific leave requests directly to the Salon Administrator for official approval.
          </p>
        </div>
      </div>

      {alertMsg && (
        <div style={{
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: alertMsg.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          border: `1px solid ${alertMsg.type === 'success' ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
          color: alertMsg.type === 'success' ? '#34d399' : '#f87171'
        }}>
          <CheckCircle2 size={18} />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{alertMsg.text}</span>
        </div>
      )}

      {/* Metrics Counter Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Requests</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginTop: '0.2rem' }}>{myLeaves.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>All submitted leaves</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Pending Admin Review</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fbbf24', marginTop: '0.2rem' }}>{pendingCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '0.3rem' }}>⏳ Awaiting decision</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Approved Leaves</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#34d399', marginTop: '0.2rem' }}>{approvedCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.3rem' }}>✓ Authorized by Admin</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Rejected</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f87171', marginTop: '0.2rem' }}>{rejectedCount}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>Declined applications</div>
        </div>
      </div>

      {/* Layout: Apply Form + Leave History */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>

        {/* Apply for Leave Form Panel */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
            <FileText size={20} color="var(--accent-gold)" />
            <h3 className="font-serif" style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>
              Submit New Leave Application
            </h3>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
              
              {/* Leave Type */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Leave Type / Category</label>
                <select 
                  className="form-select"
                  value={leaveType}
                  onChange={e => setLeaveType(e.target.value)}
                >
                  <option value="Casual Leave">Casual Leave (CL)</option>
                  <option value="Medical / Sick Leave">Medical / Sick Leave (SL)</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                  <option value="Privilege / Annual Leave">Privilege / Annual Leave (PL)</option>
                  <option value="Half Day Leave">Half Day Leave</option>
                </select>
              </div>

              {/* Time Session */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Time Slot / Working Session</label>
                <select 
                  className="form-select"
                  value={session}
                  onChange={e => setSession(e.target.value)}
                >
                  <option value="Full Day">Full Day (All Working Hours)</option>
                  <option value="Morning">First Half (09:00 AM – 01:30 PM)</option>
                  <option value="Afternoon">Second Half (02:00 PM – 07:00 PM)</option>
                  <option value="Custom">Custom Specific Hours</option>
                </select>
              </div>

            </div>

            {/* Dates Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
              
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Leave Start Date</label>
                <input 
                  type="date"
                  className="form-input"
                  value={startDate}
                  onChange={e => {
                    setStartDate(e.target.value);
                    if (!endDate || endDate < e.target.value) {
                      setEndDate(e.target.value);
                    }
                  }}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Leave End Date</label>
                <input 
                  type="date"
                  className="form-input"
                  value={endDate}
                  min={startDate}
                  onChange={e => setEndDate(e.target.value)}
                  required
                />
              </div>

              {/* Custom Hours picker if selected */}
              {session === 'Custom' && (
                <>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">From Time</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="e.g. 11:00 AM"
                      value={startTime}
                      onChange={e => setStartTime(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">To Time</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="e.g. 04:30 PM"
                      value={endTime}
                      onChange={e => setEndTime(e.target.value)}
                    />
                  </div>
                </>
              )}

            </div>

            {/* Reason Textarea */}
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Subject &amp; Reason for Leave</label>
              <textarea 
                className="form-textarea"
                rows={3}
                placeholder="State your reason for absence (e.g., Doctor appointment, Family function, Urgent personal work)..."
                value={reason}
                onChange={e => setReason(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="btn-gold"
                style={{
                  padding: '0.85rem 1.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  fontSize: '0.95rem',
                  fontWeight: 700
                }}
              >
                <Send size={16} /> Submit Leave Request to Admin
              </button>
            </div>

          </form>
        </div>

        {/* My Leave Requests Table */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 className="font-serif" style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>
                My Leave Requests History
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
                Track approval decisions and feedback notes from Salon Admin
              </p>
            </div>

            {/* Status Filter */}
            <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(255,255,255,0.04)', padding: '3px', borderRadius: '6px' }}>
              {['All', 'Pending', 'Approved', 'Rejected'].map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilterStatus(st)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '4px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: filterStatus === st ? 'var(--accent-gold)' : 'transparent',
                    color: filterStatus === st ? '#000' : 'var(--text-secondary)'
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {displayedLeaves.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <Calendar size={40} style={{ opacity: 0.25, marginBottom: '0.75rem' }} />
              <p style={{ margin: 0 }}>No leave applications found under "{filterStatus}".</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Dates &amp; Time</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Type</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Reason</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Admin Remarks</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Applied On</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedLeaves.map((leave) => (
                    <tr key={leave.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 600, color: '#fff' }}>
                          {leave.startDate} {leave.endDate !== leave.startDate ? `➔ ${leave.endDate}` : ''}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)' }}>
                          {leave.session === 'Custom' 
                            ? `${leave.startTime || ''} - ${leave.endTime || ''}` 
                            : leave.session}
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 500 }}>
                          {leave.leaveType}
                        </span>
                      </td>

                      <td style={{ padding: '0.85rem 1rem', maxWidth: '240px' }}>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={leave.reason}>
                          {leave.reason}
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        {leave.status === 'Approved' ? (
                          <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.35)', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                            <CheckCircle2 size={12} /> Approved
                          </span>
                        ) : leave.status === 'Rejected' ? (
                          <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.35)', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                            <XCircle size={12} /> Rejected
                          </span>
                        ) : (
                          <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.35)', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Clock size={12} /> Pending Review
                          </span>
                        )}
                      </td>

                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem' }}>
                        {leave.adminRemarks ? (
                          <div style={{ color: leave.status === 'Approved' ? '#34d399' : '#f87171' }}>
                            "{leave.adminRemarks}"
                            {leave.adminName && (
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>
                                by {leave.adminName}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>--</span>
                        )}
                      </td>

                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {leave.submittedAt}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
