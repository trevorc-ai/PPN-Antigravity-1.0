import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { hashPhoneNumber, formatPhoneNumber } from '../../utils/crypto';

interface BlindVettingProps {
    onCheckComplete?: (isSafe: boolean) => void;
}

type CheckResult = 'safe' | 'flagged' | null;

export const BlindVetting: React.FC<BlindVettingProps> = ({ onCheckComplete }) => {
    const [phoneInput, setPhoneInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CheckResult>(null);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        setPhoneInput(formatted);
    };

    const handleCheck = async () => {
        if (phoneInput.replace(/\D/g, '').length !== 10) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // Hash phone number client-side
            const hashedPhone = await hashPhoneNumber(phoneInput);

            // Call RPC function with hash only
            const { data, error: rpcError } = await supabase.rpc('check_client_risk', {
                client_hash: hashedPhone
            });

            if (rpcError) throw rpcError;

            // Determine result
            const isSafe = data?.risk_count === 0;
            setResult(isSafe ? 'safe' : 'flagged');

            // Clear input for privacy
            setPhoneInput('');

            // Callback
            if (onCheckComplete) {
                onCheckComplete(isSafe);
            }
        } catch (err) {
            console.error('Error checking client risk:', err);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !loading) {
            handleCheck();
        }
    };

    return (
        <div style={{
            backgroundColor: '#0a0a0a',
            padding: '32px',
            borderRadius: '8px',
            maxWidth: '500px',
            margin: '0 auto',
            border: '1px solid #1a1a1a',
            fontFamily: 'Monaco, Courier New, monospace'
        }}>
            {/* Header */}
            <div style={{
                color: '#00ff00',
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '24px',
                textAlign: 'center',
                letterSpacing: '0.1em'
            }}>
                CLIENT SECURITY CHECK
            </div>

            {/* Phone Input */}
            <div style={{ marginBottom: '20px' }}>
                <label
                    htmlFor="phone-input"
                    style={{
                        display: 'block',
                        color: '#33ff33',
                        marginBottom: '8px',
                        fontSize: '14px',
                        letterSpacing: '0.05em'
                    }}
                >
                    PHONE NUMBER
                </label>
                <input
                    id="phone-input"
                    type="tel"
                    value={phoneInput}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="(XXX) XXX-XXXX"
                    disabled={loading}
                    style={{
                        width: '100%',
                        minHeight: '44px',
                        padding: '12px',
                        backgroundColor: '#000000',
                        color: '#00ff00',
                        border: '2px solid #1a1a1a',
                        borderRadius: '4px',
                        fontSize: '18px',
                        fontFamily: 'Monaco, Courier New, monospace',
                        outline: 'none'
                    }}
                    aria-label="Phone number input for security check"
                />
            </div>

            {/* Check Button */}
            <button
                onClick={handleCheck}
                disabled={loading || phoneInput.replace(/\D/g, '').length !== 10}
                style={{
                    width: '100%',
                    minHeight: '44px',
                    padding: '12px',
                    backgroundColor: loading || phoneInput.replace(/\D/g, '').length !== 10 ? '#1a1a1a' : '#00ff00',
                    color: loading || phoneInput.replace(/\D/g, '').length !== 10 ? '#666666' : '#000000',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: loading || phoneInput.replace(/\D/g, '').length !== 10 ? 'not-allowed' : 'pointer',
                    fontFamily: 'Monaco, Courier New, monospace',
                    letterSpacing: '0.1em',
                    marginBottom: '20px'
                }}
            >
                {loading ? 'CHECKING...' : 'RUN CHECK'}
            </button>

            {/* Result Display */}
            {result && (
                <div
                    style={{
                        padding: '20px',
                        borderRadius: '4px',
                        backgroundColor: result === 'safe' ? '#065f46' : '#7f1d1d',
                        border: `2px solid ${result === 'safe' ? '#22c55e' : '#ef4444'}`,
                        marginBottom: '20px',
                        textAlign: 'center'
                    }}
                    role="status"
                    aria-live="polite"
                >
                    <div style={{
                        fontSize: '48px',
                        marginBottom: '8px'
                    }}>
                        {result === 'safe' ? '🛡️' : '⚠️'}
                    </div>
                    <div style={{
                        color: result === 'safe' ? '#22c55e' : '#ef4444',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        letterSpacing: '0.1em'
                    }}>
                        {result === 'safe' ? 'SAFE - NO FLAGS' : 'FLAGGED - RISK DETECTED'}
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div style={{
                    backgroundColor: '#7f1d1d',
                    color: '#fecaca',
                    padding: '12px',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    fontSize: '14px',
                    textAlign: 'center'
                }}>
                    {error}
                </div>
            )}

            {/* Privacy Disclaimer */}
            <div style={{
                backgroundColor: '#1a1a1a',
                padding: '16px',
                borderRadius: '4px',
                border: '1px solid #2a2a2a'
            }}>
                <div style={{
                    color: '#f59e0b',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    letterSpacing: '0.05em'
                }}>
                    ⚠️ PRIVACY NOTICE
                </div>
                <div style={{
                    color: '#94a3b8',
                    fontSize: '11px',
                    lineHeight: '1.5'
                }}>
                    Input is hashed locally using SHA-256. No personally identifiable
                    information is sent to the server. This check queries a blind database
                    of anonymized risk flags only.
                </div>
            </div>
        </div>
    );
};
