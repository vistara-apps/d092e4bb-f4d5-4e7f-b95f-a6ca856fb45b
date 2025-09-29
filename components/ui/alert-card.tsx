'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RiskLevel } from '@/lib/types';

interface AlertCardProps {
  children: ReactNode;
  variant?: 'prominent' | 'standard' | 'dismissible';
  riskLevel?: RiskLevel;
  className?: string;
  onDismiss?: () => void;
  animate?: boolean;
}

const riskLevelConfig = {
  none: {
    bg: 'bg-green-50 border-green-200',
    text: 'text-green-800',
    icon: CheckCircle,
    iconColor: 'text-green-600'
  },
  low: {
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-800',
    icon: Info,
    iconColor: 'text-blue-600'
  },
  medium: {
    bg: 'bg-yellow-50 border-yellow-200',
    text: 'text-yellow-800',
    icon: AlertTriangle,
    iconColor: 'text-yellow-600'
  },
  high: {
    bg: 'bg-orange-50 border-orange-200',
    text: 'text-orange-800',
    icon: AlertTriangle,
    iconColor: 'text-orange-600'
  },
  extreme: {
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-800',
    icon: XCircle,
    iconColor: 'text-red-600'
  }
};

export function AlertCard({
  children,
  variant = 'standard',
  riskLevel = 'low',
  className,
  onDismiss,
  animate = true
}: AlertCardProps) {
  const config = riskLevelConfig[riskLevel];
  const Icon = config.icon;

  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.25, ease: 'cubic-bezier(0.22,1,0.36,1)' }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const CardComponent = animate ? motion.div : 'div';
  const cardProps = animate ? { variants: cardVariants, initial: 'initial', animate: 'animate', exit: 'exit' } : {};

  return (
    <CardComponent
      className={cn(
        'rounded-lg border p-4 shadow-card',
        config.bg,
        variant === 'prominent' && 'ring-2 ring-offset-2',
        variant === 'prominent' && riskLevel === 'extreme' && 'ring-red-400',
        variant === 'prominent' && riskLevel === 'high' && 'ring-orange-400',
        variant === 'prominent' && riskLevel === 'medium' && 'ring-yellow-400',
        className
      )}
      {...cardProps}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', config.iconColor)} />
        <div className={cn('flex-1', config.text)}>
          {children}
        </div>
        {variant === 'dismissible' && onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors"
            aria-label="Dismiss alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </CardComponent>
  );
}

interface AlertCardHeaderProps {
  title: string;
  timestamp?: Date;
  location?: string;
  className?: string;
}

export function AlertCardHeader({ title, timestamp, location, className }: AlertCardHeaderProps) {
  return (
    <div className={cn('mb-2', className)}>
      <h3 className="font-semibold text-lg">{title}</h3>
      {(timestamp || location) && (
        <div className="text-sm opacity-75 mt-1">
          {timestamp && <span>{timestamp.toLocaleString()}</span>}
          {timestamp && location && <span> • </span>}
          {location && <span>{location}</span>}
        </div>
      )}
    </div>
  );
}

interface AlertCardContentProps {
  children: ReactNode;
  className?: string;
}

export function AlertCardContent({ children, className }: AlertCardContentProps) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
}

interface AlertCardActionsProps {
  children: ReactNode;
  className?: string;
}

export function AlertCardActions({ children, className }: AlertCardActionsProps) {
  return (
    <div className={cn('flex gap-2 flex-wrap', className)}>
      {children}
    </div>
  );
}

