import React, { Suspense, lazy, useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate, Outlet, useNavigationType } from 'react-router-dom';

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
const DataPolicy = lazy(() => import('./pages/DataPolicy')); // WO-531: Sterile Schema trust page
const DataPolicyPrint = lazy(() => import('./pages/DataPolicyPrint')); // WO-531: Print one-pager
const Checkout = lazy(() => import('./pages/Checkout'));
const Academy = lazy(() => import('./pages/Academy'));
const PartnerDemoHub = lazy(() => import('./pages/PartnerDemoHub'));
const PatientReport = lazy(() => import('./pages/PatientReport'));
const IntegrationCompass = lazy(() => import('./pages/IntegrationCompass'));

// WO-559-563: Five Audience Front Door Landing Pages
const ForClinicians = lazy(() => import('./pages/ForClinicians'));
const ForPayers = lazy(() => import('./pages/ForPayers'));
const StructuralPrivacy = lazy(() => import('./pages/StructuralPrivacy'));
const GlobalNetwork = lazy(() => import('./pages/GlobalNetwork'));
const ForPatients = lazy(() => import('./pages/ForPatients'));



// WO-587: VIP Invite Tool (admin-only)
const AdminInvitePage = lazy(() => import('./pages/AdminInvitePage'));
// WO-612: Admin Dashboard Hub (admin-only)
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

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
const MyProtocols = lazy(() => import('./pages/MyProtocols'));
const ProtocolDetail = lazy(() => import('./pages/ProtocolDetail'));
const ClinicianProfile = lazy(() => import('./pages/ClinicianProfile'));
const Notifications = lazy(() => import('./pages/Notifications'));
const AdminSharingLibrary = lazy(() => import('./pages/AdminSharingLibrary')); // WO-558
const Settings = lazy(() => import('./pages/Settings'));
const DataExport = lazy(() => import('./pages/DataExport'));
const SessionExportCenter = lazy(() => import('./pages/SessionExportCenter'));
const DownloadCenter = lazy(() => import('./pages/DownloadCenter'));
const ClinicalReportPDF = lazy(() => import('./pages/ClinicalReportPDF'));
const DemoClinicalReportPDF = lazy(() => import('./pages/DemoClinicalReportPDF'));
const PatientReportPDF = lazy(() => import('./pages/PatientReportPDF'));   // Phase 3 patient wellness report
const DataPolicyPDF = lazy(() => import('./pages/DataPolicyPDF'));         // Research export data policy
const AuditReportPDF = lazy(() => import('./pages/AuditReportPDF'));       // Audit & Compliance Export PDF
// WO-643: Polished PDF Report Suite
const AEReportPDF       = lazy(() => import('./pages/AEReportPDF'));       // WO-643-B: Adverse Event Report
const SessionTimelinePDF = lazy(() => import('./pages/SessionTimelinePDF')); // WO-643-C: Session Timeline
const SafetyPlanPDF     = lazy(() => import('./pages/SafetyPlanPDF'));     // WO-643-D: Safety Plan
const TransportPlanPDF  = lazy(() => import('./pages/TransportPlanPDF'));  // WO-643-E: Transport Plan
const ResearchReportPDF = lazy(() => import('./pages/ResearchReportPDF')); // WO-643-F: Research Export
const InsuranceReportPDF = lazy(() => import('./pages/InsuranceReportPDF')); // WO-643-G: Insurance / Letter of Medical Necessity
const ConsentPlanPDF    = lazy(() => import('./pages/ConsentPlanPDF'));    // WO-643-H: Informed Consent Record
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
import MobileBottomNav from './components/MobileBottomNav';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ActiveSessionsProvider } from './contexts/ActiveSessionsContext';
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
import HelpFAQ from './pages/HelpFAQ';

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
 * SmartScrollToTop Component
 * Resets scroll on fresh forward navigations only.
 * Skips reset on browser back/forward (POP) so the user returns to their prior scroll position.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  // useNavigationType correctly distinguishes PUSH (link click) from POP (back/forward)
  // in HashRouter — window.history.state?.type is NOT set by React Router's HashRouter.
  const navigationType = useNavigationType();

  useEffect(() => {
    // Skip scroll reset for back/forward browser navigation
    if (navigationType === 'POP') return;

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
  }, [pathname, hash, navigationType]);

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
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-transparent pb-28 lg:pb-0">
          {showTour && <GuidedTour onComplete={completeTour} />}
          <Outlet />
          <Footer />
        </main>
        {/* Mobile bottom nav — lg:hidden inside component */}
        <MobileBottomNav />
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

