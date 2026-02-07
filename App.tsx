import React, { useState, useEffect } from 'react';
// Corrected imports for React Router v6
import { HashRouter as Router, Routes, Route, useLocation, Navigate, useNavigate, Outlet } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import SubstanceCatalog from './pages/SubstanceCatalog';
import SubstanceMonograph from './pages/SubstanceMonograph';
import InteractionChecker from './pages/InteractionChecker';
import AuditLogs from './pages/AuditLogs';
import ProtocolBuilder from './pages/ProtocolBuilder';
import ProtocolDetail from './pages/ProtocolDetail';
import ClinicianDirectory from './pages/ClinicianDirectory';
import ClinicianProfile from './pages/ClinicianProfile';
import SearchPortal from './pages/SearchPortal';
import SimpleSearch from './pages/SimpleSearch';
import News from './pages/News';
import HelpFAQ from './pages/HelpFAQ';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import Breadcrumbs from './components/Breadcrumbs';
import Footer from './components/Footer';
import GuidedTour from './components/GuidedTour';
import SecureGate from './pages/SecureGate';
import Login from './pages/Login';
import Landing from './pages/Landing';

/**
 * ScrollToTop Component
 * Resets the scroll position of the main research viewport whenever the location changes.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // Check if we are in the main scrollable area or utilizing window scroll (landing page)
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

// Layout Component for Protected Routes
const ProtectedLayout: React.FC<{
  isAuthenticated: boolean;
  onLogout: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  showTour: boolean;
  setShowTour: (show: boolean) => void;
}> = ({ isAuthenticated, onLogout, isSidebarOpen, setIsSidebarOpen, showTour, setShowTour }) => {
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const completeTour = () => {
    setShowTour(false);
    navigate('/');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-dark text-slate-100 selection:bg-primary/30 selection:text-white">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isLocked={false}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader
          onMenuClick={() => setIsSidebarOpen(true)}
          onLogout={onLogout}
          isAuthenticated={true}
          onStartTour={() => setShowTour(true)}
        />
        <Breadcrumbs />
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#0e1117]">
          {showTour && <GuidedTour onComplete={completeTour} />}
          <Outlet />
          <Footer />
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Persistent Auth: Immediate check of storage for existing session
  // Default to FALSE for initial state to ensure security, useEffect will check storage
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const [showTour, setShowTour] = useState(false);

  // Suppress ResizeObserver Warnings
  useEffect(() => {
    const handleResizeError = (e: ErrorEvent) => {
      if (e.message.includes('ResizeObserver')) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    };
    window.addEventListener('error', handleResizeError);

    const originalError = console.error;
    console.error = (...args: any[]) => {
      if (args[0]?.toString().includes('ResizeObserver')) return;
      originalError.call(console, ...args);
    };

    return () => {
      window.removeEventListener('error', handleResizeError);
      console.error = originalError;
    };
  }, []);

  // Persistent Auth Verification: Sync state with storage on mount
  useEffect(() => {
    const authLocal = localStorage.getItem('ppn_authenticated');
    const authSession = sessionStorage.getItem('ppn_authenticated');
    if ((authLocal === 'true' || authSession === 'true')) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    // Basic auth set
    sessionStorage.setItem('ppn_authenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Persistent Auth: Clear both storage buckets and reset states
    localStorage.removeItem('ppn_authenticated');
    sessionStorage.removeItem('ppn_authenticated');
    setIsAuthenticated(false);
    setIsSidebarOpen(false);
    setShowTour(false);
  };

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />} />

        {/* Protected Routes */}
        <Route element={
          <ProtectedLayout
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            showTour={showTour}
            setShowTour={setShowTour}
          />
        }>
          <Route path="/search" element={<SimpleSearch />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/advanced-search" element={<SearchPortal />} />
          <Route path="/news" element={<News />} />
          <Route path="/catalog" element={<SubstanceCatalog />} />
          <Route path="/monograph/:id" element={<SubstanceMonograph />} />
          <Route path="/interactions" element={<InteractionChecker />} />
          <Route path="/audit" element={<AuditLogs />} />
          <Route path="/builder" element={<ProtocolBuilder />} />
          <Route path="/protocol/:id" element={<ProtocolDetail />} />
          <Route path="/clinicians" element={<ClinicianDirectory />} />
          <Route path="/clinician/:id" element={<ClinicianProfile />} />
          <Route path="/help" element={<HelpFAQ onStartTour={() => setShowTour(true)} />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/logout" element={<div className="p-8 text-center flex flex-col items-center justify-center h-full"><h2 className="text-2xl font-black mb-4">Confirm Logout</h2><button onClick={handleLogout} className="px-8 py-3 bg-red-500/10 text-red-500 rounded-xl font-black uppercase tracking-widest border border-red-500/20 hover:bg-red-500/20 transition-all">Sign Out of Node</button></div>} />
        </Route>

        {/* Global Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
