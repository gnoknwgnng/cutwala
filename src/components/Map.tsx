import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigation, Plus, Minus, Scissors, Navigation2 } from 'lucide-react';
import type { BarberShop } from '../mock/mockData';
import { useStore } from '../store/useStore';

interface MapProps {
  onSelectShop: (shop: BarberShop) => void;
  selectedShop: BarberShop | null;
  searchQuery: string;
}

export const Map: React.FC<MapProps> = ({ onSelectShop, selectedShop, searchQuery }) => {
  const { shops, userLocation, locationPermission } = useStore();
  
  // Center of San Francisco matching our mock coords
  const centerLat = 37.7820;
  const centerLng = -122.4100;
  
  // Scaling factors to translate Lat/Lng into pixel offsets
  const xScale = 14000;
  const yScale = 17000;

  const [zoom, setZoom] = useState<number>(1.25);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  const openShops = shops.filter(shop => shop.status === 'OPEN');

  // Pan search synchronization
  useEffect(() => {
    if (searchQuery.trim() !== '') {
      const match = openShops.find(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (match) {
        centerCameraOn(match.latitude, match.longitude);
        onSelectShop(match);
      }
    }
  }, [searchQuery]);

  // Center camera on shop selection
  useEffect(() => {
    if (selectedShop) {
      centerCameraOn(selectedShop.latitude, selectedShop.longitude);
    }
  }, [selectedShop]);

  const centerCameraOn = (lat: number, lng: number) => {
    const dx = (lng - centerLng) * xScale * zoom;
    const dy = -(lat - centerLat) * yScale * zoom;

    setPan({
      x: -dx,
      y: -dy
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStart.current = { 
        x: e.touches[0].clientX - pan.x, 
        y: e.touches[0].clientY - pan.y 
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.current.x,
      y: e.touches[0].clientY - dragStart.current.y
    });
  };

  const getCoordinates = (lat: number, lng: number) => {
    const mapWidth = mapRef.current?.clientWidth || 500;
    const mapHeight = mapRef.current?.clientHeight || 500;

    const x = ((lng - centerLng) * xScale * zoom) + (mapWidth / 2) + pan.x;
    const y = (-(lat - centerLat) * yScale * zoom) + (mapHeight / 2) + pan.y;

    return { x, y };
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.15, 2.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.15, 0.6));
  
  const handleRecenter = () => {
    setZoom(1.25);
    if (userLocation) {
      centerCameraOn(userLocation.latitude, userLocation.longitude);
    } else {
      setPan({ x: 0, y: 0 });
    }
  };

  // Coordinates mapping variables
  const userPos = getCoordinates(centerLat, centerLng);
  const routePath = selectedShop ? getCoordinates(selectedShop.latitude, selectedShop.longitude) : null;

  return (
    <div 
      ref={mapRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      className="relative h-full w-full overflow-hidden select-none bg-[#f2f1eb] dark:bg-[#1c263c] transition-colors duration-300 cursor-grab active:cursor-grabbing"
    >
      {/* 1. Vector Google Maps Style SVG Canvas */}
      <svg 
        className="absolute inset-0 h-full w-full pointer-events-none"
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
      >
        <defs>
          {/* Google Maps Urban Residential Blocks Pattern */}
          <pattern id="gmap-residential-blocks" width="120" height="120" patternUnits="userSpaceOnUse">
            {/* Soft cream residential block background */}
            <rect width="120" height="120" fill="#fdfbf7" className="dark:fill-[#212f48]" />
            
            {/* Minor residential inner street lines */}
            <line x1="0" y1="30" x2="120" y2="30" stroke="#ffffff" strokeWidth="3" className="dark:stroke-[#2b3a55]" />
            <line x1="0" y1="60" x2="120" y2="60" stroke="#ffffff" strokeWidth="3" className="dark:stroke-[#2b3a55]" />
            <line x1="0" y1="90" x2="120" y2="90" stroke="#ffffff" strokeWidth="3" className="dark:stroke-[#2b3a55]" />

            <line x1="30" y1="0" x2="30" y2="120" stroke="#ffffff" strokeWidth="3" className="dark:stroke-[#2b3a55]" />
            <line x1="60" y1="0" x2="60" y2="120" stroke="#ffffff" strokeWidth="3" className="dark:stroke-[#2b3a55]" />
            <line x1="90" y1="0" x2="90" y2="120" stroke="#ffffff" strokeWidth="3" className="dark:stroke-[#2b3a55]" />

            {/* Block fill sub-rectangles (yellowish urban fill like Google Maps) */}
            <rect x="4" y="4" width="22" height="22" rx="2" fill="#fff9ea" className="dark:fill-[#253652]" />
            <rect x="34" y="4" width="22" height="22" rx="2" fill="#fff9ea" className="dark:fill-[#253652]" />
            <rect x="64" y="4" width="22" height="22" rx="2" fill="#fff9ea" className="dark:fill-[#253652]" />
            <rect x="94" y="4" width="22" height="22" rx="2" fill="#fff9ea" className="dark:fill-[#253652]" />

            <rect x="4" y="34" width="22" height="22" rx="2" fill="#fff9ea" className="dark:fill-[#253652]" />
            <rect x="34" y="34" width="22" height="22" rx="2" fill="#fff9ea" className="dark:fill-[#253652]" />
            <rect x="64" y="34" width="22" height="22" rx="2" fill="#fff9ea" className="dark:fill-[#253652]" />
            <rect x="94" y="34" width="22" height="22" rx="2" fill="#fff9ea" className="dark:fill-[#253652]" />

            <rect x="4" y="64" width="22" height="22" rx="2" fill="#fff9ea" className="dark:fill-[#253652]" />
            <rect x="34" y="64" width="22" height="22" rx="2" fill="#fff9ea" className="dark:fill-[#253652]" />
            <rect x="64" y="64" width="22" height="22" rx="2" fill="#fff9ea" className="dark:fill-[#253652]" />
            <rect x="94" y="64" width="22" height="22" rx="2" fill="#fff9ea" className="dark:fill-[#253652]" />
          </pattern>

          {/* Dash animation */}
          <style>
            {`
              @keyframes gmap-dash-flow {
                to { stroke-dashoffset: -24; }
              }
              .gmap-active-route {
                stroke-dasharray: 8, 4;
                animation: gmap-dash-flow 0.8s linear infinite;
              }
            `}
          </style>
        </defs>

        {/* Base map fill with Google Maps residential blocks */}
        <rect width="600%" height="600%" x="-300%" y="-300%" fill="url(#gmap-residential-blocks)" />

        {/* Google Maps Parks & Greenery Areas */}
        <path 
          d="M -500 -250 L -250 -250 L -250 50 L -500 50 Z" 
          fill="#d7ecd9" 
          stroke="#c4e3c7" 
          strokeWidth="1.5" 
          className="dark:fill-[#1b3b2f] dark:stroke-[#254f3f]" 
        />
        <path 
          d="M 280 -450 L 520 -450 L 520 -280 L 280 -280 Z" 
          fill="#d7ecd9" 
          stroke="#c4e3c7" 
          strokeWidth="1.5" 
          className="dark:fill-[#1b3b2f] dark:stroke-[#254f3f]" 
        />
        <path 
          d="M -150 320 L 80 320 L 80 500 L -150 500 Z" 
          fill="#d7ecd9" 
          stroke="#c4e3c7" 
          strokeWidth="1.5" 
          className="dark:fill-[#1b3b2f] dark:stroke-[#254f3f]" 
        />

        {/* Water Bodies (Bay/River) */}
        <path 
          d="M -1500 -900 C -700 -800, -400 -500, 100 -800 C 400 -1100, 900 -600, 2200 -950 L 2200 -2500 L -1500 -2500 Z" 
          fill="#aad3df" 
          className="dark:fill-[#0f2138]" 
        />

        {/* --- GOOGLE MAPS SECONDARY STREETS (Crisp White Roads with Grey Borders) --- */}
        {/* Horizontal Streets */}
        <g stroke="#d5d5d5" strokeWidth="11" strokeLinecap="round" className="dark:stroke-[#2a3850]">
          <line x1="-1500" y1="-300" x2="2200" y2="-300" />
          <line x1="-1500" y1="-100" x2="2200" y2="-100" />
          <line x1="-1500" y1="150" x2="2200" y2="150" />
          <line x1="-1500" y1="350" x2="2200" y2="350" />
          <line x1="-1500" y1="550" x2="2200" y2="550" />
        </g>
        <g stroke="#ffffff" strokeWidth="8" strokeLinecap="round" className="dark:stroke-[#344563]">
          <line x1="-1500" y1="-300" x2="2200" y2="-300" />
          <line x1="-1500" y1="-100" x2="2200" y2="-100" />
          <line x1="-1500" y1="150" x2="2200" y2="150" />
          <line x1="-1500" y1="350" x2="2200" y2="350" />
          <line x1="-1500" y1="550" x2="2200" y2="550" />
        </g>

        {/* Vertical Streets */}
        <g stroke="#d5d5d5" strokeWidth="11" strokeLinecap="round" className="dark:stroke-[#2a3850]">
          <line x1="-450" y1="-1500" x2="-450" y2="2200" />
          <line x1="-200" y1="-1500" x2="-200" y2="2200" />
          <line x1="250" y1="-1500" x2="250" y2="2200" />
          <line x1="480" y1="-1500" x2="480" y2="2200" />
          <line x1="720" y1="-1500" x2="720" y2="2200" />
        </g>
        <g stroke="#ffffff" strokeWidth="8" strokeLinecap="round" className="dark:stroke-[#344563]">
          <line x1="-450" y1="-1500" x2="-450" y2="2200" />
          <line x1="-200" y1="-1500" x2="-200" y2="2200" />
          <line x1="250" y1="-1500" x2="250" y2="2200" />
          <line x1="480" y1="-1500" x2="480" y2="2200" />
          <line x1="720" y1="-1500" x2="720" y2="2200" />
        </g>

        {/* --- GOOGLE MAPS MAJOR ARTERIAL HIGHWAY (State Highway 65 / Main Corridor) --- */}
        {/* Outer Orange/Gold Border */}
        <line x1="0" y1="-1500" x2="0" y2="2200" stroke="#fabb05" strokeWidth="18" className="dark:stroke-[#d48806]" />
        {/* Inner Yellow Fill */}
        <line x1="0" y1="-1500" x2="0" y2="2200" stroke="#fde293" strokeWidth="13" className="dark:stroke-[#ffd591]" />

        {/* Secondary Highway Branch */}
        <path d="M 0 -100 Q 150 50, 400 200 T 900 600" fill="none" stroke="#fabb05" strokeWidth="14" className="dark:stroke-[#d48806]" />
        <path d="M 0 -100 Q 150 50, 400 200 T 900 600" fill="none" stroke="#fde293" strokeWidth="10" className="dark:stroke-[#ffd591]" />

        {/* --- GOOGLE MAPS RED DOTTED MUNICIPAL BOUNDARY LINE --- */}
        <path 
          d="M -600 -400 L 200 -400 L 200 80 L -100 80 L -100 450 L 600 450 L 600 900" 
          fill="none" 
          stroke="#ea4335" 
          strokeWidth="2" 
          strokeDasharray="5 4" 
        />

        {/* Animated Active Route Navigation Path */}
        {selectedShop && routePath && (
          <>
            <path
              d={`M ${userPos.x} ${userPos.y} L ${routePath.x} ${userPos.y} L ${routePath.x} ${routePath.y}`}
              fill="none"
              stroke="#1a73e8"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.3"
            />
            <path
              d={`M ${userPos.x} ${userPos.y} L ${routePath.x} ${userPos.y} L ${routePath.x} ${routePath.y}`}
              fill="none"
              stroke="#1a73e8"
              strokeWidth="5"
              className="gmap-active-route"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}
      </svg>

      {/* 2. Google Maps Landmarks & Locality Overlay (bilingual / standard Google Maps fonts) */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
      >
        {/* Highway 65 Shield Badge */}
        <div className="absolute top-[80px] left-[0px] -translate-x-1/2 -translate-y-1/2 bg-[#fde293] border border-[#fabb05] text-[#3c4043] font-bold text-[10px] px-1.5 py-0.5 rounded shadow-sm flex items-center justify-center dark:text-black">
          65
        </div>
        <div className="absolute top-[-400px] left-[0px] -translate-x-1/2 -translate-y-1/2 bg-[#fde293] border border-[#fabb05] text-[#3c4043] font-bold text-[10px] px-1.5 py-0.5 rounded shadow-sm flex items-center justify-center dark:text-black">
          65
        </div>

        {/* Locality Text Labels (Matching Google Maps exact design) */}
        <div className="absolute top-[-260px] left-[-380px] flex flex-col font-sans">
          <span className="text-[12px] font-bold text-[#5f6368] dark:text-[#9aa0a6] uppercase tracking-wider">VENGAL RAO NAGAR</span>
        </div>

        <div className="absolute top-[0px] left-[20px] flex flex-col font-sans">
          <span className="text-[14px] font-bold text-[#1a73e8] dark:text-[#8ab4f8]">S R Nagar</span>
        </div>

        <div className="absolute top-[-380px] left-[220px] flex flex-col font-sans">
          <span className="text-[12px] font-bold text-[#5f6368] dark:text-[#9aa0a6] uppercase tracking-wider">SANJEEVA REDDY NAGAR</span>
        </div>

        <div className="absolute top-[-100px] left-[-380px] flex flex-col font-sans">
          <span className="text-[12px] font-bold text-[#5f6368] dark:text-[#9aa0a6] uppercase tracking-wider">MOTHI NAGAR</span>
        </div>

        <div className="absolute top-[480px] left-[-320px] flex flex-col font-sans">
          <span className="text-[15px] font-extrabold text-[#3c4043] dark:text-[#e8eaed]">Ameerpet Metro Station</span>
        </div>

        {/* --- GOOGLE MAPS POI BADGES --- */}
        {/* Metro Station Icon Badge 1 */}
        <div className="absolute top-[-20px] left-[0px] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1">
          <div className="h-5 w-5 rounded bg-[#1a73e8] text-white font-extrabold text-[11px] flex items-center justify-center shadow">
            M
          </div>
        </div>

        {/* Hospital Icon Badge */}
        <div className="absolute top-[-480px] left-[-480px] flex items-center gap-1.5">
          <div className="h-6 w-6 rounded-full bg-[#ea4335] text-white font-bold text-[12px] flex items-center justify-center shadow border border-white">
            H
          </div>
          <span className="text-[10px] font-bold text-[#3c4043] dark:text-[#e8eaed] bg-white/80 dark:bg-zinc-900/80 px-1 rounded">
            Care Medical College
          </span>
        </div>

        {/* Passport Seva Kendra Landmark Badge */}
        <div className="absolute top-[220px] left-[10px] flex items-center gap-1.5">
          <div className="h-5 w-5 rounded-full bg-[#70757a] text-white flex items-center justify-center text-[10px] font-bold shadow">
            🏛️
          </div>
          <span className="text-[11px] font-bold text-[#3c4043] dark:text-[#e8eaed] bg-white/70 dark:bg-zinc-900/70 px-1 rounded">
            Passport Seva Kendra
          </span>
        </div>

        {/* Commercial Landmark */}
        <div className="absolute top-[360px] left-[350px] flex items-center gap-1.5">
          <div className="h-5 w-5 rounded-full bg-[#70757a] text-white flex items-center justify-center text-[10px] font-bold shadow">
            🏛️
          </div>
          <span className="text-[11px] font-bold text-[#3c4043] dark:text-[#e8eaed] bg-white/70 dark:bg-zinc-900/70 px-1 rounded">
            AMEERPET
          </span>
        </div>

        {/* Balkampet Road Label */}
        <span className="absolute top-[180px] left-[490px] text-[10px] font-bold text-[#70757a] dark:text-[#9aa0a6] rotate-90 origin-left">
          Balkampet Rd
        </span>
      </div>

      {/* 3. Pulsing User Location Blue Dot */}
      {locationPermission === 'granted' && (
        <div 
          style={{ left: userPos.x, top: userPos.y }}
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
        >
          <div className="relative flex h-10 w-10 items-center justify-center">
            <div className="absolute h-full w-full animate-ping rounded-full bg-[#1a73e8]/30 opacity-75"></div>
            <div className="absolute h-7 w-7 rounded-full bg-[#1a73e8]/20 border border-white shadow-md"></div>
            <div className="relative h-3.5 w-3.5 rounded-full bg-[#1a73e8] border-2 border-white shadow-lg"></div>
          </div>
        </div>
      )}

      {/* 4. Barber Shop Pins */}
      {openShops.map((shop) => {
        const pos = getCoordinates(shop.latitude, shop.longitude);
        const isSelected = selectedShop?.shop_id === shop.shop_id;

        return (
          <motion.div
            key={shop.shop_id}
            style={{ left: pos.x, top: pos.y }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectShop(shop);
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer"
          >
            <div className="relative flex flex-col items-center group">
              <motion.div
                animate={{
                  scale: isSelected ? 1.25 : 1,
                  y: isSelected ? -5 : 0
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-xl transition-all duration-300 border ${
                  isSelected 
                    ? 'bg-[#ea4335] text-white border-white font-bold scale-110 z-35' 
                    : 'bg-white text-[#3c4043] dark:bg-zinc-900 dark:text-white border-gray-200 dark:border-zinc-800 hover:scale-105'
                }`}
              >
                {isSelected ? (
                  <Navigation2 className="h-4 w-4 fill-white text-white rotate-95" />
                ) : (
                  <Scissors className="h-4 w-4 text-[#ea4335]" />
                )}
                <span className="text-[11px] font-bold select-none whitespace-nowrap">
                  {shop.name.split(' ')[0]}
                </span>
                
                {/* Visual arrow down on the pin */}
                <div className={`absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] ${
                  isSelected ? 'border-t-[#ea4335]' : 'border-t-white dark:border-t-zinc-900'
                }`} />
              </motion.div>
            </div>
          </motion.div>
        );
      })}

      {/* 5. Floating Map Controls */}
      <div className="absolute top-20 right-4 z-20 flex flex-col gap-2 md:top-6">
        {/* Center GPS button */}
        <button 
          onClick={handleRecenter}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 text-[#5f6368] dark:text-gray-300 shadow-lg border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/80 active:scale-95 transition-all cursor-pointer"
        >
          <Navigation className="h-5 w-5" />
        </button>

        {/* Zoom Controls */}
        <div className="flex flex-col rounded-2xl bg-white dark:bg-zinc-900 shadow-lg border border-gray-200 dark:border-zinc-800 overflow-hidden">
          <button 
            onClick={handleZoomIn}
            className="flex h-11 w-11 items-center justify-center text-[#5f6368] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800/80 active:scale-95 transition-all border-b border-gray-100 dark:border-zinc-800 cursor-pointer"
          >
            <Plus className="h-5 w-5" />
          </button>
          <button 
            onClick={handleZoomOut}
            className="flex h-11 w-11 items-center justify-center text-[#5f6368] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800/80 active:scale-95 transition-all cursor-pointer"
          >
            <Minus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
