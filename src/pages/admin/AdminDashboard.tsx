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
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type TabId = 'feedback' | 'users' | 'sitemap' | 'platform';
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
                                                <span className="font-mono text-xs text-slate-600 w-24 shrink-0">{k}</span>
                                                <span className="font-mono text-xs text-slate-400 break-all">{v}</span>
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
                                            className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-bold min-h-[44px]"
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
    const openInNewTab = (path: string) => {
        // Construct the full URL using the app's hash-based routing
        const base = window.location.origin + window.location.pathname;
        window.open(`${base}#${path}`, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="space-y-3">
            {SITE_MAP.map(({ group, icon, auth, admin, routes, externalLinks }) => (
                <details key={group} className="rounded-2xl border border-white/8 overflow-hidden" open={false}>
                    <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer bg-slate-900/30 hover:bg-slate-800/30 transition-colors list-none min-h-[44px]">
                        <ChevronRight className="w-4 h-4 text-slate-500 transition-transform [[open]_&]:rotate-90" />
                        <span className="text-base">{icon}</span>
                        <span className="ppn-label text-slate-300">{group}</span>
                        {auth && <Lock className="w-3.5 h-3.5 text-slate-600 ml-auto" />}
                        {admin && <Crown className="w-3.5 h-3.5 text-amber-500 ml-auto" />}
                    </summary>
                    <div className="divide-y divide-white/5">
                        {routes.map(({ path, dynamic }) => (
                            <div key={path} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/20 transition-colors">
                                {/* V5: break-all prevents code path overflow on 375px mobile */}
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
                        {(externalLinks ?? []).map(({ label, href, icon: extIcon }) => (
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
                </details>
            ))}
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
                    <span className="text-xs text-slate-700 mt-auto">As of {updatedTime}</span>
                </div>
            ))}
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const TABS: { id: TabId; label: string; Icon: React.FC<{ className?: string }> }[] = [
    { id: 'feedback',  label: 'Feedback Inbox', Icon: ({ className }) => <MessageSquare className={className} /> },
    { id: 'users',     label: 'Users',          Icon: ({ className }) => <Users className={className} /> },
    { id: 'sitemap',   label: 'Site Navigator', Icon: ({ className }) => <Map className={className} /> },
    { id: 'platform',  label: 'Platform',       Icon: ({ className }) => <Activity className={className} /> },
];

const VALID_TABS: TabId[] = ['feedback', 'users', 'sitemap', 'platform'];

const AdminDashboard: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Derive active tab from URL search param (?tab=) for deep-link & back-button support
    const tabFromUrl = new URLSearchParams(location.search).get('tab') as TabId | null;
    const activeTab: TabId = (tabFromUrl && VALID_TABS.includes(tabFromUrl)) ? tabFromUrl : 'feedback';

    const setActiveTab = (id: TabId) => {
        // Update URL without pushing a new history entry so native Back still works correctly
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
                        {/* U1: hide label text on xs screens, show from sm: up */}
                        <span className="hidden sm:inline">{label}</span>
                    </button>
                ))}
            </div>

            {/* Tab panels */}
            <div role="tabpanel" id={`tabpanel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
                {activeTab === 'feedback'  && <FeedbackInbox />}
                {activeTab === 'users'     && <UserManagement />}
                {activeTab === 'sitemap'   && <SiteNavigator />}
                {activeTab === 'platform'  && <PlatformHealth />}
            </div>
        </div>
    );
};

export default AdminDashboard;
