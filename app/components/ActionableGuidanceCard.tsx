'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Clock, CheckCircle, Phone, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ActionableGuidanceVariant, PreparednessGuidance } from '@/lib/types';
import { Button } from './ui/button';

interface ActionableGuidanceCardProps {
  variant?: ActionableGuidanceVariant;
  severity: 'minor' | 'moderate' | 'major' | 'extreme';
  location: { lat: number; lon: number };
  guidance?: PreparednessGuidance;
  onActionComplete?: (action: string) => void;
  className?: string;
}

export function ActionableGuidanceCard({
  variant = 'before',
  severity,
  location,
  guidance,
  onActionComplete,
  className
}: ActionableGuidanceCardProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'extreme': return 'text-destructive border-destructive/20 bg-destructive/5';
      case 'major': return 'text-destructive border-destructive/20 bg-destructive/5';
      case 'moderate': return 'text-accent border-accent/20 bg-accent/5';
      case 'minor': return 'text-primary border-primary/20 bg-primary/5';
      default: return 'text-muted-foreground border-border bg-card';
    }
  };

  const getSeverityIcon = (variant: string) => {
    switch (variant) {
      case 'before': return <AlertTriangle className="h-5 w-5" />;
      case 'during': return <Clock className="h-5 w-5" />;
      case 'after': return <CheckCircle className="h-5 w-5" />;
      default: return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getTitle = () => {
    switch (variant) {
      case 'before': return 'Before Flood Event';
      case 'during': return 'During Flood Event';
      case 'after': return 'After Flood Event';
      default: return 'Preparedness Guidance';
    }
  };

  const getGuidanceItems = () => {
    if (!guidance) return [];

    switch (variant) {
      case 'before': return guidance.before;
      case 'during': return guidance.during;
      case 'after': return guidance.after;
      default: return guidance.before;
    }
  };

  const guidanceItems = getGuidanceItems();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-lg border p-6 shadow-card',
        getSeverityColor(severity),
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        {getSeverityIcon(variant)}
        <div>
          <h3 className="text-xl font-semibold">{getTitle()}</h3>
          <p className="text-sm text-muted-foreground capitalize">
            {severity} Risk Level
          </p>
        </div>
      </div>

      {/* Guidance Items */}
      <div className="space-y-3 mb-6">
        {guidanceItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-3"
          >
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
              <span className="text-xs font-medium text-primary">
                {index + 1}
              </span>
            </div>
            <p className="text-sm leading-relaxed flex-1">{item}</p>
            {onActionComplete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onActionComplete(item)}
                className="flex-shrink-0 h-6 w-6 p-0"
              >
                <CheckCircle className="h-3 w-3" />
              </Button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Emergency Contacts */}
      {guidance?.emergencyContacts && guidance.emergencyContacts.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-3 flex items-center space-x-2">
            <Phone className="h-4 w-4" />
            <span>Emergency Contacts</span>
          </h4>
          <div className="space-y-2">
            {guidance.emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{contact.name}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="text-xs"
                >
                  <a href={`tel:${contact.number}`}>
                    {contact.number}
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Location Context */}
      <div className="border-t pt-4 mt-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>
            Guidance for location: {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

