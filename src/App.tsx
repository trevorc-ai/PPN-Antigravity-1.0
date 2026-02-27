import React, { Suspense, lazy, useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate, useNavigate, Outlet } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────────────────────
// WO-513: Route-Based Code Splitting
// ALL page imports are now lazy — each route loads its own JS chunk on demand.
// The landing page (~80-150KB) no longer drags down the entire app (~2-4MB).
// ─────────────────────────────────────────────────────────────────────────────

// ── Tier 1: Public / Critical Path ───────────────────────────────────────────
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Waitlist = lazy(() => import('./pages/Waitlist'));
const About = lazy(() => import('./pages/About'));
const Pricing = lazy(() => import('./pages/Pricing'));
const ContributionModel = lazy(() => import('./pages/ContributionModel'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Academy = lazy(() => import('./pages/Academy'));
const PartnerDemoHub = lazy(() => import('./pages/PartnerDemoHub'));

// ── Tier 2: Post-Auth Entry Points ───────────────────────────────────────────
const SimpleSearch = lazy(() => import('./pages/SimpleSearch'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// ── Tier 3: Core Authenticated App ───────────────────────────────────────────
const Analytics = lazy(() => import('./pages/Analytics'));
const News = lazy(() => import('./pages/News'));
const SubstanceCatalog = lazy(() => import('./pages/SubstanceCatalog'));
const SubstanceMonograph = lazy(() => import('./pages/SubstanceMonograph'));
const InteractionChecker = lazy(() => import('./pages/InteractionChecker'));
const AuditLogs = lazy(() => import('./pages/AuditLogs'));
const MyProtocols = lazy(() => import('./pages/MyProtocols').then(m => ({ default: m.MyProtocols })));
const ProtocolDetail = lazy(() => import('./pages/ProtocolDetail'));
const ClinicianProfile = lazy(() => import('./pages/ClinicianProfile'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Settings = lazy(() => import('./pages/Settings'));
const DataExport = lazy(() => import('./pages/DataExport'));
const SessionExportCenter = lazy(() => import('./pages/SessionExportCenter'));
const ClinicalReportPDF = lazy(() => import('./pages/ClinicalReportPDF'));
const DemoClinicalReportPDF = lazy(() => import('./pages/DemoClinicalReportPDF'));
const ProfileEdit = lazy(() => import('./pages/ProfileEdit'));
const WellnessJourney = lazy(() => import('./pages/WellnessJourney'));
const PatientCompanionPage = lazy(() => import('./pages/PatientCompanionPage'));
const MEQ30Page = lazy(() => import('./pages/MEQ30Page'));
const PatientFormPage = lazy(() => import('./pages/PatientFormPage'));
const AdaptiveAssessmentPage = lazy(() => import('./pages/AdaptiveAssessmentPage'));
const SecureGate = lazy(() => import('./pages/SecureGate'));

// ── Tier 4: Deep Dives (Public Marketing, Large Charts) ──────────────────────
const ClinicPerformancePage = lazy(() => import('./pages/deep-dives/ClinicPerformancePage'));
const PatientConstellationPage = lazy(() => import('./pages/deep-dives/PatientConstellationPage'));
const MolecularPharmacologyPage = lazy(() => import('./pages/deep-dives/MolecularPharmacologyPage'));
const ProtocolEfficiencyPage = lazy(() => import('./pages/deep-dives/ProtocolEfficiencyPage'));
const ComparativeEfficacyPage = lazy(() => import('./pages/deep-dives/ComparativeEfficacyPage'));
const PatientJourneyPage = lazy(() => import('./pages/deep-dives/PatientJourneyPage'));
const PatientRetentionPage = lazy(() => import('./pages/deep-dives/PatientRetentionPage'));
const RevenueAuditPage = lazy(() => import('./pages/deep-dives/RevenueAuditPage'));
const RiskMatrixPage = lazy(() => import('./pages/deep-dives/RiskMatrixPage'));
const SafetySurveillancePage = lazy(() => import('./pages/deep-dives/SafetySurveillancePage'));
const PatientFlowPage = lazy(() => import('./pages/deep-dives/PatientFlowPage'));
const WorkflowChaosPage = lazy(() => import('./pages/deep-dives/WorkflowChaosPage'));

// ── Tier 5: Dev/Showcase (low priority) ──────────────────────────────────────
const ArcOfCareDemo = lazy(() => import('./pages/ArcOfCareDemo'));
const ArcOfCarePhase2Demo = lazy(() => import('./pages/ArcOfCarePhase2Demo'));
const ArcOfCarePhase3Demo = lazy(() => import('./pages/ArcOfCarePhase3Demo'));
const ArcOfCareDashboard = lazy(() => import('./pages/ArcOfCareDashboard'));
const PhysicsDemo = lazy(() => import('./pages/PhysicsDemo'));
const HiddenComponentsShowcase = lazy(() => import('./pages/HiddenComponentsShowcase'));
const ComponentShowcase = lazy(() => import('./pages/ComponentShowcase'));
const MolecularVisualizationDemo = lazy(() => import('./pages/MolecularVisualizationDemo'));
const IsometricMoleculesDemo = lazy(() => import('./pages/IsometricMoleculesDemo'));
const MoleculeTest = lazy(() => import('./pages/MoleculeTest'));

// ── Eagerly loaded layout & infrastructure ───────────────────────────────────
// These are needed on every authenticated route so they stay synchronous.
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import Breadcrumbs from './components/Breadcrumbs';
import Footer from './components/Footer';
import GuidedTour from './components/GuidedTour';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './components/ui/Toast';
import { ThemeProvider } from './contexts/ThemeContext';
import {
  HelpCenterLayout,
} from './components/help/HelpCenterLayout';
import {
  HelpInteractionChecker,
  HelpWellnessJourney,
  HelpScanner,
  HelpQuickstart,
  HelpOverview,
  HelpSessionReporting,
  HelpDevices,
  HelpSettings,
} from './components/help/HelpPages';

// ─────────────────────────────────────────────────────────────────────────────
// Page Loading Fallback
// Matches the app's dark theme — no jarring white flash between route changes.
// ─────────────────────────────────────────────────────────────────────────────
const PageLoader: React.FC = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      <p className="text-slate-500 text-sm animate-pulse">Loading…</p>
    </div>
  </div>
);

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
  const completeTour = () => {
    localStorage.setItem('ppn_tour_completed', 'true');
    localStorage.setItem('ppn_has_seen_welcome', 'true');
    setShowTour(false);
  };

  return (
    <div className="flex h-screen overflow-clip bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a] text-slate-300 selection:bg-primary/30 selection:text-slate-300">
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
 */
const RequireAuth: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

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

  // ── First-login auto-tour trigger (WO-508) ───────────────────────────────
  useEffect(() => {
    if (!user) return;
    if (localStorage.getItem('ppn_tour_completed')) return;
    const timer = setTimeout(() => setShowTour(true), 1500);
    return () => clearTimeout(timer);
  }, [user]);

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
    console.error = (...args: unknown[]) => {
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
      {/*
        Single <Suspense> boundary wraps all routes.
        PageLoader provides a dark-themed fallback so there is no white flash
        between route transitions. AuthProvider, ToastProvider, and ThemeProvider
        remain outside Suspense — they must initialize synchronously.
      */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={user ? <Navigate to="/search" replace /> : <Navigate to="/landing" replace />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="/secure-gate" element={<SecureGate />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contribution" element={<ContributionModel />} />
          <Route path="/arc-of-care" element={<ArcOfCareDemo />} />
          <Route path="/arc-of-care-phase2" element={<ArcOfCarePhase2Demo />} />
          <Route path="/arc-of-care-phase3" element={<ArcOfCarePhase3Demo />} />
          <Route path="/arc-of-care-dashboard" element={<ArcOfCareDashboard />} />
          <Route path="/meq30" element={<MEQ30Page />} />
          <Route path="/patient-form/:formId" element={<PatientFormPage />} />
          <Route path="/assessment" element={<AdaptiveAssessmentPage />} />
          <Route path="/login" element={user ? <Navigate to="/search" replace /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/academy" replace />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/partner-demo" element={<PartnerDemoHub />} />

          {/* Deep Dives (Public Marketing Pages) */}
          <Route path="/deep-dives/patient-flow" element={<PatientFlowPage />} />
          <Route path="/deep-dives/clinic-performance" element={<ClinicPerformancePage />} />
          <Route path="/deep-dives/patient-constellation" element={<PatientConstellationPage />} />
          <Route path="/deep-dives/molecular-pharmacology" element={<MolecularPharmacologyPage />} />
          <Route path="/deep-dives/protocol-efficiency" element={<ProtocolEfficiencyPage />} />
          <Route path="/deep-dives/workflow-chaos" element={<WorkflowChaosPage />} />
          <Route path="/deep-dives/safety-surveillance" element={<SafetySurveillancePage />} />
          <Route path="/deep-dives/risk-matrix" element={<RiskMatrixPage />} />

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
              <Route path="/search" element={<SimpleSearch onStartTour={() => setShowTour(true)} />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/news" element={<News />} />
              <Route path="/catalog" element={<SubstanceCatalog />} />
              <Route path="/monograph/:id" element={<SubstanceMonograph />} />
              <Route path="/interactions" element={<InteractionChecker />} />
              <Route path="/audit" element={<AuditLogs />} />

              {/* WELLNESS JOURNEY / ARC OF CARE */}
              <Route path="/wellness-journey" element={<WellnessJourney />} />
              <Route path="/arc-of-care-god-view" element={<Navigate to="/wellness-journey" replace />} />
              <Route path="/companion/:sessionId" element={<PatientCompanionPage />} />

              {/* PROTOCOL BUILDER */}
              <Route path="/protocols" element={<MyProtocols />} />
              <Route path="/protocol/:id" element={<ProtocolDetail />} />
              <Route path="/clinician/:id" element={<ClinicianProfile />} />
              <Route path="/help" element={<HelpCenterLayout />}>
                <Route index element={<HelpFAQ onStartTour={() => setShowTour(true)} />} />
                <Route path="faq" element={<HelpFAQ onStartTour={() => setShowTour(true)} />} />
                <Route path="quickstart" element={<HelpQuickstart />} />
                <Route path="overview" element={<HelpOverview />} />
                <Route path="interaction-checker" element={<HelpInteractionChecker />} />
                <Route path="wellness-journey" element={<HelpWellnessJourney />} />
                <Route path="reports" element={<HelpSessionReporting />} />
                <Route path="scanner" element={<HelpScanner />} />
                <Route path="devices" element={<HelpDevices />} />
                <Route path="settings" element={<HelpSettings />} />
                <Route path="*" element={<div className="text-slate-500 font-medium py-10">Documentation content currently being drafted.</div>} />
              </Route>
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile/edit" element={<ProfileEdit />} />
              <Route path="/data-export" element={<DataExport />} />
              <Route path="/session-export" element={<SessionExportCenter />} />
              <Route path="/clinical-report-pdf" element={<ClinicalReportPDF />} />
              <Route path="/demo-clinical-report-pdf" element={<DemoClinicalReportPDF />} />

              {/* DEV/TEST SHOWCASE ROUTES */}
              <Route path="/component-showcase" element={<ComponentShowcase />} />
              <Route path="/hidden-components" element={<HiddenComponentsShowcase />} />

              <Route path="/logout" element={
                <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                  <h2 className="text-2xl font-black mb-4">Confirm Sign Out</h2>
                  <button onClick={signOut} className="px-8 py-3 bg-red-500/10 text-red-500 rounded-xl font-black uppercase tracking-widest border border-red-500/20 hover:bg-red-500/20 transition-all">Sign Out</button>
                </div>
              } />

              {/* Catch-all for undefined protected routes */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

// ── HelpFAQ needs onStartTour prop — lazy import with named export ────────────
import HelpFAQ from './pages/HelpFAQ';

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <ThemeProvider>
          <AppContent />
          <ToastContainer />
        </ThemeProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
