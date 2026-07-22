import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useStore } from '../store/useStore';

// ==========================================
// 1. Toast Notification Component
// ==========================================
export const ToastNotification: React.FC = () => {
  const { toast, hideToast } = useStore();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        hideToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="fixed bottom-24 left-4 right-4 z-50 mx-auto max-w-sm overflow-hidden rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl md:bottom-6 md:right-6 md:left-auto md:max-w-md"
        >
          <div className={`flex items-start gap-3 p-4 ${
            toast.type === 'success' ? 'bg-emerald-500/10 dark:bg-emerald-500/5' :
            toast.type === 'error' ? 'bg-rose-500/10 dark:bg-rose-500/5' :
            'bg-amber-500/10 dark:bg-amber-500/5'
          }`}>
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-emerald-500" />}
              {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-rose-500" />}
              {toast.type === 'info' && <Info className="h-5 w-5 text-amber-500" />}
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {toast.message}
              </p>
            </div>

            <button
              onClick={hideToast}
              className="rounded-lg p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-zinc-800 dark:hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ==========================================
// 2. GlassCard Component
// ==========================================
interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  hoverable = false, 
  className = '', 
  ...props 
}) => {
  return (
    <div
      className={`glass-panel rounded-3xl p-5 shadow-xl transition-all duration-300 ${
        hoverable ? 'hover:-translate-y-1 hover:shadow-2xl dark:hover:bg-white/[0.04] hover:bg-black/[0.01]' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// ==========================================
// 3. Premium Interactive Button Component
// ==========================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
  
  const variants = {
    primary: "bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 text-black font-semibold shadow-lg shadow-amber-500/20",
    secondary: "bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white border border-zinc-700/50",
    outline: "border border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-850 text-gray-700 dark:text-gray-250",
    danger: "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-zinc-800/50 dark:hover:text-gray-150"
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base"
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      disabled={disabled}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};

// ==========================================
// 4. Responsive Drawer / Modal Component
// ==========================================
interface DrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const DrawerModal: React.FC<DrawerModalProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
          />

          {/* Drawer / Modal Container */}
          {/* Mobile: slide-up drawer. Desktop: center modal */}
          <motion.div
            initial={{ y: '100%', x: 0, opacity: 1 }}
            animate={{ y: 0, x: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="fixed right-0 bottom-0 left-0 z-50 flex max-h-[85vh] flex-col rounded-t-[2.5rem] bg-white p-6 shadow-2xl dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 md:bottom-auto md:left-1/2 md:top-1/2 md:max-h-[90vh] md:w-[480px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl md:border md:border-gray-250/20"
          >
            {/* Grab handle for mobile */}
            <div className="mx-auto mb-4 h-1 w-12 shrink-0 rounded-full bg-gray-300 dark:bg-zinc-700 md:hidden" />

            <div className="mb-4 flex items-center justify-between">
              {title && (
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                  {title}
                </h3>
              )}
              <button
                onClick={onClose}
                className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-zinc-750 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="no-scrollbar overflow-y-auto pb-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ==========================================
// 5. Badge Component
// ==========================================
interface BadgeProps {
  status: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const normStatus = status.toLowerCase();
  
  let bgStyles = "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300";

  if (normStatus === 'open' || normStatus === 'available' || normStatus === 'upcoming' || normStatus === 'active') {
    bgStyles = "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-500/20";
  } else if (normStatus === 'closed' || normStatus === 'occupied' || normStatus === 'cancelled') {
    bgStyles = "bg-rose-500/10 text-rose-600 dark:bg-rose-500/10 dark:text-rose-450 border border-rose-500/20";
  } else if (normStatus === 'completed') {
    bgStyles = "bg-blue-500/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-500/20";
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${bgStyles} ${className}`}>
      <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
        normStatus === 'open' || normStatus === 'available' || normStatus === 'upcoming' || normStatus === 'active' ? 'bg-emerald-500' :
        normStatus === 'closed' || normStatus === 'occupied' || normStatus === 'cancelled' ? 'bg-rose-500' : 'bg-blue-500'
      }`} />
      {status}
    </span>
  );
};

// ==========================================
// 6. Loading Skeleton Component
// ==========================================
interface SkeletonProps {
  variant?: 'text' | 'rect' | 'circle';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rect',
  width = '100%',
  height = '1rem',
  className = ''
}) => {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  const borderClass = variant === 'circle' ? 'rounded-full' : 'rounded-2xl';

  return (
    <div
      style={style}
      className={`animate-shimmer ${borderClass} ${className}`}
    />
  );
};
