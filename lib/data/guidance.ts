import { PreparednessGuidance, PreparednessAction, Resource, FloodSeverity } from '../types';

export const preparednessGuidance: Record<FloodSeverity, PreparednessGuidance> = {
  minor: {
    phase: 'before',
    severity: 'minor',
    actions: [
      {
        id: 'monitor-weather',
        title: 'Monitor Weather Updates',
        description: 'Stay informed about weather conditions and potential changes',
        priority: 'medium',
        timeframe: 'ongoing',
        completed: false
      },
      {
        id: 'prepare-kit',
        title: 'Prepare Emergency Kit',
        description: 'Gather essential supplies including flashlight, batteries, and drinking water',
        priority: 'medium',
        timeframe: 'within 24 hours',
        completed: false
      }
    ],
    resources: [
      {
        type: 'information',
        title: 'Weather Updates',
        description: 'Check local weather forecasts regularly',
        url: 'https://weather.com'
      }
    ]
  },
  moderate: {
    phase: 'before',
    severity: 'moderate',
    actions: [
      {
        id: 'secure-property',
        title: 'Secure Property',
        description: 'Move valuable items to higher ground and secure outdoor furniture',
        priority: 'high',
        timeframe: 'immediately',
        completed: false
      },
      {
        id: 'backup-power',
        title: 'Prepare Backup Power',
        description: 'Ensure portable chargers and backup batteries are ready',
        priority: 'medium',
        timeframe: 'within 12 hours',
        completed: false
      },
      {
        id: 'emergency-plan',
        title: 'Review Emergency Plan',
        description: 'Review family emergency plan and communication procedures',
        priority: 'high',
        timeframe: 'immediately',
        completed: false
      }
    ],
    resources: [
      {
        type: 'emergency_contact',
        title: 'Emergency Services',
        description: 'Contact local emergency services if needed',
        contact: '911'
      },
      {
        type: 'information',
        title: 'Flood Preparedness Guide',
        description: 'Official flood preparedness information',
        url: 'https://www.ready.gov/floods'
      }
    ]
  },
  major: {
    phase: 'during',
    severity: 'major',
    actions: [
      {
        id: 'evacuate-if-needed',
        title: 'Evacuate if Advised',
        description: 'Follow evacuation orders from local authorities immediately',
        priority: 'high',
        timeframe: 'immediate',
        completed: false
      },
      {
        id: 'move-valuables',
        title: 'Move Valuables Upstairs',
        description: 'Move important documents, electronics, and valuables to upper floors',
        priority: 'high',
        timeframe: 'immediately',
        completed: false
      },
      {
        id: 'turn-off-utilities',
        title: 'Turn Off Utilities',
        description: 'Turn off electricity, gas, and water if flooding is imminent',
        priority: 'high',
        timeframe: 'when water approaches',
        completed: false
      },
      {
        id: 'stay-informed',
        title: 'Stay Informed',
        description: 'Monitor emergency broadcasts and official updates',
        priority: 'high',
        timeframe: 'ongoing',
        completed: false
      }
    ],
    resources: [
      {
        type: 'emergency_contact',
        title: 'Emergency Operations Center',
        description: 'Contact local emergency operations',
        contact: '911'
      },
      {
        type: 'shelter',
        title: 'Emergency Shelters',
        description: 'Find designated emergency shelters in your area',
        url: 'https://www.ready.gov/shelter'
      }
    ]
  },
  extreme: {
    phase: 'during',
    severity: 'extreme',
    actions: [
      {
        id: 'immediate-evacuation',
        title: 'Immediate Evacuation Required',
        description: 'Evacuate immediately to higher ground or designated safe areas',
        priority: 'high',
        timeframe: 'NOW',
        completed: false
      },
      {
        id: 'avoid-flood-waters',
        title: 'Avoid Flood Waters',
        description: 'Never walk, swim, or drive through flood waters',
        priority: 'high',
        timeframe: 'immediate',
        completed: false
      },
      {
        id: 'go-to-safe-location',
        title: 'Go to Safe Location',
        description: 'Move to the highest point available or pre-designated safe area',
        priority: 'high',
        timeframe: 'immediate',
        completed: false
      },
      {
        id: 'call-emergency',
        title: 'Call Emergency Services',
        description: 'Call 911 if you are in immediate danger or need rescue',
        priority: 'high',
        timeframe: 'if needed',
        completed: false
      }
    ],
    resources: [
      {
        type: 'emergency_contact',
        title: 'Emergency Rescue',
        description: 'Call for immediate rescue assistance',
        contact: '911'
      },
      {
        type: 'emergency_contact',
        title: 'National Emergency',
        description: 'Federal Emergency Management Agency',
        contact: '1-800-621-FEMA'
      }
    ]
  }
};

export const recoveryGuidance: PreparednessGuidance = {
  phase: 'after',
  severity: 'moderate',
  actions: [
    {
      id: 'assess-damage',
      title: 'Assess Property Damage',
      description: 'Carefully inspect your property for damage before re-entering',
      priority: 'high',
      timeframe: 'after waters recede',
      completed: false
    },
    {
      id: 'document-damage',
      title: 'Document Damage',
      description: 'Take photos and videos of all damage for insurance claims',
      priority: 'high',
      timeframe: 'immediately after safe',
      completed: false
    },
    {
      id: 'avoid-contaminated-water',
      title: 'Avoid Contaminated Water',
      description: 'Do not drink or use flood water - it may be contaminated',
      priority: 'high',
      timeframe: 'ongoing',
      completed: false
    },
    {
      id: 'clean-and-disinfect',
      title: 'Clean and Disinfect',
      description: 'Clean and disinfect all surfaces that contacted flood water',
      priority: 'medium',
      timeframe: 'as soon as possible',
      completed: false
    },
    {
      id: 'contact-insurance',
      title: 'Contact Insurance Company',
      description: 'File insurance claims and document all communications',
      priority: 'medium',
      timeframe: 'within 24 hours',
      completed: false
    }
  ],
  resources: [
    {
      type: 'information',
      title: 'Flood Recovery Guide',
      description: 'Official guide for flood recovery and cleanup',
      url: 'https://www.fema.gov/flood-recovery'
    },
    {
      type: 'emergency_contact',
      title: 'Insurance Claims Hotline',
      description: 'Get help with insurance claims',
      contact: '1-800-621-FEMA'
    },
    {
      type: 'information',
      title: 'Health and Safety',
      description: 'Health guidelines for flood recovery',
      url: 'https://www.cdc.gov/healthywater/hygiene/cleaning/flood.html'
    }
  ]
};

// Helper function to get guidance based on risk level and phase
export function getGuidanceForRisk(riskLevel: string, phase: 'before' | 'during' | 'after' = 'before'): PreparednessGuidance {
  if (phase === 'after') {
    return recoveryGuidance;
  }

  const severityMap: Record<string, FloodSeverity> = {
    'extreme': 'extreme',
    'high': 'major',
    'medium': 'moderate',
    'low': 'minor',
    'none': 'minor'
  };

  const severity = severityMap[riskLevel] || 'minor';
  return preparednessGuidance[severity];
}

