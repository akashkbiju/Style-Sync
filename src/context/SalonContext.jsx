import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_SERVICES, 
  INITIAL_STAFF, 
  INITIAL_BOOKINGS, 
  INITIAL_PAYMENTS, 
  INITIAL_FEEDBACK 
} from '../data/seedData';
import { fetchStaffFromDB, addStaffToDB, updateStaffInDB } from '../firebase/staffService';
import { fetchCollection, addDocument, updateDocument, deleteDocument } from '../firebase/dbService';

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

  // Legacy fake staff filter to ensure only authentic salon staff exist
  const LEGACY_FAKE_NAMES = new Set(['Alexander Wright', 'Sophia Chen', 'Marcus Vance', 'Elena Rostova']);

  const [staff, setStaff] = useState(() => {
    // Initial optimistic load from localStorage for fast UI
    const saved = localStorage.getItem('stylesync_staff');
    if (saved) return JSON.parse(saved);
    return INITIAL_STAFF; // Fallback to seed data initially
  });

  const [isLoadingStaff, setIsLoadingStaff] = useState(true);

  // Fetch real data from Firestore on mount
  useEffect(() => {
    const loadAllCollections = async () => {
      try {
        setIsLoadingStaff(true);
        
        // 1. Staff
        const dbStaff = await fetchCollection('staff');
        if (dbStaff !== null) {
          if (dbStaff.length > 0) setStaff(dbStaff);
          else {
            for (const s of INITIAL_STAFF) await addDocument('staff', s).catch(e => {});
            setStaff(INITIAL_STAFF);
          }
        }

        // 2. Services
        const dbServices = await fetchCollection('services');
        if (dbServices !== null) {
          if (dbServices.length > 0) setServices(dbServices);
          else {
            for (const s of INITIAL_SERVICES) await addDocument('services', s).catch(e => {});
            setServices(INITIAL_SERVICES);
          }
        }

        // 3. Bookings
        const dbBookings = await fetchCollection('bookings');
        if (dbBookings !== null) {
          if (dbBookings.length > 0) setBookings(dbBookings);
          else {
            for (const b of INITIAL_BOOKINGS) await addDocument('bookings', b).catch(e => {});
            setBookings(INITIAL_BOOKINGS);
          }
        }

        // 4. Payments
        const dbPayments = await fetchCollection('payments');
        if (dbPayments !== null) {
          if (dbPayments.length > 0) setPayments(dbPayments);
          else {
            for (const p of INITIAL_PAYMENTS) await addDocument('payments', p).catch(e => {});
            setPayments(INITIAL_PAYMENTS);
          }
        }

        // 5. Feedback
        const dbFeedback = await fetchCollection('feedback');
        if (dbFeedback !== null) {
          if (dbFeedback.length > 0) setFeedback(dbFeedback);
          else {
            for (const f of INITIAL_FEEDBACK) await addDocument('feedback', f).catch(e => {});
            setFeedback(INITIAL_FEEDBACK);
          }
        }

      } catch (error) {
        console.error("Failed to load collections from Firestore:", error);
      } finally {
        setIsLoadingStaff(false);
      }
    };
    
    loadAllCollections();
  }, []);

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('stylesync_bookings');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Remove any bookings with legacy fake staff
      const cleaned = parsed.map(b => {
        if (b.stylistName === 'Sophia Chen' || b.stylistName === 'Alexander Wright') {
          return { ...b, stylistName: 'Akash K Biju' };
        }
        return b;
      });
      return cleaned;
    }
    return INITIAL_BOOKINGS;
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
  const addBooking = async (newBookingData, paymentDetails) => {
    const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = {
      id: bookingId,
      ...newBookingData,
      status: 'Pending',
      paymentStatus: paymentDetails ? `Paid (${paymentDetails.method})` : 'Paid (Online)',
      paymentId: paymentDetails ? paymentDetails.id : `pay_${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      userId: currentUser?.uid || null,
      userEmail: currentUser?.email || null
    };

    setBookings(prev => [newBooking, ...prev]);
    addDocument('bookings', newBooking).catch(console.error);

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
      addDocument('payments', paymentEntry).catch(console.error);
    }

    return newBooking;
  };

  const updateBookingStatus = (bookingId, newStatus, newPaymentStatus = null) => {
    setBookings(prev => 
      prev.map(b => {
        if (b.id === bookingId) {
          const updated = { ...b, status: newStatus };
          if (newPaymentStatus) updated.paymentStatus = newPaymentStatus;
          return updated;
        }
        return b;
      })
    );
    
    const updatePayload = { status: newStatus };
    if (newPaymentStatus) updatePayload.paymentStatus = newPaymentStatus;
    updateDocument('bookings', bookingId, updatePayload).catch(console.error);
  };

  const assignStylistToBooking = (bookingId, stylistName) => {
    setBookings(prev => 
      prev.map(b => b.id === bookingId ? { ...b, stylistName: stylistName } : b)
    );
    updateDocument('bookings', bookingId, { stylistName }).catch(console.error);
  };

  const addService = (newService) => {
    const srv = {
      id: `srv-${Date.now()}`,
      ...newService
    };
    setServices(prev => [srv, ...prev]);
    addDocument('services', srv).catch(console.error);
  };

  const deleteService = (serviceId) => {
    setServices(prev => prev.filter(s => s.id !== serviceId));
    deleteDocument('services', serviceId).catch(console.error);
  };

  const addStaffMember = async (newStaff) => {
    const stf = {
      id: `stf-${Date.now()}`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 5.0,
      status: 'Available',
      homeServiceCertified: true,
      ...newStaff
    };
    // Save to Firestore
    try {
      await addStaffToDB(stf);
      setStaff(prev => [stf, ...prev]);
    } catch(err) {
      console.error("Failed to add staff member to DB", err);
    }
  };

  const updateStaffStatus = async (staffId, status) => {
    try {
      await updateStaffInDB(staffId, { status });
      setStaff(prev => 
        prev.map(s => s.id === staffId ? { ...s, status } : s)
      );
    } catch(err) {
      console.error("Failed to update staff status in DB", err);
    }
  };

  const updateStaffProfile = async (staffId, profileData) => {
    try {
      await updateStaffInDB(staffId, profileData);
      setStaff(prev => 
        prev.map(s => s.id === staffId ? { ...s, ...profileData } : s)
      );
    } catch(err) {
      console.error("Failed to update staff profile in DB", err);
      throw err;
    }
  };

  const addFeedback = (newFb) => {
    const fb = {
      id: `fb-${Date.now()}`,
      date: new Date().toISOString().substring(0, 10),
      ...newFb
    };
    setFeedback(prev => [fb, ...prev]);
    addDocument('feedback', fb).catch(console.error);
  };

  // Login & Logout
  const loginUser = (user) => {
    localStorage.setItem('stylesync_current_user', JSON.stringify(user));
    setCurrentUser(user);

    // If staff logs in, ensure they are registered in the active staff roster & marked as logged in
    if (user.role === 'staff') {
      setActiveRole('staff');
      setStaff(prev => {
        const exists = prev.some(s => s.name === user.name || s.email === user.email);
        if (exists) {
          return prev.map(s => 
            (s.name === user.name || s.email === user.email)
              ? { ...s, isLoggedIn: true, status: 'Available' }
              : s
          );
        } else {
          const newStaffEntry = {
            id: user.uid || `stf-${Date.now()}`,
            name: user.name,
            role: user.staffRole || 'Senior Stylist & Care Specialist',
            specialty: user.staffRole || 'Hair Styling, Grooming & Senior Home Care',
            rating: 5.0,
            experience: 'Certified Specialist',
            status: 'Available',
            homeServiceCertified: true,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            email: user.email,
            phone: user.phone || '',
            isLoggedIn: true
          };
          return [newStaffEntry, ...prev];
        }
      });
    } else if (user.role === 'admin') {
      setActiveRole('admin');
    } else {
      setActiveRole('customer');
    }

    setCustomerTab('home');
    setAdminTab('dashboard');
  };

  const logoutUser = () => {
    localStorage.removeItem('stylesync_current_user');
    // Set all staff isLoggedIn to false
    setStaff(prev => prev.map(s => ({ ...s, isLoggedIn: false })));
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
      updateStaffProfile,
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
