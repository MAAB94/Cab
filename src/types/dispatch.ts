export type BookingStatus =
  | 'PENDING'
  | 'DISPATCHED'
  | 'ALLOCATED'
  | 'POB' // Passenger On Board
  | 'STC' // Soon To Clear / Free On Job
  | 'COMPLETED'
  | 'ON_HOLD'
  | 'NO_SHOW'
  | 'CANCELLED';

export type LeadSource = 'PHONE' | 'WEB' | 'MOBILE_APP' | 'CORPORATE' | 'WALK_IN';

export type VehicleType =
  | 'Saloon'
  | 'Estate'
  | 'Executive'
  | 'MPV 6-Seater'
  | 'MPV 8-Seater'
  | 'Wheelchair Accessible';

export type PaymentMethod = 'CASH' | 'ACCOUNT' | 'CREDIT_CARD' | 'PREPAID' | 'PAYPAL';

export interface BookingActivity {
  id: string;
  timestamp: string;
  action: string;
  operator: string;
  notes?: string;
}

export interface Booking {
  id: string;
  reference: string;
  leadSource: LeadSource;
  pickupTime: string; // e.g. "08:15"
  pickupDate: string; // e.g. "2026-11-12"
  bookingTime: string; // e.g. "07:45"
  bookingDate: string;
  zone: string;
  passengerName: string;
  passengerPhone: string;
  passengerCount: number;
  luggageCount: number;
  pickupAddress: string;
  pickupPostcode?: string;
  destinationAddress: string;
  destinationPostcode?: string;
  viaAddress?: string;
  fare: number;
  account: string; // "CASH", "Barclays Capital", "BBC MediaCity", etc.
  paymentMethod: PaymentMethod;
  vehicleType: VehicleType;
  assignedDriverId?: string;
  assignedDriverNumber?: string;
  status: BookingStatus;
  flightNumber?: string;
  specialInstructions?: string;
  cancellationReason?: string;
  cancelledBy?: string;
  cancelledAt?: string;
  noShowReason?: string;
  orderNumber?: string;
  paymentReference?: string;
  activityHistory: BookingActivity[];
}

export type DriverStatus =
  | 'AVAILABLE'
  | 'WAITING'
  | 'ON_JOB'
  | 'OFFLINE'
  | 'BREAK'
  | 'SUSPENDED';

export interface Driver {
  id: string;
  driverNumber: string; // e.g. "D-102"
  fullName: string;
  mobile: string;
  callsign: string;
  status: DriverStatus;
  vehicleType: VehicleType;
  vehicleRegistration: string;
  vehicleModel: string;
  vehicleColor: string;
  currentZone: string;
  waitingDurationMinutes: number;
  activeJobRef?: string;
  activeJobPickup?: string;
  activeJobDestination?: string;
  jobStatus?: 'HEADING_TO_PICKUP' | 'ARRIVED' | 'POB' | 'STC';
  etaMinutes?: number;
  lat: number;
  lng: number;
  rating: number;
  totalJobsToday: number;
  earningsToday: number;
}

export interface DriverMessage {
  id: string;
  driverId: string;
  driverNumber: string;
  message: string;
  timestamp: string;
  direction: 'INCOMING' | 'OUTGOING';
  isRead: boolean;
  priority?: 'NORMAL' | 'URGENT';
}

export interface ZoneSummary {
  id: string;
  code: string;
  name: string;
  activeBookings: number;
  availableDrivers: number;
}

export interface TelephonyCall {
  id: string;
  callerNumber: string;
  callerName?: string;
  callTime: string;
  durationSeconds: number;
  status: 'ANSWERED' | 'MISSED' | 'BOOKED';
  account?: string;
}
