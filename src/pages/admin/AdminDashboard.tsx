/**
 * AdminDashboard.tsx — WO-612
 *
 * Central admin hub at /admin/dashboard.
 * Guarded in App.tsx: only accessible when userRole === 'admin'.
 *
 * Four tabs:
 *  1. Feedback Inbox  — browse & triage user_feedback rows
 *  2. Users           — view + role-manage log_user_profiles
 *  3. Site Navigator  — hardcoded route directory
 *  4. Platform Health — four live stat tiles
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import {
    Bug, Sparkles, MessageSquare, ChevronRight,
    RefreshCw, ExternalLink, Lock, Crown, Users,
    LayoutDashboard, Map, Activity, AlertCircle, CheckCircle, Clock,
    Copy, Package,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type TabId = 'feedback' | 'users' | 'sitemap' | 'platform' | 'packets';
type FeedbackStatus = 'open' | 'reviewed' | 'resolved';
type UserRole = 'practitioner' | 'admin' | 'suspended';

interface FeedbackRow {
    id: string;
    user_id: string | null;
    type: 'bug' | 'feature' | 'comment';
    message: string;
    page_url: string | null;
    status: FeedbackStatus;
    metadata: Record<string, string> | null;
    created_at: string;
    log_user_profiles: { display_name: string | null; email: string | null } | null;
}

interface UserRow {
    user_id: string;
    display_name: string | null;
    email: string | null;
    role_id: number;
    role_code: string; // sourced from ref_user_roles.role_code via FK
    created_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const NEXT_STATUS: Record<FeedbackStatus, FeedbackStatus> = {
    open: 'reviewed',
    reviewed: 'resolved',
    resolved: 'open',
};

function relativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
}

function StatusBadge({ status }: { status: FeedbackStatus }) {
    const cfg: Record<FeedbackStatus, { label: string; cls: string; Icon: React.FC<{ className?: string }> }> = {
        open:     { label: 'Open',     cls: 'bg-amber-500/20 text-amber-300 border-amber-500/30',  Icon: ({ className }) => <Clock className={className} /> },
        reviewed: { label: 'Reviewed', cls: 'bg-blue-500/20 text-blue-300 border-blue-500/30',     Icon: ({ className }) => <AlertCircle className={className} /> },
        resolved: { label: 'Resolved', cls: 'bg-teal-500/20 text-teal-300 border-teal-500/30',    Icon: ({ className }) => <CheckCircle className={className} /> },
    };
    const { label, cls, Icon } = cfg[status];
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-xs md:text-sm font-bold ${cls}`}>
            <Icon className="w-3 h-3" />
            {label}
        </span>
    );
}

function TypeBadge({ type }: { type: FeedbackRow['type'] }) {
    const cfg: Record<FeedbackRow['type'], { label: string; cls: string; Icon: React.FC<{ className?: string }> }> = {
        bug:     { label: 'Bug',     cls: 'bg-red-500/20 text-red-300 border-red-500/30',         Icon: ({ className }) => <Bug className={className} /> },
        feature: { label: 'Feature', cls: 'bg-violet-500/20 text-violet-300 border-violet-500/30', Icon: ({ className }) => <Sparkles className={className} /> },
        comment: { label: 'Comment', cls: 'bg-slate-500/20 text-slate-300 border-slate-600/30',   Icon: ({ className }) => <MessageSquare className={className} /> },
    };
    const { label, cls, Icon } = cfg[type];
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-xs md:text-sm font-bold ${cls}`}>
            <Icon className="w-3 h-3" />
            {label}
        </span>
    );
}

// ─── Tab 1: Feedback Inbox ────────────────────────────────────────────────────
const FeedbackInbox: React.FC = () => {
    const [rows, setRows] = useState<FeedbackRow[]>([]);
    const [filter, setFilter] = useState<'all' | 'bug' | 'feature' | 'comment'>('all');
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase
            .from('user_feedback')
            .select('*, log_user_profiles(display_name, email)')
            .order('created_at', { ascending: false });
        setRows((data ?? []) as FeedbackRow[]);
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const cycleStatus = async (row: FeedbackRow) => {
        const next = NEXT_STATUS[row.status];
        await supabase.from('user_feedback').update({ status: next }).eq('id', row.id);
        setRows(prev => prev.map(r => r.id === row.id ? { ...r, status: next } : r));
    };

    const filtered = filter === 'all' ? rows : rows.filter(r => r.type === filter);

    return (
        <div className="space-y-4">
            {/* Filter chips — horizontally scrollable on mobile (V4 fix) */}
            <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
                {(['all', 'bug', 'feature', 'comment'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`shrink-0 px-3 py-1.5 rounded-xl text-xs md:text-sm font-black uppercase tracking-widest border transition-all min-h-[44px] flex items-center gap-1
                            ${filter === f
                                ? 'bg-indigo-500/20 border-indigo-500/60 text-indigo-300'
                                : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        {f === 'bug' && <Bug className="w-3.5 h-3.5" />}
                        {f === 'feature' && <Sparkles className="w-3.5 h-3.5" />}
                        {f === 'comment' && <MessageSquare className="w-3.5 h-3.5" />}
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
                <button
                    onClick={load}
                    className="shrink-0 ml-auto px-3 py-1.5 rounded-xl text-xs md:text-sm font-black border border-slate-700 text-slate-500 hover:text-slate-300 transition-all min-h-[44px] flex items-center gap-1"
                >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-slate-500 ppn-body">No feedback found.</div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(row => (
                        <div key={row.id} className="rounded-2xl border border-white/8 bg-slate-900/40 p-4 space-y-3">
                            {/* Row 1: type + submitter + time */}
                            <div className="flex flex-wrap items-center gap-2">
                                <TypeBadge type={row.type} />
                                <span className="text-sm text-slate-300 font-bold">{row.log_user_profiles?.display_name ?? 'Unknown'}</span>
                                {row.log_user_profiles?.email && (
                                    <span className="text-xs md:text-sm text-slate-500 ppn-meta">{row.log_user_profiles.email}</span>
                                )}
                                <span className="ml-auto text-xs md:text-sm text-slate-600 ppn-meta">{relativeTime(row.created_at)}</span>
                            </div>
                            {/* Row 2: page URL */}
                            {row.page_url && (
                                <p className="text-xs md:text-sm text-slate-500 font-mono break-all ppn-meta">{row.page_url}</p>
                            )}
                            {/* Row 3: message */}
                            <p className="text-sm ppn-body text-slate-300 whitespace-pre-wrap">{row.message}</p>
                            {/* Row 4: BUG metadata */}
                            {row.type === 'bug' && row.metadata && (
                                <details className="text-sm">
                                    <summary className="cursor-pointer text-slate-500 hover:text-slate-300 ppn-meta font-bold">
                                        Browser Details
                                    </summary>
                                    <div className="mt-2 space-y-1 pl-3 border-l border-slate-700">
                                        {Object.entries(row.metadata).map(([k, v]) => (
                                            <div key={k} className="flex gap-2">
                                                <span className="font-mono text-xs md:text-sm text-slate-500 w-24 shrink-0">{k}</span>
                                                <span className="font-mono text-xs md:text-sm text-slate-400 break-all">{v}</span>
                                            </div>
                                        ))}
                                    </div>
                                </details>
                            )}
                            {/* Row 5: status + cycle */}
                            <div className="flex items-center gap-3">
                                <StatusBadge status={row.status} />
                                <button
                                    onClick={() => cycleStatus(row)}
                                    className="ppn-meta text-slate-500 hover:text-indigo-300 transition-colors underline underline-offset-2 min-h-[44px] flex items-center"
                                >
                                    Mark as {NEXT_STATUS[row.status]}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Tab 2: User Management ───────────────────────────────────────────────────
const UserManagement: React.FC = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<UserRow[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [roleError, setRoleError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            // Join ref_user_roles to get role_code — live schema uses role_id FK, not text role
            const { data } = await supabase
                .from('log_user_profiles')
                .select('user_id, display_name, email, role_id, created_at, ref_user_roles!inner(role_code)')
                .order('created_at', { ascending: false });
            const rows: UserRow[] = (data ?? []).map((r: any) => ({
                user_id: r.user_id,
                display_name: r.display_name,
                email: r.email,
                role_id: r.role_id,
                role_code: r.ref_user_roles?.role_code ?? 'practitioner',
                created_at: r.created_at,
            }));
            setUsers(rows);
            setLoading(false);
        })();
    }, []);

    const handleRoleChange = async (userId: string, newRoleCode: string) => {
        setRoleError(null);
        if (userId === currentUser?.id) {
            setRoleError('You cannot change your own admin role.');
            return;
        }
        // Look up the role_id for the chosen role_code
        const { data: roleRow } = await supabase
            .from('ref_user_roles')
            .select('id')
            .eq('role_code', newRoleCode)
            .single();
        if (!roleRow) {
            setRoleError(`Unknown role: ${newRoleCode}`);
            return;
        }
        await supabase
            .from('log_user_profiles')
            .update({ role_id: roleRow.id })
            .eq('user_id', userId);
        setUsers(prev => prev.map(u =>
            u.user_id === userId ? { ...u, role_id: roleRow.id, role_code: newRoleCode } : u
        ));
    };

    const filtered = users.filter(u => {
        const q = search.toLowerCase();
        return !q || (u.display_name?.toLowerCase().includes(q) ?? false) || (u.email?.toLowerCase().includes(q) ?? false);
    });

    return (
        <div className="space-y-4">
            <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full max-w-sm px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            {roleError && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-950/30 border border-red-800/40 text-red-300 text-sm font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {roleError}
                </div>
            )}
            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                </div>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-white/8">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/8 bg-slate-900/50">
                                <th className="text-left px-4 py-3 ppn-label text-slate-500">User</th>
                                <th className="text-left px-4 py-3 ppn-label text-slate-500">Role</th>
                                <th className="text-left px-4 py-3 ppn-label text-slate-500">Joined</th>
                                <th className="text-left px-4 py-3 ppn-label text-slate-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.map(u => (
                                <tr key={u.user_id} className="hover:bg-slate-800/20 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="font-bold text-slate-300">{u.display_name ?? '—'}</div>
                                        <div className="ppn-meta text-slate-500">{u.email ?? '—'}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={u.role_code}
                                            onChange={e => handleRoleChange(u.user_id, e.target.value)}
                                            className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm focus:outline-none focus:border-indigo-500/60 transition-all min-h-[44px] cursor-pointer"
                                        >
                                            <option value="practitioner">Practitioner</option>
                                            <option value="admin">Admin</option>
                                            <option value="suspended">Suspended</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 ppn-meta text-slate-500">
                                        {new Date(u.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <a
                                            href={`#/clinician/${u.user_id}`}
                                            className="inline-flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 font-bold min-h-[44px]"
                                        >
                                            Profile <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="text-center py-12 text-slate-500 ppn-body">No users match your search.</div>
                    )}
                </div>
            )}
        </div>
    );
};

