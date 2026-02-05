'use client';

import { useEffect } from 'react';
import { XMarkIcon, BellAlertIcon } from '@heroicons/react/24/outline';

export interface Toast {
  id: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastNotificationProps {
  toast: Toast;
  onClose: (id: string) => void;
}

export function ToastNotification({ toast, onClose }: ToastNotificationProps) {
  useEffect(() => {
    const duration = toast.duration || 8000;
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const bgColor = {
    info: 'bg-blue-50 border-blue-500',
    success: 'bg-green-50 border-green-500',
    warning: 'bg-amber-50 border-amber-500',
    error: 'bg-red-50 border-red-500'
  }[toast.type || 'info'];

  const textColor = {
    info: 'text-blue-900',
    success: 'text-green-900',
    warning: 'text-amber-900',
    error: 'text-red-900'
  }[toast.type || 'info'];

  return (
    <div className={`${bgColor} ${textColor} border-l-4 rounded-lg shadow-lg p-4 min-w-[320px] max-w-md animate-slide-in-right`}>
      <div className="flex items-start gap-3">
        <BellAlertIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold mb-1">{toast.title}</h4>
          <p className="text-sm">{toast.message}</p>
          {toast.action && (
            <button
              onClick={() => {
                toast.action?.onClick();
                onClose(toast.id);
              }}
              className="mt-2 text-sm font-semibold underline hover:no-underline"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        <button
          onClick={() => onClose(toast.id)}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      <div className="pointer-events-auto">
        {toasts.map((toast) => (
          <div key={toast.id} className="mb-3">
            <ToastNotification toast={toast} onClose={onClose} />
          </div>
        ))}
      </div>
    </div>
  );
}
