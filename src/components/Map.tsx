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

    // Helper to calculate distance string for marker cards
    const getDistanceStr = (shopLat: number, shopLng: number, shopId: string) => {
      if (userLocation) {
        const R = 6371;
        const dLat = (shopLat - userLocation.latitude) * (Math.PI / 180);
        const dLon = (shopLng - userLocation.longitude) * (Math.PI / 180);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(userLocation.latitude * (Math.PI / 180)) * Math.cos(shopLat * (Math.PI / 180)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const dist = R * c;
        return dist < 0.1 ? '0.2 km' : `${dist.toFixed(1)} km`;
      }
      if (shopId === 'shop1') return '0.8 km';
      if (shopId === 'shop2') return '1.2 km';
      if (shopId === 'shop3') return '1.8 km';
      return '1.1 km';
    };

    // Add Real Interactive Markers for each Shop (Compact & Sleek Design to prevent map overlap)
    openShops.forEach((shop) => {
      const isSelected = selectedShop?.shop_id === shop.shop_id;
      const distanceDisplay = getDistanceStr(shop.latitude, shop.longitude, shop.shop_id);

      const customIcon = L.divIcon({
        className: 'custom-shop-card-marker',
        html: `
          <div class="relative group cursor-pointer flex flex-col items-center select-none" style="transform: translate(-50%, -100%);">
            <!-- White Card / Compact Pill -->
            <div class="flex items-center ${
              isSelected 
                ? 'gap-2 p-1.5 pr-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border-2 border-orange-500 ring-4 ring-orange-500/30 scale-110 z-50' 
                : 'gap-1.5 p-1 pr-2 bg-white/95 dark:bg-zinc-900/95 rounded-full shadow-md border border-gray-250/90 dark:border-zinc-800 hover:scale-105'
            } transition-all duration-200">
              
              <!-- Thumbnail Photo -->
              <img 
                src="${shop.image}" 
                alt="${shop.name}" 
                class="${isSelected ? 'h-8 w-8 rounded-xl' : 'h-5 w-5 rounded-full'} object-cover border border-gray-100 dark:border-zinc-800 shrink-0" 
              />
              
              <!-- Shop Info -->
              <div class="flex flex-col text-left min-w-0 pr-0.5">
                <span class="${isSelected ? 'text-[11px] max-w-[95px]' : 'text-[9.5px] max-w-[62px]'} font-extrabold text-gray-900 dark:text-white truncate leading-tight">
                  ${shop.name}
                </span>
                
                <div class="flex items-center gap-0.5">
                  <span class="text-[9px] font-black text-orange-500 flex items-center">
                    ★${shop.rating}
                  </span>
                  <span class="text-[8px] font-bold text-gray-400 dark:text-zinc-400">
                    • ${distanceDisplay}
                  </span>
                </div>
              </div>
            </div>

            <!-- Pointer Triangle & Orange Location Pin Dot -->
            <div class="flex flex-col items-center -mt-0.5">
              <div class="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] ${isSelected ? 'border-t-orange-500' : 'border-t-white dark:border-t-zinc-900'}"></div>
              <div class="h-2.5 w-2.5 rounded-full bg-orange-500 border border-white dark:border-zinc-900 shadow-md -mt-0.5"></div>
            </div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([shop.latitude, shop.longitude], { 
        icon: customIcon,
        zIndexOffset: isSelected ? 1000 : 10
      }).addTo(map);

      marker.on('click', () => {
        onSelectShop(shop);
      });

      markersRef.current[shop.shop_id] = marker;
    });

  }, [shops, openShops, userLocation, selectedShop]);

  // Handle Real User Location Pulsing Marker (Always on Top Layer)
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
          <div class="absolute h-full w-full animate-ping rounded-full bg-blue-500/50 opacity-75"></div>
          <div class="relative h-4.5 w-4.5 rounded-full bg-blue-600 border-2 border-white shadow-xl"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    userMarkerRef.current = L.marker([userLocation.latitude, userLocation.longitude], { 
      icon: userIcon,
      zIndexOffset: 2000 // Always render above shop cards so user location is 100% visible
    }).addTo(map);

    // Pan smoothly to real user location on initial detection
    map.flyTo([userLocation.latitude, userLocation.longitude], 14, { duration: 1.5 });
  }, [userLocation]);

  const routePolylineRef = useRef<L.Polyline | null>(null);

  // Handle camera panning and REAL street road navigation route
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Remove previous route line if any
    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }

    if (selectedShop) {
      const startLat = userLocation ? userLocation.latitude : defaultLat;
      const startLng = userLocation ? userLocation.longitude : defaultLng;
      const endLat = selectedShop.latitude;
      const endLng = selectedShop.longitude;

      // Fetch Real Street Driving Route from OpenStreetMap OSRM Engine
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;

      fetch(osrmUrl)
        .then(res => res.json())
        .then(data => {
          if (data && data.routes && data.routes[0] && data.routes[0].geometry) {
            const rawCoords = data.routes[0].geometry.coordinates; // [lng, lat]
            const routeLatLngs: [number, number][] = rawCoords.map(([lng, lat]: [number, number]) => [lat, lng]);

            if (routePolylineRef.current) {
              routePolylineRef.current.remove();
            }

            // Real Google Maps-style Blue Navigation Polyline following real roads
            const polyline = L.polyline(routeLatLngs, {
              color: '#3b82f6', // Electric Google Maps Blue
              weight: 6,
              opacity: 0.9,
              lineCap: 'round',
              lineJoin: 'round'
            }).addTo(map);

            routePolylineRef.current = polyline;

            // Smoothly fit bounds to show full real street route
            map.fitBounds(L.latLngBounds(routeLatLngs), { padding: [70, 70], maxZoom: 16 });
          } else {
            drawFallbackRoadRoute(startLat, startLng, endLat, endLng, map);
          }
        })
        .catch(() => {
          drawFallbackRoadRoute(startLat, startLng, endLat, endLng, map);
        });
    }
  }, [selectedShop, userLocation]);

  const drawFallbackRoadRoute = (startLat: number, startLng: number, endLat: number, endLng: number, map: L.Map) => {
    // Generate right-angle street grid waypoints (Manhattan street grid path)
    const midLat = startLat;
    const midLng = endLng;

    const gridWaypoints: [number, number][] = [
      [startLat, startLng],
      [midLat, midLng],
      [endLat, endLng]
    ];

    const polyline = L.polyline(gridWaypoints, {
      color: '#3b82f6',
      weight: 6,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    routePolylineRef.current = polyline;
    map.fitBounds(L.latLngBounds(gridWaypoints), { padding: [70, 70], maxZoom: 16 });
  };

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
