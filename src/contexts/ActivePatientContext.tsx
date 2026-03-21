/**
 * ActivePatientContext — WO-B1: Cross-page patient navigation context.
 *
 * PURPOSE: Provide a lightweight global context that carries the "currently
 * selected patient" as the practitioner navigates between Protocol Detail,
 * Wellness Journey, Analytics, and Sidebar links.
 *
 * CRITICAL DESIGN RULES (per STABILIZATION_BRIEF.md Section 5 + UI_UX_GUARDRAILS.md):
 * 1. URL param `?patientUuid=` CARRIES navigation metadata — it does NOT define clinical state.
 * 2. Clinical source of truth for phase, cycle, and session is ALWAYS the database.
 * 3. Never derive sessionId, phase, or cycleNumber from the URL param.
 * 4. If patientUuid from URL doesn't resolve to a real DB patient, callers must clear
 *    context and show the selection modal.
 *
 * PATTERN: HashRouter-aware. URL is `/#/route?patientUuid=<uuid>`.
 * The hash fragment is parsed to extract the query string correctly.
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// ============================================================================
// TYPES
// ============================================================================

export interface ActivePatientContextValue {
    /** Canonical patient UUID (from log_patient_site_links). Null when no patient selected. */
    activePatientUuid: string | null;
    /**
     * Most recently active session ID for this patient. Optional — may not be known
     * at the time of context set (e.g., navigating from Protocol Detail before a session
     * exists). Always verify this against the DB before using; treat as a navigation hint only.
     */
    activeSessionId: string | null;
    /**
     * Set the active patient. Writes ?patientUuid= to the URL so navigation context
     * survives page refresh, browser back, and deep-linking.
     * @param uuid         Canonical patient UUID (or null to clear)
     * @param sessionId    Optional: active session ID to carry as a navigation hint
     */
    setActivePatient: (uuid: string | null, sessionId?: string | null) => void;
    /** Clear context and remove URL param. Used when patient selection is reset. */
    clearActivePatient: () => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

const ActivePatientContext = createContext<ActivePatientContextValue>({
    activePatientUuid: null,
    activeSessionId: null,
    setActivePatient: () => {},
    clearActivePatient: () => {},
});

// ============================================================================
// URL HELPERS (HashRouter-aware)
// ============================================================================

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Extract `?patientUuid=` from a HashRouter URL.
 * HashRouter format: `/#/route?param=value`
 * The hash is `#/route?param=value`, so we split on `?`.
 */
function readPatientUuidFromHash(hash: string): string | null {
    try {
        const queryPart = hash.includes('?') ? hash.split('?')[1] : '';
        const uuid = new URLSearchParams(queryPart).get('patientUuid');
        if (uuid && UUID_RE.test(uuid)) return uuid;
    } catch { /* ignore */ }
    return null;
}

// ============================================================================
// PROVIDER
// ============================================================================

export const ActivePatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // ── Initialize from URL on first mount ─────────────────────────────────
    // Read ?patientUuid= from hash fragment so a page refresh or bookmark
    // restores the practitioner's context without requiring re-selection.
    const [activePatientUuid, setActivePatientUuidState] = useState<string | null>(() => {
        return readPatientUuidFromHash(window.location.hash);
    });
    const [activeSessionId, setActiveSessionIdState] = useState<string | null>(null);

    // ── Keep context in sync when the URL changes externally ───────────────
    // (e.g. browser back button, NavLink clicks, deep-links from another tab)
    useEffect(() => {
        const uuidFromHash = readPatientUuidFromHash(window.location.hash);
        if (uuidFromHash !== activePatientUuid) {
            setActivePatientUuidState(uuidFromHash);
            // Don't clear sessionId on a hash change — it may still be valid
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    // ── setActivePatient ───────────────────────────────────────────────────
    const setActivePatient = useCallback((uuid: string | null, sessionId?: string | null) => {
        setActivePatientUuidState(uuid);
        setActiveSessionIdState(sessionId ?? null);

        if (!uuid) {
            // Remove patientUuid from URL without altering the rest of the query string
            const hash = window.location.hash;
            const [hashPath, hashQuery = ''] = hash.split('?');
            const params = new URLSearchParams(hashQuery);
            params.delete('patientUuid');
            const newQuery = params.toString();
            const newHash = newQuery ? `${hashPath}?${newQuery}` : hashPath;
            // Replace history entry — don't push a new one just for clearing context
            window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${newHash}`);
            return;
        }

        if (!UUID_RE.test(uuid)) {
            console.warn('[ActivePatientContext] setActivePatient: invalid UUID, context not set:', uuid);
            return;
        }

        // Write patientUuid into current URL's query params (additive — preserve other params).
        // Use navigate() so React Router updates location and HashRouter re-renders correctly.
        const currentSearch = location.search;
        const params = new URLSearchParams(currentSearch);
        params.set('patientUuid', uuid);
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }, [location, navigate]);

    // ── clearActivePatient ─────────────────────────────────────────────────
    const clearActivePatient = useCallback(() => {
        setActivePatient(null);
    }, [setActivePatient]);

    return (
        <ActivePatientContext.Provider value={{
            activePatientUuid,
            activeSessionId,
            setActivePatient,
            clearActivePatient,
        }}>
            {children}
        </ActivePatientContext.Provider>
    );
};

// ============================================================================
// HOOK
// ============================================================================

export const useActivePatient = (): ActivePatientContextValue => useContext(ActivePatientContext);
