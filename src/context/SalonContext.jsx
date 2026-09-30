import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_SERVICES, 
  INITIAL_STAFF, 
  INITIAL_BOOKINGS, 
  INITIAL_PAYMENTS, 
  INITIAL_FEEDBACK,
  INITIAL_COMPLAINTS 
} from '../data/seedData';
import { fetchStaffFromDB, addStaffToDB, updateStaffInDB, deleteStaffFromDB } from '../firebase/staffService';
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

  // Staff sub-tab: 'schedule' | 'tasks' | 'customers' | 'services' | 'reviews' | 'profile' | 'support' | 'chat'
  const [staffTab, setStaffTab] = useState('schedule');

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

  // Pending staff requests (awaiting admin approval)
  const [pendingStaff, setPendingStaff] = useState(() => {
    const saved = localStorage.getItem('stylesync_pending_staff');
    return saved ? JSON.parse(saved) : [];
  });

  // Admin ↔ Staff messaging system
  const [staffMessages, setStaffMessages] = useState(() => {
    const saved = localStorage.getItem('stylesync_staff_messages');
    return saved ? JSON.parse(saved) : {};
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

        // 6. Pending Staff
        const dbPending = await fetchCollection('pendingStaff');
        if (dbPending !== null) {
          if (dbPending.length > 0) setPendingStaff(dbPending);
        }

        // 7. Complaints
        const dbComplaints = await fetchCollection('complaints');
        if (dbComplaints !== null) {
          if (dbComplaints.length > 0) setComplaints(dbComplaints);
        }

        // 8. Staff Attendance
        const dbAttendance = await fetchCollection('staffAttendance');
        if (dbAttendance !== null) {
          if (dbAttendance.length > 0) setStaffAttendance(dbAttendance);
        }

        // 9. Leave Requests
        const dbLeaves = await fetchCollection('leaveRequests');
        if (dbLeaves !== null) {
          if (dbLeaves.length > 0) setLeaveRequests(dbLeaves);
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

  // Staff Attendance State
  const [staffAttendance, setStaffAttendance] = useState(() => {
    const saved = localStorage.getItem('stylesync_staff_attendance');
    return saved ? JSON.parse(saved) : [];
  });

  // Staff Leave Requests State
  const [leaveRequests, setLeaveRequests] = useState(() => {
    const saved = localStorage.getItem('stylesync_leave_requests');
    return saved ? JSON.parse(saved) : [];
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

  useEffect(() => {
    localStorage.setItem('stylesync_pending_staff', JSON.stringify(pendingStaff));
  }, [pendingStaff]);

  useEffect(() => {
    localStorage.setItem('stylesync_staff_messages', JSON.stringify(staffMessages));
  }, [staffMessages]);

  useEffect(() => {
    localStorage.setItem('stylesync_staff_attendance', JSON.stringify(staffAttendance));
  }, [staffAttendance]);

  useEffect(() => {
    localStorage.setItem('stylesync_leave_requests', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('stylesync_complaints');
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  useEffect(() => {
    localStorage.setItem('stylesync_complaints', JSON.stringify(complaints));
  }, [complaints]);

  // Customer AI Hair Studio Favorites
  const [hairFavorites, setHairFavorites] = useState(() => {
    const saved = localStorage.getItem('stylesync_hair_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [prefilledBookingStyle, setPrefilledBookingStyle] = useState(null);

  useEffect(() => {
    localStorage.setItem('stylesync_hair_favorites', JSON.stringify(hairFavorites));
  }, [hairFavorites]);

  const addHairFavorite = async (favoriteItem) => {
    const itemWithUser = {
      ...favoriteItem,
      userId: currentUser?.uid || null,
      userEmail: currentUser?.email || null,
      savedAt: favoriteItem.savedAt || new Date().toISOString()
    };
    setHairFavorites(prev => {
      const filtered = prev.filter(f => (f.id || f.styleId) !== (favoriteItem.id || favoriteItem.styleId));
      return [itemWithUser, ...filtered];
    });
    try {
      await addDocument('customer_hair_favorites', itemWithUser);
    } catch (e) {
      // Local fallback already saved
    }
  };

  const removeHairFavorite = async (styleId) => {
    setHairFavorites(prev => prev.filter(f => (f.id || f.styleId) !== styleId));
    try {
      await deleteDocument('customer_hair_favorites', styleId);
    } catch (e) {
      // Local fallback already saved
    }
  };

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
      status: newService.status || 'Active', // Default to Active, Staff will pass 'Pending'
      ...newService
    };
    setServices(prev => [srv, ...prev]);
    addDocument('services', srv).catch(console.error);
  };

  const updateServiceStatus = (serviceId, newStatus) => {
    setServices(prev => 
      prev.map(s => s.id === serviceId ? { ...s, status: newStatus } : s)
    );
    updateDocument('services', serviceId, { status: newStatus }).catch(console.error);
  };

  const deleteService = (serviceId) => {
    setServices(prev => prev.filter(s => s.id !== serviceId));
    deleteDocument('services', serviceId).catch(console.error);
  };

  // Submit a new staff registration as a PENDING request (awaiting admin approval)
  const submitStaffRequest = async (newStaff) => {
    const pendingEntry = {
      id: newStaff.id || `pending-${Date.now()}`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 5.0,
      status: 'Pending Approval',
      homeServiceCertified: true,
      approvalStatus: 'pending',
      requestedAt: new Date().toISOString(),
      ...newStaff
    };
    
    if (!pendingEntry.id) pendingEntry.id = `pending-${Date.now()}`;

    // Add to pending staff list
    setPendingStaff(prev => [pendingEntry, ...prev]);

    // Save to Firestore pendingStaff collection
    try {
      await addDocument('pendingStaff', pendingEntry);
    } catch(err) {
      console.warn("Failed to add pending staff request to DB", err);
    }
  };

  // Admin approves a pending staff request → move to active staff roster
  const approvePendingStaff = async (pendingId) => {
    const pendingMember = pendingStaff.find(p => p.id === pendingId);
    if (!pendingMember) return;

    const approvedStaff = {
      ...pendingMember,
      approvalStatus: 'approved',
      status: 'Available',
      approvedAt: new Date().toISOString(),
    };
    delete approvedStaff.requestedAt;

    // Add to active staff
    setStaff(prev => [approvedStaff, ...prev]);
    try {
      await addStaffToDB(approvedStaff);
    } catch(err) {
      console.warn("Failed to add approved staff to DB", err);
    }

    // Remove from pending
    setPendingStaff(prev => prev.filter(p => p.id !== pendingId));
    try {
      await deleteDocument('pendingStaff', pendingId);
    } catch(err) {
      console.warn("Failed to remove pending staff from DB", err);
    }
  };

  // Admin rejects a pending staff request
  const rejectPendingStaff = async (pendingId) => {
    setPendingStaff(prev => prev.filter(p => p.id !== pendingId));
    try {
      await deleteDocument('pendingStaff', pendingId);
    } catch(err) {
      console.warn("Failed to remove rejected staff from DB", err);
    }
  };

  // Direct add staff (used by admin "Add New Staff" button — no approval needed)
  const addStaffMember = async (newStaff) => {
    const stf = {
      id: newStaff.id || `stf-${Date.now()}`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 5.0,
      status: 'Available',
      homeServiceCertified: true,
      approvalStatus: 'approved',
      ...newStaff
    };
    
    if (!stf.id) stf.id = `stf-${Date.now()}`;

    setStaff(prev => [stf, ...prev]);

    try {
      await addStaffToDB(stf);
    } catch(err) {
      console.warn("Failed to add staff member to DB, keeping in memory fallback", err);
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
      const normalizedStaffId = staffId ? String(staffId) : (currentUser?.uid ? String(currentUser.uid) : `stf-${Date.now()}`);

      // 1. Update in-memory staff state & stylesync_staff in localStorage
      setStaff(prev => {
        const idMatches = (s) => 
          (s.id && String(s.id) === normalizedStaffId) ||
          (currentUser?.uid && String(s.id) === String(currentUser.uid)) ||
          (currentUser?.email && s.email && s.email.toLowerCase() === currentUser.email.toLowerCase()) ||
          (currentUser?.name && s.name && s.name.toLowerCase() === currentUser.name.toLowerCase());

        const exists = prev.some(idMatches);
        let updatedList;
        if (exists) {
          updatedList = prev.map(s => idMatches(s) ? { ...s, ...profileData } : s);
        } else {
          const newStaffEntry = {
            id: normalizedStaffId,
            name: profileData.name || currentUser?.name || 'Stylist Specialist',
            email: currentUser?.email || '',
            phone: profileData.phone || currentUser?.phone || '',
            role: currentUser?.staffRole || profileData.specialty || 'Senior Stylist',
            status: 'Available',
            rating: 5.0,
            homeServiceCertified: true,
            approvalStatus: 'approved',
            ...profileData
          };
          updatedList = [newStaffEntry, ...prev];
        }
        try {
          localStorage.setItem('stylesync_staff', JSON.stringify(updatedList));
        } catch (e) {
          console.warn("Could not save stylesync_staff to localStorage:", e);
        }
        return updatedList;
      });

      // 2. Synchronize currentUser in state and localStorage so avatar and details update app-wide
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          ...profileData,
          ...(profileData.name ? { name: profileData.name } : {}),
          ...(profileData.phone ? { phone: profileData.phone } : {}),
          ...(profileData.avatar ? { avatar: profileData.avatar } : {}),
        };
        setCurrentUser(updatedUser);
        try {
          localStorage.setItem('stylesync_current_user', JSON.stringify(updatedUser));
        } catch (storageErr) {
          console.warn("Could not save updated currentUser to localStorage:", storageErr);
        }
      }

      // 3. Persist to Firestore staff collection
      await updateStaffInDB(normalizedStaffId, profileData);

      return true;
    } catch(err) {
      console.error("Failed to update staff profile in DB", err);
      return false;
    }
  };

  // General profile updater for any logged in user
  const updateUserProfile = async (updates) => {
    if (!currentUser) return false;
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('stylesync_current_user', JSON.stringify(updatedUser));
    } catch (e) {
      console.warn("Could not write currentUser to localStorage:", e);
    }

    if (currentUser.role === 'staff') {
      const staffId = currentUser.uid || `stf-${currentUser.email || Date.now()}`;
      await updateStaffProfile(staffId, updates);
    }
    return true;
  };

  // Remove a staff member from the active roster
  const removeStaffMember = async (staffId) => {
    setStaff(prev => prev.filter(s => s.id !== staffId));
    try {
      await deleteDocument('staff', staffId);
    } catch(err) {
      console.warn('Failed to remove staff from DB', err);
    }
  };

  // Update staff level (Junior / Mid-Level / Senior / Lead)
  const updateStaffLevel = async (staffId, level) => {
    try {
      await updateStaffInDB(staffId, { level });
      setStaff(prev =>
        prev.map(s => s.id === staffId ? { ...s, level } : s)
      );
    } catch(err) {
      console.error('Failed to update staff level in DB', err);
    }
  };

  // Send a message between admin and staff
  const sendStaffMessage = (staffId, message, senderRole) => {
    const msg = {
      id: `msg-${Date.now()}`,
      text: message,
      sender: senderRole, // 'admin' or 'staff'
      senderName: senderRole === 'admin' ? 'Admin' : (currentUser?.name || 'Staff'),
      timestamp: new Date().toISOString(),
      read: false
    };
    setStaffMessages(prev => ({
      ...prev,
      [staffId]: [...(prev[staffId] || []), msg]
    }));
  };

  // Mark messages as read for a specific staff
  const markStaffMessagesRead = (staffId, readerRole) => {
    setStaffMessages(prev => {
      const msgs = prev[staffId] || [];
      return {
        ...prev,
        [staffId]: msgs.map(m => m.sender !== readerRole ? { ...m, read: true } : m)
      };
    });
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

    // If staff logs in, check if they are approved or still pending
    if (user.role === 'staff') {
      setActiveRole('staff');
      
      // Check if this staff is in the approved/active roster
      setStaff(prev => {
        const exists = prev.some(s => s.name === user.name || s.email === user.email);
        if (exists) {
          // Already approved — mark as logged in
          return prev.map(s => 
            (s.name === user.name || s.email === user.email)
              ? { ...s, isLoggedIn: true, status: 'Available' }
              : s
          );
        }
        // If they're not in active staff, they might be pending — don't auto-add them
        // The StaffDashboard will show a "pending approval" screen
        return prev;
      });
    } else if (user.role === 'admin') {
      setActiveRole('admin');
    } else {
      setActiveRole('customer');
    }

    setCustomerTab('home');
    setAdminTab('dashboard');
    setStaffTab('schedule');
  };

  const logoutUser = () => {
    localStorage.removeItem('stylesync_current_user');
    // Set all staff isLoggedIn to false
    setStaff(prev => prev.map(s => ({ ...s, isLoggedIn: false })));
    setCurrentUser(null);
    setActiveRole('customer');
    setCustomerTab('landing');
  };

  // ── Complaint Box Operations ──
  const submitComplaint = async (complaintData) => {
    const newEntry = {
      id: complaintData.id || `cmp-${Date.now()}`,
      customerName: currentUser?.name || complaintData.customerName || 'Anonymous Client',
      customerEmail: currentUser?.email || complaintData.customerEmail || '',
      customerPhone: currentUser?.phone || complaintData.customerPhone || '',
      category: complaintData.category || 'Service Quality',
      subject: complaintData.subject || 'Salon Issue',
      description: complaintData.description || '',
      urgency: complaintData.urgency || 'Normal',
      status: 'Pending Review',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timestamp: new Date().toISOString(),
      adminAction: '',
      adminActionDate: '',
      adminName: '',
      ...complaintData
    };

    if (!newEntry.id) newEntry.id = `cmp-${Date.now()}`;

    setComplaints(prev => [newEntry, ...prev]);

    try {
      await addDocument('complaints', newEntry);
    } catch(err) {
      console.warn("Failed to add complaint to Firestore DB", err);
    }

    return newEntry;
  };

  const updateComplaintStatus = async (complaintId, status, adminAction = '', adminName = '') => {
    const actionDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const updates = {
      status,
      adminAction,
      adminActionDate: actionDate,
      adminName: adminName || (currentUser?.name || 'Salon Administration')
    };

    setComplaints(prev =>
      prev.map(c => c.id === complaintId ? { ...c, ...updates } : c)
    );

    try {
      await updateDocument('complaints', complaintId, updates);
    } catch(err) {
      console.warn("Failed to update complaint in Firestore DB", err);
    }
  };

  const markStaffAttendance = async ({ staffId, staffName, type, notes = '' }) => {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const logId = `att_${staffId || 'staff'}_${today}`;

    let updatedRecord;
    setStaffAttendance(prev => {
      const existingIndex = prev.findIndex(a => (a.staffId === staffId || a.staffName === staffName) && a.date === today);
      if (existingIndex >= 0) {
        const existing = prev[existingIndex];
        updatedRecord = {
          ...existing,
          checkOutTime: type === 'check-out' ? nowTime : existing.checkOutTime,
          status: type === 'check-out' ? 'Completed' : 'Present',
          notes: notes || existing.notes,
          updatedAt: new Date().toISOString()
        };
        const copy = [...prev];
        copy[existingIndex] = updatedRecord;
        return copy;
      } else {
        updatedRecord = {
          id: logId,
          staffId: staffId || `stf_${Date.now()}`,
          staffName: staffName || 'Staff Stylist',
          date: today,
          checkInTime: nowTime,
          checkOutTime: '',
          status: 'Present',
          notes: notes || 'Punched in for work shift',
          createdAt: new Date().toISOString()
        };
        return [updatedRecord, ...prev];
      }
    });

    try {
      if (updatedRecord) {
        await addDocument('staffAttendance', updatedRecord);
      }
    } catch (err) {
      console.warn("Could not sync attendance to Firestore:", err);
    }

    return updatedRecord;
  };

  const submitLeaveRequest = async (requestData) => {
    const leaveId = `leave_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`;
    const submittedAt = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const newLeave = {
      id: leaveId,
      staffId: requestData.staffId || currentUser?.uid || '',
      staffName: requestData.staffName || currentUser?.name || 'Staff Specialist',
      staffRole: requestData.staffRole || 'Stylist',
      leaveType: requestData.leaveType || 'Casual Leave',
      startDate: requestData.startDate,
      endDate: requestData.endDate || requestData.startDate,
      session: requestData.session || 'Full Day',
      startTime: requestData.startTime || '',
      endTime: requestData.endTime || '',
      reason: requestData.reason || '',
      status: 'Pending',
      adminRemarks: '',
      adminName: '',
      adminActionDate: '',
      submittedAt
    };

    setLeaveRequests(prev => [newLeave, ...prev]);

    try {
      await addDocument('leaveRequests', newLeave);
    } catch (err) {
      console.warn("Could not save leave request to Firestore:", err);
    }

    return newLeave;
  };

  const updateLeaveRequestStatus = async (leaveId, status, adminRemarks = '', adminName = '') => {
    const actionDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const updates = {
      status,
      adminRemarks,
      adminActionDate: actionDate,
      adminName: adminName || (currentUser?.name || 'Salon Admin')
    };

    setLeaveRequests(prev =>
      prev.map(l => l.id === leaveId ? { ...l, ...updates } : l)
    );

    try {
      await updateDocument('leaveRequests', leaveId, updates);
    } catch (err) {
      console.warn("Could not update leave request in Firestore:", err);
    }
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
      staffTab,
      setStaffTab,
      // Data
      services,
      staff,
      pendingStaff,
      bookings,
      payments,
      feedback,
      staffMessages,
      complaints,
      staffAttendance,
      leaveRequests,
      // Actions
      addBooking,
      updateBookingStatus,
      assignStylistToBooking,
      addService,
      updateServiceStatus,
      deleteService,
      addStaffMember,
      removeStaffMember,
      submitStaffRequest,
      approvePendingStaff,
      rejectPendingStaff,
      updateStaffStatus,
      updateStaffLevel,
      updateStaffProfile,
      updateUserProfile,
      addFeedback,
      sendStaffMessage,
      markStaffMessagesRead,
      submitComplaint,
      updateComplaintStatus,
      markStaffAttendance,
      submitLeaveRequest,
      updateLeaveRequestStatus,
      // AI Hair Studio
      hairFavorites,
      addHairFavorite,
      removeHairFavorite,
      prefilledBookingStyle,
      setPrefilledBookingStyle,
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
