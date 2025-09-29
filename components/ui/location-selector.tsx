'use client';

import { useState, useEffect } from 'react';
import { MapPin, Search, Navigation, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Location } from '@/lib/types';

interface LocationSelectorProps {
  onLocationSelect: (location: Location) => void;
  variant?: 'current' | 'saved' | 'search';
  className?: string;
  placeholder?: string;
}

export function LocationSelector({
  onLocationSelect,
  variant = 'search',
  className,
  placeholder = 'Enter your location...'
}: LocationSelectorProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  // Get current location using browser geolocation
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const location: Location = {
          lat: latitude,
          lon: longitude
        };

        // Reverse geocode to get address
        try {
          const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY}`
          );
          const data = await response.json();
          if (data.length > 0) {
            location.city = data[0].name;
            location.state = data[0].state;
            location.country = data[0].country;
          }
        } catch (error) {
          console.error('Error reverse geocoding:', error);
        }

        setCurrentLocation(location);
        onLocationSelect(location);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please enter it manually.');
        setIsLoading(false);
      }
    );
  };

  // Search for locations
  const searchLocations = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchQuery)}&limit=5&appid=${process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY}`
      );
      const data = await response.json();

      const locations = data.map((item: any) => ({
        name: item.name,
        state: item.state,
        country: item.country,
        lat: item.lat,
        lon: item.lon
      }));

      setSuggestions(locations);
    } catch (error) {
      console.error('Error searching locations:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        searchLocations(query);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleLocationSelect = (location: any) => {
    const selectedLocation: Location = {
      lat: location.lat,
      lon: location.lon,
      city: location.name,
      state: location.state,
      country: location.country
    };

    onLocationSelect(selectedLocation);
    setQuery(`${location.name}${location.state ? `, ${location.state}` : ''}, ${location.country}`);
    setSuggestions([]);
  };

  if (variant === 'current') {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <button
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
          Use Current Location
        </button>
        {currentLocation && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {currentLocation.city}, {currentLocation.country}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleLocationSelect(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border last:border-b-0"
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <div className="font-medium">{suggestion.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {suggestion.state && `${suggestion.state}, `}{suggestion.country}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

