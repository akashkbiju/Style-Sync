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
  // Auth state
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('stylesync_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  const isAuthenticated = !!currentUser;

  // Active module role: 'customer' | 'staff' | 'admin'
  const [activeRole, setActiveRole] = useState('customer');

  // Customer sub-tab: 'landing' | 'home' | 'catalog' | 'book-inshop' | 'book-home' | 'my-bookings'
  const [customerTab, setCustomerTab] = useState('landing');

  // Admin sub-tab: 'dashboard' | 'home-requests' | 'services' | 'staff' | 'payments' | 'feedback'
  const [adminTab, setAdminTab] = useState('dashboard');


  // Persistent State Loaders
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem('stylesync_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [staff, setStaff] = useState(() => {
    const saved = localStorage.getItem('stylesync_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
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
        amount: newBookingData.amount,
        method: paymentDetails.method || 'Razorpay Online',
        status: 'Success',
        date: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
      setPayments(prev => [paymentEntry, ...prev]);
    }

    return newBooking;
  };

  const updateBookingStatus = (id, newStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const assignStylistToBooking = (bookingId, stylistName) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, stylistName } : b));
  };

  const addService = (newService) => {
    const srv = {
      id: `srv-${Date.now()}`,
      ...newService
    };
    setServices(prev => [srv, ...prev]);
  };

  const deleteService = (id) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const addStaffMember = (newStaff) => {
    const stf = {
      id: `stf-${Date.now()}`,
      rating: 5.0,
      status: 'Available',
      ...newStaff
    };
    setStaff(prev => [stf, ...prev]);
  };

  const updateStaffStatus = (id, status) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, status } : s));
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

  // Reset to initial demo data for MCA presentation viva
  const resetDemoData = () => {
    localStorage.removeItem('stylesync_services');
    localStorage.removeItem('stylesync_staff');
    localStorage.removeItem('stylesync_bookings');
    localStorage.removeItem('stylesync_payments');
    localStorage.removeItem('stylesync_feedback');
    setServices(INITIAL_SERVICES);
    setStaff(INITIAL_STAFF);
    setBookings(INITIAL_BOOKINGS);
    setPayments(INITIAL_PAYMENTS);
    setFeedback(INITIAL_FEEDBACK);
  };

  return (
    <SalonContext.Provider value={{
      // Auth
      currentUser,
      isAuthenticated,
      loginUser,
      logoutUser,
      // Role & Navigation
      activeRole,
      setActiveRole,
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
      resetDemoData
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
