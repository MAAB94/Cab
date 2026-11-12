import { BookingStatus, DriverStatus } from '../types/dispatch';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function getStatusBadgeClasses(status: BookingStatus): {
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case 'PENDING':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        text: 'text-amber-800 dark:text-amber-300',
        border: 'border-amber-300 dark:border-amber-700/50',
      };
    case 'DISPATCHED':
      return {
        bg: 'bg-sky-50 dark:bg-sky-950/40',
        text: 'text-sky-800 dark:text-sky-300',
        border: 'border-sky-300 dark:border-sky-700/50',
      };
    case 'ALLOCATED':
      return {
        bg: 'bg-indigo-50 dark:bg-indigo-950/40',
        text: 'text-indigo-800 dark:text-indigo-300',
        border: 'border-indigo-300 dark:border-indigo-700/50',
      };
    case 'POB':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        text: 'text-emerald-800 dark:text-emerald-300',
        border: 'border-emerald-300 dark:border-emerald-700/50',
      };
    case 'STC':
      return {
        bg: 'bg-teal-50 dark:bg-teal-950/40',
        text: 'text-teal-800 dark:text-teal-300',
        border: 'border-teal-300 dark:border-teal-700/50',
      };
    case 'COMPLETED':
      return {
        bg: 'bg-slate-100 dark:bg-slate-800',
        text: 'text-slate-700 dark:text-slate-300',
        border: 'border-slate-300 dark:border-slate-700',
      };
    case 'ON_HOLD':
      return {
        bg: 'bg-orange-50 dark:bg-orange-950/40',
        text: 'text-orange-800 dark:text-orange-300',
        border: 'border-orange-300 dark:border-orange-700/50',
      };
    case 'NO_SHOW':
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/40',
        text: 'text-rose-800 dark:text-rose-300',
        border: 'border-rose-300 dark:border-rose-700/50',
      };
    case 'CANCELLED':
      return {
        bg: 'bg-red-50 dark:bg-red-950/40',
        text: 'text-red-700 dark:text-red-400',
        border: 'border-red-300 dark:border-red-800/50',
      };
    default:
      return {
        bg: 'bg-slate-50 dark:bg-slate-800',
        text: 'text-slate-700 dark:text-slate-300',
        border: 'border-slate-200 dark:border-slate-700',
      };
  }
}

export function getDriverStatusClasses(status: DriverStatus): {
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case 'AVAILABLE':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-400 dark:border-emerald-600',
      };
    case 'WAITING':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-400 dark:border-amber-600',
      };
    case 'ON_JOB':
      return {
        bg: 'bg-blue-50 dark:bg-blue-950/40',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-400 dark:border-blue-600',
      };
    case 'BREAK':
      return {
        bg: 'bg-purple-50 dark:bg-purple-950/40',
        text: 'text-purple-700 dark:text-purple-300',
        border: 'border-purple-400 dark:border-purple-600',
      };
    case 'OFFLINE':
      return {
        bg: 'bg-slate-100 dark:bg-slate-800',
        text: 'text-slate-500 dark:text-slate-400',
        border: 'border-slate-300 dark:border-slate-700',
      };
    case 'SUSPENDED':
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/40',
        text: 'text-rose-700 dark:text-rose-300',
        border: 'border-rose-400 dark:border-rose-600',
      };
    default:
      return {
        bg: 'bg-slate-50 dark:bg-slate-800',
        text: 'text-slate-600 dark:text-slate-400',
        border: 'border-slate-300 dark:border-slate-700',
      };
  }
}
