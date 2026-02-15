import React, { useState, useRef, useEffect } from 'react';

interface TacticalButtonProps {
    label: string;
    color: 'green' | 'amber' | 'orange' | 'red';
    requireLongPress?: boolean;
    longPressDuration?: number; // milliseconds
    onPress: () => void;
}

const COLOR_MAP = {
    green: '#10b981',
    amber: '#f59e0b',
    orange: '#f97316',
    red: '#dc2626'
};

export const TacticalButton: React.FC<TacticalButtonProps> = ({
    label,
    color,
    requireLongPress = false,
    longPressDuration = 2000,
    onPress
}) => {
    const [isPressed, setIsPressed] = useState(false);
    const [progress, setProgress] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const clearTimers = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
    };

    const handlePressStart = () => {
        setIsPressed(true);

        if (requireLongPress) {
            // Start progress animation
            setProgress(0);
            const startTime = Date.now();

            progressIntervalRef.current = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const newProgress = Math.min((elapsed / longPressDuration) * 100, 100);
                setProgress(newProgress);
            }, 50);

            // Trigger action after long press duration
            timerRef.current = setTimeout(() => {
                triggerHaptic();
                onPress();
                setIsPressed(false);
                setProgress(0);
                clearTimers();
            }, longPressDuration);
        }
    };

    const handlePressEnd = () => {
        if (requireLongPress) {
            // Cancel long press if released early
            clearTimers();
            setProgress(0);
        } else {
            // Immediate trigger for non-long-press buttons
            triggerHaptic();
            onPress();
        }
        setIsPressed(false);
    };

    const handlePressCancel = () => {
        clearTimers();
        setIsPressed(false);
        setProgress(0);
    };

    const triggerHaptic = () => {
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    };

    useEffect(() => {
        return () => clearTimers();
    }, []);

    return (
        <button
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressCancel}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            onTouchCancel={handlePressCancel}
            style={{
                position: 'relative',
                minHeight: '100px',
                backgroundColor: COLOR_MAP[color],
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'transform 0.1s, opacity 0.1s',
                transform: isPressed ? 'scale(0.95)' : 'scale(1)',
                opacity: isPressed ? 0.9 : 1,
                overflow: 'hidden',
                userSelect: 'none',
                WebkitTapHighlightColor: 'transparent'
            }}
        >
            {/* Progress indicator for long press */}
            {requireLongPress && isPressed && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        height: '4px',
                        width: `${progress}%`,
                        backgroundColor: '#ffffff',
                        transition: 'width 0.05s linear'
                    }}
                />
            )}

            {/* Circular progress indicator */}
            {requireLongPress && isPressed && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        border: '4px solid rgba(255, 255, 255, 0.3)',
                        borderTop: '4px solid #ffffff',
                        animation: 'spin 1s linear infinite'
                    }}
                />
            )}

            <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>

            <style>
                {`
          @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
          }
        `}
            </style>
        </button>
    );
};
