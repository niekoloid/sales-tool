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
  businessTypes: string[];
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
    try {
      await this.loader.load();
      const map = new google.maps.Map(document.createElement('div'));
      this.placesService = new google.maps.places.PlacesService(map);
    } catch (error) {
      throw new Error(`Google Maps APIの初期化に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // キャッシュをクリアするメソッド
  clearCache(): void {
    this.placesService = null;
  }

  // APIの状態をチェックするメソッド
  isInitialized(): boolean {
    return this.placesService !== null && typeof window !== 'undefined' && !!window.google;
  }

  async searchPlaces(filters: SearchFilters): Promise<PlaceDetails[]> {
    try {
      if (!this.placesService) {
        await this.initialize();
      }

      // 複数の業種タイプで並列検索を実行
      const searchPromises = filters.businessTypes.map(businessType => 
        new Promise<google.maps.places.PlaceResult[]>((resolve) => {
          const request: google.maps.places.PlaceSearchRequest = {
            location: new google.maps.LatLng(filters.center.lat, filters.center.lng),
            radius: filters.maxDistance,
            type: businessType,
          };

          this.placesService!.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              resolve(results);
            } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
              resolve([]);
            } else {
              console.warn(`Search failed for ${businessType}: ${status}`);
              resolve([]); // エラーでも空配列を返して他の検索を継続
            }
          });
        })
      );

      const resultArrays = await Promise.all(searchPromises);
      
      // 全ての結果をマージし、重複を除去
      const allResults = resultArrays.flat();
      const uniqueResults = allResults.filter((place, index, self) => 
        index === self.findIndex(p => p.place_id === place.place_id)
      );

      if (uniqueResults.length === 0) {
        return [];
      }

      const filteredResults = uniqueResults
        .filter(place => {
          // 基本的なフィルタリング
          const hasRequiredFields = place.place_id && place.name && place.geometry?.location;
          const hasRatingInRange = !place.user_ratings_total || 
            (place.user_ratings_total >= filters.minReviews && place.user_ratings_total <= filters.maxReviews);
          const isOperational = !place.business_status || place.business_status === 'OPERATIONAL';
          
          return hasRequiredFields && hasRatingInRange && isOperational;
        })
        .slice(0, 50) // 最大50件に制限
        .map(place => ({
          place_id: place.place_id!,
          name: place.name!,
          formatted_address: place.vicinity || place.formatted_address || '位置情報なし',
          rating: place.rating || 0,
          user_ratings_total: place.user_ratings_total || 0,
          types: place.types || [],
          geometry: {
            location: {
              lat: place.geometry!.location!.lat(),
              lng: place.geometry!.location!.lng()
            }
          },
          business_status: place.business_status || 'OPERATIONAL'
        }));

      // 詳細情報を並列取得（最初の10件のみ）
      const detailedResults = await Promise.all(
        filteredResults.slice(0, 10).map(async (place) => {
          try {
            const details = await this.getPlaceDetails(place.place_id);
            return details || place;
          } catch {
            return place; // 詳細取得に失敗しても基本情報を返す
          }
        })
      );

      // 詳細取得した結果と残りの結果を結合
      const finalResults = [...detailedResults, ...filteredResults.slice(10)];
      
      return finalResults;
    } catch (error) {
      throw new Error(`検索の初期化に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private getErrorMessage(status: google.maps.places.PlacesServiceStatus): string {
    switch (status) {
      case google.maps.places.PlacesServiceStatus.INVALID_REQUEST:
        return '無効な検索リクエストです。検索条件を確認してください。';
      case google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT:
        return 'APIの使用制限を超過しました。しばらく待ってから再度お試しください。';
      case google.maps.places.PlacesServiceStatus.REQUEST_DENIED:
        return 'APIキーの設定に問題があります。管理者にお問い合わせください。';
      case google.maps.places.PlacesServiceStatus.UNKNOWN_ERROR:
        return 'サーバーエラーが発生しました。再度お試しください。';
      default:
        return `検索に失敗しました: ${status}`;
    }
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    try {
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

        // タイムアウトを設定
        const timeout = setTimeout(() => {
          reject(new Error('詳細情報の取得がタイムアウトしました'));
        }, 10000);

        this.placesService!.getDetails(request, (place, status) => {
          clearTimeout(timeout);
          
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            try {
              const details: PlaceDetails = {
                place_id: place.place_id!,
                name: place.name!,
                formatted_address: place.formatted_address || place.vicinity || '位置情報なし',
                rating: place.rating || 0,
                user_ratings_total: place.user_ratings_total || 0,
                types: place.types || [],
                geometry: {
                  location: {
                    lat: place.geometry!.location!.lat(),
                    lng: place.geometry!.location!.lng()
                  }
                },
                business_status: place.business_status || 'OPERATIONAL',
                formatted_phone_number: place.formatted_phone_number,
                website: place.website,
                opening_hours: place.opening_hours ? {
                  open_now: place.opening_hours.open_now || false,
                  weekday_text: place.opening_hours.weekday_text || []
                } : undefined
              };

              resolve(details);
            } catch (error) {
              reject(new Error(`詳細情報の処理に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`));
            }
          } else {
            const errorMessage = this.getErrorMessage(status);
            reject(new Error(errorMessage));
          }
        });
      });
    } catch (error) {
      throw new Error(`詳細情報取得の初期化に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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