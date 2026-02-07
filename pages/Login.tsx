
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // keeping if needed, though Login uses onLogin prop mostly

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'request'>('login');
  const [practitionerId, setPractitionerId] = useState('DR-ARIS-9921');

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'request') {
      setActiveTab('request');
    }
  }, [location]);

  const [secureKey, setSecureKey] = useState('********');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState('');

  // Request Access State
  const [requestData, setRequestData] = useState({
    email: '',
    fullName: '',
    licenseType: '',
    licenseNumber: '',
    organization: '',
    role: '',
    intendedUse: ''
  });
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);

    const steps = [
      'INITIALIZING...',
      'VERIFYING CREDENTIALS...',
      'ESTABLISHING SECURE LINK...',
      'SYNCING NODE 0x7...',
      'GRANTED'
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setAuthStep(step);
        if (index === steps.length - 1) {
          setTimeout(onLogin, 800);
        }
      }, (index + 1) * 600);
    });
  };

  const handleRequestAccess = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setRequestSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-[#05070a] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(#587e76 1px, transparent 1px)`, backgroundSize: '30px 30px' }}></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-[#0c0f14]/90 border border-white/5 rounded-[2.5rem] p-8 sm:p-10 backdrop-blur-3xl shadow-2xl relative">

          <div className="flex flex-col items-center mb-8">
            <div className="mb-4 relative">
              <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full scale-125"></div>
              <div className="bg-primary rounded-xl p-3 flex items-center justify-center shadow-lg relative z-10">
                <span className="material-symbols-outlined text-white text-3xl">science</span>
              </div>
            </div>
            <h1 className="text-sm sm:text-base font-black text-white tracking-widest text-center">PPN Research Portal</h1>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">Practitioner Access Node</p>
          </div>

          {/* Auth Tabs */}
          {!isAuthenticating && !requestSubmitted && (
            <div className="flex p-1 bg-slate-900/50 rounded-xl mb-6 border border-slate-800/50">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-3 rounded-lg text-[11px] font-black tracking-widest transition-all ${activeTab === 'login'
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-slate-500 hover:text-slate-300'
                  }`}
              >
                Log In
              </button>
              <button
                onClick={() => setActiveTab('request')}
                className={`flex-1 py-3 rounded-lg text-[11px] font-black tracking-widest transition-all ${activeTab === 'request'
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-slate-500 hover:text-slate-300'
                  }`}
              >
                Request Access
              </button>
            </div>
          )}

          {activeTab === 'login' && !isAuthenticating ? (
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 tracking-widest ml-1">Practitioner ID</label>
                <input
                  type="text"
                  value={practitionerId}
                  onChange={(e) => setPractitionerId(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl h-12 px-4 text-xs text-white focus:ring-1 focus:ring-primary font-mono transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 tracking-widest ml-1">Access Key</label>
                <input
                  type="password"
                  value={secureKey}
                  onChange={(e) => setSecureKey(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl h-12 px-4 text-xs text-white focus:ring-1 focus:ring-primary font-mono transition-all"
                />
              </div>

              <div className="text-right">
                <a href="#" className="text-[11px] font-bold text-slate-500 hover:text-primary transition-colors tracking-widest">Recover Credentials</a>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-primary hover:bg-blue-600 text-white text-[11px] font-black rounded-xl tracking-widest transition-all mt-2 active:scale-95 shadow-xl shadow-primary/20"
              >
                Login
              </button>
            </form>
          ) : activeTab === 'request' && !requestSubmitted ? (
            <form onSubmit={handleRequestAccess} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 tracking-widest ml-1">Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Dr. Jane Smith"
                  value={requestData.fullName}
                  onChange={(e) => setRequestData({ ...requestData, fullName: e.target.value })}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl h-10 px-4 text-xs text-white focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 tracking-widest ml-1">Work Email</label>
                <input
                  required
                  type="email"
                  placeholder="name@clinic.org"
                  value={requestData.email}
                  onChange={(e) => setRequestData({ ...requestData, email: e.target.value })}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl h-10 px-4 text-xs text-white focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-500 tracking-widest ml-1">License Type</label>
                  <input
                    required
                    type="text"
                    placeholder="MD, DO, NP..."
                    value={requestData.licenseType}
                    onChange={(e) => setRequestData({ ...requestData, licenseType: e.target.value })}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl h-10 px-4 text-xs text-white focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-500 tracking-widest ml-1">Org / Clinic</label>
                  <input
                    required
                    type="text"
                    placeholder="Clinic Name"
                    value={requestData.organization}
                    onChange={(e) => setRequestData({ ...requestData, organization: e.target.value })}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl h-10 px-4 text-xs text-white focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 tracking-widest ml-1">Intended Use</label>
                <select
                  required
                  value={requestData.intendedUse}
                  onChange={(e) => setRequestData({ ...requestData, intendedUse: e.target.value })}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl h-10 px-4 text-xs text-white focus:ring-1 focus:ring-primary transition-all appearance-none"
                >
                  <option value="" disabled className="text-slate-600">Select Use Case...</option>
                  <option value="Outcomes Tracking">Outcomes Tracking</option>
                  <option value="Safety Surveillance">Safety Surveillance</option>
                  <option value="Training Cohort">Training Cohort Reporting</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-black rounded-xl tracking-widest transition-all mt-4 border border-slate-700 hover:border-slate-600"
              >
                Submit Request
              </button>
            </form>
          ) : requestSubmitted ? (
            <div className="py-10 flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in-95">
              <div className="size-16 rounded-full bg-clinical-green/10 flex items-center justify-center border border-clinical-green/20 mb-2">
                <span className="material-symbols-outlined text-3xl text-clinical-green">check</span>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-white font-black tracking-widest text-sm">Request Received</h3>
                <p className="text-[11px] font-medium text-slate-500 max-w-[200px] mx-auto leading-relaxed">
                  Ticket #TR-8829 created. Verification details sent to <span className="text-white">{requestData.email}</span>.
                </p>
              </div>
              <button
                onClick={() => { setRequestSubmitted(false); setActiveTab('login'); }}
                className="text-[11px] font-black text-primary tracking-widest hover:text-white transition-colors"
              >
                Return to Login
              </button>
            </div>
          ) : (
            <div className="py-10 flex flex-col items-center justify-center space-y-6">
              <div className="size-16 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
              <p className="text-white font-mono text-xs tracking-widest animate-pulse">{authStep}</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-800/50">
            <p className="text-[11px] font-bold text-slate-600 text-center tracking-widest">
              Restricted Clinical System. Access Logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
