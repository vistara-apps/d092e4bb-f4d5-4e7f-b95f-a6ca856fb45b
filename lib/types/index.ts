// FloodAlert NG Data Models

export interface User {
  userId: string;
  farcasterId?: string;
  registeredLocation: {
    lat: number;
    lon: number;
  };
  notificationPreferences: {
    pushEnabled: boolean;
    emailEnabled?: boolean;
    farcasterEnabled?: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface LocationRisk {
  locationId: string;
  location: {
    lat: number;
    lon: number;
  };
  timestamp: Date;
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
  predictedIntensity: number; // 0-100 scale
  alertTriggered: boolean;
  weatherData?: WeatherData;
  satelliteData?: SatelliteData;
}

export interface FloodEvent {
  eventId: string;
  timestamp: Date;
  severity: 'minor' | 'moderate' | 'major' | 'extreme';
  affectedArea: GeoPolygon;
  description: string;
  source: string; // 'weather-api' | 'satellite' | 'user-report'
  verified: boolean;
}

export interface Alert {
  alertId: string;
  userId: string;
  locationRiskId: string;
  timestamp: Date;
  readStatus: boolean;
  type: 'warning' | 'watch' | 'advisory';
  message: string;
  actionItems?: string[];
}

// API Data Types
export interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  pressure: number;
  forecast: WeatherForecast[];
}

export interface WeatherForecast {
  timestamp: Date;
  temperature: number;
  precipitation: number;
  precipitationProbability: number;
}

export interface SatelliteData {
  cloudCover: number;
  vegetationIndex: number;
  waterExtent: number;
  floodRisk: number;
}

// UI Component Types
export type AlertCardVariant = 'prominent' | 'standard' | 'dismissible';
export type LocationSelectorVariant = 'current' | 'saved' | 'search';
export type DataVizChartVariant = 'line' | 'bar' | 'heatmap';
export type ActionableGuidanceVariant = 'before' | 'during' | 'after';
export type SocialShareVariant = 'farcaster' | 'direct';

// User Flow Types
export interface SetupFlowState {
  step: 'welcome' | 'location' | 'permissions' | 'complete';
  location?: { lat: number; lon: number };
  permissions?: {
    location: boolean;
    notifications: boolean;
    farcaster?: boolean;
  };
}

export interface AlertFlowState {
  alert?: Alert;
  guidance?: ActionableGuidance;
  shared?: boolean;
}

export interface HistoryFlowState {
  filters: {
    dateRange?: { start: Date; end: Date };
    severity?: FloodEvent['severity'][];
    area?: GeoPolygon;
  };
  selectedEvent?: FloodEvent;
}

// API Response Types
export interface WeatherAPIResponse {
  coord: { lat: number; lon: number };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  rain?: { '1h': number; '3h': number };
  clouds: { all: number };
}

export interface ForecastAPIResponse {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      humidity: number;
    };
    weather: Array<{
      main: string;
      description: string;
    }>;
    rain?: { '3h': number };
    pop: number; // precipitation probability
  }>;
}

// Component Props Types
export interface AlertCardProps {
  alert: Alert;
  variant?: AlertCardVariant;
  onMarkAsRead?: () => void;
  onViewGuidance?: () => void;
  onShare?: () => void;
}

export interface LocationSelectorProps {
  variant?: LocationSelectorVariant;
  onLocationSelect?: (location: { lat: number; lon: number }) => void;
  currentLocation?: { lat: number; lon: number };
  savedLocations?: Array<{ id: string; name: string; location: { lat: number; lon: number } }>;
}

export interface DataVizChartProps {
  variant?: DataVizChartVariant;
  data: any[];
  title?: string;
  height?: number;
}

export interface ActionableGuidanceCardProps {
  variant?: ActionableGuidanceVariant;
  severity: FloodEvent['severity'];
  location: { lat: number; lon: number };
  onActionComplete?: (action: string) => void;
}

export interface SocialShareButtonProps {
  variant?: SocialShareVariant;
  content: {
    text: string;
    url?: string;
    image?: string;
  };
  onShare?: () => void;
}

// Business Logic Types
export interface RiskCalculationResult {
  riskLevel: LocationRisk['riskLevel'];
  confidence: number; // 0-100
  factors: {
    weather: number;
    historical: number;
    satellite: number;
    terrain: number;
  };
  recommendedActions: string[];
}

export interface PreparednessGuidance {
  before: string[];
  during: string[];
  after: string[];
  emergencyContacts: Array<{
    type: string;
    name: string;
    number: string;
  }>;
}

// Utility Types
export type GeoPoint = {
  lat: number;
  lon: number;
};

export type BoundingBox = {
  north: number;
  south: number;
  east: number;
  west: number;
};

// Simple GeoJSON types (subset)
export interface GeoPosition extends Array<number> {
  0: number; // longitude
  1: number; // latitude
  2?: number; // elevation (optional)
}

export type GeoPolygon = {
  type: 'Polygon';
  coordinates: GeoPosition[][];
};
