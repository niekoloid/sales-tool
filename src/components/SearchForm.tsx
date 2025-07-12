'use client';

import { useState } from 'react';
import { SearchFilters } from '@/lib/google-maps';

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading: boolean;
  currentLocation?: { lat: number; lng: number } | null;
  isGettingLocation?: boolean;
  locationError?: string | null;
}

const BUSINESS_TYPES = [
  { value: 'restaurant', label: 'レストラン', icon: '🍽️', category: 'food' },
  { value: 'cafe', label: 'カフェ', icon: '☕', category: 'food' },
  { value: 'bakery', label: 'ベーカリー', icon: '🥖', category: 'food' },
  { value: 'bar', label: 'バー・居酒屋', icon: '🍺', category: 'food' },
  
  { value: 'store', label: '小売店', icon: '🏪', category: 'retail' },
  { value: 'clothing_store', label: '服飾店', icon: '👔', category: 'retail' },
  { value: 'electronics_store', label: '電気店', icon: '📱', category: 'retail' },
  { value: 'supermarket', label: 'スーパー', icon: '🛒', category: 'retail' },
  { value: 'convenience_store', label: 'コンビニ', icon: '🏪', category: 'retail' },
  
  { value: 'hospital', label: '病院・医院', icon: '🏥', category: 'health' },
  { value: 'dentist', label: '歯科医院', icon: '🦷', category: 'health' },
  { value: 'pharmacy', label: '薬局', icon: '💊', category: 'health' },
  { value: 'beauty_salon', label: '美容院・サロン', icon: '💇', category: 'health' },
  { value: 'gym', label: 'ジム・フィットネス', icon: '💪', category: 'health' },
  
  { value: 'bank', label: '銀行', icon: '🏦', category: 'business' },
  { value: 'real_estate_agency', label: '不動産会社', icon: '🏠', category: 'business' },
  { value: 'insurance_agency', label: '保険会社', icon: '🛡️', category: 'business' },
  { value: 'accounting', label: '会計事務所', icon: '📊', category: 'business' },
  { value: 'lawyer', label: '法律事務所', icon: '⚖️', category: 'business' },
  
  { value: 'gas_station', label: 'ガソリンスタンド', icon: '⛽', category: 'automotive' },
  { value: 'car_dealer', label: '自動車販売店', icon: '🚗', category: 'automotive' },
  { value: 'car_repair', label: '自動車修理', icon: '🔧', category: 'automotive' },
  
  { value: 'school', label: '学校・教育機関', icon: '🏫', category: 'education' },
  { value: 'library', label: '図書館', icon: '📚', category: 'education' },
];

const BUSINESS_CATEGORIES = {
  food: { label: '飲食店', color: 'bg-orange-50 border-orange-200' },
  retail: { label: '小売・商業', color: 'bg-blue-50 border-blue-200' },
  health: { label: '健康・美容', color: 'bg-green-50 border-green-200' },
  business: { label: 'ビジネス・金融', color: 'bg-purple-50 border-purple-200' },
  automotive: { label: '自動車関連', color: 'bg-red-50 border-red-200' },
  education: { label: '教育・文化', color: 'bg-yellow-50 border-yellow-200' },
};

