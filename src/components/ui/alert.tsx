'use client';

import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react';
import { Button } from './button';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  description?: string;
  onClose?: () => void;
  className?: string;
}

export function Alert({ 
  type, 
  title, 
  description, 
  onClose, 
  className = '' 
}: AlertProps) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  };

  const colors = {
    success: 'border-green-500/20 bg-green-500/10 text-green-400',
    error: 'border-red-500/20 bg-red-500/10 text-red-400',
    warning: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400',
    info: 'border-blue-500/20 bg-blue-500/10 text-blue-400'
  };

  const Icon = icons[type];

  return (
    <div className={`glass-card border ${colors[type]} ${className}`}>
      <div className="flex items-start space-x-3 p-4">
        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="text-sm font-medium mb-1">{title}</h3>
          )}
          {description && (
            <p className="text-sm opacity-90">{description}</p>
          )}
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-current hover:bg-current/10"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export function Toast({ 
  id, 
  type, 
  title, 
  description, 
  duration = 5000,
  onClose 
}: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Alert
        type={type}
        title={title}
        description={description}
        onClose={() => onClose(id)}
        className="lavender-glow"
      />
    </div>
  );
}
