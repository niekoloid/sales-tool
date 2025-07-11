'use client';

import { PlaceDetails } from '@/lib/google-maps';
import Papa from 'papaparse';

interface SearchResultsProps {
  results: PlaceDetails[];
  centerPoint: { lat: number; lng: number };
  onPlaceSelect?: (place: PlaceDetails) => void;
  selectedPlace?: PlaceDetails | null;
}

export default function SearchResults({ results, centerPoint, onPlaceSelect, selectedPlace }: SearchResultsProps) {
  const calculateDistance = (point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number => {
    const lat1Rad = (point1.lat * Math.PI) / 180;
    const lat2Rad = (point2.lat * Math.PI) / 180;
    const deltaLatRad = ((point2.lat - point1.lat) * Math.PI) / 180;
    const deltaLngRad = ((point2.lng - point1.lng) * Math.PI) / 180;

    const a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(deltaLngRad / 2) * Math.sin(deltaLngRad / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return 6371 * c;
  };

  const exportToCSV = () => {
    const csvData = results.map((place, index) => ({
      '番号': index + 1,
      '店舗名': place.name,
      '住所': place.formatted_address,
      '評価': place.rating,
      'レビュー数': place.user_ratings_total,
      '距離(km)': calculateDistance(centerPoint, place.geometry.location).toFixed(2),
      '業種': place.types.join(', '),
      '営業状況': place.business_status === 'OPERATIONAL' ? '営業中' : '不明',
      '電話番号': place.formatted_phone_number || '',
      'ウェブサイト': place.website || '',
      '緯度': place.geometry.location.lat,
      '経度': place.geometry.location.lng
    }));

    const csv = Papa.unparse(csvData, {
      header: true
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `attack_list_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md h-full flex items-center justify-center">
        <p className="text-gray-800 text-center font-medium">検索結果がありません</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-bold text-gray-900">検索結果 ({results.length}件)</h2>
        <button
          onClick={exportToCSV}
          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
        >
          CSVエクスポート
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {results.map((place, index) => (
            <div 
              key={place.place_id} 
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                selectedPlace?.place_id === place.place_id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onPlaceSelect?.(place)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-start space-x-2">
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{place.name}</h3>
                    {place.business_status === 'OPERATIONAL' && (
                      <span className="text-xs text-green-700 font-semibold">営業中</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm text-gray-800 font-medium">{place.rating}</span>
                  <span className="text-xs text-gray-700">({place.user_ratings_total})</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-800 mb-2">{place.formatted_address}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-700">
                <span className="font-medium">距離: {calculateDistance(centerPoint, place.geometry.location).toFixed(2)}km</span>
                <div className="flex space-x-2">
                  {place.formatted_phone_number && (
                    <span>📞</span>
                  )}
                  {place.website && (
                    <span>🌐</span>
                  )}
                </div>
              </div>
              
              {(place.formatted_phone_number || place.website) && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  {place.formatted_phone_number && (
                    <div className="text-xs text-gray-800 mb-1 font-medium">
                      📞 {place.formatted_phone_number}
                    </div>
                  )}
                  {place.website && (
                    <div className="text-xs">
                      <a
                        href={place.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:underline font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        🌐 ウェブサイト
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}