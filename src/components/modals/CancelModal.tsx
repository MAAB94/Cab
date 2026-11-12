import React, { useState } from 'react';
import { Booking } from '../../types/dispatch';
import { AlertTriangle, X } from 'lucide-react';
import { soundManager } from '../../utils/sound';

interface CancelModalProps {
  isOpen: boolean;
  booking: Booking | null;
  onClose: () => void;
  onConfirmCancel: (bookingId: string, reason: string) => void;
}

export const CancelModal: React.FC<CancelModalProps> = ({
  isOpen,
  booking,
  onClose,
  onConfirmCancel,
}) => {
  const [reasonCategory, setReasonCategory] = useState('Passenger Cancelled');
  const [details, setDetails] = useState('');

  if (!isOpen || !booking) return null;

  const handleConfirm = () => {
    const fullReason = details.trim()
      ? `${reasonCategory} - ${details.trim()}`
      : reasonCategory;

    onConfirmCancel(booking.id, fullReason);
    soundManager.playRadioClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-rose-700 text-white border-b border-rose-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-200" />
            <h3 className="font-bold text-sm tracking-wide uppercase">
              Cancel Booking Confirmation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-rose-200 hover:text-white hover:bg-rose-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 text-xs">
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/30 rounded border border-rose-200 dark:border-rose-900/50">
            <p className="font-semibold text-rose-900 dark:text-rose-200">
              Are you sure you want to cancel booking {booking.reference}?
            </p>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Passenger: {booking.passengerName} · Pickup: {booking.pickupTime} ({booking.zone})
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Cancellation Reason Category *
            </label>
            <select
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value)}
              className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs focus:ring-1 focus:ring-rose-500 focus:outline-none"
            >
              <option value="Passenger Cancelled">Passenger Cancelled</option>
              <option value="Flight Delayed / Cancelled">Flight Delayed / Cancelled</option>
              <option value="Customer No Longer Required">Customer No Longer Required</option>
              <option value="Found Alternate Transport">Found Alternate Transport</option>
              <option value="No Suitable Vehicle/Driver Available">No Driver Available</option>
              <option value="Duplicate Order">Duplicate Order</option>
              <option value="Billing / Payment Declined">Billing / Payment Declined</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Additional Dispatcher Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g. Caller mentioned meetings rescheduled to Friday..."
              className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs focus:ring-1 focus:ring-rose-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition"
          >
            Go Back
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-1.5 text-xs font-bold bg-rose-700 hover:bg-rose-600 text-white rounded transition shadow-sm"
          >
            Confirm Cancellation
          </button>
        </div>
      </div>
    </div>
  );
};
