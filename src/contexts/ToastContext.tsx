import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Toast } from '../types';

interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast: Toast = { ...toast, id };

        setToasts((prev) => [...prev, newToast]);

        // Auto-dismiss
        if (toast.duration !== 0) {
            setTimeout(() => {
                removeToast(id);
            }, toast.duration || 5000);
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    // Bridge: allow components outside the React tree (or deep descendant components
    // that don't import useToast) to surface toasts by dispatching a global CustomEvent.
    // Usage: window.dispatchEvent(new CustomEvent('ppn:toast', { detail: { title, message, type } }))
    useEffect(() => {
        const handleGlobalToast = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            if (detail?.title || detail?.message) {
                addToast({
                    title: detail.title ?? '',
                    message: detail.message ?? '',
                    type: detail.type ?? 'info',
                });
            }
        };
        window.addEventListener('ppn:toast', handleGlobalToast);
        return () => window.removeEventListener('ppn:toast', handleGlobalToast);
    }, [addToast]);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
