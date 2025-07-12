'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { PlaceDetails } from '@/lib/google-maps';

interface MapProps {
  center: { lat: number; lng: number };
  places: PlaceDetails[];
  onPlaceSelect?: (place: PlaceDetails) => void;
  selectedPlace?: PlaceDetails | null;
  currentLocation?: { lat: number; lng: number } | null;
}

export default function Map({ center, places, onPlaceSelect, selectedPlace, currentLocation }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Record<string, google.maps.Marker>>({});
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [searchRadiusCircle, setSearchRadiusCircle] = useState<google.maps.Circle | null>(null);
  const [currentLocationMarker, setCurrentLocationMarker] = useState<google.maps.Marker | null>(null);

  // 地図を初期化
  useEffect(() => {
    if (!mapRef.current) return;

    const initializeMap = async () => {
      try {
        setIsMapLoading(true);
        setMapError(null);

        // Google Maps APIが読み込まれるまで待機
        if (!window.google) {
          const checkGoogleMaps = () => {
            return new Promise<void>((resolve, reject) => {
              const timeout = setTimeout(() => {
                reject(new Error('Google Maps APIの読み込みがタイムアウトしました'));
              }, 10000);

              const checkInterval = setInterval(() => {
                if (window.google && window.google.maps) {
                  clearTimeout(timeout);
                  clearInterval(checkInterval);
                  resolve();
                }
              }, 100);
            });
          };
          await checkGoogleMaps();
        }

        const newMap = new google.maps.Map(mapRef.current!, {
          center,
          zoom: 14,
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT
          },
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
          },
          streetViewControl: true,
          streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
          },
          fullscreenControl: true,
          scaleControl: true,
          rotateControl: true,
          clickableIcons: true,
          gestureHandling: 'cooperative',
          keyboardShortcuts: true,
          disableDoubleClickZoom: false,
          draggable: true,
          scrollwheel: true,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            },
            {
              featureType: 'transit',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        const newInfoWindow = new google.maps.InfoWindow({
          maxWidth: 300
        });
        
        setMap(newMap);
        setInfoWindow(newInfoWindow);
        setIsMapLoading(false);
      } catch (error) {
        console.error('地図の初期化に失敗しました:', error);
        setMapError(error instanceof Error ? error.message : '地図の読み込みに失敗しました');
        setIsMapLoading(false);
      }
    };

    initializeMap();
  }, [center]);

  // 検索範囲を表示する関数
  const updateSearchRadius = useCallback((center: { lat: number; lng: number }, radiusMeters: number) => {
    if (!map) return;

    // 既存の円を削除
    if (searchRadiusCircle) {
      searchRadiusCircle.setMap(null);
    }

    // 新しい検索範囲の円を作成
    const circle = new google.maps.Circle({
      strokeColor: '#3B82F6',
      strokeOpacity: 0.6,
      strokeWeight: 2,
      fillColor: '#3B82F6',
      fillOpacity: 0.1,
      map,
      center,
      radius: radiusMeters
    });

    setSearchRadiusCircle(circle);
  }, [map, searchRadiusCircle]);

  // 中心位置が変更された時に地図を移動
  useEffect(() => {
    if (map) {
      // 滑らかな移動
      map.panTo(center);
      // 検索範囲を表示（デフォルト5km）
      setTimeout(() => {
        updateSearchRadius(center, 5000);
      }, 500); // 地図の移動完了後に検索範囲を更新
    }
  }, [map, center, updateSearchRadius]);

  // マーカーを効率的に更新
  useEffect(() => {
    if (!map || !infoWindow) return;

    // 既存のマーカーのplace_idを取得
    const existingPlaceIds = new Set(Object.keys(markersRef.current));
    const newPlaceIds = new Set(places.map(place => place.place_id));

    // 削除すべきマーカーを特定して削除
    const updatedMarkers = { ...markersRef.current };
    existingPlaceIds.forEach(placeId => {
      if (!newPlaceIds.has(placeId)) {
        const marker = updatedMarkers[placeId];
        if (marker) {
          google.maps.event.clearInstanceListeners(marker);
          marker.setMap(null);
          delete updatedMarkers[placeId];
        }
      }
    });

    // 新しいマーカーを作成
    let hasNewMarkers = false;
    places.forEach((place, index) => {
      if (!updatedMarkers[place.place_id]) {
        hasNewMarkers = true;
        const marker = new google.maps.Marker({
          position: { lat: place.geometry.location.lat, lng: place.geometry.location.lng },
          map,
          title: place.name,
          icon: {
            url: 'data:image/svg+xml;base64,' + btoa(`
              <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="16" fill="#3B82F6" stroke="white" stroke-width="3"/>
                <circle cx="20" cy="20" r="12" fill="#1E40AF"/>
                <text x="20" y="26" text-anchor="middle" fill="white" font-family="Arial" font-size="14" font-weight="bold">${index + 1}</text>
              </svg>
            `),
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 20)
          },
          animation: google.maps.Animation.DROP
        });

        marker.addListener('click', () => {
          const distance = calculateDistance(center, place.geometry.location);
          const content = `
            <div class="p-4 max-w-sm">
              <div class="flex items-start justify-between mb-3">
                <h3 class="font-bold text-lg text-gray-900 pr-2">${place.name}</h3>
                <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">#${index + 1}</span>
              </div>
              <p class="text-sm text-gray-600 mb-3">${place.formatted_address}</p>
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center">
                  <span class="text-yellow-400 text-lg">★</span>
                  <span class="ml-1 text-sm font-medium">${place.rating}</span>
                  <span class="ml-1 text-xs text-gray-500">(${place.user_ratings_total}件)</span>
                </div>
                <span class="text-xs text-gray-600 font-medium">${distance.toFixed(1)}km</span>
              </div>
              ${place.business_status === 'OPERATIONAL' ? '<div class="mb-3"><span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">営業中</span></div>' : ''}
              <button 
                onclick="selectPlaceFromMap('${place.place_id}')"
                class="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                詳細を表示
              </button>
            </div>
          `;
          
          infoWindow.setContent(content);
          infoWindow.open(map, marker);
        });

        updatedMarkers[place.place_id] = marker;
      }
    });

    // グローバル関数を安全に設定
    (window as typeof window & { selectPlaceFromMap?: (placeId: string) => void }).selectPlaceFromMap = (placeId: string) => {
      const place = places.find(p => p.place_id === placeId);
      if (place && onPlaceSelect) {
        onPlaceSelect(place);
      }
      infoWindow.close();
    };

    // 地図の表示範囲を調整（新しいマーカーがある場合のみ）
    if (places.length > 0 && hasNewMarkers) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(center);
      places.forEach(place => {
        bounds.extend({ lat: place.geometry.location.lat, lng: place.geometry.location.lng });
      });
      
      map.fitBounds(bounds);
      
      const listener = google.maps.event.addListener(map, 'idle', () => {
        const zoom = map.getZoom();
        if (zoom && zoom > 16) {
          map.setZoom(16);
        }
        google.maps.event.removeListener(listener);
      });
    }

    // マーカーが変更された場合のみ状態を更新
    if (hasNewMarkers || existingPlaceIds.size !== newPlaceIds.size) {
      markersRef.current = updatedMarkers;
    }
  }, [map, places, infoWindow, onPlaceSelect, center]);

  // 距離計算関数
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

  // 現在地マーカーを管理
  useEffect(() => {
    if (!map || !currentLocation) return;

    // 既存の現在地マーカーを削除
    if (currentLocationMarker) {
      currentLocationMarker.setMap(null);
    }

    // 現在地マーカーを作成
    const marker = new google.maps.Marker({
      position: currentLocation,
      map,
      title: '現在地',
      icon: {
        url: 'data:image/svg+xml;base64,' + btoa(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="#10B981" stroke="white" stroke-width="3"/>
            <circle cx="16" cy="16" r="8" fill="#059669"/>
            <circle cx="16" cy="16" r="3" fill="white"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 16)
      },
      zIndex: 1000 // 他のマーカーより上に表示
    });

    // 現在地マーカーのクリックイベント
    marker.addListener('click', () => {
      const content = `
        <div class="p-3 max-w-xs text-center">
          <div class="text-green-500 text-2xl mb-2">📍</div>
          <h3 class="font-bold text-lg mb-2 text-gray-900">現在地</h3>
          <p class="text-sm text-gray-600 mb-3">あなたの現在位置です</p>
          <div class="text-xs text-gray-500">
            <p>緯度: ${currentLocation.lat.toFixed(6)}</p>
            <p>経度: ${currentLocation.lng.toFixed(6)}</p>
          </div>
        </div>
      `;
      
      infoWindow?.setContent(content);
      infoWindow?.open(map, marker);
    });

    setCurrentLocationMarker(marker);
  }, [map, currentLocation, infoWindow]); // eslint-disable-line react-hooks/exhaustive-deps

  // 選択された場所のマーカーをハイライト
  useEffect(() => {
    if (!selectedPlace || !map) return;

    const marker = markersRef.current[selectedPlace.place_id];
    if (marker) {
      // 選択されたマーカーの位置に地図を移動
      map.panTo({ 
        lat: selectedPlace.geometry.location.lat, 
        lng: selectedPlace.geometry.location.lng 
      });
      
      // マーカーをクリックしたときと同じ動作
      google.maps.event.trigger(marker, 'click');
    }
  }, [selectedPlace, map]);

  // コンポーネントのクリーンアップ
  useEffect(() => {
    return () => {
      // マーカーをクリーンアップ
      Object.values(markersRef.current).forEach(marker => {
        marker.setMap(null);
      });
      markersRef.current = {};
      
      // 現在地マーカーをクリーンアップ
      if (currentLocationMarker) {
        currentLocationMarker.setMap(null);
      }
      
      // 検索範囲の円をクリーンアップ
      if (searchRadiusCircle) {
        searchRadiusCircle.setMap(null);
      }
      
      // グローバル関数をクリーンアップ
      if (typeof window !== 'undefined') {
        delete (window as typeof window & { selectPlaceFromMap?: (placeId: string) => void }).selectPlaceFromMap;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (mapError) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center p-6">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">地図の読み込みエラー</h3>
          <p className="text-sm text-gray-600 mb-4">{mapError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
          >
            ページを再読み込み
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      {isMapLoading && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">地図を読み込み中...</p>
          </div>
        </div>
      )}
      <div 
        ref={mapRef} 
        className="h-full w-full rounded-lg shadow-md map-container"
        style={{ 
          minHeight: '400px'
        }}
      />
      {places.length > 0 && (
        <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md text-sm font-medium text-gray-700">
          {places.length}件の結果を表示中
        </div>
      )}
    </div>
  );
}