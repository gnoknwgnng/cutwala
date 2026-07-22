import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Plus, Minus } from 'lucide-react';
import type { BarberShop } from '../mock/mockData';
import { useStore } from '../store/useStore';

interface MapProps {
  onSelectShop: (shop: BarberShop) => void;
  selectedShop: BarberShop | null;
  searchQuery: string;
}

export const Map: React.FC<MapProps> = ({ onSelectShop, selectedShop, searchQuery }) => {
  const { shops, userLocation, requestRealLocation } = useStore();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const userMarkerRef = useRef<L.Marker | null>(null);

  const openShops = shops.filter(shop => shop.status === 'OPEN');

  // Trigger real browser location request on mount if not available
  useEffect(() => {
    if (!userLocation) {
      requestRealLocation();
    }
  }, []);

  // Default center coordinates (User GPS location if available, otherwise shop 1)
  const defaultLat = userLocation ? userLocation.latitude : (selectedShop ? selectedShop.latitude : 37.7816);
  const defaultLng = userLocation ? userLocation.longitude : (selectedShop ? selectedShop.longitude : -122.4156);

  // Initialize Leaflet Real Interactive Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [defaultLat, defaultLng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false
      });

      // CartoDB Voyager tiles (Modern Google Maps-like vibrant street tiles)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous shop markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Add Real Interactive Markers for each Shop
    openShops.forEach((shop) => {
      const isSelected = selectedShop?.shop_id === shop.shop_id;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="relative group cursor-pointer flex flex-col items-center select-none">
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-2xl transition-all duration-300 border ${
              isSelected 
                ? 'bg-orange-500 text-white border-white ring-4 ring-orange-500/30 scale-110' 
                : 'bg-white text-gray-900 border-gray-200 dark:bg-zinc-900 dark:text-white dark:border-zinc-800 hover:scale-105'
            }">
              <span class="text-xs">💈</span>
              <span class="text-[11px] font-extrabold whitespace-nowrap">${shop.name.split(' ')[0]}</span>
              <span class="text-[10px] font-extrabold ${isSelected ? 'text-amber-200' : 'text-orange-500'}">★${shop.rating}</span>
            </div>
            <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] ${
              isSelected ? 'border-t-orange-500' : 'border-t-white dark:border-t-zinc-900'
            } -mt-0.5"></div>
          </div>
        `,
        iconSize: [110, 40],
        iconAnchor: [55, 40],
      });

      const marker = L.marker([shop.latitude, shop.longitude], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        onSelectShop(shop);
      });

      markersRef.current[shop.shop_id] = marker;
    });

  }, [shops, openShops]);

  // Handle Real User Location Pulsing Marker
  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation) return;
    const map = mapInstanceRef.current;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    const userIcon = L.divIcon({
      className: 'user-gps-marker',
      html: `
        <div class="relative flex h-8 w-8 items-center justify-center -translate-x-1/2 -translate-y-1/2">
          <div class="absolute h-full w-full animate-ping rounded-full bg-blue-500/40 opacity-75"></div>
          <div class="relative h-4 w-4 rounded-full bg-blue-600 border-2 border-white shadow-lg"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    userMarkerRef.current = L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon }).addTo(map);

    // Pan smoothly to real user location on initial detection
    map.flyTo([userLocation.latitude, userLocation.longitude], 14, { duration: 1.5 });
  }, [userLocation]);

  // Handle camera panning when selectedShop changes
  useEffect(() => {
    if (mapInstanceRef.current && selectedShop) {
      mapInstanceRef.current.flyTo(
        [selectedShop.latitude, selectedShop.longitude],
        15,
        { duration: 1.2, easeLinearity: 0.25 }
      );
    }
  }, [selectedShop]);

  // Handle Search Query filtering
  useEffect(() => {
    if (searchQuery.trim() !== '' && mapInstanceRef.current) {
      const match = openShops.find(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (match) {
        onSelectShop(match);
      }
    }
  }, [searchQuery]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleRecenter = () => {
    requestRealLocation();
    if (mapInstanceRef.current && userLocation) {
      mapInstanceRef.current.flyTo([userLocation.latitude, userLocation.longitude], 15);
    }
  };

  return (
    <div className="relative h-full w-full select-none overflow-hidden bg-gray-100 dark:bg-zinc-950">
      
      {/* Real Leaflet Map Container */}
      <div 
        ref={mapContainerRef} 
        className="h-full w-full z-0" 
      />

      {/* Floating Map Controls */}
      <div className="absolute top-20 right-4 z-20 flex flex-col gap-2 md:top-6">
        {/* Recenter GPS Button */}
        <button 
          onClick={handleRecenter}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-200 shadow-xl border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer group"
          title="Recenter Real GPS Location"
        >
          <Navigation className="h-5 w-5 text-orange-500 group-hover:scale-110 transition-transform" />
        </button>

        {/* Zoom Controls */}
        <div className="flex flex-col rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
          <button 
            onClick={handleZoomIn}
            className="flex h-11 w-11 items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 active:scale-95 transition-all border-b border-gray-100 dark:border-zinc-800 cursor-pointer"
            title="Zoom in"
          >
            <Plus className="h-5 w-5" />
          </button>
          <button 
            onClick={handleZoomOut}
            className="flex h-11 w-11 items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer"
            title="Zoom out"
          >
            <Minus className="h-5 w-5" />
          </button>
        </div>
      </div>

    </div>
  );
};
