

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import InstantConnectModal from './modals/InstantConnectModal';
import FeedbackCard from './FeedbackCard';
import { MessageSquarePlus } from 'lucide-react';
import { CLINICIANS } from '../constants';
import { supabase } from '../supabaseClient';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from './ui/ThemeToggle';
import { CockpitModeTour, useCockpitModeTour } from './help/CockpitModeTour';
import { useTheme } from '../contexts/ThemeContext';


interface TopHeaderProps {
  onMenuClick: () => void;
  onLogout: () => void;
  onStartTour?: () => void;
  isAuthenticated?: boolean;
}

const NavIconButton: React.FC<{
  onClick?: () => void;
  icon: string;
  label: string;
  tooltip: string;
  badge?: boolean;
  activeScale?: boolean;
}> = ({ onClick, icon, label, tooltip, badge, activeScale = true }) => (
  <div className="relative group/tooltip flex flex-col items-center gap-1">
    <button
      onClick={onClick}
      className="size-11 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-300 hover:text-slate-300 transition-all hover:bg-white/10 shadow-sm group"
      aria-label={label}
    >
      <span className={`material-symbols-outlined text-[24px] transition-transform ${activeScale ? 'group-active:scale-90' : ''}`}>
        {icon}
      </span>
      {badge && (
        <span className="absolute top-2 right-2.5 size-2 bg-red-500 rounded-full ring-2 ring-[#0a0c12] animate-pulse"></span>
      )}
    </button>

    {/* Tooltip implementation */}
    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-[#0c0f16] border border-white/10 rounded-lg shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-[100] whitespace-nowrap pointer-events-none scale-90 group-hover/tooltip:scale-100">
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 size-2 bg-[#0c0f16] border-t border-l border-white/10 rotate-45"></div>
      <span className="text-[12px] font-black text-slate-300 tracking-[0.15em] relative z-10">{tooltip}</span>
    </div>
  </div>
);

// WO-524: Ticking elapsed timer — 1s interval, no DB poll
const ElapsedTimer: React.FC<{ startedAt: string }> = ({ startedAt }) => {
  const [elapsed, setElapsed] = useState('');
  useEffect(() => {
    const tick = () => {
      const diff = Date.now() - new Date(startedAt).getTime();
      const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
      const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
      setElapsed(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAt]);
  return <span className="font-mono">{elapsed}</span>;
};

const TopHeader: React.FC<TopHeaderProps> = ({ onMenuClick, onLogout, onStartTour, isAuthenticated = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const { signOut, userRole } = useAuth();
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isInstantConnectOpen, setIsInstantConnectOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const feedbackTriggerRef = useRef<HTMLButtonElement>(null);
  const { showTour, triggerIfNew, closeTour } = useCockpitModeTour();
  const prevThemeRef = useRef(theme);

  // Fire tour the first time user switches to cockpit mode
  useEffect(() => {
    if (prevThemeRef.current !== 'cockpit' && theme === 'cockpit') {
      triggerIfNew();
    }
    prevThemeRef.current = theme;
  }, [theme, triggerIfNew]);

  // WO-524: Active session timer chips
  // Migration 079: patient_link_code dropped — use patient_link_code_hash or id for display
  interface ActiveChip { sessionId: string; subjectId: string; startedAt: string; }
  const [activeChips, setActiveChips] = useState<ActiveChip[]>([]);
  const fetchActiveChipsInFlight = useRef(false);

  const fetchActiveChips = useCallback(async () => {
    if (!isAuthenticated) return;
    if (fetchActiveChipsInFlight.current) return;
    fetchActiveChipsInFlight.current = true;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: mySite } = await supabase
        .from('log_user_sites').select('site_id')
        .eq('user_id', user.id).eq('is_active', true).single();
      if (!mySite) return;
      const { data: sessions, error } = await supabase
        .from('log_clinical_records')
        .select('id, patient_link_code_hash, session_started_at')
        .eq('site_id', mySite.site_id)
        .eq('session_date', new Date().toISOString().split('T')[0])
        .not('session_started_at', 'is', null)
        .is('session_ended_at', null);
      if (error) {
        console.warn('[TopHeader] fetchActiveChips:', error.message);
        return;
      }
      setActiveChips((sessions ?? []).map((s: any) => ({
        sessionId: s.id,
        subjectId: String(s.patient_link_code_hash ?? s.id).slice(0, 6).toUpperCase(),
        startedAt: s.session_started_at,
      })));
    } catch (err) { console.warn('[TopHeader] fetchActiveChips:', err); }
    finally {
      fetchActiveChipsInFlight.current = false;
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchActiveChips();
    const interval = setInterval(fetchActiveChips, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchActiveChips]);

  const isLanding = location.pathname === '/';

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        // If there's an auth error or no user, just set loading to false and return
        if (authError || !user) {
          console.log('No authenticated user found');
          setLoading(false);
          return;
        }

        // Try to fetch profile, but don't crash if it fails
        try {
          const { data: profile, error: profileError } = await supabase
            .from('log_user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (!profileError && profile) {
            setUserProfile({
              ...profile,
              email: user.email,
              id: user.id
            });
          } else {
            // Set minimal profile if fetch fails
            setUserProfile({
              email: user.email,
              id: user.id
            });
          }
        } catch (profileError) {
          console.log('Profile fetch failed, using minimal user data:', profileError);
          setUserProfile({
            email: user.email,
            id: user.id
          });
        }
      } catch (error) {
        console.log('Auth check failed (expected on public pages):', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);



  // Handle click outside  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Handle logout with AuthContext signOut
  const handleLogout = async () => {
    console.log('[TopHeader] Logout initiated');
    setIsMenuOpen(false);

    try {
      console.log('[TopHeader] Calling signOut from AuthContext');
      await signOut();
      console.log('[TopHeader] signOut completed successfully');

      addToast({
        title: 'Logged Out',
        message: 'You have been signed out successfully.',
        type: 'success'
      });
    } catch (error) {
      console.error('[TopHeader] Logout error:', error);

      // Fallback: force logout even if signOut fails
      try {
        await supabase.auth.signOut();
      } catch (supabaseError) {
        console.error('[TopHeader] Supabase signOut also failed:', supabaseError);
      }

      // Clear storage manually
      localStorage.clear();
      sessionStorage.clear();

      // Show error toast
      addToast({
        title: 'Logged Out',
        message: 'Session ended (with errors)',
        type: 'warning'
      });

      // Force navigation to dashboard (not '/' which resolves to public landing for logged-in users)
      navigate('/dashboard');
    }
  };

  const scrollToSection = (id: string) => {
    if (isLanding) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      if (id === 'secure-access-node') {
        const input = document.getElementById('node-id-input');
        if (input) input.focus();
      }
    } else {
      navigate(`/#${id}`);
    }
  };

  const handleAuthAction = () => scrollToSection('secure-access-node');

  return (
    <header className="h-12 sm:h-20 border-b border-white/5 bg-[#0a1628] sticky top-0 z-40 backdrop-blur-xl">
      <div className="h-full px-6 sm:px-10 pr-6 sm:pr-10 flex items-center justify-end ml-auto max-w-7xl">
        <div className="flex items-center gap-8">
          {/* Portal Title & Local Nav */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={onMenuClick}
              className="block lg:hidden size-10 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-300 transition-all shadow-lg"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>

          {!isAuthenticated && isLanding && (
            <div className="hidden lg:flex items-center gap-10">
              {[
                { label: 'Security', id: 'security-compliance' },
                { label: 'Alliance', id: 'global-network' },
                { label: 'Membership', id: 'membership-tiers' }
              ].map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.id)}
                  className="text-[12px] font-black text-slate-300 hover:text-slate-300 tracking-[0.25em] transition-all relative group"
                >
                  {link.label}
                  <div className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-indigo-600 hover:bg-indigo-500 transition-all group-hover:w-full opacity-50"></div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>


              {/* WO-524: Active session timer chips — desktop only, 60s poll */}
              {activeChips.length > 0 && (
                <div className="hidden lg:flex items-center gap-2 mr-2">
                  {activeChips.slice(0, 3).map(chip => (
                    <button
                      key={chip.sessionId}
                      onClick={() => navigate(`/wellness-journey?session=${chip.sessionId}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-400/60 hover:bg-emerald-500/20 rounded-xl transition-all text-xs font-bold text-emerald-300 active:scale-95"
                      aria-label={`Active session ${chip.subjectId} — navigate to session`}
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="font-mono tracking-wider">{chip.subjectId}</span>
                      <span className="text-emerald-600">·</span>
                      <ElapsedTimer startedAt={chip.startedAt} />
                    </button>
                  ))}
                  {activeChips.length > 3 && (
                    <span className="px-2 py-1 bg-slate-800/60 border border-slate-700/50 rounded-lg text-xs text-slate-400 font-bold">
                      +{activeChips.length - 3}
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3">

                {/* Cockpit Mode Toggle — desktop only */}
                <div className="hidden lg:block">
                  <ThemeToggle />
                </div>

                {/* Feedback — Hidden on mobile, visible via dropdown */}
                <div className="hidden lg:block relative group/tooltip flex flex-col items-center gap-1">
                  <button
                    ref={feedbackTriggerRef}
                    onClick={() => setIsFeedbackOpen(prev => !prev)}
                    aria-label="Leave feedback"
                    aria-expanded={isFeedbackOpen}
                    className="size-11 rounded-xl bg-white/5 border border-teal-400/50 hover:border-teal-400/80 flex items-center justify-center text-teal-300 hover:text-teal-200 transition-all hover:bg-teal-500/10 shadow-sm shadow-teal-500/10 group active:scale-90"
                  >
                    <MessageSquarePlus className="w-5 h-5 transition-transform group-active:scale-90" aria-hidden="true" />
                  </button>
                  {/* Tooltip */}
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-[#0c0f16] border border-white/10 rounded-lg shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-[100] whitespace-nowrap pointer-events-none scale-90 group-hover/tooltip:scale-100">
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 size-2 bg-[#0c0f16] border-t border-l border-white/10 rotate-45"></div>
                    <span className="text-[12px] font-black text-teal-300 tracking-[0.15em] relative z-10">Leave Feedback</span>
                  </div>
                  {/* Feedback card anchored here */}
                  <FeedbackCard
                    isOpen={isFeedbackOpen}
                    onClose={() => setIsFeedbackOpen(false)}
                    triggerRef={feedbackTriggerRef}
                  />
                </div>





                {/* Vibe - Hidden per user request 2026-02-12 */}
                {/* <div className="hidden lg:block">
                  <NavIconButton
                    icon="science"
                    label="Vibe"
                    tooltip="Physics Demo"
                    onClick={() => navigate('/vibe-check')}
                  />
                </div> */}
              </div>



              {/* User Dropdown Menu */}
              <div id="tour-user-profile" className="relative group/avatar" ref={menuRef}>
                <div
                  className="flex items-center gap-3 pl-2 group cursor-pointer hover:bg-white/5 rounded-2xl p-1 transition-all"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  role="button"
                  aria-label="Open account menu"
                  aria-expanded={isMenuOpen}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsMenuOpen(!isMenuOpen); }}
                >
                  <div className="relative">
                    <div className="size-10 rounded-full bg-gradient-to-br from-primary to-blue-600 border-2 border-primary/40 group-hover:border-primary transition-all shadow-[0_0_15px_rgba(43,116,243,0.2)] flex items-center justify-center">
                      <span className="text-slate-300 font-bold text-sm">
                        {loading ? '…' : (
                          userProfile?.display_name?.[0] ||
                          userProfile?.user_first_name?.[0] ||
                          userProfile?.email?.[0] ||
                          'U'
                        )}
                      </span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-clinical-green border-2 border-[#0a0c12] rounded-full"></div>
                  </div>
                  <div className="hidden lg:flex flex-col">
                    <p className="text-[12px] font-black text-slate-300 leading-none mb-1 group-hover:text-primary transition-colors">
                      {loading ? 'Loading...' : (
                        userProfile?.display_name ||
                        userProfile?.user_first_name ||
                        userProfile?.email?.split('@')[0] ||
                        'User'
                      )}
                    </p>
                    <div className="flex items-center gap-1">
                      <span className="text-[12px] text-slate-300 font-bold tracking-widest leading-none">Practitioner</span>
                      <span className="material-symbols-outlined text-[15px] text-slate-300 group-hover:text-slate-300 transition-transform duration-300" style={{ transform: isMenuOpen ? 'rotate(180deg)' : 'none' }}>expand_more</span>
                    </div>
                  </div>
                </div>

                {/* Menu Dropdown Panel */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-[#0c0f16] border border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-3xl">
                    <div className="px-4 py-3 border-b border-white/5 mb-2">
                      <p className="text-[12px] font-black text-slate-300 tracking-widest leading-none mb-1">Signed In As</p>
                      <p className="text-sm font-bold text-slate-300 truncate">{userProfile?.email || 'user@ppnportal.net'}</p>
                    </div>

                    <button
                      onClick={() => { navigate(`/clinician/${userProfile?.id || 'profile'}`); setIsMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-slate-300 hover:bg-white/5 transition-all text-sm font-bold"
                    >
                      <span className="material-symbols-outlined text-lg">account_circle</span>
                      View Research Profile
                    </button>

                    <button
                      onClick={() => { navigate('/settings'); setIsMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-slate-300 hover:bg-white/5 transition-all text-sm font-bold"
                    >
                      <span className="material-symbols-outlined text-lg">settings_applications</span>
                      Account Settings
                    </button>

                    {/* Mobile-only: Leave Feedback */}
                    <button
                      onClick={() => { setIsMenuOpen(false); setIsFeedbackOpen(true); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-teal-400 hover:text-teal-300 hover:bg-teal-400/5 transition-all text-sm font-bold lg:hidden"
                    >
                      <MessageSquarePlus className="w-[18px] h-[18px]" aria-hidden="true" />
                      Leave Feedback
                    </button>

                    {/* Admin Console — only visible to admin users */}
                    {userRole === 'admin' && (
                      <>
                        <div className="h-px bg-white/5 my-2" />
                        <button
                          onClick={() => { navigate('/admin/dashboard'); setIsMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-amber-400 hover:text-amber-300 hover:bg-amber-400/5 transition-all text-sm font-bold"
                        >
                          <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                          Admin Console
                        </button>
                      </>
                    )}

                    <div className="h-px bg-white/5 my-2"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/5 transition-all text-sm font-bold"
                    >
                      <span className="material-symbols-outlined text-lg">logout</span>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={handleAuthAction}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 hover:bg-blue-600 text-white text-[12px] font-black rounded-2xl tracking-widest transition-all shadow-[0_0_15px_rgba(43,116,243,0.3)] active:scale-95"
            >
              Login
            </button>
          )}
        </div>
      </div>

      <InstantConnectModal
        isOpen={isInstantConnectOpen}
        onClose={() => setIsInstantConnectOpen(false)}
      />

      {/* Cockpit Mode guided tour — fires once on first activation */}
      {showTour && <CockpitModeTour onClose={closeTour} />}
    </header>
  );
};

export default TopHeader;
