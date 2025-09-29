'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Navigation, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LocationSelectorVariant, GeoPoint } from '@/lib/types';
import { Button } from './ui/button';

interface LocationSelectorProps {
  variant?: LocationSelectorVariant;
  onLocationSelect?: (location: GeoPoint) => void;
  currentLocation?: GeoPoint;
  savedLocations?: Array<{
    id: string;
    name: string;
    location: GeoPoint;
  }>;
  className?: string;
}

export function LocationSelector({
  variant = 'current',
  onLocationSelect,
  currentLocation,
  savedLocations = [],
  className
}: LocationSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<GeoPoint | null>(null);

  useEffect(() => {
    if (variant === 'current' && !currentLocation) {
      getCurrentLocation();
    }
  }, [variant, currentLocation]);

  const getCurrentLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          setUserLocation(location);
          onLocationSelect?.(location);
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      // In a real app, you'd use a geocoding service like Google Maps or Mapbox
      // For now, we'll simulate a search
      const mockResults = [
        { lat: 40.7128, lon: -74.0060, name: 'New York, NY' },
        { lat: 34.0522, lon: -118.2437, name: 'Los Angeles, CA' },
        { lat: 41.8781, lon: -87.6298, name: 'Chicago, IL' },
      ];

      const result = mockResults.find(location =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (result) {
        onLocationSelect?.({ lat: result.lat, lon: result.lon });
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentLocation = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Current Location</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="flex items-center space-x-2"
        >
          <Navigation className="h-4 w-4" />
          <span>{isLoading ? 'Getting...' : 'Refresh'}</span>
        </Button>
      </div>

      {userLocation || currentLocation ? (
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">
                {userLocation?.lat.toFixed(4)}, {userLocation?.lon.toFixed(4)}
              </p>
              <p className="text-sm text-muted-foreground">
                Current location detected
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed bg-muted/50 p-8 text-center">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {isLoading ? 'Detecting your location...' : 'Unable to detect location'}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={getCurrentLocation}
            disabled={isLoading}
          >
            Try Again
          </Button>
        </div>
      )}
    </motion.div>
  );

  const renderSearchLocation = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold">Search Location</h3>

      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Enter city, address, or coordinates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <Button onClick={handleSearch} disabled={isLoading || !searchQuery.trim()}>
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {currentLocation && (
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">
                {currentLocation.lat.toFixed(4)}, {currentLocation.lon.toFixed(4)}
              </p>
              <p className="text-sm text-muted-foreground">
                Selected location
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderSavedLocations = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold">Saved Locations</h3>

      {savedLocations.length > 0 ? (
        <div className="space-y-2">
          {savedLocations.map((location) => (
            <div
              key={location.id}
              className="flex items-center justify-between rounded-lg border bg-card p-4 cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => onLocationSelect?.(location.location)}
            >
              <div className="flex items-center space-x-2">
                <Save className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{location.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {location.location.lat.toFixed(4)}, {location.location.lon.toFixed(4)}
                  </p>
                </div>
              </div>
              <MapPin className="h-4 w-4 text-primary" />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed bg-muted/50 p-8 text-center">
          <Save className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No saved locations yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Locations you monitor will appear here
          </p>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className={cn('w-full', className)}>
      {variant === 'current' && renderCurrentLocation()}
      {variant === 'search' && renderSearchLocation()}
      {variant === 'saved' && renderSavedLocations()}
    </div>
  );
}

