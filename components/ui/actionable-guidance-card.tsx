'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Clock, AlertTriangle, Shield, MapPin, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PreparednessAction, Resource } from '@/lib/types';

interface ActionableGuidanceCardProps {
  variant?: 'before' | 'during' | 'after';
  actions: PreparednessAction[];
  resources?: Resource[];
  className?: string;
  onActionComplete?: (actionId: string) => void;
}

const variantConfig = {
  before: {
    title: 'Prepare Before Flood',
    icon: Shield,
    bgColor: 'bg-blue-50 border-blue-200',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-600'
  },
  during: {
    title: 'During Flood Event',
    icon: AlertTriangle,
    bgColor: 'bg-orange-50 border-orange-200',
    textColor: 'text-orange-800',
    iconColor: 'text-orange-600'
  },
  after: {
    title: 'After Flood Recovery',
    icon: CheckCircle,
    bgColor: 'bg-green-50 border-green-200',
    textColor: 'text-green-800',
    iconColor: 'text-green-600'
  }
};

export function ActionableGuidanceCard({
  variant = 'before',
  actions,
  resources = [],
  className,
  onActionComplete
}: ActionableGuidanceCardProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-lg border p-6 shadow-card',
        config.bgColor,
        className
      )}
    >
      <div className="flex items-center gap-3 mb-6">
        <Icon className={cn('h-6 w-6', config.iconColor)} />
        <h3 className={cn('text-xl font-semibold', config.textColor)}>
          {config.title}
        </h3>
      </div>

      <div className="space-y-4">
        {actions.map((action) => (
          <ActionItem
            key={action.id}
            action={action}
            onComplete={() => onActionComplete?.(action.id)}
          />
        ))}
      </div>

      {resources.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="font-medium mb-3">Helpful Resources</h4>
          <div className="space-y-2">
            {resources.map((resource, index) => (
              <ResourceItem key={index} resource={resource} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

interface ActionItemProps {
  action: PreparednessAction;
  onComplete: () => void;
}

function ActionItem({ action, onComplete }: ActionItemProps) {
  const [isCompleted, setIsCompleted] = useState(action.completed || false);

  const handleToggle = () => {
    setIsCompleted(!isCompleted);
    if (!isCompleted) {
      onComplete();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
      <button
        onClick={handleToggle}
        className="flex-shrink-0 mt-0.5"
      >
        {isCompleted ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : (
          <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
        )}
      </button>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className={cn(
            'font-medium',
            isCompleted && 'line-through text-muted-foreground'
          )}>
            {action.title}
          </h4>
          <span className={cn(
            'text-xs px-2 py-1 rounded-full',
            getPriorityColor(action.priority),
            'bg-current/10'
          )}>
            {action.priority}
          </span>
        </div>

        <p className={cn(
          'text-sm mb-2',
          isCompleted ? 'text-muted-foreground' : 'text-foreground'
        )}>
          {action.description}
        </p>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {action.timeframe}
        </div>
      </div>
    </div>
  );
}

interface ResourceItemProps {
  resource: Resource;
}

function ResourceItem({ resource }: ResourceItemProps) {
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'emergency_contact': return Phone;
      case 'shelter': return MapPin;
      case 'supply': return Shield;
      default: return Circle;
    }
  };

  const Icon = getResourceIcon(resource.type);

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-background/50 transition-colors">
      <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <div className="flex-1">
        <div className="font-medium text-sm">{resource.title}</div>
        <div className="text-xs text-muted-foreground">{resource.description}</div>
        {resource.contact && (
          <div className="text-xs font-medium text-primary mt-1">{resource.contact}</div>
        )}
        {resource.url && (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline mt-1 inline-block"
          >
            Visit Resource →
          </a>
        )}
      </div>
    </div>
  );
}

