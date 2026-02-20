import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div
            className="fixed top-24 right-6 z-50 flex flex-col gap-3 w-full max-w-md pointer-events-none"
            role="region"
            aria-live="polite"
        >
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: -16, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -16, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`
              pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md
              ${toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : ''}
              ${toast.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : ''}
              ${toast.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : ''}
              ${toast.type === 'info' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : ''}
            `}
                    >
                        <div className="mt-0.5 shrink-0">
                            {toast.type === 'success' && <CheckCircle size={20} />}
                            {toast.type === 'error' && <AlertCircle size={20} />}
                            {toast.type === 'warning' && <AlertTriangle size={20} />}
                            {toast.type === 'info' && <Info size={20} />}
                        </div>

                        <div className="flex-1 text-sm font-medium leading-relaxed">
                            {toast.message}
                        </div>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="mt-0.5 p-1 hover:bg-white/10 rounded-lg transition-colors"
                            aria-label="Dismiss notification"
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
