'use client';
/**
 * Toast Notification System
 *
 * Usage:
 *   import { useToast } from '~/components/utility/Toast';
 *   const toast = useToast();
 *   toast.success('Saved!');
 *   toast.error('Something went wrong');
 *   toast.info('Did you know...');
 *   toast.warning('Unsaved changes');
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert, { type AlertColor } from '@mui/material/Alert';
import Slide, { type SlideProps } from '@mui/material/Slide';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { v4 as uuid } from 'crypto'; // use crypto.randomUUID instead

interface ToastItem {
    id: string;
    message: string;
    severity: AlertColor;
    duration?: number;
}

interface ToastContextValue {
    success: (msg: string, duration?: number) => void;
    error:   (msg: string, duration?: number) => void;
    info:    (msg: string, duration?: number) => void;
    warning: (msg: string, duration?: number) => void;
    show:    (msg: string, severity?: AlertColor, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="up" />;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const show = useCallback((message: string, severity: AlertColor = 'info', duration = 4000) => {
        const id = crypto.randomUUID();
        setToasts(prev => [...prev, { id, message, severity, duration }]);
    }, []);

    const dismiss = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const value: ToastContextValue = {
        success: (m, d) => show(m, 'success', d),
        error:   (m, d) => show(m, 'error', d),
        info:    (m, d) => show(m, 'info', d),
        warning: (m, d) => show(m, 'warning', d),
        show,
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            {toasts.map((toast, i) => (
                <Snackbar
                    key={toast.id}
                    open
                    autoHideDuration={toast.duration ?? 4000}
                    onClose={() => dismiss(toast.id)}
                    TransitionComponent={SlideTransition}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    sx={{ bottom: { xs: 16 + i * 72, sm: 24 + i * 72 } }}
                >
                    <Alert
                        severity={toast.severity}
                        variant="filled"
                        sx={{ minWidth: 280, boxShadow: 4, borderRadius: 2 }}
                        action={
                            <IconButton size="small" color="inherit" onClick={() => dismiss(toast.id)}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        }
                    >
                        {toast.message}
                    </Alert>
                </Snackbar>
            ))}
        </ToastContext.Provider>
    );
}

export function useToast(): ToastContextValue {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
    return ctx;
}
