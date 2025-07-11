'use client';

import { useEffect, useRef, useState } from 'react';
import { PlaceDetails } from '@/lib/google-maps';

interface MapProps {
  center: { lat: number; lng: number };
  places: PlaceDetails[];
  onPlaceSelect?: (place: PlaceDetails) => void;
  selectedPlace?: PlaceDetails | null;
}

export default function Map({ center, places, onPlaceSelect, selectedPlace }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);

  // 地図を初期化
  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    const newMap = new google.maps.Map(mapRef.current, {
      center,
      zoom: 14,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    const newInfoWindow = new google.maps.InfoWindow();
    
    setMap(newMap);
    setInfoWindow(newInfoWindow);
  }, [center]);

  // 中心位置が変更された時に地図を移動
  useEffect(() => {
    if (map) {
      map.setCenter(center);
    }
  }, [map, center]);

  // マーカーを更新
  useEffect(() => {
    if (!map || !infoWindow) return;

    // 既存のマーカーを削除
    markers.forEach(marker => marker.setMap(null));

    // placesが空の場合は早期リターン
    if (places.length === 0) {
      setMarkers([]);
      return;
    }

    // 新しいマーカーを作成（検索結果表示時に即座に表示）
    const newMarkers = places.map((place, index) => {
      const marker = new google.maps.Marker({
        position: { lat: place.geometry.location.lat, lng: place.geometry.location.lng },
        map,
        title: place.name,
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#3B82F6" stroke="white" stroke-width="2"/>
              <text x="16" y="21" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">${index + 1}</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16)
        }
      });

      marker.addListener('click', () => {
        const content = `
          <div class="p-3 max-w-xs">
            <h3 class="font-bold text-lg mb-2">${place.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${place.formatted_address}</p>
            <div class="flex items-center mb-2">
              <span class="text-yellow-500">★</span>
              <span class="ml-1 text-sm">${place.rating} (${place.user_ratings_total}件)</span>
            </div>
            <button 
              onclick="window.selectPlace && window.selectPlace(${index})"
              class="w-full bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            >
              詳細を見る
            </button>
          </div>
        `;
        
        infoWindow.setContent(content);
        infoWindow.open(map, marker);
        
        // グローバル関数として設定
        (window as unknown as { selectPlace: (placeIndex: number) => void }).selectPlace = (placeIndex: number) => {
          if (onPlaceSelect) {
            onPlaceSelect(places[placeIndex]);
          }
          infoWindow.close();
        };
      });

      return marker;
    });

    setMarkers(newMarkers);

    // 地図の表示範囲を調整（検索結果が表示されたら即座に調整）
    if (places.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(center); // 中心点も含める
      places.forEach(place => {
        bounds.extend({ lat: place.geometry.location.lat, lng: place.geometry.location.lng });
      });
      
      // アニメーション付きで地図を調整
      map.fitBounds(bounds);
      
      // ズームレベルが高すぎる場合は制限
      const listener = google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom() && map.getZoom()! > 16) {
          map.setZoom(16);
        }
        google.maps.event.removeListener(listener);
      });
    } else {
      // 検索結果がない場合は中心点のみ表示
      map.setCenter(center);
      map.setZoom(14);
    }
  }, [map, places, infoWindow, onPlaceSelect, center, markers]);

  // 選択された場所のマーカーをハイライト
  useEffect(() => {
    if (!selectedPlace || markers.length === 0) return;

    const selectedIndex = places.findIndex(place => place.place_id === selectedPlace.place_id);
    if (selectedIndex >= 0 && markers[selectedIndex]) {
      // 選択されたマーカーの位置に地図を移動
      map?.panTo({ 
        lat: selectedPlace.geometry.location.lat, 
        lng: selectedPlace.geometry.location.lng 
      });
      
      // マーカーをクリックしたときと同じ動作
      google.maps.event.trigger(markers[selectedIndex], 'click');
    }
  }, [selectedPlace, markers, places, map]);

  return (
    <div className="h-full w-full">
      <div 
        ref={mapRef} 
        className="h-full w-full rounded-lg shadow-md"
      />
    </div>
  );
}