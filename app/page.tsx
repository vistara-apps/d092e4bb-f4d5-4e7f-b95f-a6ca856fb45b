'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CloudRain, MapPin, Bell, History, Shield, Share2 } from 'lucide-react';
import { AppShell, AppShellMain, AppShellHeader } from '@/components/ui/app-shell';
import { AlertCard } from '@/components/ui/alert-card';
import { LocationSelector } from '@/components/ui/location-selector';
import { DataVizChart } from '@/components/ui/data-viz-chart';
import { ActionableGuidanceCard } from '@/components/ui/actionable-guidance-card';
import { SocialShareButton } from '@/components/ui/social-share-button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { weatherAPI } from '@/lib/api/weather';
import { Location, WeatherData, RiskLevel, PreparednessAction } from '@/lib/types';
import { formatRiskLevel, getRiskColor } from '@/lib/utils';

export default function HomePage() {
  const [location, setLocation] = useState<Location | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [currentRisk, setCurrentRisk] = useState<RiskLevel>('none');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock preparedness actions based on risk level
  const getPreparednessActions = (riskLevel: RiskLevel): PreparednessAction[] => {
    const baseActions: PreparednessAction[] = [
      {
        id: 'backup-important',
        title: 'Backup Important Documents',
        description: 'Make digital copies of important documents and store them safely',
        priority: 'high',
        timeframe: 'within 24 hours',
        completed: false
      },
      {
        id: 'emergency-kit',
        title: 'Prepare Emergency Kit',
        description: 'Gather essential supplies including water, food, medications, and flashlights',
        priority: 'high',
        timeframe: 'within 24 hours',
        completed: false
      }
    ];

    if (riskLevel === 'high' || riskLevel === 'extreme') {
      baseActions.push({
        id: 'evacuation-plan',
        title: 'Review Evacuation Routes',
        description: 'Identify multiple evacuation routes and have a meeting point established',
        priority: 'high',
        timeframe: 'immediately',
        completed: false
      });
    }

    return baseActions;
  };

  const handleLocationSelect = async (selectedLocation: Location) => {
    setLocation(selectedLocation);
    setIsLoading(true);
    setError(null);

    try {
      const result = await weatherAPI.getWeatherData(selectedLocation);
      if (result.success && result.data) {
        setWeatherData(result.data);
        const riskScore = weatherAPI.calculateFloodRisk(result.data);
        const riskLevel: RiskLevel =
          riskScore > 80 ? 'extreme' :
          riskScore > 60 ? 'high' :
          riskScore > 30 ? 'medium' :
          riskScore > 10 ? 'low' : 'none';
        setCurrentRisk(riskLevel);
      } else {
        setError(result.error || 'Failed to fetch weather data');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error fetching weather data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock historical data for demonstration
  const mockHistoricalData = [
    { timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), value: 15 },
    { timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), value: 25 },
    { timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), value: 10 },
    { timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), value: 45 },
    { timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), value: 30 },
    { timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), value: 20 },
    { timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), value: 35 }
  ];

  return (
    <ErrorBoundary>
      <AppShell>
        <AppShellHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CloudRain className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">FloodAlert NG</h1>
                <p className="text-sm text-muted-foreground">
                  Hyperlocal Flood Alerts, Before They Happen
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <History className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </AppShellHeader>

        <AppShellMain>
          <div className="space-y-8">
            {/* Location Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-lg p-6 border"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Select Your Location
              </h2>
              <LocationSelector
                onLocationSelect={handleLocationSelect}
                placeholder="Enter your city or use current location"
              />
            </motion.div>

            {isLoading && (
              <LoadingSpinner text="Analyzing flood risk..." />
            )}

            {error && (
              <AlertCard variant="standard" riskLevel="high">
                <AlertCardHeader title="Error" />
                <AlertCardContent>
                  <p>{error}</p>
                </AlertCardContent>
              </AlertCard>
            )}

            {location && weatherData && !isLoading && (
              <>
                {/* Current Risk Alert */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <AlertCard
                    variant={currentRisk === 'extreme' || currentRisk === 'high' ? 'prominent' : 'standard'}
                    riskLevel={currentRisk}
                  >
                    <AlertCardHeader
                      title={`Flood Risk: ${formatRiskLevel(currentRisk)}`}
                      timestamp={new Date()}
                      location={`${location.city || 'Unknown'}, ${location.country || ''}`}
                    />
                    <AlertCardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {weatherData.current.temperature}°C
                          </div>
                          <div className="text-sm text-muted-foreground">Temperature</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {weatherData.current.precipitation > 0 ? `${weatherData.current.precipitation}mm` : '0mm'}
                          </div>
                          <div className="text-sm text-muted-foreground">Precipitation</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {weatherData.current.humidity}%
                          </div>
                          <div className="text-sm text-muted-foreground">Humidity</div>
                        </div>
                      </div>
                      <p className="text-sm">
                        Based on current weather conditions and forecast data,
                        your area has a {formatRiskLevel(currentRisk).toLowerCase()} flood risk.
                      </p>
                    </AlertCardContent>
                    <AlertCardActions>
                      <SocialShareButton
                        shareData={{
                          location,
                          riskLevel: currentRisk,
                          message: `🚨 Flood Alert: ${formatRiskLevel(currentRisk)} risk in ${location.city}. Stay prepared! #FloodAlertNG`,
                          hashtags: ['FloodAlertNG', 'FloodRisk', 'Preparedness']
                        }}
                      />
                    </AlertCardActions>
                  </AlertCard>
                </motion.div>

                {/* Historical Data Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card rounded-lg p-6 border"
                >
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Historical Flood Risk
                  </h2>
                  <DataVizChart
                    data={mockHistoricalData}
                    variant="area"
                    title="7-Day Risk Trend"
                    height={250}
                  />
                </motion.div>

                {/* Preparedness Guidance */}
                {(currentRisk === 'medium' || currentRisk === 'high' || currentRisk === 'extreme') && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <ActionableGuidanceCard
                      variant="before"
                      actions={getPreparednessActions(currentRisk)}
                      resources={[
                        {
                          type: 'emergency_contact',
                          title: 'Local Emergency Services',
                          description: 'Contact emergency services if you need immediate assistance',
                          contact: '911'
                        },
                        {
                          type: 'shelter',
                          title: 'Emergency Shelters',
                          description: 'Find nearby emergency shelters in your area',
                          url: 'https://www.ready.gov/shelter'
                        }
                      ]}
                    />
                  </motion.div>
                )}
              </>
            )}

            {!location && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <CloudRain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Welcome to FloodAlert NG</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Get hyperlocal flood risk alerts before they happen. Select your location to get started.
                </p>
              </motion.div>
            )}
          </div>
        </AppShellMain>
      </AppShell>
    </ErrorBoundary>
  );
}

