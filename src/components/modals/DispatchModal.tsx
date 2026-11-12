import React, { useState } from 'react';
import { Booking, Driver } from '../../types/dispatch';
import { X, Send, Car, MapPin, Check, Clock, ShieldAlert } from 'lucide-react';
import { soundManager } from '../../utils/sound';

interface DispatchModalProps {
  isOpen: boolean;
  booking: Booking | null;
  drivers: Driver[];
  onClose: () => void;
  onConfirmDispatch: (bookingId: string, driver: Driver) => void;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({
  isOpen,
  booking,
  drivers,
  onClose,
  onConfirmDispatch,
}) => {
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');

  if (!isOpen || !booking) return null;

  // Filter and rank drivers based on availability, zone match and vehicle type
  const sortedDrivers = [...drivers].sort((a, b) => {
    // 1. Zone match priority
    const aZoneMatch = a.currentZone === booking.zone ? 1 : 0;
    const bZoneMatch = b.currentZone === booking.zone ? 1 : 0;
    if (aZoneMatch !== bZoneMatch) return bZoneMatch - aZoneMatch;

    // 2. Status priority: WAITING / AVAILABLE first
    const aAvail = a.status === 'AVAILABLE' || a.status === 'WAITING' ? 1 : 0;
    const bAvail = b.status === 'AVAILABLE' || b.status === 'WAITING' ? 1 : 0;
    if (aAvail !== bAvail) return bAvail - aAvail;

    // 3. Waiting duration (longest waiting first)
    return b.waitingDurationMinutes - a.waitingDurationMinutes;
  });

  const handleDispatch = () => {
    const driver = drivers.find((d) => d.id === selectedDriverId);
    if (!driver) return;

    onConfirmDispatch(booking.id, driver);
    soundManager.playDispatch();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#143254] text-white dark:bg-slate-800 border-b border-[#214772] dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-sky-300" />
            <h3 className="font-extrabold text-xs tracking-wider uppercase">
              Dispatch Driver Allocation
            </h3>
            <span className="font-mono text-xs bg-[#091b30] text-sky-300 px-1.5 py-0.2 rounded border border-[#1f4773]">
              {booking.reference}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-sky-200 hover:text-white hover:bg-[#1e4674] dark:hover:bg-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Job Overview */}
        <div className="p-3 bg-sky-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              {booking.passengerName}
            </span>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-slate-500">Pickup:</span>
              <span className="font-bold text-blue-700 dark:text-blue-400">
                {booking.pickupTime}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold">
                Zone: {booking.zone}
              </span>
            </div>
          </div>

          <p className="text-slate-600 dark:text-slate-300 truncate">
            <span className="font-semibold text-slate-700 dark:text-slate-200">From:</span> {booking.pickupAddress}
          </p>
          <p className="text-slate-600 dark:text-slate-300 truncate">
            <span className="font-semibold text-slate-700 dark:text-slate-200">To:</span> {booking.destinationAddress}
          </p>

          <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-500 font-mono">
            <span>Required Vehicle: <strong>{booking.vehicleType}</strong></span>
            <span>Fare: <strong>£{booking.fare.toFixed(2)}</strong></span>
            <span>Payment: <strong>{booking.paymentMethod}</strong></span>
          </div>
        </div>

        {/* Driver Selection List */}
        <div className="flex-1 overflow-y-auto p-3 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase px-1 mb-1">
            <span>Eligible Drivers Ranked By Distance & Queue</span>
            <span>Plot / Waiting</span>
          </div>

          {sortedDrivers.map((driver) => {
            const isSelected = selectedDriverId === driver.id;
            const isZoneMatch = driver.currentZone === booking.zone;
            const isVehicleMatch = driver.vehicleType === booking.vehicleType;
            const isAvailable = driver.status === 'AVAILABLE' || driver.status === 'WAITING';

            return (
              <div
                key={driver.id}
                onClick={() => setSelectedDriverId(driver.id)}
                className={`p-2 rounded border cursor-pointer transition flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 ring-1 ring-blue-500'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5" />}
                  </div>

                  <span className="font-mono font-bold text-xs px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                    {driver.driverNumber}
                  </span>

                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {driver.fullName}
                      </span>
                      {isZoneMatch && (
                        <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[9px] font-bold px-1 rounded">
                          Exact Zone
                        </span>
                      )}
                      {isVehicleMatch && (
                        <span className="bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 text-[9px] font-bold px-1 rounded">
                          Exact Vehicle
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {driver.vehicleModel} ({driver.vehicleType}) · {driver.vehicleRegistration}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 text-right">
                  <div>
                    <span className="font-mono font-bold text-[11px] text-slate-800 dark:text-slate-200 block">
                      {driver.currentZone}
                    </span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono flex items-center justify-end gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {driver.waitingDurationMinutes}m wait
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                      isAvailable
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {driver.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-mono">
            {selectedDriverId ? 'Driver ready for dispatch' : 'Select a driver from the ranked list'}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition"
            >
              Cancel
            </button>

            <button
              disabled={!selectedDriverId}
              onClick={handleDispatch}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white rounded transition shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Confirm & Dispatch Driver</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
