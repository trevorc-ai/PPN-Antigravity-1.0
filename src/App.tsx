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
import { MyProtocols } from './pages/MyProtocols';
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
import SessionExportCenter from './pages/SessionExportCenter';
import ClinicalReportPDF from './pages/ClinicalReportPDF';
import ProfileEdit from './pages/ProfileEdit';
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
import Pricing from './pages/Pricing';
import ContributionModel from './pages/ContributionModel';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import PhysicsDemo from './pages/PhysicsDemo';
import HiddenComponentsShowcase from './pages/HiddenComponentsShowcase';
import ComponentShowcase from './pages/ComponentShowcase';
import MolecularVisualizationDemo from './pages/MolecularVisualizationDemo';
import IsometricMoleculesDemo from './pages/IsometricMoleculesDemo';
import MoleculeTest from './pages/MoleculeTest';
import ArcOfCareDemo from './pages/ArcOfCareDemo';
import ArcOfCarePhase2Demo from './pages/ArcOfCarePhase2Demo';
import ArcOfCarePhase3Demo from './pages/ArcOfCarePhase3Demo';
import ArcOfCareDashboard from './pages/ArcOfCareDashboard';
import WellnessJourney from './pages/WellnessJourney';
import MEQ30Page from './pages/MEQ30Page';
import PatientFormPage from './pages/PatientFormPage';
import AdaptiveAssessmentPage from './pages/AdaptiveAssessmentPage';
import Checkout from './pages/Checkout';
import Academy from './pages/Academy';
import BillingPortal from './pages/BillingPortal';
import PartnerDemoHub from './pages/PartnerDemoHub';
import FormsShowcase from './pages/FormsShowcase';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Verified Deep Dives
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
import WorkflowChaosPage from './pages/deep-dives/WorkflowChaosPage';



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
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a] text-slate-300 selection:bg-primary/30 selection:text-slate-300">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isLocked={false}
      />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <TopHeader
          onMenuClick={() => setIsSidebarOpen(true)}
          onLogout={onLogout}
          isAuthenticated={true}
          onStartTour={() => setShowTour(true)}
        />
        <Breadcrumbs />
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-transparent">
          {showTour && <GuidedTour onComplete={completeTour} />}
          <Outlet />
          <Footer />
        </main>
      </div>
    </div>
  );
};

/**
 * RequireAuth — Session Gate
 *
 * Sits between the Router and ProtectedLayout. Checks the Supabase session:
 *   - loading  → show a subtle spinner (prevents flash redirect on cold page load)
 *   - no user  → redirect to /login, preserving the intended destination
 *   - user ok  → render children via <Outlet />
 *
 * This replaces the commented-out auth guard that previously lived inside
 * ProtectedLayout and was disabled for the Inspector audit.
 */
const RequireAuth: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // While Supabase restores the persisted session from localStorage,
  // show a minimal loading screen — never redirect prematurely.
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-b from-[#0a1628] to-[#05070a]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm animate-pulse">Verifying session…</p>
        </div>
      </div>
    );
  }

  // Session expired or never logged in → send to login, preserve return URL
  if (!user) {
    const returnTo = location.pathname + location.hash;
    return <Navigate to="/login" state={{ from: returnTo }} replace />;
  }

  return <Outlet />;
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
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/landing" replace />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/secure-gate" element={<SecureGate />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contribution" element={<ContributionModel />} />
        {/* Dev/test routes removed from public router — use /hidden-components locally only */}
        <Route path="/arc-of-care" element={<ArcOfCareDemo />} />
        <Route path="/arc-of-care-phase2" element={<ArcOfCarePhase2Demo />} />
        <Route path="/arc-of-care-phase3" element={<ArcOfCarePhase3Demo />} />
        <Route path="/arc-of-care-dashboard" element={<ArcOfCareDashboard />} />
        <Route path="/meq30" element={<MEQ30Page />} />
        <Route path="/patient-form/:formId" element={<PatientFormPage />} />
        <Route path="/assessment" element={<AdaptiveAssessmentPage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/academy" element={<Academy />} />
        <Route path="/billing" element={<BillingPortal />} />
        <Route path="/partner-demo" element={<PartnerDemoHub />} />

        {/* Protected Routes — RequireAuth gates all children behind a valid session */}
        <Route element={<RequireAuth />}>
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

            {/* WELLNESS JOURNEY / ARC OF CARE */}
            <Route path="/wellness-journey" element={<WellnessJourney />} />
            <Route path="/arc-of-care-god-view" element={<Navigate to="/wellness-journey" replace />} /> {/* Legacy redirect */}

            {/* PROTOCOL BUILDER */}
            <Route path="/protocols" element={<MyProtocols />} />
            <Route path="/protocol/:id" element={<ProtocolDetail />} />
            <Route path="/clinicians" element={<ClinicianDirectory />} />
            <Route path="/clinician/:id" element={<ClinicianProfile />} />
            <Route path="/help" element={<HelpFAQ onStartTour={() => setShowTour(true)} />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile/edit" element={<ProfileEdit />} />
            <Route path="/data-export" element={<DataExport />} />
            <Route path="/session-export" element={<SessionExportCenter />} />
            <Route path="/clinical-report-pdf" element={<ClinicalReportPDF />} />

            {/* Forms Showcase - Testing Page for Arc of Care Forms */}
            <Route path="/forms-showcase" element={<FormsShowcase />} />

            {/* Deep Dives */}
            <Route path="/deep-dives/patient-flow" element={<PatientFlowPage />} />
            <Route path="/deep-dives/clinic-performance" element={<ClinicPerformancePage />} />
            <Route path="/deep-dives/patient-constellation" element={<PatientConstellationPage />} />
            <Route path="/deep-dives/molecular-pharmacology" element={<MolecularPharmacologyPage />} />
            <Route path="/deep-dives/protocol-efficiency" element={<ProtocolEfficiencyPage />} />
            <Route path="/deep-dives/workflow-chaos" element={<WorkflowChaosPage />} />
            <Route path="/deep-dives/safety-surveillance" element={<SafetySurveillancePage />} />
            <Route path="/deep-dives/risk-matrix" element={<RiskMatrixPage />} />

            <Route path="/logout" element={<div className="p-8 text-center flex flex-col items-center justify-center h-full"><h2 className="text-2xl font-black mb-4">Confirm Sign Out</h2><button onClick={signOut} className="px-8 py-3 bg-red-500/10 text-red-500 rounded-xl font-black uppercase tracking-widest border border-red-500/20 hover:bg-red-500/20 transition-all">Sign Out</button></div>} />

            {/* Catch-all for undefined protected routes */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route> {/* closes RequireAuth */}
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

