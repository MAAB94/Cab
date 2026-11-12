import React, { useState } from 'react';
import { Driver, DriverStatus } from '../../types/dispatch';
import { Users, Search, Car, Shield, Star, Phone, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { getDriverStatusClasses } from '../../utils/formatters';

interface DriverManagementViewProps {
  drivers: Driver[];
  onUpdateDriverStatus: (driverId: string, status: DriverStatus) => void;
}

export const DriverManagementView: React.FC<DriverManagementViewProps> = ({
  drivers,
  onUpdateDriverStatus,
}) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filtered = drivers.filter((d) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        d.fullName.toLowerCase().includes(q) ||
        d.driverNumber.toLowerCase().includes(q) ||
        d.mobile.toLowerCase().includes(q) ||
        d.vehicleRegistration.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filterStatus !== 'ALL' && d.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-xs overflow-hidden">
      {/* Header & Controls */}
      <div className="p-3 bg-blue-700 text-white dark:bg-slate-800 border-b border-blue-800 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-sky-200" />
          <h3 className="font-bold text-xs uppercase tracking-wide">
            Driver & Fleet Controller Management
          </h3>
          <span className="text-[10px] font-mono bg-blue-900/60 text-sky-200 px-2 py-0.5 rounded border border-blue-600">
            {drivers.length} REGISTERED
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search driver, reg, mobile..."
              className="pl-7 pr-2 py-1 text-xs bg-blue-900/60 dark:bg-slate-900 border border-blue-600 dark:border-slate-700 rounded text-white placeholder:text-blue-200 focus:outline-none"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2 py-1 text-xs bg-blue-900/60 dark:bg-slate-900 border border-blue-600 dark:border-slate-700 rounded text-white focus:outline-none font-mono"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="WAITING">Waiting Queue</option>
            <option value="ON_JOB">On Job</option>
            <option value="BREAK">On Break</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* Driver Cards Grid */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((driver) => {
            const statusStyle = getDriverStatusClasses(driver.status);

            return (
              <div
                key={driver.id}
                className="bg-white dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700 p-3 shadow-xs hover:border-blue-400 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                        {driver.driverNumber}
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-tight">
                          {driver.fullName}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Callsign: {driver.callsign}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded border font-mono ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                    >
                      {driver.status}
                    </span>
                  </div>

                  {/* Vehicle details */}
                  <div className="p-2 bg-slate-50 dark:bg-slate-900/60 rounded border border-slate-200 dark:border-slate-700/60 space-y-1 text-xs mb-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Car className="w-3 h-3" />
                        Vehicle:
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {driver.vehicleModel}
                      </span>
                    </div>
                    <div className="flex justify-between items-center font-mono">
                      <span className="text-slate-500">Reg:</span>
                      <span className="font-bold text-blue-700 dark:text-sky-300">
                        {driver.vehicleRegistration}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Type / Plot:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {driver.vehicleType} · {driver.currentZone}
                      </span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-1 text-center font-mono text-xs py-1">
                    <div className="p-1 bg-slate-50 dark:bg-slate-900/40 rounded">
                      <span className="text-[9px] text-slate-400 block">Rating</span>
                      <span className="font-bold text-amber-500 flex items-center justify-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {driver.rating}
                      </span>
                    </div>
                    <div className="p-1 bg-slate-50 dark:bg-slate-900/40 rounded">
                      <span className="text-[9px] text-slate-400 block">Jobs Today</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {driver.totalJobsToday}
                      </span>
                    </div>
                    <div className="p-1 bg-slate-50 dark:bg-slate-900/40 rounded">
                      <span className="text-[9px] text-slate-400 block">Earnings</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        £{driver.earningsToday.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Status Control */}
                <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-1 text-xs">
                  <span className="text-[10px] text-slate-400">Set Status:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUpdateDriverStatus(driver.id, 'AVAILABLE')}
                      className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 transition"
                    >
                      Available
                    </button>
                    <button
                      onClick={() => onUpdateDriverStatus(driver.id, 'BREAK')}
                      className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-50 hover:bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-300 dark:border-purple-800 transition"
                    >
                      Break
                    </button>
                    <button
                      onClick={() => onUpdateDriverStatus(driver.id, 'SUSPENDED')}
                      className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-50 hover:bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800 transition"
                    >
                      Suspend
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
