import { Loader } from '@googlemaps/js-api-loader';

export interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  rating: number;
  user_ratings_total: number;
  types: string[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  business_status?: string;
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: {
    open_now: boolean;
    weekday_text: string[];
  };
}

export interface SearchFilters {
  businessType: string;
  maxDistance: number;
  minReviews: number;
  maxReviews: number;
  center: {
    lat: number;
    lng: number;
  };
}

class GoogleMapsService {
  private loader: Loader;
  private placesService: google.maps.places.PlacesService | null = null;

  constructor() {
    this.loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
      libraries: ['places', 'geometry']
    });
  }

  async initialize(): Promise<void> {
    await this.loader.load();
    const map = new google.maps.Map(document.createElement('div'));
    this.placesService = new google.maps.places.PlacesService(map);
  }

  async searchPlaces(filters: SearchFilters): Promise<PlaceDetails[]> {
    if (!this.placesService) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      const request: google.maps.places.PlaceSearchRequest = {
        location: new google.maps.LatLng(filters.center.lat, filters.center.lng),
        radius: filters.maxDistance,
        type: filters.businessType,
      };

      this.placesService!.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const filteredResults = results
            .filter(place => 
              place.user_ratings_total && 
              place.user_ratings_total >= filters.minReviews &&
              place.user_ratings_total <= filters.maxReviews &&
              place.business_status === 'OPERATIONAL' // 営業中の店舗のみ
            )
            .map(place => ({
              place_id: place.place_id!,
              name: place.name!,
              formatted_address: place.vicinity!,
              rating: place.rating || 0,
              user_ratings_total: place.user_ratings_total || 0,
              types: place.types || [],
              geometry: {
                location: {
                  lat: place.geometry!.location!.lat(),
                  lng: place.geometry!.location!.lng()
                }
              },
              business_status: place.business_status
            }));

          resolve(filteredResults);
        } else {
          reject(new Error(`Places search failed: ${status}`));
        }
      });
    });
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    if (!this.placesService) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      const request: google.maps.places.PlaceDetailsRequest = {
        placeId: placeId,
        fields: [
          'place_id',
          'name',
          'formatted_address',
          'rating',
          'user_ratings_total',
          'types',
          'geometry',
          'business_status',
          'formatted_phone_number',
          'website',
          'opening_hours'
        ]
      };

      this.placesService!.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          const details: PlaceDetails = {
            place_id: place.place_id!,
            name: place.name!,
            formatted_address: place.formatted_address!,
            rating: place.rating || 0,
            user_ratings_total: place.user_ratings_total || 0,
            types: place.types || [],
            geometry: {
              location: {
                lat: place.geometry!.location!.lat(),
                lng: place.geometry!.location!.lng()
              }
            },
            business_status: place.business_status,
            formatted_phone_number: place.formatted_phone_number,
            website: place.website,
            opening_hours: place.opening_hours ? {
              open_now: place.opening_hours.open_now || false,
              weekday_text: place.opening_hours.weekday_text || []
            } : undefined
          };

          resolve(details);
        } else {
          reject(new Error(`Place details failed: ${status}`));
        }
      });
    });
  }

  calculateDistance(point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number {
    const lat1Rad = (point1.lat * Math.PI) / 180;
    const lat2Rad = (point2.lat * Math.PI) / 180;
    const deltaLatRad = ((point2.lat - point1.lat) * Math.PI) / 180;
    const deltaLngRad = ((point2.lng - point1.lng) * Math.PI) / 180;

    const a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(deltaLngRad / 2) * Math.sin(deltaLngRad / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return 6371 * c; // Earth's radius in kilometers
  }
}

export const googleMapsService = new GoogleMapsService();