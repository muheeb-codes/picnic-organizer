import React, { useState, useEffect } from 'react';
import { MapPin, Search, Navigation, ExternalLink } from 'lucide-react';
import { MapsService } from '../services/mapsService';
import { LocationData } from '../types/weather';

interface LocationSelectorProps {
  selectedLocation: LocationData | null;
  onLocationSelect: (location: LocationData) => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedLocation,
  onLocationSelect
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await MapsService.searchPlaces(searchQuery);
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Search failed:', error);
      // Fallback to geocoding
      try {
        const location = await MapsService.geocodeAddress(searchQuery);
        setSearchResults([location]);
        setShowResults(true);
      } catch (geocodeError) {
        console.error('Geocoding failed:', geocodeError);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      const location = await MapsService.getCurrentLocation();
      onLocationSelect(location);
    } catch (error) {
      console.error('Failed to get current location:', error);
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleLocationSelect = (location: LocationData) => {
    onLocationSelect(location);
    setShowResults(false);
    setSearchQuery(location.name || location.address);
    setShowMap(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const openInGoogleMaps = () => {
    if (selectedLocation) {
      const url = MapsService.generateDirectionsUrl(selectedLocation);
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    if (selectedLocation) {
      setSearchQuery(selectedLocation.name || selectedLocation.address);
      setShowMap(true);
    }
  }, [selectedLocation]);

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Picnic Location
      </label>
      
      <div className="relative">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for parks, beaches, or enter an address..."
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
          </div>
          
          <button
            type="button"
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isSearching ? (
              <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </button>
          
          <button
            type="button"
            onClick={handleCurrentLocation}
            disabled={isGettingLocation}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            title="Use current location"
          >
            {isGettingLocation ? (
              <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Search Results */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
            {searchResults.map((location, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleLocationSelect(location)}
                className="w-full p-3 text-left hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    {location.name && (
                      <div className="font-medium text-gray-900">{location.name}</div>
                    )}
                    <div className="text-sm text-gray-600">{location.address}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedLocation && (
        <div className="space-y-4">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  {selectedLocation.name && (
                    <div className="font-medium text-green-900">{selectedLocation.name}</div>
                  )}
                  <div className="text-sm text-green-700">{selectedLocation.address}</div>
                  <div className="text-xs text-green-600 mt-1">
                    {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                  </div>
                </div>
              </div>
              <button
                onClick={openInGoogleMaps}
                className="flex items-center space-x-1 text-green-600 hover:text-green-800 transition-colors duration-200"
                title="Open in Google Maps"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm">Directions</span>
              </button>
            </div>
          </div>

          {/* Map Display */}
          {showMap && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-64 relative">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${selectedLocation.lng}!3d${selectedLocation.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2sus!4v1234567890123`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Picnic Location Map"
                />
              </div>
              <div className="p-3 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Click "Directions" to open in Google Maps for navigation
                  </div>
                  <button
                    onClick={() => setShowMap(false)}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    Hide Map
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="text-sm text-gray-500">
        💡 Tip: Search for "parks near [your city]" or specific park names for best results
      </div>
    </div>
  );
};