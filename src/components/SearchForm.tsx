'use client';

import { useState } from 'react';
import { SearchFilters } from '@/lib/google-maps';

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading: boolean;
}

const BUSINESS_TYPES = [
  { value: 'restaurant', label: 'レストラン' },
  { value: 'store', label: '小売店' },
  { value: 'hospital', label: '病院・医院' },
  { value: 'beauty_salon', label: '美容院・サロン' },
  { value: 'gas_station', label: 'ガソリンスタンド' },
  { value: 'bank', label: '銀行' },
  { value: 'pharmacy', label: '薬局' },
  { value: 'gym', label: 'ジム・フィットネス' },
  { value: 'dentist', label: '歯科医院' },
  { value: 'car_dealer', label: '自動車販売店' },
  { value: 'real_estate_agency', label: '不動産会社' },
  { value: 'insurance_agency', label: '保険会社' },
  { value: 'accounting', label: '会計事務所' },
  { value: 'lawyer', label: '法律事務所' },
  { value: 'school', label: '学校・教育機関' }
];

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [businessType, setBusinessType] = useState('restaurant');
  const [maxDistance, setMaxDistance] = useState(5000);
  const [maxReviews, setMaxReviews] = useState(100);
  const [address, setAddress] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setAddress(`現在地 (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`);
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('位置情報の取得に失敗しました:', error);
          alert('位置情報の取得に失敗しました。手動で住所を入力してください。');
          setIsGettingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000
        }
      );
    } else {
      alert('このブラウザは位置情報機能に対応していません。');
      setIsGettingLocation(false);
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

      const filters: SearchFilters = {
        businessType,
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
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGettingLocation ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>取得中...</span>
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
          <label htmlFor="businessType" className="block text-sm font-bold text-gray-900 mb-2">
            業種
          </label>
          <div className="relative">
            <select
              id="businessType"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 appearance-none bg-white transition-colors"
            >
              {BUSINESS_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
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
      </form>
    </div>
  );
}