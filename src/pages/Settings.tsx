
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';
import { useToast } from '../contexts/ToastContext'; // WO-109

const Settings: React.FC = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleMFA = () => {
    addToast({
      title: 'MFA Configuration',
      message: 'Multi-Factor Authentication is enforced by your institutional ID provider. Please contact IT Security to reset your factors.',
      type: 'info'
    });
  };

  const handleChangePassword = () => {
    // Placeholder for password reset flow
    addToast({
      title: 'Password Reset',
      message: 'Redirecting to secure password reset portal...',
      type: 'success'
    });
    // setTimeout(() => navigate('/reset-password'), 1000);
  };

  return (
    <PageContainer className="animate-in fade-in duration-700 pb-20">
      <Section spacing="spacious">

        {/* Header Area */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: '#8BA5D3' }}>Settings</h1>
            <p className="text-slate-400 text-sm font-medium">Manage your account security, data privacy preferences, and session controls.</p>
          </div>

          <div className="flex items-center gap-3 px-5 py-3 bg-accent-amber/5 border border-accent-amber/20 rounded-2xl shadow-xl">
            <div className="size-8 rounded-xl bg-accent-amber/10 flex items-center justify-center text-accent-amber border border-accent-amber/20">
              <span className="material-symbols-outlined text-xl">shield_with_heart</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Security Health</span>
              <span className="text-xs font-bold text-accent-amber uppercase tracking-tighter">Needs Attention</span>
            </div>
          </div>
        </div>

        {/* Authentication Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 ml-1">
            <span className="material-symbols-outlined text-slate-300 text-xl">verified_user</span>
            <h2 className="text-sm font-black uppercase tracking-widest whitespace-nowrap" style={{ color: '#A8B5D1' }}>Authentication</h2>
            <div className="h-px bg-slate-800/60 flex-1 ml-4 rounded-full"></div>
          </div>

          <div className="bg-[#111418]/60 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl divide-y divide-slate-800/40">
            {/* MFA */}
            <div className="p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-lg">
                  <span className="material-symbols-outlined text-3xl">phonelink_lock</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold" style={{ color: '#8B9DC3' }}>Multi-Factor Authentication (MFA)</h3>
                    <span className="px-2 py-0.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-black uppercase tracking-widest">Disabled</span>
                  </div>
                  <p className="text-sm text-slate-400 max-w-md font-medium leading-relaxed">Add an extra layer of security to your account by requiring a verification code.</p>
                </div>
              </div>
              {/* WO-109: Wired up MFA button */}
              <button
                onClick={handleMFA}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 hover:bg-blue-600 text-white text-sm font-black rounded-xl uppercase tracking-widest transition-all shadow-xl active:scale-95 whitespace-nowrap"
              >
                Setup MFA
              </button>
            </div>

            {/* Password */}
            <div className="p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <div className="size-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shadow-lg">
                  <span className="material-symbols-outlined text-3xl">password</span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold" style={{ color: '#8B9DC3' }}>Password Management</h3>
                  <p className="text-sm text-slate-400 max-w-md font-medium leading-relaxed">Manage your sign-in password.</p>
                  <p className="text-sm font-mono text-slate-600">Last changed: <span style={{ color: '#8B9DC3' }}>3 months ago</span></p>
                </div>
              </div>
              <button
                onClick={handleChangePassword}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-300 border border-slate-700 text-sm font-black rounded-xl uppercase tracking-widest transition-all active:scale-95 whitespace-nowrap"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Data Privacy Section (WO-107: Enforced Zero PHI) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 ml-1">
            <span className="material-symbols-outlined text-slate-300 text-xl">visibility_off</span>
            <h2 className="text-sm font-black uppercase tracking-widest whitespace-nowrap" style={{ color: '#A8B5D1' }}>Data Privacy</h2>
            <div className="h-px bg-slate-800/60 flex-1 ml-4 rounded-full"></div>
          </div>

          <div className="bg-[#111418]/60 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl divide-y divide-slate-800/40">
            {/* Anonymize - LOCKED ON */}
            <div className="p-8 flex items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold" style={{ color: '#8B9DC3' }}>Anonymize Patient Data in Exports</h3>
                  <span className="material-symbols-outlined text-sm text-clinical-green">lock</span>
                </div>
                <p className="text-sm text-slate-400 max-w-md font-medium leading-relaxed">
                  PII (Personally Identifiable Information) is automatically scrubbed from all research datasets.
                  <span className="block text-clinical-green mt-1 font-bold text-xs">ENFORCED BY INSTITUTIONAL POLICY</span>
                </p>
              </div>
              {/* Static Locked Switch */}
              <div className="relative w-14 h-8 rounded-full bg-clinical-green/20 shadow-[0_0_12px_rgba(83,210,45,0.2)] opacity-80 cursor-not-allowed">
                <div className="absolute top-1 left-7 size-6 bg-clinical-green rounded-full shadow-md flex items-center justify-center">
                  <span className="material-symbols-outlined text-[14px] text-black font-bold">lock</span>
                </div>
              </div>
            </div>

            {/* HIPAA - LOCKED ON */}
            <div className="p-8 flex items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-slate-300">
                  <h3 className="text-base font-bold">HIPAA Compliance Logging</h3>
                  <span className="material-symbols-outlined text-sm text-clinical-green">lock</span>
                </div>
                <p className="text-sm text-slate-400 max-w-md font-medium leading-relaxed">
                  All data access events are cryptographically signed and logged for audit trails.
                  <span className="block text-clinical-green mt-1 font-bold text-xs">ACTIVE & MONITORING</span>
                </p>
              </div>
              {/* Static Locked Switch */}
              <div className="relative w-14 h-8 rounded-full bg-clinical-green/20 shadow-[0_0_12px_rgba(83,210,45,0.2)] opacity-80 cursor-not-allowed">
                <div className="absolute top-1 left-7 size-6 bg-clinical-green rounded-full shadow-md flex items-center justify-center">
                  <span className="material-symbols-outlined text-[14px] text-black font-bold">lock</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Access Control Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 ml-1">
            <span className="material-symbols-outlined text-slate-300 text-xl">devices</span>
            <h2 className="text-sm font-black uppercase tracking-widest whitespace-nowrap" style={{ color: '#A8B5D1' }}>Access Control</h2>
            <div className="h-px bg-slate-800/60 flex-1 ml-4 rounded-full"></div>
          </div>

          <div className="bg-[#111418]/60 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-800 bg-slate-900/40">
                    <th className="px-8 py-5">Device / Browser</th>
                    <th className="px-8 py-5">Location</th>
                    <th className="px-8 py-5">IP Address</th>
                    <th className="px-8 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  <tr className="hover:bg-primary/5 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-xl bg-clinical-green/10 flex items-center justify-center text-clinical-green border border-clinical-green/20">
                          <span className="material-symbols-outlined">laptop_mac</span>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold" style={{ color: '#8B9DC3' }}>Macbook Pro (Chrome)</p>
                          <p className="text-sm font-black text-clinical-green uppercase tracking-widest">Current Session</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-medium" style={{ color: '#8B9DC3' }}>Boston, MA, USA</td>
                    <td className="px-8 py-6 font-mono text-xs text-slate-400">192.168.1.45</td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-xs font-black text-slate-600 uppercase tracking-widest italic">Active</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-primary/5 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 border border-slate-700">
                          <span className="material-symbols-outlined">smartphone</span>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold" style={{ color: '#8B9DC3' }}>iPhone 14 (Safari)</p>
                          <p className="text-sm font-mono text-slate-600">Last active: 2 hours ago</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-medium" style={{ color: '#8B9DC3' }}>Cambridge, MA, USA</td>
                    <td className="px-8 py-6 font-mono text-xs text-slate-400">10.0.0.12</td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-xs font-black text-red-400 hover:text-red-300 uppercase tracking-widest transition-colors">Revoke</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-primary/5 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 border border-slate-700">
                          <span className="material-symbols-outlined">desktop_windows</span>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold" style={{ color: '#8B9DC3' }}>Windows PC (Edge)</p>
                          <p className="text-sm font-mono text-slate-600">Last active: 3 days ago</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-medium" style={{ color: '#8B9DC3' }}>New York, NY, USA</td>
                    <td className="px-8 py-6 font-mono text-xs text-slate-400">172.16.254.1</td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-xs font-black text-red-400 hover:text-red-300 uppercase tracking-widest transition-colors">Revoke</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Encryption Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 ml-1">
            <span className="material-symbols-outlined text-slate-300 text-xl">key</span>
            <h2 className="text-sm font-black uppercase tracking-widest whitespace-nowrap" style={{ color: '#A8B5D1' }}>Encryption</h2>
            <div className="h-px bg-slate-800/60 flex-1 ml-4 rounded-full"></div>
          </div>

          <div className="bg-[#111418]/60 border border-slate-800 rounded-[2rem] p-8 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="size-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(43,116,243,0.2)]">
                <span className="material-symbols-outlined text-3xl">lock_person</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold leading-tight" style={{ color: '#8B9DC3' }}>End-to-End Encryption Active</h3>
                <p className="text-sm text-slate-400 max-w-xl font-medium leading-relaxed">
                  Your direct messages and sensitive patient files are encrypted using AES-256 before leaving your device. Only you and the intended recipient possess the keys to decrypt this data.
                </p>
              </div>
            </div>
            <button className="flex items-center gap-3 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 hover:bg-blue-600 text-white text-sm font-black rounded-2xl uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 whitespace-nowrap group">
              <span className="material-symbols-outlined text-lg">vpn_key</span>
              Manage Recovery Keys
            </button>
          </div>
        </div>

        {/* Node Configuration Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 ml-1">
            <span className="material-symbols-outlined text-slate-300 text-xl">dns</span>
            <h2 className="text-sm font-black uppercase tracking-widest whitespace-nowrap" style={{ color: '#A8B5D1' }}>Node Configuration</h2>
            <div className="h-px bg-slate-800/60 flex-1 ml-4 rounded-full"></div>
          </div>

          <div className="bg-[#0D121C] border border-slate-800 rounded-[2rem] p-8 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-black/40 border border-slate-800 rounded-2xl space-y-1">
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Node Version</p>
                <p className="text-sm font-mono font-bold" style={{ color: '#8B9DC3' }}>v2.4.1 (Stable)</p>
              </div>
              <div className="p-4 bg-black/40 border border-slate-800 rounded-2xl space-y-1">
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Ledger Hash</p>
                <p className="text-sm font-mono font-bold text-primary truncate">0x773...99a</p>
              </div>
              <div className="p-4 bg-black/40 border border-slate-800 rounded-2xl space-y-1">
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Sync Frequency</p>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-clinical-green animate-pulse"></div>
                  <p className="text-sm font-mono font-bold" style={{ color: '#8B9DC3' }}>Real-time (WebSocket)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </PageContainer>
  );
};

export default Settings;
