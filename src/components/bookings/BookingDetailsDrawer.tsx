import React from 'react';
import { Booking } from '../../types/dispatch';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Phone,
  Plane,
  Receipt,
  Car,
  ShieldCheck,
  Send,
  Printer,
  History,
} from 'lucide-react';
import { formatCurrency, getStatusBadgeClasses } from '../../utils/formatters';

interface BookingDetailsDrawerProps {
  booking: Booking | null;
  onClose: () => void;
  onDispatch: (booking: Booking) => void;
  onPrint: (booking: Booking) => void;
  onHoldToggle: (booking: Booking) => void;
}

export const BookingDetailsDrawer: React.FC<BookingDetailsDrawerProps> = ({
  booking,
  onClose,
  onDispatch,
  onPrint,
  onHoldToggle,
}) => {
  if (!booking) return null;

  const statusStyle = getStatusBadgeClasses(booking.status);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#143254] text-white dark:bg-slate-800 border-b border-[#214772] dark:border-slate-700">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-base tracking-wide text-sky-200">
              {booking.reference}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
            >
              {booking.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrint(booking)}
              className="p-1 rounded text-sky-200 hover:text-white hover:bg-[#1e4674] dark:hover:bg-slate-700 transition"
              title="Print Voucher"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-sky-200 hover:text-white hover:bg-[#1e4674] dark:hover:bg-slate-700 transition"
              title="Close Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Passenger & Contact */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-800">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Passenger & Client
            </h4>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Name:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {booking.passengerName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Mobile:</span>
                <a
                  href={`tel:${booking.passengerPhone}`}
                  className="font-mono text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 hover:underline"
                >
                  <Phone className="w-3 h-3" />
                  {booking.passengerPhone}
                </a>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Passengers / Bags:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {booking.passengerCount} Pax · {booking.luggageCount} Luggage
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Account:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {booking.account}
                </span>
              </div>
            </div>
          </div>

          {/* Route & Timing */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-800">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Route & Schedule
            </h4>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-mono">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>{booking.pickupDate}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-mono font-bold">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>{booking.pickupTime} (Slot)</span>
              </div>
            </div>

            {/* From - To visual route */}
            <div className="relative pl-5 space-y-3 border-l-2 border-blue-400 ml-1">
              <div className="relative">
                <span className="absolute -left-[27px] top-0 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-950" />
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Pickup Location ({booking.zone})
                </span>
                <p className="font-medium text-slate-900 dark:text-slate-100 text-xs">
                  {booking.pickupAddress}
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[27px] top-0 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-emerald-100 dark:ring-emerald-950" />
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Destination
                </span>
                <p className="font-medium text-slate-900 dark:text-slate-100 text-xs">
                  {booking.destinationAddress}
                </p>
              </div>
            </div>

            {booking.flightNumber && (
              <div className="mt-3 p-2 bg-sky-50 dark:bg-sky-950/40 rounded border border-sky-200 dark:border-sky-800/50 flex items-center gap-2">
                <Plane className="w-4 h-4 text-sky-600 shrink-0" />
                <div className="flex-1">
                  <span className="text-[10px] text-sky-700 dark:text-sky-300 font-semibold uppercase block">
                    Inbound Flight Monitoring
                  </span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
                    {booking.flightNumber}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Dispatch Assignment & Vehicle */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-800">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Vehicle & Driver Assignment
            </h4>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Vehicle Type:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {booking.vehicleType}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Assigned Driver:</span>
                {booking.assignedDriverNumber ? (
                  <span className="font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                    {booking.assignedDriverNumber}
                  </span>
                ) : (
                  <span className="text-amber-600 font-bold">Unassigned</span>
                )}
              </div>
              {booking.specialInstructions && (
                <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block mb-0.5">Special Instructions:</span>
                  <p className="text-slate-700 dark:text-slate-300 italic bg-amber-50 dark:bg-amber-950/30 p-1.5 rounded border border-amber-200 dark:border-amber-900/50">
                    "{booking.specialInstructions}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Pricing & Financials */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-800">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Financial Breakdown</span>
              <Receipt className="w-3.5 h-3.5 text-slate-400" />
            </h4>
            <div className="space-y-1 text-slate-700 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Total Fare:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {formatCurrency(booking.fare)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-mono font-semibold">{booking.paymentMethod}</span>
              </div>
              {booking.paymentReference && (
                <div className="flex justify-between text-[10px]">
                  <span>Payment Ref:</span>
                  <span className="font-mono text-slate-500">{booking.paymentReference}</span>
                </div>
              )}
              {booking.orderNumber && (
                <div className="flex justify-between text-[10px]">
                  <span>Order / Purchase Order:</span>
                  <span className="font-mono text-slate-500">{booking.orderNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Activity History Audit Log */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-800">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-blue-600" />
              <span>Activity History Trail</span>
            </h4>
            <div className="space-y-2 border-l border-slate-200 dark:border-slate-700 pl-3 ml-1">
              {booking.activityHistory.map((act) => (
                <div key={act.id} className="text-[11px] relative">
                  <span className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-blue-500" />
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {act.action}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {act.timestamp} · {act.operator}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Action Bar */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
          {booking.status === 'PENDING' && (
            <button
              onClick={() => onDispatch(booking)}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-xs transition shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Now</span>
            </button>
          )}

          <button
            onClick={() => onHoldToggle(booking)}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded text-xs transition"
          >
            {booking.status === 'ON_HOLD' ? 'Resume' : 'Hold'}
          </button>

          <button
            onClick={() => onPrint(booking)}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white font-semibold rounded text-xs transition"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};
