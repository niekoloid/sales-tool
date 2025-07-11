'use client';

import { useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import SearchForm from '@/components/SearchForm';
import SearchResults from '@/components/SearchResults';
import Map from '@/components/Map';
import { googleMapsService, PlaceDetails, SearchFilters } from '@/lib/google-maps';

export default function Home() {
  const [results, setResults] = useState<PlaceDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [centerPoint, setCenterPoint] = useState<{ lat: number; lng: number } | null>(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);

  const loadGoogleMaps = async () => {
    if (isGoogleMapsLoaded) return;
    
    try {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
        libraries: ['places', 'geometry']
      });
      
      await loader.load();
      setIsGoogleMapsLoaded(true);
    } catch (error) {
      console.error('Google Maps APIの読み込みに失敗しました:', error);
      alert('Google Maps APIの読み込みに失敗しました。APIキーを確認してください。');
    }
  };

  const handleSearch = async (filters: SearchFilters) => {
    setIsLoading(true);
    setCenterPoint(filters.center);
    
    try {
      if (!isGoogleMapsLoaded) {
        await loadGoogleMaps();
      }
      
      const places = await googleMapsService.searchPlaces(filters);
      setResults(places);
    } catch (error) {
      console.error('検索エラー:', error);
      alert('検索に失敗しました。条件を確認してください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">営業アタックリスト作成ツール</h1>
          <p className="mt-2 text-lg text-gray-600">
            Google Mapsのデータを使って効率的な営業リストを作成
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* 検索フォーム */}
          <div className="xl:col-span-1">
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          </div>
          
          {/* 地図とリスト */}
          <div className="xl:col-span-3">
            {centerPoint ? (
              <div className="space-y-6">
                {/* 地図 */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-bold text-gray-900">地図表示</h2>
                  </div>
                  <div className="h-[500px]">
                    {isGoogleMapsLoaded && (
                      <Map 
                        center={centerPoint}
                        places={results}
                        onPlaceSelect={setSelectedPlace}
                        selectedPlace={selectedPlace}
                      />
                    )}
                  </div>
                </div>
                
                {/* 検索結果リスト */}
                <div className="h-[400px] overflow-hidden">
                  <SearchResults 
                    results={results} 
                    centerPoint={centerPoint}
                    onPlaceSelect={setSelectedPlace}
                    selectedPlace={selectedPlace}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">検索を開始してください</h2>
                <p className="text-gray-500">
                  左側の検索フォームに条件を入力して、営業対象となる店舗や施設を検索できます。
                </p>
                <div className="mt-6 space-y-2 text-sm text-gray-600">
                  <p>✓ 業種別に絞り込み検索</p>
                  <p>✓ 指定地点からの距離で絞り込み</p>
                  <p>✓ レビュー数で品質をフィルタリング</p>
                  <p>✓ 検索結果をCSVで一括エクスポート</p>
                  <p>✓ 地図上でマーカー表示</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}