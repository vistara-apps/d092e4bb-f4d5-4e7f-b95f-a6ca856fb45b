'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, MapPin, TrendingUp, Shield } from 'lucide-react';
import { AppShell } from './components/AppShell';
import { AlertCard } from './components/AlertCard';
import { LocationSelector } from './components/LocationSelector';
import { DataVizChart } from './components/DataVizChart';
import { ActionableGuidanceCard } from './components/ActionableGuidanceCard';
import { SocialShareButton } from './components/SocialShareButton';
import { Button } from './components/ui/button';
import { Alert, GeoPoint } from './lib/types';

export default function HomePage() {
  const [currentLocation, setCurrentLocation] = useState<GeoPoint | null>(null);
  const [floodData, setFloodData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Mock alerts for demonstration
  useEffect(() => {
    const mockAlerts: Alert[] = [
      {
        alertId: 'alert-1',
        userId: 'user-1',
        locationRiskId: 'risk-1',
        timestamp: new Date().toISOString(),
        readStatus: false,
        type: 'warning',
        message: 'High flood risk detected in your area. Heavy rainfall expected in the next 24 hours.',
        actionItems: [
          'Move valuables to higher ground',
          'Prepare emergency kit',
          'Monitor local weather updates'
        ]
      }
    ];
    setAlerts(mockAlerts);
  }, []);

  const handleLocationSelect = async (location: GeoPoint) => {
    setCurrentLocation(location);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/flood-data?lat=${location.lat}&lon=${location.lon}`);
      const data = await response.json();
      setFloodData(data);
    } catch (error) {
      console.error('Failed to fetch flood data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlertAction = (alertId: string, action: 'read' | 'share' | 'guidance') => {
    if (action === 'read') {
      setAlerts(prev => prev.map(alert =>
        alert.alertId === alertId ? { ...alert, readStatus: true } : alert
      ));
    }
  };

  // Mock historical data for charts
  const historicalData = [
    { timestamp: '2024-01-01', value: 0.2 },
    { timestamp: '2024-02-01', value: 0.3 },
    { timestamp: '2024-03-01', value: 0.1 },
    { timestamp: '2024-04-01', value: 0.4 },
    { timestamp: '2024-05-01', value: 0.6 },
    { timestamp: '2024-06-01', value: 0.8 },
  ];

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <AlertTriangle className="h-12 w-12 text-accent" />
            <h1 className="text-4xl font-bold">FloodAlert NG</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hyperlocal Flood Alerts, Before They Happen.
            Stay safe with predictive flood warnings powered by weather and satellite data.
          </p>
        </motion.div>

        {/* Location Selection */}
        <div className="grid gap-6 md:grid-cols-2">
          <LocationSelector
            variant="current"
            onLocationSelect={handleLocationSelect}
            currentLocation={currentLocation || undefined}
          />

          <LocationSelector
            variant="search"
            onLocationSelect={handleLocationSelect}
            currentLocation={currentLocation || undefined}
          />
        </div>

        {/* Current Risk Status */}
        {currentLocation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg border bg-card p-6 shadow-card"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold flex items-center space-x-2">
                <Shield className="h-6 w-6 text-primary" />
                <span>Current Risk Assessment</span>
              </h2>
              {isLoading && (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              )}
            </div>

            {floodData ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {floodData.riskAssessment?.riskLevel?.toUpperCase() || 'LOW'}
                  </div>
                  <div className="text-sm text-muted-foreground">Risk Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">
                    {Math.round((floodData.riskAssessment?.riskScore || 0) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Risk Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {floodData.weatherData?.temperature || 0}°C
                  </div>
                  <div className="text-sm text-muted-foreground">Temperature</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {floodData.weatherData?.humidity || 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">Humidity</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Select a location to view risk assessment
              </div>
            )}
          </motion.div>
        )}

        {/* Active Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center space-x-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              <span>Active Alerts</span>
            </h2>
            <div className="grid gap-4">
              {alerts.map((alert) => (
                <AlertCard
                  key={alert.alertId}
                  alert={alert}
                  variant="prominent"
                  onMarkAsRead={() => handleAlertAction(alert.alertId, 'read')}
                  onViewGuidance={() => handleAlertAction(alert.alertId, 'guidance')}
                  onShare={() => handleAlertAction(alert.alertId, 'share')}
                />
              ))}
            </div>
          </div>
        )}

        {/* Preparedness Guidance */}
        {floodData?.guidance && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span>Preparedness Guidance</span>
            </h2>
            <ActionableGuidanceCard
              variant="before"
              severity={floodData.riskAssessment?.riskLevel || 'low'}
              location={currentLocation!}
              guidance={floodData.guidance}
            />
          </div>
        )}

        {/* Historical Data Visualization */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span>Historical Flood Patterns</span>
          </h2>
          <DataVizChart
            variant="line"
            data={historicalData}
            title="Flood Risk Trends Over Time"
            height={300}
          />
        </div>

        {/* Community Sharing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-lg border bg-card p-6 shadow-card"
        >
          <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-accent" />
            <span>Community Alerting</span>
          </h2>
          <p className="text-muted-foreground mb-4">
            Share flood alerts and preparedness information with your local community on Farcaster.
          </p>
          <SocialShareButton
            variant="farcaster"
            content={{
              text: "🚨 FloodAlert NG: High flood risk detected in my area. Stay prepared! #FloodAlertNG",
              url: "https://floodalert-ng.vercel.app"
            }}
          />
        </motion.div>
      </div>
    </AppShell>
  );
}