/**
 * SignUpGuard — Handles two distinct user states on /signup:
 *   1. Invited users (session exists + ?invited=true) → allow through to complete wizard
 *   2. Already-registered users (session exists, no invite param) → bounce to /search
 *   3. No session → normal self-signup flow
 */
const SignUpGuard: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isInvited = new URLSearchParams(location.search).get('invited') === 'true';

  if (user && isInvited) return <SignUp />;
  if (user && !isInvited) return <Navigate to="/dashboard" replace />;
  return <SignUp />;
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class GlobalErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };
  public readonly props!: ErrorBoundaryProps;

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Global Error Caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen items-center justify-center bg-gradient-to-b from-[#0a1628] to-[#05070a] p-6 text-center">
          <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900/50 border border-red-900/30 shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h2 className="text-2xl font-black text-slate-200 mb-3 tracking-tight">Application Error</h2>
            <p className="text-sm font-medium text-slate-400 mb-8 leading-relaxed">
              We encountered an unexpected error while preparing this screen. This could be due to a lost connection or an outdated module.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-95 tracking-wide"
            >
              Reload Application
            </button>
            {this.state.error?.message && (
              <div className="mt-6 p-4 bg-slate-950/50 rounded-lg overflow-x-auto text-left border border-slate-800">
                <p className="font-mono text-xs text-slate-500 break-all">{this.state.error.message}</p>
              </div>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppContent: React.FC = () => {
  const { user, signOut, userRole } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showTour, setShowTour] = useState(false);

  // Auto-tour disabled (WO-554) — tour can still be triggered manually via onStartTour


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
    <>
      {/* Staging environment banner — only renders when VITE_APP_ENV=staging */}
      {import.meta.env.VITE_APP_ENV === 'staging' && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99999,
          background: '#f59e0b', color: '#000', textAlign: 'center',
          fontSize: '11px', fontWeight: 900, padding: '4px 0',
          letterSpacing: '0.1em', textTransform: 'uppercase'
        }}>
          ⚠️ Staging Environment — Test Data Only — Not for Clinical Use
        </div>
      )}
      <Router>
        <ScrollToTop />
        {/*
        Global Error Boundary catches lazy-load chunk network failures.
        Single <Suspense> boundary wraps all routes.
        PageLoader provides a dark-themed fallback so there is no white flash
        between route transitions. AuthProvider, ToastProvider, and ThemeProvider
        remain outside Suspense — they must initialize synchronously.
      */}
        <GlobalErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/landing" replace />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="/about" element={<About />} />
              <Route path="/waitlist" element={<Waitlist />} />
              <Route path="/secure-gate" element={<SecureGate />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/data-policy" element={<DataPolicy />} /> {/* WO-531 */}
              <Route path="/data-policy/print" element={<DataPolicyPrint />} /> {/* WO-531: print one-pager */}
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contribution" element={<ContributionModel />} />
              <Route path="/arc-of-care" element={<ArcOfCareDemo />} />
              <Route path="/arc-of-care-phase2" element={<ArcOfCarePhase2Demo />} />
              <Route path="/arc-of-care-phase3" element={<ArcOfCarePhase3Demo />} />
              <Route path="/arc-of-care-dashboard" element={<ArcOfCareDashboard />} />
              <Route path="/meq30" element={<MEQ30Page />} />
              <Route path="/patient-form/:formId" element={<PatientFormPage />} />
              <Route path="/assessment" element={<AdaptiveAssessmentPage />} />
              <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
              <Route path="/signup" element={<SignUpGuard />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/academy" element={<Academy />} />
              <Route path="/partner-demo" element={<PartnerDemoHub />} />
              {/* Patient-facing shareable report — no auth required */}
              <Route path="/patient-report" element={<PatientReport />} />
              {/* WO-601: Magic link entry point — same page, different path convention.
                  Renders PatientReport publicly so magic links work regardless of auth state. */}
              <Route path="/journey/auth" element={<PatientReport />} />
              {/* WO-570: Integration Compass — patient post-session integration tool */}
              <Route path="/integration-compass" element={<IntegrationCompass />} />
              {/* Patient Wellness Report — QR-accessible, no auth */}
              <Route path="/patient-report-pdf" element={<PatientReportPDF />} />
              {/* Research Data Policy PDF — accompanies CSV exports */}
              <Route path="/data-policy-pdf" element={<DataPolicyPDF />} />
              {/* Audit & Compliance Export PDF — Zero-PHI, regulator-ready */}
              <Route path="/audit-report-pdf" element={<AuditReportPDF />} />
              {/* WO-643: Polished PDF Report Suite — public routes, no auth required */}
              <Route path="/ae-report-pdf"          element={<AEReportPDF />} />
              <Route path="/session-timeline-pdf"   element={<SessionTimelinePDF />} />
              <Route path="/safety-plan-pdf"         element={<SafetyPlanPDF />} />
              <Route path="/transport-plan-pdf"      element={<TransportPlanPDF />} />
              <Route path="/research-report-pdf"     element={<ResearchReportPDF />} />
              <Route path="/insurance-report-pdf"    element={<InsuranceReportPDF />} />
              <Route path="/consent-plan-pdf"        element={<ConsentPlanPDF />} />

              {/* Deep Dives (Public Marketing Pages) */}
              <Route path="/deep-dives/patient-flow" element={<PatientFlowPage />} />
              <Route path="/deep-dives/clinic-performance" element={<ClinicPerformancePage />} />
              <Route path="/deep-dives/patient-constellation" element={<PatientConstellationPage />} />
              <Route path="/deep-dives/molecular-pharmacology" element={<MolecularPharmacologyPage />} />
              <Route path="/deep-dives/protocol-efficiency" element={<ProtocolEfficiencyPage />} />
              <Route path="/deep-dives/workflow-chaos" element={<WorkflowChaosPage />} />
              <Route path="/deep-dives/safety-surveillance" element={<SafetySurveillancePage />} />
              <Route path="/deep-dives/risk-matrix" element={<RiskMatrixPage />} />

              {/* WO-559-563: Five Audience Front Door Landing Pages */}
              <Route path="/for-clinicians" element={<ForClinicians />} />
              <Route path="/for-payers" element={<ForPayers />} />
              <Route path="/structural-privacy" element={<StructuralPrivacy />} />
              <Route path="/global-network" element={<GlobalNetwork />} />
              <Route path="/for-patients" element={<ForPatients />} />



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
                  <Route path="/search" element={<Navigate to="/dashboard" replace />} />
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
                  <Route path="/network-library" element={<AdminSharingLibrary />} />
                  {/* WO-587: VIP Invite Tool — admin only */}
                  <Route
                    path="/admin/invite"
                    element={userRole === 'admin' ? <AdminInvitePage /> : <Navigate to="/dashboard" replace />}
                  />
                  {/* WO-612: Admin Dashboard Hub */}
                  <Route
                    path="/admin/dashboard"
                    element={userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" replace />}
                  />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/profile/edit" element={<ProfileEdit />} />
                  <Route path="/data-export" element={<DataExport />} />
                  <Route path="/session-export" element={<SessionExportCenter />} />
                  <Route path="/download-center" element={<DownloadCenter />} />
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
        </GlobalErrorBoundary>
      </Router>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ActiveSessionsProvider>
        <ToastProvider>
          <ThemeProvider>
            <AppContent />
            <ToastContainer />
          </ThemeProvider>
        </ToastProvider>
      </ActiveSessionsProvider>
    </AuthProvider>
  );
};

export default App;
