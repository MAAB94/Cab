import React, { useState } from 'react';
import { Driver } from '../../types/dispatch';
import { CarFront, ShieldAlert, CheckCircle2, Search, Filter } from 'lucide-react';

interface VehicleManagementViewProps {
  drivers: Driver[];
}

export const VehicleManagementView: React.FC<VehicleManagementViewProps> = ({
  drivers,
}) => {
  const [search, setSearch] = useState('');

  const vehicles = drivers.map((d, index) => ({
    id: `veh-${index + 1}`,
    registration: d.vehicleRegistration,
    model: d.vehicleModel,
    type: d.vehicleType,
    color: d.vehicleColor,
    year: 2022 + (index % 3),
    capacity: d.vehicleType.includes('8-Seater') ? 8 : d.vehicleType.includes('6-Seater') ? 6 : 4,
    insuranceExpiry: '2027-04-15',
    motExpiry: '2027-08-30',
    status: 'ACTIVE',
    assignedDriverNumber: d.driverNumber,
    assignedDriverName: d.fullName,
  }));

  const filtered = vehicles.filter((v) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        v.registration.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.assignedDriverName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-blue-700 text-white dark:bg-slate-800 border-b border-blue-800 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CarFront className="w-4 h-4 text-sky-200" />
          <h3 className="font-bold text-xs uppercase tracking-wide">
            Fleet Vehicles & Compliance MOT Registry
          </h3>
          <span className="text-[10px] font-mono bg-blue-900/60 text-sky-200 px-2 py-0.5 rounded border border-blue-600">
            {vehicles.length} VEHICLES INSPECTED
          </span>
        </div>

        <div className="relative">
          <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vehicle reg, model..."
            className="pl-7 pr-2 py-1 text-xs bg-blue-900/60 dark:bg-slate-900 border border-blue-600 dark:border-slate-700 rounded text-white placeholder:text-blue-200 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
          <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
            <tr className="h-8 border-b border-slate-200 dark:border-slate-700">
              <th className="px-3 py-1">Registration</th>
              <th className="px-3 py-1">Make & Model</th>
              <th className="px-3 py-1">Type</th>
              <th className="px-3 py-1">Color / Year</th>
              <th className="px-3 py-1">Seats</th>
              <th className="px-3 py-1">Assigned Driver</th>
              <th className="px-3 py-1">MOT Expiry</th>
              <th className="px-3 py-1">Insurance</th>
              <th className="px-3 py-1">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
            {filtered.map((v) => (
              <tr key={v.id} className="h-8 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-3 font-mono font-bold text-blue-700 dark:text-sky-300">
                  {v.registration}
                </td>
                <td className="px-3 font-semibold text-slate-800 dark:text-slate-200">
                  {v.model}
                </td>
                <td className="px-3 text-slate-600 dark:text-slate-400">
                  {v.type}
                </td>
                <td className="px-3 text-slate-600 dark:text-slate-400">
                  {v.color} ({v.year})
                </td>
                <td className="px-3 font-mono">{v.capacity} Pax</td>
                <td className="px-3">
                  <span className="font-mono font-bold text-blue-800 dark:text-blue-300">
                    {v.assignedDriverNumber}
                  </span>
                  <span className="text-slate-500 ml-1.5 font-medium">
                    ({v.assignedDriverName})
                  </span>
                </td>
                <td className="px-3 font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {v.motExpiry}
                </td>
                <td className="px-3 font-mono text-slate-600 dark:text-slate-400">
                  {v.insuranceExpiry}
                </td>
                <td className="px-3">
                  <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                    VALID
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
