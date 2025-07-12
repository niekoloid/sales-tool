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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border-b gap-3">
        <h2 className="text-lg font-bold text-gray-900">
          検索結果 
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">
            {results.length}件
          </span>
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="hidden sm:inline">CSVエクスポート</span>
            <span className="sm:hidden">CSV</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2 sm:p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 gap-3">
            {results.map((place, index) => (
              <div 
                key={place.place_id} 
                className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedPlace?.place_id === place.place_id 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => onPlaceSelect?.(place)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">{place.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {place.business_status === 'OPERATIONAL' && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            営業中
                          </span>
                        )}
                        <span className="text-xs text-gray-500 font-medium">
                          距離: {calculateDistance(centerPoint, place.geometry.location).toFixed(1)}km
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <span className="text-yellow-400 text-sm">★</span>
                    <span className="text-sm text-gray-800 font-medium">{place.rating}</span>
                    <span className="text-xs text-gray-500 hidden sm:inline">({place.user_ratings_total})</span>
                  </div>
                </div>
                
                <p className="text-xs sm:text-sm text-gray-700 mb-3 line-clamp-2">{place.formatted_address}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {place.formatted_phone_number && (
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-400 text-sm">📞</span>
                        <span className="text-xs text-gray-600 hidden sm:block truncate max-w-[120px]">
                          {place.formatted_phone_number}
                        </span>
                      </div>
                    )}
                    {place.website && (
                      <a
                        href={place.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-sm">🌐</span>
                        <span className="text-xs hidden sm:inline">Web</span>
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">レビュー:</span>
                    <span className="text-xs font-medium text-gray-700">{place.user_ratings_total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {results.length > 10 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                さらに{results.length - 10}件の結果があります
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}