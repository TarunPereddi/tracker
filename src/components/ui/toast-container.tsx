'use client';

import { Toast } from './alert';
import { useToast, Toast as ToastType } from '@/hooks/use-toast';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast: ToastType) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          description={toast.description}
          duration={toast.duration}
          onClose={removeToast}
        />
      ))}
    </div>
  );
}
