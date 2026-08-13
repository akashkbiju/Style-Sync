import React from 'react';
import { SalonProvider, useSalon } from './context/SalonContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AIChatbot } from './components/AIChatbot';

// Auth
import { AuthPage } from './pages/Auth/AuthPage';

// Customer Pages
import { LandingPage } from './pages/CustomerPortal/LandingPage';
import { CustomerHome } from './pages/CustomerPortal/CustomerHome';
import { ServiceCatalog } from './pages/CustomerPortal/ServiceCatalog';
import { BookInShop } from './pages/CustomerPortal/BookInShop';
import { BookHomeService } from './pages/CustomerPortal/BookHomeService';
import { CustomerBookings } from './pages/CustomerPortal/CustomerBookings';

// Staff Pages
import { StaffDashboard } from './pages/StaffPortal/StaffDashboard';

// Admin Pages
import { AdminDashboard } from './pages/AdminPortal/AdminDashboard';
import { ManageHomeRequests } from './pages/AdminPortal/ManageHomeRequests';
import { ManageServices } from './pages/AdminPortal/ManageServices';
import { ManageStaff } from './pages/AdminPortal/ManageStaff';
import { PaymentRecords } from './pages/AdminPortal/PaymentRecords';
import { CustomerFeedback } from './pages/AdminPortal/CustomerFeedback';

const MainContent = () => {
  const { activeRole, customerTab, adminTab, isAuthenticated } = useSalon();

  // Show Auth gate if not logged in
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <main style={{ maxWidth: '1350px', margin: '0 auto', padding: '5.5rem 1.5rem 2rem', minHeight: '80vh' }}>
      
      {/* Customer Module Views */}
      {activeRole === 'customer' && (
        <>
          {customerTab === 'landing' && <LandingPage />}
          {customerTab === 'home' && <CustomerHome />}
          {customerTab === 'catalog' && <ServiceCatalog />}
          {customerTab === 'book-inshop' && <BookInShop />}
          {customerTab === 'book-home' && <BookHomeService />}
          {customerTab === 'my-bookings' && <CustomerBookings />}
        </>
      )}

      {/* Staff Module Views */}
      {activeRole === 'staff' && <StaffDashboard />}

      {/* Admin Module Views */}
      {activeRole === 'admin' && (
        <>
          {adminTab === 'dashboard' && <AdminDashboard />}
          {adminTab === 'home-requests' && <ManageHomeRequests />}
          {adminTab === 'services' && <ManageServices />}
          {adminTab === 'staff' && <ManageStaff />}
          {adminTab === 'payments' && <PaymentRecords />}
          {adminTab === 'feedback' && <CustomerFeedback />}
        </>
      )}

    </main>
  );
};

export function App() {
  return (
    <SalonProvider>
      <AppInner />
    </SalonProvider>
  );
}

const AppInner = () => {
  const { isAuthenticated } = useSalon();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {isAuthenticated && <Navbar />}
      <div style={{ flex: 1 }}>
        <MainContent />
      </div>
      {isAuthenticated && <AIChatbot />}
      {isAuthenticated && <Footer />}
    </div>
  );
};

export default App;
