import React, { useState, useEffect } from 'react';
// Corrected imports for React Router v6
import { HashRouter as Router, Routes, Route, useLocation, Navigate, useNavigate, Outlet } from 'react-router-dom';
import About from './pages/About';
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
import DataExport from './pages/DataExport';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import Breadcrumbs from './components/Breadcrumbs';
import Footer from './components/Footer';
import GuidedTour from './components/GuidedTour';
import SecureGate from './pages/SecureGate';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Landing from './pages/Landing';
import PhysicsDemo from './pages/PhysicsDemo';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Verified Deep Dives
import RegulatoryMapPage from './pages/deep-dives/RegulatoryMapPage';
import ClinicPerformancePage from './pages/deep-dives/ClinicPerformancePage';
import PatientConstellationPage from './pages/deep-dives/PatientConstellationPage';
import MolecularPharmacologyPage from './pages/deep-dives/MolecularPharmacologyPage';
import ProtocolEfficiencyPage from './pages/deep-dives/ProtocolEfficiencyPage';
import ComparativeEfficacyPage from './pages/deep-dives/ComparativeEfficacyPage';
import PatientJourneyPage from './pages/deep-dives/PatientJourneyPage';
import PatientRetentionPage from './pages/deep-dives/PatientRetentionPage';
import RevenueAuditPage from './pages/deep-dives/RevenueAuditPage';
import RiskMatrixPage from './pages/deep-dives/RiskMatrixPage';
import SafetySurveillancePage from './pages/deep-dives/SafetySurveillancePage';
import PatientFlowPage from './pages/deep-dives/PatientFlowPage';

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

// Layout Component for Protected Routes - AUTH DISABLED PENDING SUPABASE INTEGRATION
const ProtectedLayout: React.FC<{
  isAuthenticated: boolean;
  onLogout: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  showTour: boolean;
  setShowTour: (show: boolean) => void;
}> = ({ isAuthenticated, onLogout, isSidebarOpen, setIsSidebarOpen, showTour, setShowTour }) => {
  const navigate = useNavigate();

  // AUTH CHECK TEMPORARILY DISABLED FOR INSPECTOR AUDIT
  // useEffect(() => {
  //   const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
  //   if (!isAuthenticated && !isDemoMode) {
  //     navigate('/login');
  //   }
  // }, [isAuthenticated, navigate]);

  // Check environment variable for demo mode
  // const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
  // if (!isAuthenticated && !isDemoMode) return null;

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

const AppContent: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/secure-gate" element={<SecureGate />} />
        <Route path="/vibe-check" element={<PhysicsDemo />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route element={
          <ProtectedLayout
            isAuthenticated={!!user}
            onLogout={signOut}
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
          <Route path="/data-export" element={<DataExport />} />

          {/* Deep Dives */}
          <Route path="/deep-dives/patient-flow" element={<PatientFlowPage />} />
          <Route path="/deep-dives/regulatory-map" element={<RegulatoryMapPage />} />
          <Route path="/deep-dives/clinic-performance" element={<ClinicPerformancePage />} />
          <Route path="/deep-dives/patient-constellation" element={<PatientConstellationPage />} />
          <Route path="/deep-dives/molecular-pharmacology" element={<MolecularPharmacologyPage />} />
          <Route path="/deep-dives/protocol-efficiency" element={<ProtocolEfficiencyPage />} />

          <Route path="/logout" element={<div className="p-8 text-center flex flex-col items-center justify-center h-full"><h2 className="text-2xl font-black mb-4">Confirm Logout</h2><button onClick={signOut} className="px-8 py-3 bg-red-500/10 text-red-500 rounded-xl font-black uppercase tracking-widest border border-red-500/20 hover:bg-red-500/20 transition-all">Sign Out of Node</button></div>} />
        </Route>

        {/* Global Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './components/ui/Toast';

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
        <ToastContainer />
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;