export default function SearchForm({ onSearch, isLoading, currentLocation, isGettingLocation, locationError }: SearchFormProps) {
  const [selectedBusinessTypes, setSelectedBusinessTypes] = useState<string[]>(['restaurant']);
  const [maxDistance, setMaxDistance] = useState(5000);
  const [maxReviews, setMaxReviews] = useState(100);
  const [address, setAddress] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setAddress(`現在地 (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`);
        },
        (error) => {
          console.error('位置情報の取得に失敗しました:', error);
          alert('位置情報の取得に失敗しました。手動で住所を入力してください。');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000
        }
      );
    } else {
      alert('このブラウザは位置情報機能に対応していません。');
    }
  };

  const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng()
          });
        } else {
          reject(new Error('住所の検索に失敗しました'));
        }
      });
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      alert('住所を入力するか現在地を取得してください。');
      return;
    }

    try {
      let center: { lat: number; lng: number };
      
      if (address.startsWith('現在地')) {
        const coords = address.match(/\((.*?),\s*(.*?)\)/);
        if (coords) {
          center = {
            lat: parseFloat(coords[1]),
            lng: parseFloat(coords[2])
          };
        } else {
          throw new Error('現在地の座標が正しくありません');
        }
      } else {
        center = await geocodeAddress(address);
      }

      if (selectedBusinessTypes.length === 0) {
        alert('業種を1つ以上選択してください。');
        return;
      }

      const filters: SearchFilters = {
        businessTypes: selectedBusinessTypes,
        maxDistance,
        minReviews: 0,
        maxReviews,
        center
      };

      onSearch(filters);
    } catch (error) {
      console.error('検索エラー:', error);
      alert('検索に失敗しました。住所を確認してください。');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          検索条件
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
        <div>
          <label htmlFor="address" className="block text-sm font-bold text-gray-900 mb-2">
            基準地点
          </label>
          <div className="space-y-2">
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="住所を入力してください（例: 東京駅）"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => {
                if (currentLocation) {
                  setAddress(`現在地 (${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)})`);
                } else {
                  getCurrentLocation();
                }
              }}
              disabled={isGettingLocation || (!currentLocation && locationError !== null)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGettingLocation ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>取得中...</span>
                </>
              ) : currentLocation ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>現在地を使用</span>
                </>
              ) : locationError ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span>取得失敗</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>現在地を取得</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-bold text-gray-900">
              業種選択 
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {selectedBusinessTypes.length}個選択中
              </span>
            </label>
            <button
              type="button"
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              {showAllCategories ? '▲ 閉じる' : '▼ すべて表示'}
            </button>
          </div>
          
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {Object.entries(BUSINESS_CATEGORIES).map(([categoryKey, category]) => {
              const categoryTypes = BUSINESS_TYPES.filter(type => type.category === categoryKey);
              const isExpanded = showAllCategories || categoryKey === 'food' || categoryKey === 'retail';
              
              if (!isExpanded && categoryKey !== 'food' && categoryKey !== 'retail') {
                return null;
              }
              
              return (
                <div key={categoryKey} className={`p-3 rounded-lg border ${category.color}`}>
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">{category.label}</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {categoryTypes.map((type) => {
                      const isSelected = selectedBusinessTypes.includes(type.value);
                      return (
                        <label 
                          key={type.value} 
                          className={`flex items-center p-2 rounded-md cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-blue-100 border border-blue-300' 
                              : 'bg-white border border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedBusinessTypes([...selectedBusinessTypes, type.value]);
                              } else {
                                setSelectedBusinessTypes(selectedBusinessTypes.filter(t => t !== type.value));
                              }
                            }}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center mr-3 ${
                            isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                          }`}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span className="text-lg mr-2">{type.icon}</span>
                          <span className="text-sm font-medium text-gray-900">{type.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedBusinessTypes(BUSINESS_TYPES.filter(t => t.category === 'food').map(t => t.value))}
              className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full hover:bg-orange-200 transition-colors"
            >
              飲食店をすべて選択
            </button>
            <button
              type="button"
              onClick={() => setSelectedBusinessTypes(BUSINESS_TYPES.filter(t => t.category === 'retail').map(t => t.value))}
              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors"
            >
              小売店をすべて選択
            </button>
            <button
              type="button"
              onClick={() => setSelectedBusinessTypes([])}
              className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              すべてクリア
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="maxDistance" className="block text-sm font-bold text-gray-900 mb-2">
            検索範囲
          </label>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">範囲:</span>
              <span className="text-lg font-bold text-blue-600">{(maxDistance / 1000).toFixed(1)}km</span>
            </div>
            <input
              type="range"
              id="maxDistance"
              min="500"
              max="50000"
              step="500"
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.5km</span>
              <span>10km</span>
              <span>25km</span>
              <span>50km</span>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="maxReviews" className="block text-sm font-bold text-gray-900 mb-2">
            レビュー数フィルタ
          </label>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">最大レビュー数:</span>
              <span className="text-lg font-bold text-green-600">{maxReviews}件</span>
            </div>
            <input
              type="range"
              id="maxReviews"
              min="1"
              max="500"
              step="5"
              value={maxReviews}
              onChange={(e) => setMaxReviews(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1件</span>
              <span>100件</span>
              <span>300件</span>
              <span>500件</span>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              レビュー数が少ない店舗を含めると新しい店舗を発見できます
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !address}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-md hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>検索中...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>検索開始</span>
            </>
          )}
        </button>
        
        {!address && (
          <p className="text-xs text-red-500 text-center">
            基準地点を入力してください
          </p>
        )}
        
        {selectedBusinessTypes.length === 0 && (
          <p className="text-xs text-red-500 text-center">
            業種を1つ以上選択してください
          </p>
        )}
      </form>
    </div>
  );
}