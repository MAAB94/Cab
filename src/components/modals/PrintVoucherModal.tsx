import React from 'react';
import { Booking } from '../../types/dispatch';
import { X, Printer, Car, Check } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface PrintVoucherModalProps {
  isOpen: boolean;
  booking: Booking | null;
  onClose: () => void;
}

export const PrintVoucherModal: React.FC<PrintVoucherModalProps> = ({
  isOpen,
  booking,
  onClose,
}) => {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white text-slate-900 rounded-lg shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Controls Header (Not in print) */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 text-white border-b border-slate-700 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-xs uppercase tracking-wide">
              Print Dispatch Ticket Voucher
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded text-xs transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Sheet</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Area */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans bg-white text-slate-900">
          {/* Header Ticket Banner */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3">
            <div>
              <div className="flex items-center gap-1.5">
                <Car className="w-5 h-5 text-blue-800" />
                <h2 className="text-base font-extrabold tracking-tight uppercase text-blue-900">
                  CAB TREASURE CLOUD X
                </h2>
              </div>
              <p className="text-[10px] text-slate-500 font-mono">
                DISPATCH OPERATION & PASSENGER VOUCHER
              </p>
            </div>

            <div className="text-right">
              <span className="font-mono font-bold text-lg text-slate-900 block">
                {booking.reference}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {new Date().toLocaleString('en-GB')}
              </span>
            </div>
          </div>

          {/* Core Info Grid */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">
                Pickup Date & Time
              </span>
              <span className="font-mono font-bold text-sm text-slate-900">
                {booking.pickupDate} · {booking.pickupTime}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">
                Zone / Plot
              </span>
              <span className="font-mono font-bold text-sm text-blue-800">
                {booking.zone}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">
                Passenger Name
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {booking.passengerName}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">
                Mobile Number
              </span>
              <span className="font-mono font-semibold text-slate-900">
                {booking.passengerPhone}
              </span>
            </div>
          </div>

          {/* Route Details */}
          <div className="border border-slate-200 rounded p-3 space-y-2">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">
                Pickup Location
              </span>
              <p className="font-semibold text-slate-900 text-xs">
                {booking.pickupAddress}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">
                Destination
              </span>
              <p className="font-semibold text-slate-900 text-xs">
                {booking.destinationAddress}
              </p>
            </div>

            {booking.flightNumber && (
              <div className="border-t border-slate-100 pt-2 text-[11px] font-mono">
                <span className="font-bold text-slate-600">Flight Ref: </span>
                <span className="text-blue-800 font-bold">{booking.flightNumber}</span>
              </div>
            )}
          </div>

          {/* Vehicle & Financial Info */}
          <div className="grid grid-cols-3 gap-2 border border-slate-200 rounded p-3 text-center">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">
                Vehicle Type
              </span>
              <span className="font-semibold">{booking.vehicleType}</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">
                Driver Assigned
              </span>
              <span className="font-mono font-bold text-blue-900">
                {booking.assignedDriverNumber || 'UNASSIGNED'}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">
                Fare (£)
              </span>
              <span className="font-mono font-extrabold text-base text-slate-900">
                {formatCurrency(booking.fare)}
              </span>
            </div>
          </div>

          {/* Instructions */}
          {booking.specialInstructions && (
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px]">
              <span className="font-bold text-slate-600 uppercase text-[10px] block">
                Special Driver Instructions:
              </span>
              <p className="italic text-slate-800">{booking.specialInstructions}</p>
            </div>
          )}

          {/* Signature / Driver Confirmation */}
          <div className="pt-6 border-t border-dashed border-slate-400 grid grid-cols-2 gap-4 text-[10px] text-slate-500">
            <div>
              <div className="border-b border-slate-400 h-8 mb-1" />
              <span>Passenger Signature</span>
            </div>
            <div>
              <div className="border-b border-slate-400 h-8 mb-1" />
              <span>Driver Signature / Stamp</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