// ─── Tab 3: Site Navigator ────────────────────────────────────────────────────
const SITE_MAP = [
    {
        group: 'Public / Marketing', icon: '🌐', routes: [
            { path: '/landing' }, { path: '/about' }, { path: '/pricing' }, { path: '/contribution' },
            { path: '/for-clinicians' }, { path: '/for-payers' }, { path: '/for-patients' },
            { path: '/structural-privacy' }, { path: '/global-network' },
            { path: '/academy' }, { path: '/partner-demo' }, { path: '/beta-welcome' },
        ],
    },
    {
        group: 'Auth', icon: '🔑', routes: [
            { path: '/login' }, { path: '/signup' }, { path: '/forgot-password' },
            { path: '/reset-password' }, { path: '/secure-gate' },
        ],
    },
    {
        group: 'Legal & Data', icon: '📄', routes: [
            { path: '/privacy' }, { path: '/terms' }, { path: '/data-policy' }, { path: '/data-policy/print' },
        ],
        externalLinks: [
            { label: 'HIPAA Counsel Packet — Print / PDF', href: '/internal/admin_uploads/legal/HIPAA_Counsel_Packet_Print.html', icon: '📋' },
            { label: 'HIPAA Legal Packet (GO-651)', href: '/internal/founding-docs/HIPAA-Packet/index.html', icon: '⚖️' },
            { label: 'Clinician Founding Partner Packet (GO-651)', href: '/internal/founding-docs/Clinician-Packet/index.html', icon: '🩺' },
            { label: 'Researcher Founding Partner Packet (GO-651)', href: '/internal/founding-docs/Researcher-Packet/index.html', icon: '🔬' },
        ],
    },
    {
        group: 'Patient-Facing (No Auth)', icon: '🧑‍⚕️', routes: [
            { path: '/patient-report' }, { path: '/integration-compass' }, { path: '/meq30' },
            { path: '/patient-form/:formId', dynamic: true }, { path: '/assessment' },
        ],
    },
    {
        group: 'Core App', icon: '🔒', auth: true, routes: [
            { path: '/search' }, { path: '/dashboard' }, { path: '/analytics' }, { path: '/news' },
            { path: '/catalog' }, { path: '/interactions' }, { path: '/audit' },
        ],
    },
    {
        group: 'Wellness Journey', icon: '🔒', auth: true, routes: [
            { path: '/wellness-journey' }, { path: '/companion/:sessionId', dynamic: true },
        ],
    },
    {
        group: 'Protocol', icon: '🔒', auth: true, routes: [
            { path: '/protocols' }, { path: '/protocol/:id', dynamic: true }, { path: '/clinician/:id', dynamic: true },
        ],
    },
    {
        group: 'Settings & Exports', icon: '🔒', auth: true, routes: [
            { path: '/settings' }, { path: '/profile/edit' }, { path: '/data-export' },
            { path: '/session-export' }, { path: '/download-center' },
        ],
    },
    {
        group: 'Reports', icon: '🔒', auth: true, routes: [
            { path: '/clinical-report-pdf' }, { path: '/demo-clinical-report-pdf' },
        ],
    },
    {
        group: 'Help Center', icon: '🔒', auth: true, routes: [
            { path: '/help' }, { path: '/help/faq' }, { path: '/help/quickstart' }, { path: '/help/overview' },
            { path: '/help/interaction-checker' }, { path: '/help/wellness-journey' }, { path: '/help/reports' },
            { path: '/help/scanner' }, { path: '/help/devices' }, { path: '/help/settings' },
        ],
    },
    {
        group: 'Deep Dives (Public)', icon: '📊', routes: [
            { path: '/deep-dives/patient-flow' }, { path: '/deep-dives/clinic-performance' },
            { path: '/deep-dives/patient-constellation' }, { path: '/deep-dives/molecular-pharmacology' },
            { path: '/deep-dives/protocol-efficiency' }, { path: '/deep-dives/workflow-chaos' },
            { path: '/deep-dives/safety-surveillance' }, { path: '/deep-dives/risk-matrix' },
        ],
    },
    {
        group: 'Outreach Assets (Internal)', icon: '📤', routes: [],
        externalLinks: [
            { label: 'Denver Leave-Behind · PsyCon 2026', href: '/internal/admin_uploads/denver-2026/PPN_Leave_Behind_Print.html', icon: '🎯' },
            { label: 'Advisor Demo', href: '/internal/advisor-demo.html', icon: '💼' },
            { label: 'Partner Hub', href: '/internal/partner-hub.html', icon: '🤝' },
            { label: 'Partner Preview', href: '/internal/partner-preview.html', icon: '👁️' },
            { label: 'VIP Invite Flow', href: '/internal/vip-invite-flow.html', icon: '⭐' },
            { label: 'Email Templates', href: '/internal/ppn-email-templates.html', icon: '📧' },
            { label: 'Bridge Camera', href: '/internal/PPN_Bridge_Camera.html', icon: '🎥' },
            { label: 'Jason Demo', href: '/internal/jason-demo.html', icon: '🖥️' },
            { label: 'Jason Tour', href: '/internal/jason-tour.html', icon: '🗺️' },
            { label: 'Trevor Showcase', href: '/internal/trevor-showcase.html', icon: '✨' },
            { label: 'Growth Sandbox', href: '/internal/growth-sandbox.html', icon: '🌱' },
        ],
    },
    {
        group: 'Admin Only', icon: '👑', admin: true, routes: [
            { path: '/admin/dashboard' }, { path: '/admin/invite' },
        ],
    },
    {
        group: 'Dev / Showcase', icon: '🔒', auth: true, routes: [
            { path: '/component-showcase' }, { path: '/hidden-components' },
            { path: '/arc-of-care' }, { path: '/arc-of-care-phase2' }, { path: '/arc-of-care-phase3' },
            { path: '/arc-of-care-dashboard' },
        ],
    },
];

