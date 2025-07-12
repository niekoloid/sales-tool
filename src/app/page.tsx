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
    
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    console.log('API Key status:', apiKey ? 'Set' : 'Not set');
    
    if (!apiKey) {
      console.error('Google Maps API key is not set');
      alert('Google Maps APIキーが設定されていません。環境変数を確認してください。');
      return;
    }
    
    try {
      const loader = new Loader({
        apiKey: apiKey,
        version: 'weekly',
        libraries: ['places', 'geometry']
      });
      
      await loader.load();
      setIsGoogleMapsLoaded(true);
      console.log('Google Maps loaded successfully');
    } catch (error) {
      console.error('Google Maps APIの読み込みに失敗しました:', error);
      alert('Google Maps APIの読み込みに失敗しました。APIキーと設定を確認してください。');
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              営業アタックリスト作成ツール
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600">
              Google Mapsのデータを使って効率的な営業リストを作成
            </p>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 検索フォーム - モバイルでは上、デスクトップでは左 */}
          <div className="lg:w-80 lg:flex-shrink-0">
            <div className="sticky top-6">
              <SearchForm onSearch={handleSearch} isLoading={isLoading} />
            </div>
          </div>
          
          {/* 結果表示エリア */}
          <div className="flex-1 min-w-0">
            {centerPoint ? (
              <div className="space-y-6">
                {/* モバイル: タブ切り替え、デスクトップ: 縦並び */}
                <div className="lg:hidden">
                  {/* モバイル用タブ */}
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="flex border-b">
                      <button 
                        className={`flex-1 py-3 px-4 text-sm font-medium ${
                          selectedPlace ? 'text-gray-500 border-b-2 border-transparent' : 'text-blue-600 border-b-2 border-blue-600'
                        }`}
                        onClick={() => setSelectedPlace(null)}
                      >
                        リスト ({results.length})
                      </button>
                      <button 
                        className={`flex-1 py-3 px-4 text-sm font-medium ${
                          selectedPlace ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 border-b-2 border-transparent'
                        }`}
                      >
                        地図
                      </button>
                    </div>
                    
                    <div className="h-[500px]">
                      {!selectedPlace ? (
                        <SearchResults 
                          results={results} 
                          centerPoint={centerPoint}
                          onPlaceSelect={setSelectedPlace}
                          selectedPlace={selectedPlace}
                        />
                      ) : (
                        <div className="h-full">
                          {isGoogleMapsLoaded && (
                            <Map 
                              center={centerPoint}
                              places={results}
                              onPlaceSelect={setSelectedPlace}
                              selectedPlace={selectedPlace}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* デスクトップ用レイアウト */}
                <div className="hidden lg:block space-y-6">
                  {/* 検索結果リスト */}
                  <div className="h-[350px]">
                    <SearchResults 
                      results={results} 
                      centerPoint={centerPoint}
                      onPlaceSelect={setSelectedPlace}
                      selectedPlace={selectedPlace}
                    />
                  </div>
                  
                  {/* 地図 */}
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4 border-b flex items-center justify-between">
                      <h2 className="text-lg font-bold text-gray-900">地図表示</h2>
                      {results.length > 0 && (
                        <span className="text-sm text-gray-600">
                          {results.length}件の結果を表示
                        </span>
                      )}
                    </div>
                    <div className="h-[500px]">
                      {isGoogleMapsLoaded ? (
                        <Map 
                          center={centerPoint}
                          places={results}
                          onPlaceSelect={setSelectedPlace}
                          selectedPlace={selectedPlace}
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center bg-gray-50">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-sm text-gray-600">Google Mapsを読み込み中...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 結果がない場合 */}
                {results.length === 0 && !isLoading && (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="text-gray-400 text-6xl mb-4">📍</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">検索結果がありません</h3>
                    <p className="text-gray-600 mb-4">検索条件を変更して再度お試しください。</p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li>・ 検索範囲を幅げてみる</li>
                      <li>・ 別の業種を選択する</li>
                      <li>・ レビュー数の条件を緩める</li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-8 text-center">
                  <div className="text-blue-500 text-6xl mb-6">🎯</div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                    検索を開始してください
                  </h2>
                  <p className="text-gray-600 mb-8">
                    左側の検索フォームに条件を入力して、営業対象となる店舗や施設を検索できます。
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-blue-500 text-2xl mb-2">🏢</div>
                      <h3 className="font-semibold text-gray-900 mb-1">業種別検索</h3>
                      <p className="text-sm text-gray-600">レストラン、小売店など業種で絞り込み</p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-green-500 text-2xl mb-2">📍</div>
                      <h3 className="font-semibold text-gray-900 mb-1">距離範囲指定</h3>
                      <p className="text-sm text-gray-600">指定地点からの距離で絞り込み</p>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="text-yellow-500 text-2xl mb-2">⭐</div>
                      <h3 className="font-semibold text-gray-900 mb-1">品質フィルタ</h3>
                      <p className="text-sm text-gray-600">レビュー数で品質をフィルタリング</p>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-purple-500 text-2xl mb-2">📄</div>
                      <h3 className="font-semibold text-gray-900 mb-1">CSVエクスポート</h3>
                      <p className="text-sm text-gray-600">検索結果を一括エクスポート</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* ローディングオーバーレイ */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-900 font-medium">検索中...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}