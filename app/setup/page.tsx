'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, CheckCircle } from 'lucide-react';
import { AppShell, AppShellMain, AppShellHeader } from '@/components/ui/app-shell';
import { LocationSelector } from '@/components/ui/location-selector';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Location, NotificationPreferences } from '@/lib/types';
import { LocalStorage } from '@/lib/storage/localStorage';

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState<'location' | 'preferences' | 'complete'>('location');
  const [location, setLocation] = useState<Location | null>(null);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    pushEnabled: true,
    alertThreshold: 'medium',
    frequency: 'immediate'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationSelect = (selectedLocation: Location) => {
    setLocation(selectedLocation);
  };

  const handleNext = async () => {
    if (step === 'location' && location) {
      setStep('preferences');
    } else if (step === 'preferences') {
      setIsLoading(true);

      // Save user data
      const user = {
        userId: `user_${Date.now()}`,
        registeredLocation: location!,
        notificationPreferences: preferences,
        premiumTier: 'free' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      LocalStorage.setUser(user);
      LocalStorage.setLocation(location!);
      LocalStorage.setPreferences(preferences);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStep('complete');
      setIsLoading(false);

      // Redirect to main app after a delay
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }
  };

  const renderLocationStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Set Up Your Location</h2>
        <p className="text-muted-foreground">
          Choose your location to receive personalized flood alerts and risk assessments.
        </p>
      </div>

      <LocationSelector
        onLocationSelect={handleLocationSelect}
        variant="current"
        className="max-w-md mx-auto"
      />

      {location && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-lg p-4 border max-w-md mx-auto"
        >
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium">
                {location.city || 'Unknown City'}
              </div>
              <div className="text-sm text-muted-foreground">
                {location.state && `${location.state}, `}{location.country || 'Unknown Country'}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  const renderPreferencesStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Notification Preferences</h2>
        <p className="text-muted-foreground">
          Customize how you want to receive flood alerts.
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Alert Threshold</label>
          <select
            value={preferences.alertThreshold}
            onChange={(e) => setPreferences(prev => ({
              ...prev,
              alertThreshold: e.target.value as any
            }))}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background"
          >
            <option value="low">Low Risk - All alerts</option>
            <option value="medium">Medium Risk - Moderate and higher</option>
            <option value="high">High Risk - Only high and extreme</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Alert Frequency</label>
          <select
            value={preferences.frequency}
            onChange={(e) => setPreferences(prev => ({
              ...prev,
              frequency: e.target.value as any
            }))}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background"
          >
            <option value="immediate">Immediate - As soon as detected</option>
            <option value="hourly">Hourly - Batched hourly</option>
            <option value="daily">Daily - Daily summary</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="pushEnabled"
            checked={preferences.pushEnabled}
            onChange={(e) => setPreferences(prev => ({
              ...prev,
              pushEnabled: e.target.checked
            }))}
            className="rounded border-input"
          />
          <label htmlFor="pushEnabled" className="text-sm">
            Enable push notifications
          </label>
        </div>
      </div>
    </motion.div>
  );

  const renderCompleteStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-600" />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">Setup Complete!</h2>
        <p className="text-muted-foreground">
          You're all set to receive flood alerts for {location?.city}.
          Redirecting to your dashboard...
        </p>
      </div>
    </motion.div>
  );

  return (
    <ErrorBoundary>
      <AppShell>
        <AppShellHeader>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">FA</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">FloodAlert NG</h1>
              <p className="text-xs text-muted-foreground">Setup</p>
            </div>
          </div>
        </AppShellHeader>

        <AppShellMain>
          <div className="max-w-2xl mx-auto">
            {/* Progress indicator */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === 'location' ? 'bg-primary text-primary-foreground' :
                  ['preferences', 'complete'].includes(step) ? 'bg-green-600 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  1
                </div>
                <div className={`w-12 h-0.5 ${
                  ['preferences', 'complete'].includes(step) ? 'bg-green-600' : 'bg-muted'
                }`} />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === 'preferences' ? 'bg-primary text-primary-foreground' :
                  step === 'complete' ? 'bg-green-600 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  2
                </div>
                <div className={`w-12 h-0.5 ${
                  step === 'complete' ? 'bg-green-600' : 'bg-muted'
                }`} />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === 'complete' ? 'bg-green-600 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  ✓
                </div>
              </div>
            </div>

            {/* Step content */}
            <div className="min-h-[400px] flex items-center justify-center">
              {step === 'location' && renderLocationStep()}
              {step === 'preferences' && renderPreferencesStep()}
              {step === 'complete' && renderCompleteStep()}
            </div>

            {/* Navigation */}
            {step !== 'complete' && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleNext}
                  disabled={
                    (step === 'location' && !location) ||
                    isLoading
                  }
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      {step === 'location' ? 'Continue' : 'Complete Setup'}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </AppShellMain>
      </AppShell>
    </ErrorBoundary>
  );
}

