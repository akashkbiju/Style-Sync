import React, { useState, useMemo } from 'react';
import { useSalon } from '../../context/SalonContext';
import { 
  User, Search, Mail, Phone, Calendar, CreditCard, 
  ShoppingBag, MapPin, ChevronDown, ChevronUp, Eye, 
  Users, TrendingUp, Star
} from 'lucide-react';

export const ManageCustomers = () => {
  const { bookings, payments, feedback } = useSalon();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCustomerId, setExpandedCustomerId] = useState(null);
  const [sortBy, setSortBy] = useState('bookings'); // 'bookings' | 'name' | 'spent'

  // Build customer profiles from bookings data
  const customers = useMemo(() => {
    const customerMap = new Map();

    bookings.forEach(booking => {
      const key = booking.customerName || booking.userEmail || 'Unknown';
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          id: booking.userId || booking.userEmail || `cust-${key}`,
          name: booking.customerName || 'Unknown Customer',
          email: booking.userEmail || booking.customerEmail || '',
          phone: booking.customerPhone || booking.phone || '',
          address: booking.address || booking.customerAddress || '',
          bookings: [],
          totalSpent: 0,
          firstVisit: booking.createdAt || booking.date,
          lastVisit: booking.createdAt || booking.date,
        });
      }

      const cust = customerMap.get(key);
      cust.bookings.push(booking);
      cust.totalSpent += Number(booking.amount) || 0;

      // Track latest visit
      const bDate = booking.createdAt || booking.date || '';
      if (bDate > (cust.lastVisit || '')) cust.lastVisit = bDate;
      if (bDate < (cust.firstVisit || 'z')) cust.firstVisit = bDate;

      // Capture phone/email if available
      if (booking.customerPhone && !cust.phone) cust.phone = booking.customerPhone;
      if (booking.phone && !cust.phone) cust.phone = booking.phone;
      if (booking.userEmail && !cust.email) cust.email = booking.userEmail;
      if (booking.customerEmail && !cust.email) cust.email = booking.customerEmail;
      if (booking.address && !cust.address) cust.address = booking.address;
    });

    return Array.from(customerMap.values());
  }, [bookings]);

  // Filter and sort
  const filteredCustomers = useMemo(() => {
    let list = customers;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
      );
    }

    if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'spent') list.sort((a, b) => b.totalSpent - a.totalSpent);
    else list.sort((a, b) => b.bookings.length - a.bookings.length);

    return list;
  }, [customers, searchQuery, sortBy]);

  // Get customer feedback
  const getCustomerFeedback = (customerName) => {
    return feedback.filter(f => f.customerName === customerName);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div style={{ paddingBottom: '3rem' }}>

      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="font-serif gold-text" style={{ fontSize: '2rem', margin: 0 }}>
              Customer Management
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              View all registered customers, their bookings, and spending history
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
          <div style={{
            padding: '1rem',
            background: 'rgba(225, 29, 72, 0.08)',
            border: '1px solid rgba(225, 29, 72, 0.2)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center'
          }}>
            <Users size={20} style={{ color: 'var(--accent-red)', marginBottom: '0.3rem' }} />
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-red)' }}>{customers.length}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Customers</div>
          </div>
          <div style={{
            padding: '1rem',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center'
          }}>
            <TrendingUp size={20} style={{ color: '#34d399', marginBottom: '0.3rem' }} />
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399' }}>
              ₹{customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Revenue</div>
          </div>
          <div style={{
            padding: '1rem',
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center'
          }}>
            <ShoppingBag size={20} style={{ color: '#60a5fa', marginBottom: '0.3rem' }} />
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#60a5fa' }}>{bookings.length}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Bookings</div>
          </div>
        </div>
      </div>

      {/* Search & Sort Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search customers by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.5rem', width: '100%' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { key: 'bookings', label: 'Most Bookings' },
            { key: 'spent', label: 'Top Spenders' },
            { key: 'name', label: 'A → Z' }
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => setSortBy(opt.key)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: sortBy === opt.key ? '1px solid var(--accent-red)' : '1px solid rgba(255,255,255,0.1)',
                background: sortBy === opt.key ? 'rgba(225, 29, 72, 0.12)' : 'rgba(255,255,255,0.03)',
                color: sortBy === opt.key ? 'var(--accent-red)' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Customer List */}
      {filteredCustomers.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          color: 'var(--text-muted)',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 'var(--radius-md)'
        }}>
          <Users size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem' }}>No Customers Found</h3>
          <p style={{ fontSize: '0.85rem' }}>
            {searchQuery ? 'Try a different search term.' : 'Customer data will appear here once bookings are made.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredCustomers.map((cust, idx) => {
            const isExpanded = expandedCustomerId === cust.id;
            const custFeedback = getCustomerFeedback(cust.name);
            const completedBookings = cust.bookings.filter(b => b.status === 'Completed').length;
            const homeBookings = cust.bookings.filter(b => b.type === 'home-service').length;

            return (
              <div
                key={cust.id || idx}
                style={{
                  background: 'linear-gradient(135deg, rgba(20, 20, 28, 0.95), rgba(18, 18, 22, 0.9))',
                  border: isExpanded ? '1px solid rgba(225, 29, 72, 0.3)' : '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  boxShadow: isExpanded ? '0 0 25px rgba(225, 29, 72, 0.08)' : 'none'
                }}
              >
                {/* Customer Row Header */}
                <div
                  onClick={() => setExpandedCustomerId(isExpanded ? null : cust.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.1rem 1.25rem',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease'
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: `hsl(${(cust.name.charCodeAt(0) * 37) % 360}, 60%, 35%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    flexShrink: 0,
                    border: '2px solid rgba(255,255,255,0.1)'
                  }}>
                    {cust.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Name & Contact */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ color: '#fff', margin: 0, fontSize: '1rem', fontWeight: 700 }}>{cust.name}</h3>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
                      {cust.email && (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Mail size={11} /> {cust.email}
                        </span>
                      )}
                      {cust.phone && (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Phone size={11} /> {cust.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-red)' }}>{cust.bookings.length}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bookings</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>₹{cust.totalSpent.toLocaleString('en-IN')}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Spent</div>
                    </div>
                    {isExpanded ? <ChevronUp size={18} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />}
                  </div>
                </div>

                {/* Expanded Customer Details */}
                {isExpanded && (
                  <div style={{
                    padding: '0 1.25rem 1.25rem',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    animation: 'fadeIn 0.3s ease'
                  }}>

                    {/* Detail Cards Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', padding: '1rem 0' }}>
                      <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem', fontWeight: 600 }}>Email</div>
                        <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>{cust.email || 'Not available'}</div>
                      </div>
                      <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem', fontWeight: 600 }}>Phone</div>
                        <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>{cust.phone || 'Not available'}</div>
                      </div>
                      <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem', fontWeight: 600 }}>First Visit</div>
                        <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>{formatDate(cust.firstVisit)}</div>
                      </div>
                      <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem', fontWeight: 600 }}>Last Visit</div>
                        <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>{formatDate(cust.lastVisit)}</div>
                      </div>
                      <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.06)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                        <div style={{ fontSize: '0.65rem', color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem', fontWeight: 600 }}>Completed</div>
                        <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>{completedBookings} of {cust.bookings.length}</div>
                      </div>
                      <div style={{ padding: '0.75rem', background: 'rgba(168, 85, 247, 0.06)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(168, 85, 247, 0.15)' }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem', fontWeight: 600 }}>Home Visits</div>
                        <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>{homeBookings}</div>
                      </div>
                    </div>

                    {/* Address if available */}
                    {cust.address && (
                      <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem', fontWeight: 600 }}>
                          <MapPin size={12} /> Address
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{cust.address}</div>
                      </div>
                    )}

                    {/* Booking History Table */}
                    <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700, margin: '0.5rem 0 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={14} /> Booking History
                    </h4>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>ID</th>
                            <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Service</th>
                            <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Stylist</th>
                            <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Date</th>
                            <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Amount</th>
                            <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cust.bookings.map((b, bIdx) => (
                            <tr key={b.id || bIdx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                              <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '0.75rem' }}>{b.id}</td>
                              <td style={{ padding: '0.6rem 0.75rem', color: '#fff', fontWeight: 500 }}>
                                {b.serviceTitle}
                                {b.type === 'home-service' && <span style={{ marginLeft: '0.4rem', fontSize: '0.7rem', color: 'var(--accent-purple)' }}>🏡</span>}
                              </td>
                              <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-secondary)' }}>{b.stylistName || '—'}</td>
                              <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-secondary)' }}>{b.date || formatDate(b.createdAt)}</td>
                              <td style={{ padding: '0.6rem 0.75rem', color: '#34d399', fontWeight: 600, textAlign: 'right' }}>₹{b.amount}</td>
                              <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>
                                <span style={{
                                  padding: '0.2rem 0.6rem',
                                  borderRadius: 'var(--radius-full)',
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  background: b.status === 'Completed' ? 'rgba(16, 185, 129, 0.15)' :
                                             b.status === 'Pending' ? 'rgba(245, 158, 11, 0.15)' :
                                             b.status === 'In-Progress' ? 'rgba(59, 130, 246, 0.15)' :
                                             'rgba(239, 68, 68, 0.15)',
                                  color: b.status === 'Completed' ? '#34d399' :
                                         b.status === 'Pending' ? '#fbbf24' :
                                         b.status === 'In-Progress' ? '#60a5fa' :
                                         '#f87171',
                                  border: `1px solid ${
                                    b.status === 'Completed' ? 'rgba(16, 185, 129, 0.3)' :
                                    b.status === 'Pending' ? 'rgba(245, 158, 11, 0.3)' :
                                    b.status === 'In-Progress' ? 'rgba(59, 130, 246, 0.3)' :
                                    'rgba(239, 68, 68, 0.3)'
                                  }`
                                }}>
                                  {b.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Customer Feedback */}
                    {custFeedback.length > 0 && (
                      <div style={{ marginTop: '1rem' }}>
                        <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Star size={14} style={{ color: '#fbbf24' }} /> Customer Reviews ({custFeedback.length})
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {custFeedback.slice(0, 3).map((fb, fIdx) => (
                            <div key={fb.id || fIdx} style={{ padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.05)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                                <span style={{ color: '#fbbf24', fontWeight: 600 }}>{'⭐'.repeat(fb.rating || 5)}</span>
                                <span style={{ color: 'var(--text-muted)' }}>{fb.date}</span>
                              </div>
                              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{fb.comment || fb.message}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Send Email Action */}
                    {cust.email && (
                      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <a
                          href={`mailto:${cust.email}?subject=${encodeURIComponent('StyleSync - We Value Your Patronage!')}`}
                          style={{
                            padding: '0.55rem 1.25rem',
                            background: 'rgba(225, 29, 72, 0.1)',
                            border: '1px solid rgba(225, 29, 72, 0.3)',
                            borderRadius: 'var(--radius-sm)',
                            color: '#f43f5e',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            textDecoration: 'none',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Mail size={14} /> Send Email
                        </a>
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
};