const SiteNavigator: React.FC = () => {
    const [openGroup, setOpenGroup] = useState<string | null>(null);
    const [query, setQuery] = useState('');

    const openInNewTab = (path: string) => {
        const base = window.location.origin + window.location.pathname;
        window.open(`${base}#${path}`, '_blank', 'noopener,noreferrer');
    };

    const toggleGroup = (group: string) => {
        setOpenGroup(prev => prev === group ? null : group);
    };

    const q = query.trim().toLowerCase();

    // When searching: auto-expand groups that have matches
    const getFilteredRoutes = (routes: { path: string; dynamic?: boolean }[]) =>
        q ? routes.filter(r => r.path.toLowerCase().includes(q)) : routes;

    const getFilteredLinks = (links?: { label: string; href: string; icon: string }[]) =>
        q ? (links ?? []).filter(l => l.label.toLowerCase().includes(q) || l.href.toLowerCase().includes(q)) : (links ?? []);

    const groupHasMatch = (routes: { path: string; dynamic?: boolean }[], links?: { label: string; href: string; icon: string }[]) =>
        getFilteredRoutes(routes).length > 0 || getFilteredLinks(links).length > 0;

    const visibleGroups = SITE_MAP.filter(({ routes, externalLinks }) => !q || groupHasMatch(routes, externalLinks));
    const totalMatches = visibleGroups.reduce((acc, { routes, externalLinks }) =>
        acc + getFilteredRoutes(routes).length + getFilteredLinks(externalLinks).length, 0);

    return (
        <div className="space-y-3">
            {/* Search input */}
            <div className="relative">
                <input
                    type="search"
                    placeholder="Search routes..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-4 py-3 pl-10 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-900/80 transition-all min-h-[44px]"
                    aria-label="Search routes"
                />
                <Map className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
                {q && (
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs md:text-sm text-slate-500">
                        {totalMatches} result{totalMatches !== 1 ? 's' : ''}
                    </span>
                )}
            </div>

            {/* No results state */}
            {q && visibleGroups.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-8">No routes matching &ldquo;{query}&rdquo;</p>
            )}

            {/* Group accordions */}
            <div className="space-y-2">
                {visibleGroups.map(({ group, icon, auth, admin, routes, externalLinks }) => {
                    const filteredRoutes = getFilteredRoutes(routes);
                    const filteredLinks = getFilteredLinks(externalLinks);
                    const totalItems = routes.length + (externalLinks?.length ?? 0);
                    const isOpen = q ? true : openGroup === group;

                    return (
                        <div key={group} className="rounded-2xl border border-white/8 overflow-hidden">
                            <button
                                onClick={() => !q && toggleGroup(group)}
                                aria-expanded={isOpen}
                                className={`w-full flex items-center gap-3 px-4 py-3 bg-slate-900/30 transition-colors min-h-[44px] text-left ${!q ? 'hover:bg-slate-800/30 cursor-pointer' : 'cursor-default'}`}
                            >
                                <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-90' : ''}`} />
                                <span className="text-base shrink-0">{icon}</span>
                                <span className="ppn-label text-sm text-slate-300 flex-1">{group}</span>
                                <span className="text-xs md:text-sm text-slate-600 shrink-0">
                                    {q ? `${filteredRoutes.length + filteredLinks.length}/${totalItems}` : `(${totalItems})`}
                                </span>
                                {auth && <Lock className="w-3.5 h-3.5 text-slate-600 ml-1 shrink-0" />}
                                {admin && <Crown className="w-3.5 h-3.5 text-amber-500 ml-1 shrink-0" />}
                            </button>
                            {isOpen && (
                                <div className="divide-y divide-white/5">
                                    {filteredRoutes.map(({ path, dynamic }) => (
                                        <div key={path} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/20 transition-colors">
                                            <code className="flex-1 text-xs md:text-sm text-slate-400 font-mono break-all">{path}</code>
                                            {dynamic ? (
                                                <span className="text-xs md:text-sm text-slate-600 ppn-meta shrink-0">(requires ID)</span>
                                            ) : (
                                                <button
                                                    onClick={() => openInNewTab(path)}
                                                    aria-label={`Open ${path} in new tab`}
                                                    className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 transition-all min-h-[44px]"
                                                >
                                                    Open <ExternalLink className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {filteredLinks.map(({ label, href, icon: extIcon }) => (
                                        <div key={href} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/20 transition-colors">
                                            <span className="text-sm shrink-0">{extIcon}</span>
                                            <span className="flex-1 text-xs md:text-sm text-slate-400 break-all">{label}</span>
                                            <a
                                                href={href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20 transition-all min-h-[44px]"
                                            >
                                                Open <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


// ─── Tab 4: Platform Health ───────────────────────────────────────────────────
interface PlatformStats {
    totalUsers: number;
    totalSessions: number;
    totalClinics: number;
    newThisWeek: number;
}

const PlatformHealth: React.FC = () => {
    const [stats, setStats] = useState<PlatformStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const [
                { count: totalUsers },
                { count: totalSessions },
                { data: clinicData },
                { count: newThisWeek },
            ] = await Promise.all([
                supabase.from('log_user_profiles').select('*', { count: 'exact', head: true }),
                supabase.from('log_clinical_records').select('*', { count: 'exact', head: true }),
                supabase.from('log_clinical_records').select('site_id'),
                supabase.from('log_user_profiles')
                    .select('*', { count: 'exact', head: true })
                    .gt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
            ]);

            const uniqueSites = new Set((clinicData ?? []).map(r => r.site_id)).size;

            setStats({
                totalUsers: totalUsers ?? 0,
                totalSessions: totalSessions ?? 0,
                totalClinics: uniqueSites,
                newThisWeek: newThisWeek ?? 0,
            });
            setLoading(false);
        })();
    }, []);

    const tiles = [
        { label: 'Total Users', value: stats?.totalUsers, icon: Users },
        { label: 'Total Sessions', value: stats?.totalSessions, icon: Activity },
        { label: 'Total Clinics', value: stats?.totalClinics, icon: LayoutDashboard },
        { label: 'New This Week', value: stats?.newThisWeek, icon: RefreshCw },
    ];

    const updatedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tiles.map(({ label, value, icon: Icon }) => (
                <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 flex flex-col gap-3"
                >
                    <Icon className="w-5 h-5 text-indigo-400" />
                    {loading ? (
                        <div className="h-8 w-16 rounded-lg bg-slate-800 animate-pulse" />
                    ) : (
                        <span className="text-4xl font-black text-slate-100 tabular-nums">{value?.toLocaleString()}</span>
                    )}
                    <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-slate-500">{label}</span>
                    <span className="text-xs md:text-sm text-slate-500 mt-auto">As of {updatedTime}</span>
                </div>
            ))}
        </div>
    );
};

// ─── Tab 5: Packet Builder ───────────────────────────────────────────────────
type AudienceTag = 'All' | 'Investor' | 'Clinician' | 'Researcher' | 'Technical Advisor' | 'Legal';

interface PacketDoc {
    id: string;
    label: string;
    description: string;
    url: string;
    audience: AudienceTag[];
}

const PACKET_DOCS: PacketDoc[] = [
    { id: 'clinician-packet', label: 'Clinician Founding Partner Packet', description: 'Full clinical onboarding, Arc of Care overview, and founding charter for licensed practitioners.', url: '/internal/founding-docs/Clinician-Packet/index.html', audience: ['Clinician', 'Investor', 'Technical Advisor'] },
    { id: 'researcher-packet', label: 'Researcher Founding Partner Packet', description: 'Data taxonomy, clinical schema, and IRB-ready technical specifications.', url: '/internal/founding-docs/Researcher-Packet/index.html', audience: ['Researcher', 'Investor', 'Legal'] },
    { id: 'hipaa-packet', label: 'HIPAA Legal Packet', description: 'HIPAA posture overview, technical proof set, safe harbor table, and conflict resolution audit.', url: '/internal/founding-docs/HIPAA-Packet/index.html', audience: ['Legal', 'Investor', 'Technical Advisor'] },
    { id: 'advisor-demo', label: 'Advisor Demo', description: 'Interactive platform walkthrough for technical evaluators and advisory board members.', url: '/internal/advisor-demo.html', audience: ['Technical Advisor', 'Investor'] },
    { id: 'partner-hub', label: 'Partner Hub', description: 'Founding partner overview, tier benefits, and onboarding pathways.', url: '/internal/partner-hub.html', audience: ['Investor', 'Clinician'] },
    { id: 'partner-preview', label: 'Partner Preview', description: 'Visual product preview optimized for first impressions and investor intros.', url: '/internal/partner-preview.html', audience: ['Investor', 'Clinician'] },
    { id: 'vip-invite', label: 'VIP Invite Flow', description: 'Exclusive invite sequence for advisory board members and strategic contacts.', url: '/internal/vip-invite-flow.html', audience: ['Investor', 'Technical Advisor'] },
    { id: 'email-templates', label: 'Email Templates', description: 'Pre-approved outreach templates for all audience types and use cases.', url: '/internal/ppn-email-templates.html', audience: ['All'] },
    { id: 'bridge-camera', label: 'PPN Bridge Camera', description: 'High-impact visual narrative for platform demonstrations.', url: '/internal/PPN_Bridge_Camera.html', audience: ['Technical Advisor', 'Investor'] },
    { id: 'jason-demo', label: 'Jason Demo', description: 'Full platform demo tailored for clinical and investor audiences.', url: '/internal/jason-demo.html', audience: ['Investor', 'Clinician'] },
    { id: 'jason-tour', label: 'Jason Tour', description: 'Guided product tour with technical depth for evaluators.', url: '/internal/jason-tour.html', audience: ['Investor', 'Technical Advisor'] },
    { id: 'trevor-showcase', label: 'Trevor Showcase', description: 'Comprehensive showcase of platform capabilities and design excellence.', url: '/internal/trevor-showcase.html', audience: ['Investor', 'Clinician'] },
    { id: 'growth-sandbox', label: 'Growth Sandbox', description: 'Analytics and growth data sandbox for technical deep-dives.', url: '/internal/growth-sandbox.html', audience: ['Technical Advisor'] },
    { id: 'denver-leave-behind', label: 'Denver Leave-Behind (PsyCon 2026)', description: 'Print-ready conference leave-behind for PsyCon 2026.', url: '/internal/admin_uploads/denver-2026/PPN_Leave_Behind_Print.html', audience: ['Clinician', 'Investor'] },
];

const AUDIENCE_FILTERS: AudienceTag[] = ['All', 'Investor', 'Clinician', 'Researcher', 'Technical Advisor', 'Legal'];

const AUDIENCE_COLORS: Record<AudienceTag, string> = {
    'All':               'bg-slate-700/40 text-slate-300 border-slate-600/40',
    'Investor':          'bg-amber-500/15 text-amber-300 border-amber-500/30',
    'Clinician':         'bg-teal-500/15 text-teal-300 border-teal-500/30',
    'Researcher':        'bg-violet-500/15 text-violet-300 border-violet-500/30',
    'Technical Advisor': 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    'Legal':             'bg-red-500/15 text-red-300 border-red-500/30',
};

const PacketBuilder: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<AudienceTag>('All');
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [copiedTray, setCopiedTray] = useState(false);

    const filtered = activeFilter === 'All'
        ? PACKET_DOCS
        : PACKET_DOCS.filter(d => d.audience.includes(activeFilter) || d.audience.includes('All'));

    const toggle = (id: string) => {
        setSelected(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const selectedDocs = PACKET_DOCS.filter(d => selected.has(d.id));

    const handleOpenAll = () => {
        selectedDocs.forEach(d => window.open(d.url, '_blank', 'noopener,noreferrer'));
    };

    const handleCopyUrls = () => {
        const base = window.location.origin + window.location.pathname.replace(/\/?$/, '');
        const urls = selectedDocs.map(d => `${base}${d.url}`).join('\n');
        navigator.clipboard.writeText(urls);
        setCopiedTray(true);
        setTimeout(() => setCopiedTray(false), 2500);
    };

    return (
        <div className="space-y-4 pb-28">
            <p className="text-sm text-slate-400 leading-relaxed">
                Select documents to assemble a shareable packet for your contact. Filter by audience, then Open All or Copy URLs.
            </p>
            {/* Filter chips */}
            <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
                {AUDIENCE_FILTERS.map(f => (
                    <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`shrink-0 px-3 py-1.5 rounded-xl text-xs md:text-sm font-black uppercase tracking-widest border transition-all min-h-[44px] flex items-center
                            ${activeFilter === f
                                ? 'bg-indigo-500/20 border-indigo-500/60 text-indigo-300'
                                : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        {f}
                    </button>
                ))}
                {selected.size > 0 && (
                    <button
                        onClick={() => setSelected(new Set())}
                        className="shrink-0 ml-auto px-3 py-1.5 rounded-xl text-xs md:text-sm font-black border border-slate-700 text-slate-500 hover:text-red-300 hover:border-red-500/40 transition-all min-h-[44px] flex items-center gap-1"
                    >
                        Clear ({selected.size})
                    </button>
                )}
            </div>

            {/* Document grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(doc => {
                    const isSelected = selected.has(doc.id);
                    return (
                        <button
                            key={doc.id}
                            onClick={() => toggle(doc.id)}
                            className={`text-left rounded-2xl border p-4 transition-all flex flex-col gap-3 min-h-[44px]
                                ${isSelected
                                    ? 'bg-indigo-500/10 border-indigo-500/50 ring-1 ring-indigo-500/30'
                                    : 'bg-slate-900/40 border-white/8 hover:bg-slate-800/40 hover:border-white/15'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`mt-0.5 w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-slate-600'}`}>
                                    {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                                </div>
                                <span className="text-sm font-bold text-slate-200 leading-snug">{doc.label}</span>
                            </div>
                            <p className="text-xs md:text-sm text-slate-500 leading-relaxed pl-7">{doc.description}</p>
                            <div className="flex flex-wrap gap-1.5 pl-7">
                                {doc.audience.includes('All') ? (
                                    <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${AUDIENCE_COLORS['All']}`}>All Audiences</span>
                                ) : doc.audience.map(a => (
                                    <span key={a} className={`text-xs px-2 py-0.5 rounded-full border font-bold ${AUDIENCE_COLORS[a]}`}>{a}</span>
                                ))}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Sticky selection tray */}
            {selected.size > 0 && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-4 py-3 rounded-2xl border border-indigo-500/40 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 whitespace-nowrap">
                    <span className="text-sm font-black text-indigo-300">{selected.size} doc{selected.size !== 1 ? 's' : ''} selected</span>
                    <div className="w-px h-5 bg-slate-700" />
                    <button
                        onClick={handleOpenAll}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-700/60 transition-all min-h-[44px]"
                    >
                        <ExternalLink className="w-3.5 h-3.5" /> Open All
                    </button>
                    <button
                        onClick={handleCopyUrls}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold transition-all min-h-[44px] bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300"
                    >
                        {copiedTray ? (
                            <><CheckCircle className="w-3.5 h-3.5 text-teal-400" /><span className="text-teal-400">Copied</span></>
                        ) : (
                            <><Copy className="w-3.5 h-3.5" /> Copy URLs</>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const TABS: { id: TabId; label: string; Icon: React.FC<{ className?: string }> }[] = [
    { id: 'feedback',  label: 'Feedback',  Icon: ({ className }) => <MessageSquare className={className} /> },
    { id: 'users',     label: 'Users',     Icon: ({ className }) => <Users className={className} /> },
    { id: 'sitemap',   label: 'Site Nav',  Icon: ({ className }) => <Map className={className} /> },
    { id: 'platform',  label: 'Platform',  Icon: ({ className }) => <Activity className={className} /> },
    { id: 'packets',   label: 'Packets',   Icon: ({ className }) => <Package className={className} /> },
];

const VALID_TABS: TabId[] = ['feedback', 'users', 'sitemap', 'platform', 'packets'];

const AdminDashboard: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Persist last-used tab in localStorage across sessions
    const LAST_TAB_KEY = 'ppn_admin_last_tab';
    const savedTab = localStorage.getItem(LAST_TAB_KEY) as TabId | null;

    // Priority: URL param > localStorage > default ('sitemap' — most-used)
    const tabFromUrl = new URLSearchParams(location.search).get('tab') as TabId | null;
    const activeTab: TabId =
        (tabFromUrl && VALID_TABS.includes(tabFromUrl))
            ? tabFromUrl
            : (savedTab && VALID_TABS.includes(savedTab))
                ? savedTab
                : 'sitemap';

    const setActiveTab = (id: TabId) => {
        localStorage.setItem(LAST_TAB_KEY, id);
        navigate({ search: `?tab=${id}` }, { replace: true });
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
            {/* Page heading */}
            <div className="flex items-center gap-3">
                <Crown className="w-6 h-6 text-amber-400" />
                <h1 className="ppn-h1 text-slate-100">Admin Console</h1>
            </div>

            {/* Tab bar — horizontally scrollable on mobile */}
            <div className="flex overflow-x-auto gap-1 border-b border-white/10 pb-0 -mb-px no-scrollbar" role="tablist" aria-label="Admin console tabs">
                {TABS.map(({ id, label, Icon }) => (
                    <button
                        key={id}
                        role="tab"
                        aria-selected={activeTab === id}
                        aria-controls={`tabpanel-${id}`}
                        id={`tab-${id}`}
                        onClick={() => setActiveTab(id)}
                        title={label}
                        className={`
                            shrink-0 flex items-center gap-2 px-3 sm:px-4 py-3 whitespace-nowrap text-sm font-black border-b-2 transition-all min-h-[44px]
                            ${activeTab === id
                                ? 'text-indigo-300 border-indigo-500'
                                : 'text-slate-500 border-transparent hover:text-slate-300 hover:border-slate-600'
                            }
                        `}
                    >
                        <Icon className="w-4 h-4" aria-hidden="true" />
                        <span className="truncate max-w-[80px] sm:max-w-none">{label}</span>
                    </button>
                ))}
            </div>

            {/* Tab panels */}
            <div role="tabpanel" id={`tabpanel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
                {activeTab === 'feedback'  && <FeedbackInbox />}
                {activeTab === 'users'     && <UserManagement />}
                {activeTab === 'sitemap'   && <SiteNavigator />}
                {activeTab === 'platform'  && <PlatformHealth />}
                {activeTab === 'packets'   && <PacketBuilder />}
            </div>
        </div>
    );
};

export default AdminDashboard;
