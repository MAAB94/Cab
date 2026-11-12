import React, { useState } from 'react';
import { Booking, VehicleType, PaymentMethod, LeadSource } from '../../types/dispatch';
import { X, Car, Calculator, UserCheck, Shield, MapPin } from 'lucide-react';
import { soundManager } from '../../utils/sound';

interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBooking: (newBooking: Partial<Booking>) => void;
}

export const NewBookingModal: React.FC<NewBookingModalProps> = ({
  isOpen,
  onClose,
  onCreateBooking,
}) => {
  if (!isOpen) return null;

  const [leadSource, setLeadSource] = useState<LeadSource>('PHONE');
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('+44 ');
  const [passengerCount, setPassengerCount] = useState(1);
  const [luggageCount, setLuggageCount] = useState(1);
  const [pickupDate, setPickupDate] = useState('2026-11-12');
  const [pickupTime, setPickupTime] = useState('09:00');
  const [pickupAddress, setPickupAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [zone, setZone] = useState('W1');
  const [vehicleType, setVehicleType] = useState<VehicleType>('Saloon');
  const [account, setAccount] = useState('CASH');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [fare, setFare] = useState<number>(30.0);
  const [flightNumber, setFlightNumber] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Quick fare recalculator based on vehicle and distance estimate
  const handleEstimateFare = () => {
    let base = 25.0;
    if (vehicleType === 'Executive') base = 65.0;
    if (vehicleType === 'Estate') base = 32.0;
    if (vehicleType.includes('MPV')) base = 55.0;
    if (zone.includes('LHR')) base += 30.0;
    setFare(base);
    soundManager.playRadioClick();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passengerName.trim() || !pickupAddress.trim() || !destinationAddress.trim()) {
      return;
    }

    onCreateBooking({
      leadSource,
      passengerName: passengerName.trim(),
      passengerPhone: passengerPhone.trim(),
      passengerCount: Number(passengerCount),
      luggageCount: Number(luggageCount),
      pickupDate,
      pickupTime,
      pickupAddress: pickupAddress.trim(),
      destinationAddress: destinationAddress.trim(),
      zone,
      vehicleType,
      account,
      paymentMethod,
      fare: Number(fare),
      flightNumber: flightNumber.trim() || undefined,
      specialInstructions: specialInstructions.trim() || undefined,
    });

    soundManager.playDispatch();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#143254] text-white dark:bg-slate-800 border-b border-[#214772] dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-sky-300" />
            <h3 className="font-extrabold text-xs tracking-wider uppercase">
              Fast Dispatch Booking Entry
            </h3>
            <span className="text-[9px] font-mono bg-[#091b30] text-sky-300 px-1.5 py-0.2 rounded border border-[#1f4773]">
              OPERATIONAL
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-sky-200 hover:text-white hover:bg-[#1e4674] dark:hover:bg-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Source & Booking Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Booking Source
              </label>
              <select
                value={leadSource}
                onChange={(e) => setLeadSource(e.target.value as LeadSource)}
                className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="PHONE">Telephone Desk</option>
                <option value="WEB">Web Booker</option>
                <option value="MOBILE_APP">Mobile App</option>
                <option value="CORPORATE">Corporate Account</option>
                <option value="WALK_IN">Walk-in Customer</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Pickup Date
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Pickup Time
              </label>
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Passenger Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Passenger Full Name *
              </label>
              <input
                type="text"
                required
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                placeholder="e.g. Alexander Vance"
                className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={passengerPhone}
                onChange={(e) => setPassengerPhone(e.target.value)}
                className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Pax
                </label>
                <input
                  type="number"
                  min={1}
                  max={16}
                  value={passengerCount}
                  onChange={(e) => setPassengerCount(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none text-center"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Bags
                </label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={luggageCount}
                  onChange={(e) => setLuggageCount(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none text-center"
                />
              </div>
            </div>
          </div>

          {/* Route Addresses */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                  Pickup Address & Postcode *
                </label>
                <div className="flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 text-blue-600" />
                  <span className="text-[10px] text-slate-500">Zone:</span>
                  <select
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="px-1.5 py-0.5 text-[10px] bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded font-mono font-bold"
                  >
                    <option value="W1">W1 - Mayfair / West End</option>
                    <option value="W2">W2 - Paddington</option>
                    <option value="EC2">EC2 - City of London</option>
                    <option value="E14">E14 - Canary Wharf</option>
                    <option value="SW1">SW1 - Victoria</option>
                    <option value="SW7">SW7 - South Kensington</option>
                    <option value="LHR-T5">LHR-T5 - Heathrow T5</option>
                    <option value="LHR-T2">LHR-T2 - Heathrow T2/3</option>
                  </select>
                </div>
              </div>
              <input
                type="text"
                required
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="e.g. Dorchester Hotel, 53 Park Lane, London W1K 1QA"
                className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Destination Address *
              </label>
              <input
                type="text"
                required
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                placeholder="e.g. Heathrow Airport Terminal 5 Departures, TW6 2GA"
                className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Vehicle, Account & Billing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Vehicle Type
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Saloon">Saloon (4 Pax)</option>
                <option value="Estate">Estate (4 Pax + Extra Bags)</option>
                <option value="Executive">Executive (Mercedes/BMW)</option>
                <option value="MPV 6-Seater">MPV 6-Seater</option>
                <option value="MPV 8-Seater">MPV 8-Seater</option>
                <option value="Wheelchair Accessible">Wheelchair Accessible</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Account
              </label>
              <select
                value={account}
                onChange={(e) => {
                  setAccount(e.target.value);
                  if (e.target.value !== 'CASH') setPaymentMethod('ACCOUNT');
                  else setPaymentMethod('CASH');
                }}
                className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="CASH">CASH (Retail / Private)</option>
                <option value="Barclays Private Wealth">Barclays Private Wealth</option>
                <option value="Goldman Sachs International">Goldman Sachs</option>
                <option value="BBC Worldwide">BBC Worldwide</option>
                <option value="NHS Health Partners">NHS Health Partners</option>
                <option value="American Express GBT">Amex GBT</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="CASH">Cash</option>
                <option value="ACCOUNT">Corporate Account</option>
                <option value="CREDIT_CARD">Credit / Debit Card</option>
                <option value="PREPAID">Pre-paid Online</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                  Fare (£)
                </label>
                <button
                  type="button"
                  onClick={handleEstimateFare}
                  className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                  title="Auto estimate fare"
                >
                  <Calculator className="w-2.5 h-2.5" />
                  Calc
                </button>
              </div>
              <input
                type="number"
                step="0.5"
                min={5}
                required
                value={fare}
                onChange={(e) => setFare(Number(e.target.value))}
                className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono font-bold text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Optional Flight & Special Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Flight Number (Optional)
              </label>
              <input
                type="text"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                placeholder="e.g. BA182, LH901"
                className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Driver Instructions / Dispatch Notes
              </label>
              <input
                type="text"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Call passenger on arrival, hold nameboard at arrivals gate"
                className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>Real-time dispatch validation active</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition"
              >
                Cancel (Esc)
              </button>

              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold bg-blue-700 hover:bg-blue-600 text-white rounded transition shadow-sm"
              >
                Create & Save Booking
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
