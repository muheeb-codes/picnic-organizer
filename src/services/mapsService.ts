import { LocationData } from '../types/weather';

export class MapsService {
  private static isLoaded = false;

  static async initialize(): Promise<void> {
    this.isLoaded = true;
  }

  static async searchPlaces(query: string): Promise<LocationData[]> {
    // Return mock data for common park searches since we're using iframe maps
    return this.getMockParkData(query);
  }

  static async geocodeAddress(address: string): Promise<LocationData> {
    // Fallback geocoding for major locations
    return this.fallbackGeocode(address);
  }

  static async getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({
            lat: latitude,
            lng: longitude,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          });
        },
        (error) => {
          reject(new Error('Failed to get current location'));
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  }

  static generateMapUrl(location: LocationData, zoom: number = 15): string {
    // Generate Google Maps embed URL (no API key required for basic embed)
    const query = encodeURIComponent(location.name || location.address);
    return `https://www.google.com/maps/embed/v1/place?key=demo&q=${query}&zoom=${zoom}`;
  }

  static generateDirectionsUrl(location: LocationData): string {
    // Generate Google Maps directions URL
    const query = encodeURIComponent(location.name || location.address);
    return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  }

  private static getMockParkData(query: string): LocationData[] {
    // Enhanced mock data for common park searches
    const mockParks = [
      {
        lat: 40.7829,
        lng: -73.9654,
        address: "Central Park, New York, NY, USA",
        name: "Central Park",
        placeId: "mock_central_park"
      },
      {
        lat: 37.7749,
        lng: -122.4194,
        address: "Golden Gate Park, San Francisco, CA, USA",
        name: "Golden Gate Park",
        placeId: "mock_golden_gate"
      },
      {
        lat: 34.0522,
        lng: -118.2437,
        address: "Griffith Park, Los Angeles, CA, USA",
        name: "Griffith Park",
        placeId: "mock_griffith"
      },
      {
        lat: 41.8781,
        lng: -87.6298,
        address: "Grant Park, Chicago, IL, USA",
        name: "Grant Park",
        placeId: "mock_grant"
      },
      {
        lat: 25.7617,
        lng: -80.1918,
        address: "Bayfront Park, Miami, FL, USA",
        name: "Bayfront Park",
        placeId: "mock_bayfront"
      },
      {
        lat: 51.5074,
        lng: -0.1278,
        address: "Hyde Park, London, UK",
        name: "Hyde Park",
        placeId: "mock_hyde_park"
      },
      {
        lat: 48.8566,
        lng: 2.3522,
        address: "Luxembourg Gardens, Paris, France",
        name: "Luxembourg Gardens",
        placeId: "mock_luxembourg"
      },
      {
        lat: 52.5200,
        lng: 13.4050,
        address: "Tiergarten, Berlin, Germany",
        name: "Tiergarten",
        placeId: "mock_tiergarten"
      },
      {
        lat: 35.6762,
        lng: 139.6503,
        address: "Ueno Park, Tokyo, Japan",
        name: "Ueno Park",
        placeId: "mock_ueno"
      },
      {
        lat: -33.8688,
        lng: 151.2093,
        address: "Royal Botanic Gardens, Sydney, Australia",
        name: "Royal Botanic Gardens",
        placeId: "mock_botanic_sydney"
      }
    ];

    // Filter based on query if possible
    const queryLower = query.toLowerCase();
    const filtered = mockParks.filter(park => 
      park.name.toLowerCase().includes(queryLower) ||
      park.address.toLowerCase().includes(queryLower) ||
      queryLower.includes(park.name.toLowerCase().split(' ')[0])
    );

    return filtered.length > 0 ? filtered : mockParks.slice(0, 5);
  }

  private static fallbackGeocode(address: string): LocationData {
    // Enhanced fallback geocoding for major cities and landmarks
    const locationMap: { [key: string]: { lat: number; lng: number; name?: string } } = {
      // US Cities
      'new york': { lat: 40.7128, lng: -74.0060, name: 'Central Park' },
      'los angeles': { lat: 34.0522, lng: -118.2437, name: 'Griffith Park' },
      'chicago': { lat: 41.8781, lng: -87.6298, name: 'Grant Park' },
      'houston': { lat: 29.7604, lng: -95.3698, name: 'Hermann Park' },
      'phoenix': { lat: 33.4484, lng: -112.0740, name: 'Papago Park' },
      'philadelphia': { lat: 39.9526, lng: -75.1652, name: 'Fairmount Park' },
      'san antonio': { lat: 29.4241, lng: -98.4936, name: 'Brackenridge Park' },
      'san diego': { lat: 32.7157, lng: -117.1611, name: 'Balboa Park' },
      'dallas': { lat: 32.7767, lng: -96.7970, name: 'White Rock Lake Park' },
      'san francisco': { lat: 37.7749, lng: -122.4194, name: 'Golden Gate Park' },
      'seattle': { lat: 47.6062, lng: -122.3321, name: 'Discovery Park' },
      'denver': { lat: 39.7392, lng: -104.9903, name: 'City Park' },
      'washington': { lat: 38.9072, lng: -77.0369, name: 'National Mall' },
      'boston': { lat: 42.3601, lng: -71.0589, name: 'Boston Common' },
      'miami': { lat: 25.7617, lng: -80.1918, name: 'Bayfront Park' },
      'atlanta': { lat: 33.7490, lng: -84.3880, name: 'Piedmont Park' },
      
      // International Cities
      'london': { lat: 51.5074, lng: -0.1278, name: 'Hyde Park' },
      'paris': { lat: 48.8566, lng: 2.3522, name: 'Luxembourg Gardens' },
      'berlin': { lat: 52.5200, lng: 13.4050, name: 'Tiergarten' },
      'tokyo': { lat: 35.6762, lng: 139.6503, name: 'Ueno Park' },
      'sydney': { lat: -33.8688, lng: 151.2093, name: 'Royal Botanic Gardens' },
      'toronto': { lat: 43.6532, lng: -79.3832, name: 'High Park' },
      'vancouver': { lat: 49.2827, lng: -123.1207, name: 'Stanley Park' },
      'melbourne': { lat: -37.8136, lng: 144.9631, name: 'Royal Botanic Gardens' },
      
      // Famous Parks
      'central park': { lat: 40.7829, lng: -73.9654, name: 'Central Park' },
      'golden gate park': { lat: 37.7749, lng: -122.4194, name: 'Golden Gate Park' },
      'hyde park': { lat: 51.5074, lng: -0.1278, name: 'Hyde Park' },
      'stanley park': { lat: 49.2827, lng: -123.1207, name: 'Stanley Park' },
      'balboa park': { lat: 32.7157, lng: -117.1611, name: 'Balboa Park' }
    };

    const lowerAddress = address.toLowerCase();
    for (const [key, coords] of Object.entries(locationMap)) {
      if (lowerAddress.includes(key)) {
        return {
          lat: coords.lat,
          lng: coords.lng,
          address: address,
          name: coords.name
        };
      }
    }

    // Default to a central location if no match found
    return {
      lat: 39.8283,
      lng: -98.5795,
      address: address
    };
  }

  static isApiAvailable(): boolean {
    return true; // Always available since we're using iframe maps
  }
}