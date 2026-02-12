
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';
import { useToast } from '../contexts/ToastContext';

interface NotificationItem {
  id: string;
  type: 'critical' | 'system' | 'protocol' | 'warning' | 'training';
  title: string;
  description: string;
  metadata: {
    label: string;
    value: string;
    secondaryLabel?: string;
    secondaryValue?: string;
  }[];
  timestamp: string;
  isUnread: boolean;
  actionLabel?: string;
  actionIcon?: string;
}

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'All' | 'Unread' | 'Flagged'>('All');
  const [preferences, setPreferences] = useState({
    safetyAlerts: true,
    protocolAmendments: true,
    labResults: false,
    email: true,
    push: false,
  });

  const notifications: NotificationItem[] = [
    {
      id: '1',
      type: 'critical',
      title: 'CRITICAL: Patient ID #4092 - Adverse Reaction',
      description: 'Severe rash and tachycardia reported post-infusion. Immediate review required by principal investigator.',
      timestamp: '10 mins ago',
      isUnread: false,
      actionLabel: 'View Details',
      actionIcon: 'arrow_forward',
      metadata: [
        { label: 'Trial', value: 'Oncology-2024-B' },
        { label: 'Site', value: 'General Hospital' },
      ],
    },
    {
      id: '2',
      type: 'system',
      title: 'System Maintenance Scheduled',
      description: 'Scheduled maintenance from 02:00 AM to 04:00 AM EST for database upgrades. Portal will be offline.',
      timestamp: '2h ago',
      isUnread: false,
      metadata: [
        { label: 'Date', value: 'Oct 24, 2023' },
      ],
    },
    {
      id: '3',
      type: 'protocol',
      title: 'New Protocol v2.4 Available',
      description: 'The updated protocol for the Diabetes-Type2 study is now available for download. Please review changes.',
      timestamp: 'Yesterday',
      isUnread: true,
      actionLabel: 'Download',
      actionIcon: 'download',
      metadata: [
        { label: 'Trial', value: 'Diabetes-Type2' },
      ],
    },
    {
      id: '4',
      type: 'warning',
      title: 'Late Case Report Forms (CRF)',
      description: "Overdue CRFs for 3 patients at 'City Center' site. Submission deadline was 48 hours ago.",
      timestamp: '2 days ago',
      isUnread: false,
      actionLabel: 'Resolve',
      actionIcon: 'arrow_forward',
      metadata: [
        { label: 'Patients', value: '#301, #305, #312' },
      ],
    },
    {
      id: '5',
      type: 'training',
      title: 'Training Certificate Expiry',
      description: 'Your GCP (Good Clinical Practice) certification will expire in 30 days. Renew now to maintain site access.',
      timestamp: '3 days ago',
      isUnread: false,
      actionLabel: 'Renew',
      actionIcon: 'open_in_new',
      metadata: [],
    },
  ];

  const handleAction = (notif: NotificationItem) => {
    if (notif.type === 'critical') {
      navigate('/audit');
    } else if (notif.type === 'protocol') {
      addToast({
        type: 'info',
        message: "Downloading Secure Protocol v2.4..."
      });
    } else if (notif.type === 'warning') {
      navigate('/clinicians');
    } else if (notif.type === 'training') {
      window.open('https://training.nih.gov', '_blank');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'critical': return 'warning';
      case 'system': return 'settings';
      case 'protocol': return 'description';
      case 'warning': return 'error';
      case 'training': return 'school';
      default: return 'notifications';
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'Unread') return n.isUnread;
    return true; // Simple logic for Flagged/All
  });

  return (
    <PageContainer className="!max-w-7xl animate-in fade-in duration-500 relative">



      <Section spacing="default" className="flex flex-col lg:flex-row gap-10">

        {/* Main Feed */}
        <div className="flex-1 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tight text-white">Notifications</h1>
              <p className="text-slate-500 text-sm font-medium">Manage urgent clinical alerts and system updates.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl text-[11px] font-black text-slate-300 uppercase tracking-widest transition-all">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              Mark all as read
            </button>
          </div>

          <div className="flex items-center gap-1 bg-[#111418] p-1 rounded-xl w-fit border border-slate-800">
            {['All', 'Unread', 'Flagged'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab
                  ? 'bg-accent-amber text-black shadow-lg shadow-accent-amber/10'
                  : 'text-slate-500 hover:text-white'
                  }`}
              >
                {tab}
                {tab === 'Unread' && <span className="px-1.5 py-0.5 bg-accent-amber/20 text-accent-amber rounded text-[11px]">3</span>}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`relative group bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden transition-all hover:bg-slate-900/60 ${notif.type === 'critical' ? 'border-l-4 border-l-accent-amber' :
                  notif.type === 'system' ? 'border-l-4 border-l-primary' :
                    notif.type === 'protocol' ? 'border-l-4 border-l-slate-700' :
                      notif.type === 'warning' ? 'border-l-4 border-l-accent-amber/50' :
                        'border-l-4 border-l-slate-800'
                  }`}
              >
                <div className="p-6 flex gap-6">
                  <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 border border-white/5 ${notif.type === 'critical' ? 'bg-accent-amber/10 text-accent-amber' :
                    notif.type === 'system' ? 'bg-primary/10 text-primary' :
                      'bg-slate-800/50 text-slate-500'
                    }`}>
                    <span className="material-symbols-outlined text-2xl">{getIcon(notif.type)}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-base font-bold text-white tracking-tight">{notif.title}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-slate-500">{notif.timestamp}</span>
                        {notif.isUnread && (
                          <div className="size-2 bg-accent-amber rounded-full shadow-[0_0_8px_#f59e0b]"></div>
                        )}
                        {notif.type === 'critical' && (
                          <span className="px-2 py-0.5 bg-accent-amber/10 text-accent-amber text-[11px] font-black uppercase rounded border border-accent-amber/20">Urgent</span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed mb-4 max-w-2xl">{notif.description}</p>

                    <div className="flex items-center gap-24">
                      <div className="flex items-center gap-6">
                        {notif.metadata.map((meta, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm text-slate-600">
                              {meta.label === 'Trial' ? 'biotech' : meta.label === 'Site' ? 'location_on' : meta.label === 'Date' ? 'calendar_today' : 'groups'}
                            </span>
                            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">{meta.label}:</span>
                            <span className="text-[11px] text-slate-300 font-bold">{meta.value}</span>
                          </div>
                        ))}
                      </div>

                      {notif.actionLabel && (
                        <button
                          onClick={() => handleAction(notif)}
                          className="flex items-center gap-2 text-accent-amber hover:text-white text-[11px] font-black uppercase tracking-[0.2em] transition-all ml-auto"
                        >
                          {notif.actionLabel}
                          <span className="material-symbols-outlined text-sm">{notif.actionIcon}</span>
                        </button>
                      )}
                      {!notif.actionLabel && notif.type === 'system' && (
                        <button className="material-symbols-outlined text-slate-700 hover:text-white transition-colors ml-auto">more_horiz</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <button className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] hover:text-white transition-colors">Load older notifications</button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[380px] space-y-6">
          <div className="bg-[#111418] border border-slate-800 rounded-[2rem] p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="size-10 rounded-xl bg-accent-amber/10 flex items-center justify-center text-accent-amber border border-accent-amber/20">
                <span className="material-symbols-outlined text-2xl">settings_input_component</span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">Preferences</h2>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em]">Channel Settings</h3>

                {[
                  { id: 'safetyAlerts', label: 'Patient Safety Alerts', sub: 'Adverse events & SAEs' },
                  { id: 'protocolAmendments', label: 'Protocol Amendments', sub: 'Major & minor updates' },
                  { id: 'labResults', label: 'Lab Results', sub: 'Critical values only' },
                ].map((pref) => (
                  <div key={pref.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-slate-200">{pref.label}</p>
                      <p className="text-[11px] text-slate-500">{pref.sub}</p>
                    </div>
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, [pref.id]: !prev[pref.id as keyof typeof prev] }))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${preferences[pref.id as keyof typeof preferences] ? 'bg-accent-amber' : 'bg-slate-800'}`}
                    >
                      <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${preferences[pref.id as keyof typeof preferences] ? 'left-6' : 'left-1'}`}></div>
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800/50">
                <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em]">Delivery Methods</h3>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={preferences.email}
                      onChange={() => setPreferences(p => ({ ...p, email: !p.email }))}
                      className="size-4 bg-slate-800 border-slate-700 rounded text-accent-amber focus:ring-accent-amber/40"
                    />
                    <span className="text-[11px] font-black text-slate-400 group-hover:text-white uppercase tracking-widest">Email</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={preferences.push}
                      onChange={() => setPreferences(p => ({ ...p, push: !p.push }))}
                      className="size-4 bg-slate-800 border-slate-700 rounded text-accent-amber focus:ring-accent-amber/40"
                    />
                    <span className="text-[11px] font-black text-slate-400 group-hover:text-white uppercase tracking-widest">Push</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#111418] border border-slate-800 rounded-[2rem] p-8 relative overflow-hidden group shadow-2xl">
            {/* Background Decoration */}
            <div className="absolute -bottom-10 -right-10 size-48 bg-slate-900 rounded-full flex items-center justify-center opacity-20">
              <span className="text-9xl font-black text-slate-700 select-none">?</span>
            </div>

            <div className="relative z-10 space-y-4">
              <h3 className="text-xl font-black text-white tracking-tight">Need Help?</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                Contact the Research IT Support team for issues with receiving notifications.
              </p>
              <button className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-black text-white uppercase tracking-widest rounded-xl transition-all">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </Section>
    </PageContainer>
  );
};

export default Notifications;
