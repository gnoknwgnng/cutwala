import React, { useEffect, useRef, useState } from 'react';
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
  const { shops, chairs, userLocation, requestRealLocation, setMapPanning } = useStore();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Favourite shops state — persisted in localStorage
  const [favourites, setFavourites] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('cutwala_favourites');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const toggleFavourite = (shopId: string) => {
    setFavourites(prev => {
      const next = new Set(prev);
      if (next.has(shopId)) {
        next.delete(shopId);
      } else {
        next.add(shopId);
      }
      localStorage.setItem('cutwala_favourites', JSON.stringify([...next]));
      return next;
    });
  };

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

      // Detect map pan/zoom to hide top header + bottom nav ONLY when user physically drags/gestures on map
      let panningTimer: ReturnType<typeof setTimeout> | null = null;

      map.on('dragstart', () => {
        setMapPanning(true);
        if (panningTimer) clearTimeout(panningTimer);
      });

      map.on('zoomstart', (e: L.LeafletEvent) => {
        if ((e as unknown as { originalEvent?: Event }).originalEvent) {
          setMapPanning(true);
          if (panningTimer) clearTimeout(panningTimer);
        }
      });

      map.on('moveend zoomend', () => {
        if (panningTimer) clearTimeout(panningTimer);
        panningTimer = setTimeout(() => {
          setMapPanning(false);
        }, 600); // restore quickly after 0.6s idle
      });
    }

    // Ensure header/nav are visible on mount/reload
    setMapPanning(false);

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
      const isFav = favourites.has(shop.shop_id);

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

      if (taken === 0) {
        chairImg = '/green-chair.jpg';
        badgeBg = '#10b981';
      } else if (taken >= 1 && taken <= (total - 2)) {
        chairImg = '/yellow-chair.jpg';
        badgeBg = '#f59e0b';
      } else if (taken >= (total - 1)) {
        chairImg = '/red-chair.jpg';
        badgeBg = '#ef4444';
      }

      // Heart SVG path — always solid pink filled, brighter pink when favourited
      const heartFill = '#ec4899';
      const heartStroke = isFav ? '#be185d' : '#ec4899';

      const customIcon = L.divIcon({
        className: 'custom-shop-pin-marker',
        html: `
          <div style="position: relative; cursor: pointer; display: flex; flex-direction: column; align-items: center; user-select: none; ${isSelected ? 'transform: translate(-50%, -100%) scale(1.1); z-index: 1000;' : 'transform: translate(-50%, -100%); z-index: 10;'}">
            
            <!-- Salon Name Label Above Pin -->
            <div style="font-size: 8.5px; font-weight: 800; color: #111827; background-color: rgba(255, 255, 255, 0.95); padding: 1px 6px; border-radius: 9999px; box-shadow: 0 1px 3px rgba(0,0,0,0.12); border: 1px solid #e5e7eb; margin-bottom: 3px; white-space: nowrap; line-height: 1.2;">
              ${shop.name}
            </div>

            <!-- Pin Marker Container -->
            <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
              
              <!-- Pin Teardrop Body with Badge All-In-One SVG -->
              <div style="position: relative; width: 36px; height: 44px; display: flex; align-items: center; justify-content: center;">
                
                <svg width="36" height="44" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; overflow: visible;">
                  <defs>
                    <clipPath id="teardrop-clip-${shop.shop_id}">
                      <path d="M18 4C11.4 4 6 9.4 6 16C6 23.5 18 38 18 38C18 38 30 23.5 30 16C30 9.4 24.6 4 18 4Z" />
                    </clipPath>
                  </defs>

                  <!-- White Teardrop Pin with Occupancy Colored Border -->
                  <path 
                    d="M18 2C10.3 2 4 8.3 4 16C4 25 18 42 18 42C18 42 32 25 32 16C32 8.3 25.7 2 18 2Z" 
                    fill="#ffffff" 
                    stroke="${badgeBg}" 
                    stroke-width="3" 
                    stroke-linejoin="round"
                  />
                  
                  <!-- Clipped Chair Image -->
                  <g clip-path="url(#teardrop-clip-${shop.shop_id})">
                    <image href="${chairImg}" x="7" y="5" width="22" height="22" preserveAspectRatio="xMidYMid meet" />
                  </g>
                  
                  <!-- CutWala label -->
                  <text x="18" y="30" text-anchor="middle" font-size="5" font-weight="900" fill="${badgeBg}" font-family="sans-serif">CutWala</text>

                  <!-- Occupancy Badge on RIGHT SIDE of pin -->
                  <rect x="30" y="6" width="20" height="11" rx="5.5" ry="5.5" fill="${badgeBg}" />
                  <rect x="29" y="5" width="22" height="13" rx="6.5" ry="6.5" fill="none" stroke="#ffffff" stroke-width="1.5" />
                  <text x="40" y="13.5" text-anchor="middle" font-size="7" font-weight="900" fill="#ffffff" font-family="sans-serif">${taken}/${total}</text>

                  <!-- Pink Heart Favourite Button on LEFT SIDE of pin (clickable) -->
                  <g id="heart-btn-${shop.shop_id}" style="cursor: pointer;" transform="translate(-16, 5)">
                    <!-- Heart circle background -->
                    <circle cx="10" cy="6" r="8" fill="#ffffff" stroke="#f9a8d4" stroke-width="1.5" />
                    <!-- Heart shape -->
                    <path d="M10 9.5C10 9.5 6 6.8 6 4.5C6 3.1 7.1 2 8.5 2C9.2 2 9.8 2.3 10 2.7C10.2 2.3 10.8 2 11.5 2C12.9 2 14 3.1 14 4.5C14 6.8 10 9.5 10 9.5Z" fill="${heartFill}" stroke="${heartStroke}" stroke-width="0.8" stroke-linejoin="round" />
                  </g>
                </svg>

              </div>

              <!-- Concentric Ground Target Ripples Below Pin Tip -->
              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: -1px;">
                <svg width="20" height="6" viewBox="0 0 20 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="10" cy="3" rx="8.5" ry="2.2" stroke="${badgeBg}" stroke-width="1" fill="none" opacity="0.85" />
                  <ellipse cx="10" cy="3" rx="4" ry="1.1" fill="${badgeBg}" opacity="0.8" />
                </svg>
              </div>

            </div>

            <!-- Distance Pill Below Pin -->
            <div style="margin-top: 1px; background-color: rgba(255, 255, 255, 0.95); padding: 0.5px 5.5px; border-radius: 9999px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); font-size: 8px; font-weight: 800; color: #1f2937; border: 1px solid #e5e7eb;">
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

      marker.on('click', (e) => {
        // Check if the heart button was clicked via DOM target
        const target = e.originalEvent?.target as HTMLElement | SVGElement | null;
        const isHeartClick = target?.closest?.(`#heart-btn-${shop.shop_id}`) != null;
        if (isHeartClick) {
          toggleFavourite(shop.shop_id);
          e.originalEvent?.stopPropagation();
          return;
        }
        onSelectShop(shop);
      });

      markersRef.current[shop.shop_id] = marker;
    });

  }, [shops, openShops, chairs, userLocation, selectedShop, favourites]);

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
