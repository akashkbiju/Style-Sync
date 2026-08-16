import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_SERVICES, 
  INITIAL_STAFF, 
  INITIAL_BOOKINGS, 
  INITIAL_PAYMENTS, 
  INITIAL_FEEDBACK 
} from '../data/seedData';

const SalonContext = createContext();

export const SalonProvider = ({ children }) => {
  // Theme state: 'dark' | 'light'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('stylesync_theme');
    return savedTheme || 'dark';
  });

  // Apply theme to root html element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('stylesync_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Auth state
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('stylesync_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  const isAuthenticated = !!currentUser;

  // Active module role — locked to logged-in user's role, never manually switchable
  const [activeRole, setActiveRole] = useState(() => {
    const saved = localStorage.getItem('stylesync_current_user');
    if (saved) {
      const user = JSON.parse(saved);
      return user.role || 'customer';
    }
    return 'customer';
  });

  // Customer sub-tab: 'landing' | 'home' | 'catalog' | 'book-inshop' | 'book-home' | 'my-bookings'
  const [customerTab, setCustomerTab] = useState('home');

  // Admin sub-tab: 'dashboard' | 'home-requests' | 'services' | 'staff' | 'payments' | 'feedback'
  const [adminTab, setAdminTab] = useState('dashboard');

  // Persistent State Loaders with smart merging for new seed items
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem('stylesync_services');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge any new seed services that don't exist in local storage
      const existingIds = new Set(parsed.map(s => s.id));
      const newItems = INITIAL_SERVICES.filter(s => !existingIds.has(s.id));
      return [...parsed, ...newItems];
    }
    return INITIAL_SERVICES;
  });

  const [staff, setStaff] = useState(() => {
    const saved = localStorage.getItem('stylesync_staff');
    if (saved) {
      const parsed = JSON.parse(saved);
      const existingIds = new Set(parsed.map(s => s.id));
      const newItems = INITIAL_STAFF.filter(s => !existingIds.has(s.id));
      return [...parsed, ...newItems];
    }
    return INITIAL_STAFF;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('stylesync_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('stylesync_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [feedback, setFeedback] = useState(() => {
    const saved = localStorage.getItem('stylesync_feedback');
    return saved ? JSON.parse(saved) : INITIAL_FEEDBACK;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('stylesync_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('stylesync_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('stylesync_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('stylesync_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('stylesync_feedback', JSON.stringify(feedback));
  }, [feedback]);

  // Actions & Operations
  const addBooking = (newBookingData, paymentDetails) => {
    const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = {
      id: bookingId,
      ...newBookingData,
      status: 'Pending',
      paymentStatus: paymentDetails ? `Paid (${paymentDetails.method})` : 'Paid (Online)',
      paymentId: paymentDetails ? paymentDetails.id : `pay_${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setBookings(prev => [newBooking, ...prev]);

    // Record Payment
    if (paymentDetails) {
      const paymentEntry = {
        id: paymentDetails.id || `pay_${Date.now()}`,
        bookingId: bookingId,
        customerName: newBookingData.customerName,
        serviceTitle: newBookingData.serviceTitle,
        amount: newBookingData.amount,
        method: paymentDetails.method || 'Razorpay Online',
        status: 'Success',
        date: new Date().toISOString().substring(0, 10),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setPayments(prev => [paymentEntry, ...prev]);
    }

    return newBooking;
  };

  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings(prev => 
      prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
    );
  };

  const assignStylistToBooking = (bookingId, stylistName) => {
    setBookings(prev => 
      prev.map(b => b.id === bookingId ? { ...b, stylistName: stylistName } : b)
    );
  };

  const addService = (newService) => {
    const srv = {
      id: `srv-${Date.now()}`,
      ...newService
    };
    setServices(prev => [srv, ...prev]);
  };

  const deleteService = (serviceId) => {
    setServices(prev => prev.filter(s => s.id !== serviceId));
  };

  const addStaffMember = (newStaff) => {
    const stf = {
      id: `stf-${Date.now()}`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 5.0,
      ...newStaff
    };
    setStaff(prev => [stf, ...prev]);
  };

  const updateStaffStatus = (staffId, status) => {
    setStaff(prev => 
      prev.map(s => s.id === staffId ? { ...s, status } : s)
    );
  };

  const addFeedback = (newFb) => {
    const fb = {
      id: `fb-${Date.now()}`,
      date: new Date().toISOString().substring(0, 10),
      ...newFb
    };
    setFeedback(prev => [fb, ...prev]);
  };

  // Login & Logout
  const loginUser = (user) => {
    localStorage.setItem('stylesync_current_user', JSON.stringify(user));
    setCurrentUser(user);
    // Auto-switch role
    if (user.role === 'admin') setActiveRole('admin');
    else if (user.role === 'staff') setActiveRole('staff');
    else setActiveRole('customer');
    setCustomerTab('home');
    setAdminTab('dashboard');
  };

  const logoutUser = () => {
    localStorage.removeItem('stylesync_current_user');
    setCurrentUser(null);
    setActiveRole('customer');
    setCustomerTab('landing');
  };

  return (
    <SalonContext.Provider value={{
      // Theme
      theme,
      toggleTheme,
      // Auth
      currentUser,
      isAuthenticated,
      loginUser,
      logoutUser,
      // Role & Navigation (activeRole is READ-ONLY externally — set only on login)
      activeRole,
      customerTab,
      setCustomerTab,
      adminTab,
      setAdminTab,
      // Data
      services,
      staff,
      bookings,
      payments,
      feedback,
      // Actions
      addBooking,
      updateBookingStatus,
      assignStylistToBooking,
      addService,
      deleteService,
      addStaffMember,
      updateStaffStatus,
      addFeedback,
    }}>
      {children}
    </SalonContext.Provider>
  );
};

export const useSalon = () => {
  const context = useContext(SalonContext);
  if (!context) {
    throw new Error('useSalon must be used within a SalonProvider');
  }
  return context;
};
