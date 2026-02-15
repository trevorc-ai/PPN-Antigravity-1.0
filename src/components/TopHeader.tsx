
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CLINICIANS } from '../constants';
import { supabase } from '../supabaseClient';
import { useToast } from '../contexts/ToastContext';

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
      className="size-11 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all hover:bg-white/10 shadow-sm group"
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
      <span className="text-[11px] font-black text-slate-300 tracking-[0.15em] relative z-10">{tooltip}</span>
    </div>
  </div>
);

const TopHeader: React.FC<TopHeaderProps> = ({ onMenuClick, onLogout, onStartTour, isAuthenticated = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const [latency, setLatency] = useState(14);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isLanding = location.pathname === '/';

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          setUserProfile({
            ...profile,
            email: user.email,
            id: user.id
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => Math.max(8, Math.min(22, prev + (Math.random() * 4 - 2))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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

  // Handle logout with Supabase signOut
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      setIsMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/');
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
    <header className="h-20 border-b border-white/5 bg-[#0a0c12] sticky top-0 z-40 backdrop-blur-xl">
      <div className="h-full px-6 sm:px-10 pr-6 sm:pr-10 flex items-center justify-end ml-auto max-w-7xl">
        <div className="flex items-center gap-8">
          {/* Portal Title & Local Nav */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={onMenuClick}
              className="lg:hidden size-10 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all shadow-lg"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>

          {!isAuthenticated && isLanding && (
            <div className="hidden lg:flex items-center gap-10">
              {[
                { label: 'Security', id: 'security-compliance' },
                { label: 'Network', id: 'global-network' },
                { label: 'Membership', id: 'membership-tiers' }
              ].map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.id)}
                  className="text-[11px] font-black text-slate-400 hover:text-white tracking-[0.25em] transition-all relative group"
                >
                  {link.label}
                  <div className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full opacity-50"></div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <div className="hidden lg:flex items-center gap-4 mr-6 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                <div className="flex flex-col items-end border-r border-white/10 pr-4">
                  <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-0.5">Latency</span>
                  <div className="flex items-center gap-2">
                    <div className={`size-1.5 rounded-full ${latency < 18 ? 'bg-clinical-green' : 'bg-accent-amber'} animate-pulse shadow-[0_0_8px] shadow-current`}></div>
                    <span className="text-[11px] font-mono text-slate-300 font-bold">{latency.toFixed(1)}ms</span>
                  </div>
                </div>
                <div className="flex flex-col items-start pl-1">
                  <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-0.5">Sync Status</span>
                  <span className="text-[11px] font-mono text-clinical-green font-bold tracking-tight">Synchronized</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mr-2">
                {/* Tour - Hidden on mobile */}
                <div className="hidden lg:block">
                  <NavIconButton
                    icon="explore"
                    label="Tour"
                    tooltip="System Tour"
                    onClick={onStartTour}
                  />
                </div>

                {/* Search - Hidden on mobile */}
                <div id="tour-search-node" className="hidden lg:contents">
                  <NavIconButton
                    icon="search"
                    label="Search"
                    tooltip="Search Registry"
                    onClick={() => addToast({ title: 'Feature Pending', message: 'Global registry search coming in v2.0', type: 'info' })}
                  />
                </div>

                {/* Alerts - Always visible (essential) */}
                <div id="tour-notifications" className="contents">
                  <NavIconButton
                    icon="notifications"
                    label="Alerts"
                    tooltip="Notifications"
                    onClick={() => addToast({ title: 'No New Alerts', message: 'You are all caught up.', type: 'success' })}
                  />
                </div>

                {/* Help - Hidden on mobile */}
                <div id="tour-help-node" className="hidden lg:contents">
                  <NavIconButton
                    icon="help"
                    label="Help"
                    tooltip="Help & Support"
                    onClick={() => addToast({ title: 'Support Contacted', message: 'Ticket #492 created. Check email.', type: 'success' })}
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

              <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block"></div>

              {/* User Dropdown Menu */}
              <div id="tour-user-profile" className="relative" ref={menuRef}>
                <div
                  className="flex items-center gap-3 pl-2 group cursor-pointer hover:bg-white/5 rounded-2xl p-1 transition-all"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <div className="relative">
                    <div className="size-10 rounded-full bg-gradient-to-br from-primary to-blue-600 border-2 border-primary/40 group-hover:border-primary transition-all shadow-[0_0_15px_rgba(43,116,243,0.2)] flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {loading ? '...' : (userProfile?.display_name?.[0] || userProfile?.email?.[0] || 'U')}
                      </span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-clinical-green border-2 border-[#0a0c12] rounded-full"></div>
                  </div>
                  <div className="hidden lg:flex flex-col">
                    <p className="text-[12px] font-black text-white leading-none mb-1 group-hover:text-primary transition-colors">
                      {loading ? 'Loading...' : (userProfile?.display_name || userProfile?.email?.split('@')[0] || 'User')}
                    </p>
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-slate-500 font-bold tracking-widest leading-none">Practitioner</span>
                      <span className="material-symbols-outlined text-[15px] text-slate-500 group-hover:text-white transition-transform duration-300" style={{ transform: isMenuOpen ? 'rotate(180deg)' : 'none' }}>expand_more</span>
                    </div>
                  </div>
                </div>

                {/* Menu Dropdown Panel */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-[#0c0f16] border border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-3xl">
                    <div className="px-4 py-3 border-b border-white/5 mb-2">
                      <p className="text-[10px] font-black text-slate-500 tracking-widest leading-none mb-1">Session Node</p>
                      <p className="text-xs font-bold text-white truncate">{userProfile?.email || 'user@ppn-research.org'}</p>
                    </div>

                    <button
                      onClick={() => { navigate(`/clinician/${userProfile?.id || 'profile'}`); setIsMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 transition-all text-xs font-bold"
                    >
                      <span className="material-symbols-outlined text-lg">account_circle</span>
                      View Research Profile
                    </button>

                    <button
                      onClick={() => { navigate('/settings'); setIsMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 transition-all text-xs font-bold"
                    >
                      <span className="material-symbols-outlined text-lg">settings_applications</span>
                      Account Settings
                    </button>

                    <div className="h-px bg-white/5 my-2"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/5 transition-all text-xs font-bold"
                    >
                      <span className="material-symbols-outlined text-lg">logout</span>
                      Sign Out of Node
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={handleAuthAction}
              className="px-6 py-2.5 bg-primary hover:bg-blue-600 text-white text-[12px] font-black rounded-2xl tracking-widest transition-all shadow-[0_0_15px_rgba(43,116,243,0.3)] active:scale-95"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
