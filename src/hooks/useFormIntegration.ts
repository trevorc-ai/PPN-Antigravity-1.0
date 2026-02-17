import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useFormIntegration - Form State Management Hook
 * 
 * Features:
 * - Auto-save to localStorage every 30 seconds
 * - Offline queue for form submissions
 * - Sync when connection restored
 * - Form validation state management
 */

interface UseFormIntegrationOptions {
    formId: string;
    patientId: string;
    autoSaveInterval?: number; // milliseconds, default: 30000 (30s)
    onSubmit?: (data: any) => Promise<void>;
}

interface UseFormIntegrationReturn {
    formData: any;
    updateField: (field: string, value: any) => void;
    submitForm: () => Promise<void>;
    isSaving: boolean;
    lastSaved: Date | null;
    isOnline: boolean;
    isDirty: boolean;
}

export const useFormIntegration = ({
    formId,
    patientId,
    autoSaveInterval = 30000,
    onSubmit
}: UseFormIntegrationOptions): UseFormIntegrationReturn => {
    const [formData, setFormData] = useState<any>({});
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isDirty, setIsDirty] = useState(false);

    const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
    const storageKey = `form_${formId}_${patientId}`;
    const queueKey = `form_queue_${formId}_${patientId}`;

    // Load saved data from localStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setFormData(parsed.data);
                setLastSaved(new Date(parsed.timestamp));
            } catch (error) {
                console.error('Failed to load saved form data:', error);
            }
        }
    }, [storageKey]);

    // Monitor online/offline status
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            syncOfflineQueue();
        };
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Auto-save to localStorage
    const autoSave = useCallback(() => {
        if (isDirty) {
            const dataToSave = {
                data: formData,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem(storageKey, JSON.stringify(dataToSave));
            setLastSaved(new Date());
            setIsDirty(false);
            setIsSaving(false);
        }
    }, [formData, isDirty, storageKey]);

    // Set up auto-save timer
    useEffect(() => {
        if (isDirty) {
            setIsSaving(true);
            autoSaveTimerRef.current = setTimeout(autoSave, autoSaveInterval);
        }

        return () => {
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }
        };
    }, [isDirty, autoSave, autoSaveInterval]);

    // Update field
    const updateField = useCallback((field: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [field]: value
        }));
        setIsDirty(true);
    }, []);

    // Sync offline queue
    const syncOfflineQueue = useCallback(async () => {
        const queuedData = localStorage.getItem(queueKey);
        if (queuedData && onSubmit) {
            try {
                const parsed = JSON.parse(queuedData);
                await onSubmit(parsed);
                localStorage.removeItem(queueKey);
                console.log('✅ Offline form synced successfully');
            } catch (error) {
                console.error('Failed to sync offline form:', error);
            }
        }
    }, [queueKey, onSubmit]);

    // Submit form
    const submitForm = useCallback(async () => {
        setIsSaving(true);

        try {
            if (isOnline && onSubmit) {
                // Submit directly if online
                await onSubmit(formData);
                // Clear localStorage after successful submission
                localStorage.removeItem(storageKey);
                setLastSaved(new Date());
                setIsDirty(false);
            } else {
                // Queue for later if offline
                localStorage.setItem(queueKey, JSON.stringify(formData));
                console.log('📴 Form queued for sync when online');
            }
        } catch (error) {
            console.error('Form submission failed:', error);
            // Queue for retry
            localStorage.setItem(queueKey, JSON.stringify(formData));
        } finally {
            setIsSaving(false);
        }
    }, [formData, isOnline, onSubmit, storageKey, queueKey]);

    return {
        formData,
        updateField,
        submitForm,
        isSaving,
        lastSaved,
        isOnline,
        isDirty
    };
};
