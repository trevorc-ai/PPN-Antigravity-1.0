import React, { useState } from 'react';

interface InstantConnectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const InstantConnectModal: React.FC<InstantConnectModalProps> = ({ isOpen, onClose }) => {
    const [phoneFallback, setPhoneFallback] = useState('');
    const [showSMS, setShowSMS] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a1628]/80 backdrop-blur-md animate-in fade-in duration-200 p-4">
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={onClose}></div>

            <div className="relative bg-[#0c1a30] border border-[#388bfd]/30 rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden p-8 flex flex-col items-center">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[#889aab] hover:text-[#388bfd] transition-colors"
                >
                    <span className="material-symbols-outlined text-[24px]">close</span>
                </button>

                {/* Modal Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#388bfd]/10 border border-[#388bfd]/30 mb-4">
                        <span className="material-symbols-outlined text-[24px] text-[#388bfd]">devices</span>
                    </div>
                    <h2 className="text-2xl font-black text-[#9fb0be] mb-2 tracking-tight">Instant Connect</h2>
                    <p className="text-sm text-[#889aab]">
                        Scan with your phone to instantly transfer your session. No login required.
                    </p>
                </div>

                {/* The Magic QR Code (MVP Dummy) */}
                <div className="relative p-4 rounded-3xl border-2 border-[#388bfd]/20 bg-white shadow-[0_0_30px_rgba(56,139,253,0.15)] mb-8 transition-transform hover:scale-105 duration-300">
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#3fb950] border-4 border-[#0c1a30] flex items-center justify-center animate-bounce">
                        <span className="material-symbols-outlined text-[16px] text-[#0c1a30] font-bold">qr_code_scanner</span>
                    </div>
                    <svg className="w-48 h-48 text-[#0a1628]" viewBox="0 0 24 24" fill="currentColor">
                        {/* Dummy SVG pattern resembling a dense QR code */}
                        <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 15h6v6H3v-6zm2 2v2h2v-2H5zm8-4h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm-6-2h2v2h-2v-2zm0-4h2v2h-2V9zm4-2h2v2h-2V7z" />
                        {/* Some generic scatter boxes to look like a payload */}
                        <rect x="13" y="11" width="2" height="2" />
                        <rect x="15" y="15" width="2" height="2" />
                        <rect x="19" y="11" width="2" height="2" />
                        <rect x="11" y="19" width="2" height="2" />
                        <rect x="15" y="19" width="2" height="2" />
                        <rect x="19" y="7" width="2" height="2" />
                    </svg>
                </div>

                {/* PWA Prompt Suggestion */}
                <div className="w-full bg-[#112340] border border-[#388bfd]/20 rounded-xl p-4 mb-6 flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#388bfd] text-[20px] mt-0.5">add_to_home_screen</span>
                    <div>
                        <p className="text-xs font-bold text-[#9fb0be]">Progressive Web App</p>
                        <p className="text-[11px] text-[#889aab] mt-1 leading-relaxed">
                            Upon scanning, tap <strong>"Add to Home Screen"</strong> on your device for a 1-click native app experience.
                        </p>
                    </div>
                </div>

                {/* SMS Fallback Toggle */}
                <div className="w-full">
                    {!showSMS ? (
                        <button
                            onClick={() => setShowSMS(true)}
                            className="w-full py-3 rounded-xl border border-[#4a5568] hover:border-[#388bfd] text-sm font-bold text-[#889aab] hover:text-[#388bfd] transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">sms</span>
                            Text this to my phone instead
                        </button>
                    ) : (
                        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                            <label className="text-xs font-bold tracking-widest text-[#889aab] uppercase block">
                                Mobile Number
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="tel"
                                    placeholder="(555) 000-0000"
                                    value={phoneFallback}
                                    onChange={(e) => setPhoneFallback(e.target.value)}
                                    className="flex-1 bg-[#112340] border border-[#388bfd]/30 rounded-xl px-4 py-3 text-sm font-bold text-[#9fb0be] placeholder:text-[#4a5568] focus:outline-none focus:border-[#388bfd] transition-colors"
                                />
                                <button
                                    onClick={() => {
                                        // MVP Dummy Action
                                        setPhoneFallback('');
                                        setShowSMS(false);
                                        alert('Magic link sent to phone!');
                                    }}
                                    className="px-5 py-3 bg-[#388bfd] hover:bg-[#2070d0] text-white text-sm font-bold rounded-xl shadow-[0_0_15px_rgba(56,139,253,0.3)] transition-all"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InstantConnectModal;
