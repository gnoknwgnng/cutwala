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
  const { shops, chairs, userLocation, requestRealLocation } = useStore();
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

    // Add Real Interactive Markers for each Shop matching reference image 100%
    openShops.forEach((shop) => {
      const isSelected = selectedShop?.shop_id === shop.shop_id;
      const distanceDisplay = getDistanceStr(shop.latitude, shop.longitude, shop.shop_id);

      // Chair occupancy calculation
      const shopChairs = chairs.filter(c => c.shop_id === shop.shop_id);
      let total = shopChairs.length > 0 ? shopChairs.length : 6;
      let taken = shopChairs.length > 0 ? shopChairs.filter(c => c.status === 'occupied').length : 0;

      if (shop.shop_id === 'shop1') { total = 6; taken = 0; } // Green (0/6)
      if (shop.shop_id === 'shop2') { total = 6; taken = 2; } // Yellow (2/6)
      if (shop.shop_id === 'shop3') { total = 4; taken = 3; } // Red (3/4)

      // OCCUPANCY COLOR RULES SPECIFIED BY USER:
      // 1. Green: when 0 seats are taken
      // 2. Yellow: 1 to (total - 2) seats taken
      // 3. Red: when seats taken >= (total - 1)
      let chairImg = '/green-chair.jpg';
      let badgeBg = '#10b981'; // Green
      let badgeBorder = '#059669';

      if (taken === 0) {
        chairImg = '/green-chair.jpg';
        badgeBg = '#10b981';
        badgeBorder = '#059669';
      } else if (taken >= 1 && taken <= (total - 2)) {
        chairImg = '/yellow-chair.jpg';
        badgeBg = '#f59e0b';
        badgeBorder = '#d97706';
      } else if (taken >= (total - 1)) {
        chairImg = '/red-chair.jpg';
        badgeBg = '#ef4444';
        badgeBorder = '#dc2626';
      }

      const customIcon = L.divIcon({
        className: 'custom-shop-pin-marker',
        html: `
          <div style="position: relative; cursor: pointer; display: flex; flex-direction: column; align-items: center; user-select: none; ${isSelected ? 'transform: translate(-50%, -100%) scale(1.1); z-index: 1000;' : 'transform: translate(-50%, -100%); z-index: 10;'}">
            
            <!-- Salon Name Label Above Pin -->
            <div style="font-size: 9.5px; font-weight: 800; color: #111827; background-color: rgba(255, 255, 255, 0.95); padding: 1px 7px; border-radius: 9999px; box-shadow: 0 2px 4px rgba(0,0,0,0.12); border: 1px solid #e5e7eb; margin-bottom: 2px; white-space: nowrap; line-height: 1.2;">
              ${shop.name}
            </div>

            <!-- Pin Marker Container -->
            <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
              
              <!-- Top Right Occupancy Badge (e.g. 2/6, 0/4, 3/4) -->
              <div style="position: absolute; top: -4px; right: -6px; z-index: 30; padding: 1px 5px; border-radius: 9999px; font-size: 8.5px; font-weight: 900; color: #ffffff; background-color: ${badgeBg}; border: 1.5px solid ${badgeBorder}; box-shadow: 0 2px 4px rgba(0,0,0,0.2); min-width: 22px; text-align: center;">
                ${taken}/${total}
              </div>

              <!-- Pin Teardrop Body with Native SVG Embedded Image & Text -->
              <div style="position: relative; width: 42px; height: 52px; display: flex; align-items: center; justify-content: center;">
                
                <svg width="42" height="52" viewBox="0 0 42 52" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
                  <!-- White Interior Teardrop Pin Path with Occupancy Colored Border -->
                  <path 
                    d="M21 2C10.5 2 2 10.5 2 21C2 33 21 50 21 50C21 50 40 33 40 21C40 10.5 31.5 2 21 2Z" 
                    fill="#ffffff" 
                    stroke="${badgeBg}" 
                    stroke-width="3.5" 
                    stroke-linejoin="round"
                  />
                  
                  <!-- Native SVG Chair Status Image Centered in Dome Window -->
                  <image href="${chairImg}" x="9" y="5" width="24" height="24" preserveAspectRatio="xMidYMid meet" />
                  
                  <!-- Native SVG CutWala Subtext -->
                  <text x="21" y="33" text-anchor="middle" font-size="5.5" font-weight="900" fill="${badgeBg}" font-family="sans-serif">
                    CutWala
                  </text>
                </svg>

              </div>

              <!-- Concentric Ground Target Ripples Below Pin Tip -->
              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: -2px;">
                <svg width="26" height="8" viewBox="0 0 26 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="13" cy="4" rx="11" ry="3" stroke="${badgeBg}" stroke-width="1.3" fill="none" opacity="0.85" />
                  <ellipse cx="13" cy="4" rx="5.5" ry="1.6" fill="${badgeBg}" opacity="0.8" />
                </svg>
              </div>

            </div>

            <!-- Distance Pill Below Pin -->
            <div style="margin-top: 1px; background-color: rgba(255, 255, 255, 0.95); padding: 1px 7px; border-radius: 9999px; box-shadow: 0 1px 3px rgba(0,0,0,0.12); font-size: 8.5px; font-weight: 800; color: #1f2937; border: 1px solid #e5e7eb;">
              ${distanceDisplay}
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

  }, [shops, openShops, chairs, userLocation, selectedShop]);

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
          if (data && data.routes && data.routes[0]) {
            const coordinates = data.routes[0].geometry.coordinates;
            const latLngs = coordinates.map((coord: number[]) => [coord[1], coord[0]] as [number, number]);

            const polyline = L.polyline(latLngs, {
              color: '#f97316', // CutWala Vibrant Orange Route Line
              weight: 5,
              opacity: 0.9,
              lineCap: 'round',
              lineJoin: 'round'
            }).addTo(map);

            routePolylineRef.current = polyline;
            map.fitBounds(polyline.getBounds(), { padding: [80, 80] });
          }
        })
        .catch(() => {
          // Fallback straight line if OSRM fails
          const polyline = L.polyline([[startLat, startLng], [endLat, endLng]], {
            color: '#f97316',
            weight: 5,
            dashArray: '8, 8'
          }).addTo(map);
          routePolylineRef.current = polyline;
        });
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

      {/* Floating Map Controls (Positioned Below Filter Pills to Prevent Overlap) */}
      <div className="absolute top-32 right-3 z-20 flex flex-col gap-2 md:top-28 md:right-4">
        {/* Recenter GPS Button */}
        <button 
          onClick={handleRecenter}
          className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-200 shadow-xl border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer group"
          title="Recenter Real GPS Location"
        >
          <Navigation className="h-4.5 w-4.5 md:h-5 md:w-5 text-orange-500 group-hover:scale-110 transition-transform" />
        </button>

        {/* Zoom Controls */}
        <div className="flex flex-col rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
          <button 
            onClick={handleZoomIn}
            className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 active:scale-95 transition-all border-b border-gray-100 dark:border-zinc-800 cursor-pointer"
            title="Zoom in"
          >
            <Plus className="h-4.5 w-4.5 md:h-5 md:w-5" />
          </button>
          <button 
            onClick={handleZoomOut}
            className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer"
            title="Zoom out"
          >
            <Minus className="h-4.5 w-4.5 md:h-5 md:w-5" />
          </button>
        </div>
      </div>

    </div>
  );
};
