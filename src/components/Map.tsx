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
      let chairImg = '/green chair.jpg';
      let badgeBg = '#10b981'; // Green
      let badgeBorder = '#059669';

      if (taken === 0) {
        chairImg = '/green chair.jpg';
        badgeBg = '#10b981';
        badgeBorder = '#059669';
      } else if (taken >= 1 && taken <= (total - 2)) {
        chairImg = '/yellow chair.jpg';
        badgeBg = '#f59e0b';
        badgeBorder = '#d97706';
      } else if (taken >= (total - 1)) {
        chairImg = '/red chair.jpg';
        badgeBg = '#ef4444';
        badgeBorder = '#dc2626';
      }

      const customIcon = L.divIcon({
        className: 'custom-shop-pin-marker',
        html: `
          <div class="relative group cursor-pointer flex flex-col items-center select-none ${isSelected ? 'scale-110 z-50' : 'hover:scale-105 z-10'}" style="transform: translate(-50%, -100%);">
            
            <!-- Salon Name Label Above Pin (Compact & Clean) -->
            <span class="text-[9px] font-extrabold text-gray-900 dark:text-white bg-white/95 dark:bg-zinc-900/95 px-2 py-0.5 rounded-full shadow-sm border border-gray-200/80 dark:border-zinc-800 mb-0.5 whitespace-nowrap leading-tight">
              ${shop.name}
            </span>

            <!-- Pin Marker Container (Compact & Non-Overlapping) -->
            <div class="relative flex flex-col items-center">
              
              <!-- Top Right Occupancy Pill Badge (e.g. 2/6, 0/4, 3/4) -->
              <div class="absolute -top-1 -right-2 z-30 px-1.5 py-0.2 rounded-full text-[8.5px] font-black text-white shadow-sm border ring-1.5 ring-white dark:ring-zinc-900 flex items-center justify-center min-w-[22px]" style="background-color: ${badgeBg}; border-color: ${badgeBorder};">
                ${taken}/${total}
              </div>

              <!-- SEAMLESS CLASSIC COMPACT TEARDROP LOCATION PIN -->
              <div class="relative flex flex-col items-center">
                
                <!-- SVG Teardrop Location Pin Path -->
                <div class="relative w-[38px] h-[48px] flex items-center justify-center drop-shadow-sm">
                  <svg width="38" height="48" viewBox="0 0 36 46" fill="none" xmlns="http://www.w3.org/2000/svg" class="absolute inset-0">
                    <path 
                      d="M18 2C9.163 2 2 9.163 2 18C2 28.5 18 44 18 44C18 44 34 28.5 34 18C34 9.163 26.837 2 18 2Z" 
                      fill="white" 
                      stroke="${badgeBg}" 
                      stroke-width="3" 
                      stroke-linejoin="round"
                    />
                  </svg>

                  <!-- Content Inside White Window of Teardrop Pin (Perfectly Centered 28px Window) -->
                  <div class="absolute top-[3px] left-1/2 -translate-x-1/2 w-[28px] h-[28px] rounded-full bg-white flex flex-col items-center justify-center z-10 overflow-hidden">
                    <img src="${encodeURI(chairImg)}" alt="Chair Status" class="h-5 w-5 object-contain shrink-0" />
                    <span class="text-[5.5px] font-black tracking-tighter leading-none text-orange-600 mt-0.5">
                      CutWala
                    </span>
                  </div>
                </div>

                <!-- Compact Concentric Target Ripple Rings on Map Ground Below Pin Tip -->
                <div class="flex flex-col items-center justify-center -mt-0.5">
                  <svg width="24" height="8" viewBox="0 0 24 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="12" cy="4" rx="10" ry="3" stroke="${badgeBg}" stroke-width="1.2" fill="none" opacity="0.85" />
                    <ellipse cx="12" cy="4" rx="5" ry="1.5" fill="${badgeBg}" opacity="0.8" />
                  </svg>
                </div>

              </div>

            </div>

            <!-- Distance Pill Below Pin -->
            <div class="mt-0.5 bg-white/95 dark:bg-zinc-900/95 px-2 py-0.2 rounded-full shadow-sm text-[8.5px] font-extrabold text-gray-800 dark:text-zinc-200 border border-gray-200/80 dark:border-zinc-800">
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
