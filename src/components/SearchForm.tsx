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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-900">検索条件</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="address" className="block text-sm font-bold text-gray-900 mb-2">
            基準地点
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="住所を入力してください"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-600"
            />
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {isGettingLocation ? '取得中...' : '現在地'}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="businessType" className="block text-sm font-bold text-gray-900 mb-2">
            業種
          </label>
          <select
            id="businessType"
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          >
            {BUSINESS_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="maxDistance" className="block text-sm font-bold text-gray-900 mb-2">
            検索範囲: {(maxDistance / 1000).toFixed(1)}km
          </label>
          <input
            type="range"
            id="maxDistance"
            min="500"
            max="50000"
            step="500"
            value={maxDistance}
            onChange={(e) => setMaxDistance(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-700 mt-1 font-medium">
            <span>0.5km</span>
            <span>50km</span>
          </div>
        </div>

        <div>
          <label htmlFor="maxReviews" className="block text-sm font-bold text-gray-900 mb-2">
            最大レビュー数: {maxReviews}件
          </label>
          <input
            type="range"
            id="maxReviews"
            min="1"
            max="500"
            step="5"
            value={maxReviews}
            onChange={(e) => setMaxReviews(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-700 mt-1 font-medium">
            <span>1件</span>
            <span>500件</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '検索中...' : '検索'}
        </button>
      </form>
    </div>
  );
}