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

// GPS-relative offsets: each shop is placed at a fixed offset from the user's real location
// so they always appear nearby no matter where the user is in the world.
const shopOffsets: Record<string, { lat: number; lng: number }> = {
  shop1: { lat:  0.004, lng: -0.006 },  // NW  — 0/4 green
  shop2: { lat:  0.006, lng:  0.003 },  // NE  — 1/4 yellow
  shop3: { lat: -0.003, lng: -0.004 },  // SW  — 2/6 yellow
  shop4: { lat: -0.005, lng:  0.005 },  // SE  — 5/6 red
  shop5: { lat:  0.001, lng:  0.007 },  // E   — 1/4 yellow + favourite
};

export const Map: React.FC<MapProps> = ({ onSelectShop, selectedShop, searchQuery }) => {
  const { shops, chairs, userLocation, requestRealLocation, setMapPanning, favoriteShops, setFavorite } = useStore();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const userMarkerRef = useRef<L.Marker | null>(null);

  const openShops = shops.filter(shop => shop.status === 'OPEN');

  // Reset map panning state and trigger real browser location request on mount
  useEffect(() => {
    setMapPanning(false);
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

    // Add Real Interactive Markers for each Shop matching reference image (large floating barber/chair figure)
    openShops.forEach((shop) => {
      const offset = shopOffsets[shop.shop_id] ?? { lat: 0, lng: 0 };
      // Use GPS-relative position when user location is known
      const markerLat = userLocation ? userLocation.latitude  + offset.lat : shop.latitude;
      const markerLng = userLocation ? userLocation.longitude + offset.lng : shop.longitude;

      const isSelected = selectedShop?.shop_id === shop.shop_id;
      const distanceDisplay = getDistanceStr(markerLat, markerLng, shop.shop_id);
      const isFav = favoriteShops.includes(shop.shop_id);

      // Chair occupancy calculation
      const shopChairs = chairs.filter(c => c.shop_id === shop.shop_id);
      let total = shopChairs.length > 0 ? shopChairs.length : 6;
      let taken = shopChairs.length > 0 ? shopChairs.filter(c => c.status === 'occupied').length : 0;


      // Badge color: green = full availability, orange = partial, red = almost full
      let badgeBg = '#10b981';
      if (taken === 0) {
        badgeBg = '#10b981';
      } else if (taken >= 1 && taken <= (total - 2)) {
        badgeBg = '#f59e0b';
      } else {
        badgeBg = '#ef4444';
      }

      // Figure image based on occupancy: unoccupied image for 0 taken, occupied for 1+
      const figureImg = taken === 0 ? '/map-unoccupied.png' : '/map-occupied.png';

      // Scale up for selected
      const scale = isSelected ? 1.15 : 1;

      const customIcon = L.divIcon({
        className: 'custom-shop-pin-marker',
        html: `
          <div style="
            position: relative;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            user-select: none;
            transform: translate(-50%, -100%) scale(${scale});
            transform-origin: bottom center;
            z-index: ${isSelected ? 1000 : 10};
          ">

            <!-- Shop name + star rating row -->
            <div style="
              display: flex;
              align-items: center;
              gap: 3px;
              margin-bottom: 3px;
              white-space: nowrap;
            ">
              <span style="
                font-size: 9px;
                font-weight: 800;
                color: #111827;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                text-shadow: 0 1px 3px rgba(255,255,255,0.9), 0 0 6px rgba(255,255,255,0.8);
              ">${shop.name}</span>
              <span style="
                font-size: 8px;
                font-weight: 700;
                color: #f59e0b;
                font-family: sans-serif;
                text-shadow: 0 1px 3px rgba(255,255,255,0.9);
              ">⭐ ${shop.rating}</span>
            </div>

            <!-- Floating figure container -->
            <div style="position: relative; width: 50px; height: 65px;">

              <!-- Barber/Chair image — transparent PNG cutout floating on map -->
              <img
                src="${figureImg}"
                style="
                  width: 50px;
                  height: 65px;
                  object-fit: contain;
                  object-position: center bottom;
                  display: block;
                "
                onerror="this.style.display='none'"
              />

              <!-- Seat availability badge — top right of figure -->
              <div style="
                position: absolute;
                top: 2px;
                right: -8px;
                background: ${badgeBg};
                color: white;
                font-size: 8px;
                font-weight: 900;
                padding: 1px 5px;
                border-radius: 6px;
                border: 1.5px solid white;
                box-shadow: 0 1px 4px rgba(0,0,0,0.25);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                white-space: nowrap;
              ">${taken}/${total}</div>

              ${isFav ? `
              <div id="heart-btn-${shop.shop_id}" style="
                position: absolute;
                top: 2px;
                left: -8px;
                width: 16px;
                height: 16px;
                background: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 1px 4px rgba(0,0,0,0.2);
                border: 1px solid #fce7f3;
                cursor: pointer;
              ">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="#be185d" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>` : ''}

            </div>

            <!-- Orange downward triangle pin -->
            <div style="
              width: 0;
              height: 0;
              border-left: 7px solid transparent;
              border-right: 7px solid transparent;
              border-top: 10px solid #f97316;
              margin-top: -1px;
              filter: drop-shadow(0 2px 3px rgba(249,115,22,0.4));
            "></div>

            <!-- White distance pill -->
            <div style="
              margin-top: 3px;
              background: white;
              padding: 1px 6px;
              border-radius: 9999px;
              font-size: 8px;
              font-weight: 800;
              color: #111827;
              box-shadow: 0 1px 4px rgba(0,0,0,0.15);
              border: 1px solid #e5e7eb;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              white-space: nowrap;
            ">${distanceDisplay}</div>

          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([markerLat, markerLng], { 
        icon: customIcon,
        zIndexOffset: isSelected ? 1000 : 10
      }).addTo(map);

      marker.on('click', (e) => {
        // Check if the heart button was clicked via DOM target
        const target = e.originalEvent?.target as HTMLElement | SVGElement | null;
        const isHeartClick = target?.closest?.(`#heart-btn-${shop.shop_id}`) != null;
        if (isHeartClick) {
          setFavorite(shop.shop_id);
          e.originalEvent?.stopPropagation();
          return;
        }
        onSelectShop(shop);
      });

      markersRef.current[shop.shop_id] = marker;
    });

  }, [shops, openShops, chairs, userLocation, selectedShop, favoriteShops]);

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
      const offset = shopOffsets[selectedShop.shop_id] ?? { lat: 0, lng: 0 };
      const startLat = userLocation ? userLocation.latitude : defaultLat;
      const startLng = userLocation ? userLocation.longitude : defaultLng;
      const endLat = userLocation ? userLocation.latitude + offset.lat : selectedShop.latitude;
      const endLng = userLocation ? userLocation.longitude + offset.lng : selectedShop.longitude;

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
  }, [selectedShop, userLocation]);

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
