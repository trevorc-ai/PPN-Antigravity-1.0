import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

interface PatientLogEvent {
    timestamp: string;
    feeling: string;
}

const FEELINGS = [
    { id: 'blissful', label: 'Blissful', color: 'bg-emerald-500/20 text-emerald-100 border-emerald-500/50 hover:bg-emerald-500/40' },
    { id: 'anxious', label: 'Anxious', color: 'bg-amber-500/20 text-amber-100 border-amber-500/50 hover:bg-amber-500/40' },
    { id: 'drifting', label: 'Drifting/Floating', color: 'bg-indigo-500/20 text-indigo-100 border-indigo-500/50 hover:bg-indigo-500/40' },
    { id: 'nauseous', label: 'Nauseous', color: 'bg-red-500/20 text-red-100 border-red-500/50 hover:bg-red-500/40' },
    { id: 'grounded', label: 'Grounded/Safe', color: 'bg-teal-500/20 text-teal-100 border-teal-500/50 hover:bg-teal-500/40' },
    { id: 'tense', label: 'Tense/Resistance', color: 'bg-rose-500/20 text-rose-100 border-rose-500/50 hover:bg-rose-500/40' },
];

const VIDEOS = [
    '/admin_uploads/spherecules_vids/Spherecules_01.mp4',
    '/admin_uploads/spherecules_vids/Spherecules_02.mp4',
    '/admin_uploads/spherecules_vids/Spherecules_03.mp4',
    '/admin_uploads/spherecules_vids/Spherecules_04.mp4',
    '/admin_uploads/spherecules_vids/Spherecules_05.mp4',
    '/admin_uploads/spherecules_vids/Spherecules_06.mp4'
];

export default function PatientCompanionPage() {
    const { sessionId } = useParams();
    const navigate = useNavigate();

    // UI State
    const [activeVideoIndex, setActiveVideoIndex] = useState(0);
    const [recentLog, setRecentLog] = useState<string | null>(null);
    const [lockHoldProgress, setLockHoldProgress] = useState(0);

    // Hold to unlock logic
    const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const handleLogFeeling = (feelingId: string, feelingLabel: string) => {
        // 1. Get existing logs
        const storageKey = `companion_logs_${sessionId}`;
        const existingLogsStr = localStorage.getItem(storageKey);
        const logs: PatientLogEvent[] = existingLogsStr ? JSON.parse(existingLogsStr) : [];

        // 2. Append new log
        logs.push({
            timestamp: new Date().toISOString(),
            feeling: feelingId
        });

        // 3. Save back
        localStorage.setItem(storageKey, JSON.stringify(logs));

        // 4. Visual Feedback
        setRecentLog(feelingLabel);
        setTimeout(() => setRecentLog(null), 3000);

        // 5. Shift background video to match the changing state
        setActiveVideoIndex((prev) => (prev + 1) % VIDEOS.length);
    };

    // Hold Lock for 3 seconds to exit
    const startUnlock = () => {
        let progress = 0;

        // Update circular progress visual
        progressIntervalRef.current = setInterval(() => {
            progress += 5; // 5% every 150ms = 3 seconds to 100%
            if (progress <= 100) {
                setLockHoldProgress(progress);
            }
        }, 150);

        // Actual unlock timer
        holdTimerRef.current = setTimeout(() => {
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            // End session companion, return to journey
            navigate('/wellness-journey');
        }, 3000);
    };

    const cancelUnlock = () => {
        if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        setLockHoldProgress(0);
    };

    return (
        <div className="fixed inset-0 bg-black overflow-hidden flex flex-col justify-between selection:bg-transparent tracking-wide">
            {/* Ambient Background Loop */}
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-80 pointer-events-none mix-blend-screen scale-110">
                <video
                    key={VIDEOS[activeVideoIndex]}
                    src={VIDEOS[activeVideoIndex]}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover sm:object-contain fade-in transition-opacity duration-1000"
                />
            </div>

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-10 pointer-events-none" />

            {/* Practitioner Safe-Exit Button (Top Right) */}
            <div className="absolute top-6 right-6 z-50">
                <button
                    onMouseDown={startUnlock}
                    onMouseUp={cancelUnlock}
                    onMouseLeave={cancelUnlock}
                    onTouchStart={startUnlock}
                    onTouchEnd={cancelUnlock}
                    className="relative w-14 h-14 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/30 backdrop-blur-md active:bg-white/10 transition-colors group"
                >
                    <Lock className="w-5 h-5 group-active:text-white/80 transition-colors" />
                    {/* SVG Circular Progress Ring */}
                    {lockHoldProgress > 0 && (
                        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                            <circle
                                cx="28"
                                cy="28"
                                r="26"
                                fill="none"
                                stroke="rgba(255,255,255,0.4)"
                                strokeWidth="2"
                                strokeDasharray="163"
                                strokeDashoffset={163 - (163 * lockHoldProgress) / 100}
                                className="transition-all duration-150 ease-linear"
                            />
                        </svg>
                    )}
                </button>
            </div>

            {/* Visual Feedback Toast */}
            <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 z-40 transition-all duration-700 ease-out ${recentLog ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
                <div className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
                    <p className="text-2xl font-black tracking-widest text-white/90 uppercase">
                        {recentLog}
                    </p>
                </div>
            </div>

            {/* Top Prompt */}
            <div className="relative z-20 pt-16 pb-8 px-8 text-center pointer-events-none">
                <h1 className="text-3xl md:text-5xl font-bold text-white/50 tracking-widest font-mono">
                    HOW ARE YOU FEELING?
                </h1>
                <p className="text-white/30 text-lg sm:text-xl mt-4 max-w-xl mx-auto tracking-wide">
                    Tap a button below to quietly log your state without speaking.
                </p>
            </div>

            {/* Interactive Grid (Bottom anchored) */}
            <div className="relative z-20 pb-16 px-6 sm:px-12 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    {FEELINGS.map((feeeling) => (
                        <button
                            key={feeeling.id}
                            onClick={() => handleLogFeeling(feeeling.id, feeeling.label)}
                            className={`
                                ${feeeling.color}
                                backdrop-blur-2xl border-2 rounded-3xl p-6 sm:p-10 
                                transition-all duration-300 transform active:scale-95 active:brightness-150
                                flex flex-col items-center justify-center shadow-2xl
                            `}
                        >
                            <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-wider uppercase text-center shadow-black/20 drop-shadow-lg">
                                {feeeling.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
