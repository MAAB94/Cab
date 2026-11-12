import React, { useState } from 'react';
import { Driver, Booking } from '../../types/dispatch';
import { X, MapPin, Navigation, Car, RefreshCw, ZoomIn, ZoomOut, Compass } from 'lucide-react';
import { soundManager } from '../../utils/sound';

interface TrackingMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  drivers: Driver[];
  activeBookings: Booking[];
}

export const TrackingMapModal: React.FC<TrackingMapModalProps> = ({
  isOpen,
  onClose,
  drivers,
  activeBookings,
}) => {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(drivers[0] || null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  if (!isOpen) return null;

  // Map coordinates simulation for London bounding box:
  // Lat: 51.45 to 51.55, Lng: -0.50 to 0.05
  const getMapPosition = (lat: number, lng: number) => {
    const minLat = 51.44;
    const maxLat = 51.56;
    const minLng = -0.52;
    const maxLng = 0.05;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;

    return {
      left: `${Math.max(5, Math.min(95, x))}%`,
      top: `${Math.max(5, Math.min(95, y))}%`,
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 md:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-slate-900 text-slate-100 rounded-lg shadow-2xl border border-slate-700 overflow-hidden flex flex-col h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#143254] text-white border-b border-[#214772]">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-sky-300" />
            <h3 className="font-extrabold text-xs tracking-wider uppercase">
              Fleet GPS Radar & Tracking Console (Ctrl+M)
            </h3>
            <span className="text-[9px] font-mono bg-[#091b30] text-emerald-400 px-1.5 py-0.2 rounded border border-[#1f4773]">
              GPS LIVE FEED ACTIVE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundManager.playRadioClick();
              }}
              className="p-1 rounded text-sky-200 hover:text-white hover:bg-[#1e4674] transition"
              title="Ping Drivers GPS"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-sky-200 hover:text-white hover:bg-[#1e4674] transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Map Body: Left Interactive Vector Map + Right Telemetry Sidebar */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          {/* Main Visual Map Area */}
          <div className="flex-1 relative bg-slate-950 overflow-hidden flex items-center justify-center select-none">
            {/* Map Grid Background pattern */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px), radial-gradient(#38bdf8 1px, #020617 1px)`,
                backgroundSize: '40px 40px',
                backgroundPosition: '0 0, 20px 20px',
              }}
            />

            {/* Simulated River Thames and London Arteries */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* River Thames winding line */}
              <path
                d="M 50 250 C 200 240, 350 280, 500 260 S 700 230, 950 280"
                stroke="#0284c7"
                strokeWidth="14"
                fill="none"
              />
              {/* M25 / M4 Orbital highways */}
              <path
                d="M 20 100 Q 400 40 850 80"
                stroke="#475569"
                strokeWidth="2"
                strokeDasharray="6 4"
                fill="none"
              />
              <path
                d="M 50 270 Q 300 260 700 450"
                stroke="#475569"
                strokeWidth="2"
                strokeDasharray="6 4"
                fill="none"
              />
            </svg>

            {/* Zone Plots Labels */}
            <div className="absolute top-[28%] left-[45%] text-[10px] font-mono font-bold text-sky-400/80 bg-slate-900/80 px-2 py-0.5 rounded border border-sky-800 pointer-events-none">
              PLOT W1 (WEST END)
            </div>
            <div className="absolute top-[32%] left-[62%] text-[10px] font-mono font-bold text-sky-400/80 bg-slate-900/80 px-2 py-0.5 rounded border border-sky-800 pointer-events-none">
              PLOT EC2 (CITY OF LONDON)
            </div>
            <div className="absolute top-[48%] left-[78%] text-[10px] font-mono font-bold text-sky-400/80 bg-slate-900/80 px-2 py-0.5 rounded border border-sky-800 pointer-events-none">
              PLOT E14 (CANARY WHARF)
            </div>
            <div className="absolute top-[52%] left-[12%] text-[10px] font-mono font-bold text-sky-400/80 bg-slate-900/80 px-2 py-0.5 rounded border border-sky-800 pointer-events-none">
              PLOT LHR (HEATHROW T2/T5)
            </div>

            {/* Interactive Driver Markers */}
            {drivers.map((driver) => {
              const pos = getMapPosition(driver.lat, driver.lng);
              const isSelected = selectedDriver?.id === driver.id;

              let markerColor = 'bg-emerald-500 border-emerald-300';
              if (driver.status === 'ON_JOB') markerColor = 'bg-blue-500 border-sky-300';
              if (driver.status === 'WAITING') markerColor = 'bg-amber-500 border-amber-300';
              if (driver.status === 'BREAK') markerColor = 'bg-purple-500 border-purple-300';

              return (
                <div
                  key={driver.id}
                  style={{ left: pos.left, top: pos.top }}
                  onClick={() => {
                    setSelectedDriver(driver);
                    soundManager.playRadioClick();
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all z-20 ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                >
                  <div className="relative flex flex-col items-center">
                    {/* Driver Callout Box */}
                    <div
                      className={`px-1.5 py-0.5 rounded font-mono font-bold text-[10px] text-white shadow-md flex items-center gap-1 border ${
                        isSelected
                          ? 'bg-blue-600 border-white ring-2 ring-blue-400'
                          : 'bg-slate-800/90 border-slate-600'
                      }`}
                    >
                      <Car className="w-2.5 h-2.5" />
                      <span>{driver.driverNumber}</span>
                    </div>

                    {/* Marker Dot */}
                    <div
                      className={`w-3.5 h-3.5 rounded-full border-2 shadow-lg -mt-0.5 ${markerColor}`}
                    />
                  </div>
                </div>
              );
            })}

            {/* Map Controls */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-700 rounded p-1 flex items-center gap-1 z-30 text-xs">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 2))}
                className="p-1 hover:bg-slate-800 rounded text-slate-300"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono px-1">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.6))}
                className="p-1 hover:bg-slate-800 rounded text-slate-300"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Driver Telemetry Panel */}
          <div className="w-full md:w-80 bg-slate-900 border-t md:border-t-0 md:border-l border-slate-700 p-4 flex flex-col text-xs overflow-y-auto">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Vehicle Telemetry & Status
            </h4>

            {selectedDriver ? (
              <div className="space-y-3">
                <div className="p-3 bg-slate-800/80 rounded border border-slate-700">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-sm text-sky-400">
                      {selectedDriver.driverNumber}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-900 text-sky-200 border border-blue-700">
                      {selectedDriver.status}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-100 text-sm">
                    {selectedDriver.fullName}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Callsign: {selectedDriver.callsign} · Mobile: {selectedDriver.mobile}
                  </p>
                </div>

                <div className="p-3 bg-slate-800/80 rounded border border-slate-700 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Vehicle Specifications
                  </span>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Model:</span>
                    <span className="font-medium">{selectedDriver.vehicleModel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Registration:</span>
                    <span className="font-mono font-bold text-amber-300">
                      {selectedDriver.vehicleRegistration}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type / Class:</span>
                    <span>{selectedDriver.vehicleType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Plot:</span>
                    <span className="font-mono font-bold text-sky-300">
                      Zone {selectedDriver.currentZone}
                    </span>
                  </div>
                </div>

                {selectedDriver.activeJobRef && (
                  <div className="p-3 bg-blue-950/60 rounded border border-blue-800 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-sky-300 uppercase">
                        Current Mission
                      </span>
                      <span className="font-mono text-xs font-bold text-sky-400">
                        {selectedDriver.activeJobRef}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 truncate">
                      <strong>From:</strong> {selectedDriver.activeJobPickup}
                    </p>
                    <p className="text-[11px] text-slate-300 truncate">
                      <strong>To:</strong> {selectedDriver.activeJobDestination}
                    </p>
                    <p className="text-[10px] font-mono text-emerald-400 pt-1">
                      Status: {selectedDriver.jobStatus || 'POB'} · ETA: {selectedDriver.etaMinutes}m
                    </p>
                  </div>
                )}

                <div className="p-3 bg-slate-800/80 rounded border border-slate-700 space-y-1 text-[11px] font-mono text-slate-400">
                  <div className="flex justify-between">
                    <span>GPS Coordinates:</span>
                    <span className="text-slate-200">
                      {selectedDriver.lat.toFixed(4)}, {selectedDriver.lng.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Today's Jobs:</span>
                    <span className="text-slate-200">{selectedDriver.totalJobsToday} completed</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Today's Takings:</span>
                    <span className="text-emerald-400 font-bold">
                      £{selectedDriver.earningsToday.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-slate-500">
                Click any driver on the radar map to view telemetry
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
