'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastType } from './Toast';

export interface ToastOptions {
  title?: string;
  action?: { label: string; onClick: () => void };
  duration?: number;
}

interface ToastData {
  id: string;
  message: string;
  type: ToastType;
  title?: string;
  action?: { label: string; onClick: () => void };
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType, options?: ToastOptions) => void;
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((message: string, type: ToastType, options?: ToastOptions) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type, ...options }]);
  }, []);

  const success = useCallback((message: string, options?: ToastOptions) => showToast(message, 'success', options), [showToast]);
  const error = useCallback((message: string, options?: ToastOptions) => showToast(message, 'error', options), [showToast]);
  const warning = useCallback((message: string, options?: ToastOptions) => showToast(message, 'warning', options), [showToast]);
  const info = useCallback((message: string, options?: ToastOptions) => showToast(message, 'info', options), [showToast]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      <div className="fixed top-20 left-4 right-4 md:left-auto md:right-4 md:w-auto md:max-w-md z-[9999] flex flex-col gap-3 pointer-events-none">
        <div className="pointer-events-auto">
          {toasts.map(({ id, message, type, title, action, duration }) => {
            const extra: Pick<Parameters<typeof Toast>[0], 'title' | 'action' | 'duration'> = {};
            if (title !== undefined) extra.title = title;
            if (action !== undefined) extra.action = action;
            if (duration !== undefined) extra.duration = duration;
            return (
              <div key={id} className="mb-3">
                <Toast message={message} type={type} onClose={() => removeToast(id)} {...extra} />
              </div>
            );
          })}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
