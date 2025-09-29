'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, MapPin, Clock, CheckCircle, Share2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertCardVariant } from '@/lib/types';
import { Button } from './ui/button';

interface AlertCardProps {
  alert: Alert;
  variant?: AlertCardVariant;
  onMarkAsRead?: () => void;
  onViewGuidance?: () => void;
  onShare?: () => void;
  className?: string;
}

export function AlertCard({
  alert,
  variant = 'standard',
  onMarkAsRead,
  onViewGuidance,
  onShare,
  className
}: AlertCardProps) {
  const getRiskColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-destructive border-destructive/20 bg-destructive/5';
      case 'watch': return 'text-accent border-accent/20 bg-accent/5';
      case 'advisory': return 'text-primary border-primary/20 bg-primary/5';
      default: return 'text-muted-foreground border-border bg-card';
    }
  };

  const getRiskIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-5 w-5" />;
      case 'watch': return <Clock className="h-5 w-5" />;
      case 'advisory': return <Eye className="h-5 w-5" />;
      default: return <AlertTriangle className="h-5 w-5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'rounded-lg border p-4 shadow-card',
        getRiskColor(alert.type),
        variant === 'prominent' && 'ring-2 ring-offset-2 ring-accent',
        variant === 'dismissible' && 'relative',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          {getRiskIcon(alert.type)}
          <div>
            <h3 className="font-semibold text-lg capitalize">{alert.type} Alert</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(alert.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
        {variant === 'dismissible' && !alert.readStatus && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkAsRead}
            className="h-8 w-8 p-0"
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Message */}
      <div className="mt-3">
        <p className="text-sm leading-relaxed">{alert.message}</p>
      </div>

      {/* Action Items */}
      {alert.actionItems && alert.actionItems.length > 0 && (
        <div className="mt-3">
          <h4 className="text-sm font-medium mb-2">Recommended Actions:</h4>
          <ul className="text-sm space-y-1">
            {alert.actionItems.map((item, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-accent mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onViewGuidance}
          className="flex items-center space-x-2"
        >
          <Eye className="h-4 w-4" />
          <span>View Guidance</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onShare}
          className="flex items-center space-x-2"
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
        {!alert.readStatus && (
          <Button
            variant="default"
            size="sm"
            onClick={onMarkAsRead}
            className="flex items-center space-x-2"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Mark as Read</span>
          </Button>
        )}
      </div>

      {/* Status Indicator */}
      {alert.readStatus && (
        <div className="absolute top-2 right-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
        </div>
      )}
    </motion.div>
  );
}

