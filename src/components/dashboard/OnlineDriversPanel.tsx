import React, { useState } from 'react';
import { Driver, ZoneSummary } from '../../types/dispatch';
import { Users, Radio } from 'lucide-react';
import { getDriverStatusClasses } from '../../utils/formatters';

interface OnlineDriversPanelProps {
  drivers: Driver[];
  zones: ZoneSummary[];
  onSelectDriver: (driver: Driver) => void;
}

export const OnlineDriversPanel: React.FC<OnlineDriversPanelProps> = ({
  drivers,
  zones,
  onSelectDriver,
}) => {
  const [selectedZone, setSelectedZone] = useState<string>('ALL');

  const onlineDrivers = drivers.filter((d) => d.status !== 'OFFLINE');
  const availableCount = drivers.filter(
    (d) => d.status === 'AVAILABLE' || d.status === 'WAITING'
  ).length;
  const onJobCount = drivers.filter((d) => d.status === 'ON_JOB').length;
  const onBreakCount = drivers.filter((d) => d.status === 'BREAK').length;

  const filteredDrivers =
    selectedZone === 'ALL'
      ? onlineDrivers
      : onlineDrivers.filter((d) => d.currentZone === selectedZone);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded shadow-xs overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#1b3a5f] text-white dark:bg-slate-800 border-b border-[#254d7d] dark:border-slate-700 text-xs font-semibold">
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-sky-300" />
          <span className="tracking-wide uppercase text-[11px] font-bold">Online Drivers</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono">
          <span className="text-emerald-300 font-bold tabular-nums">{availableCount} Avail</span>
          <span className="text-slate-400">·</span>
          <span className="text-sky-300 font-bold tabular-nums">{onJobCount} Job</span>
          <span className="text-slate-400">·</span>
          <span className="bg-[#0f243c] px-1.5 py-0.2 rounded font-bold text-white border border-[#2b5587] tabular-nums">
            Total {onlineDrivers.length}
          </span>
        </div>
      </div>

      {/* Zone Filter Bar */}
      <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/60 dark:border-slate-800 overflow-x-auto text-[10px]">
        <button
          onClick={() => setSelectedZone('ALL')}
          className={`px-2 py-0.5 rounded font-mono font-bold transition shrink-0 ${
            selectedZone === 'ALL'
              ? 'bg-blue-700 text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          ALL ({onlineDrivers.length})
        </button>
        {zones.map((zone) => {
          const countInZone = onlineDrivers.filter((d) => d.currentZone === zone.code).length;
          return (
            <button
              key={zone.id}
              onClick={() => setSelectedZone(zone.code)}
              className={`px-1.5 py-0.5 rounded font-mono font-medium transition shrink-0 ${
                selectedZone === zone.code
                  ? 'bg-blue-700 text-white shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {zone.code} ({countInZone})
            </button>
          );
        })}
      </div>

      {/* Drivers Grid / Badges */}
      <div className="flex-1 overflow-y-auto p-2 text-xs min-h-[105px] max-h-[140px]">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {filteredDrivers.map((driver) => {
            const statusStyle = getDriverStatusClasses(driver.status);

            return (
              <button
                key={driver.id}
                onClick={() => onSelectDriver(driver)}
                className={`flex items-center justify-between p-1.5 rounded border text-left transition hover:shadow-2xs ${statusStyle.bg} ${statusStyle.border}`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <Radio className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                  <div className="truncate">
                    <span className="font-mono font-bold text-[11px] text-slate-900 dark:text-slate-100">
                      {driver.driverNumber}
                    </span>
                    <span className="block text-[9px] text-slate-500 truncate leading-none">
                      {driver.callsign}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-[10px] text-slate-700 dark:text-slate-300 block">
                    {driver.currentZone}
                  </span>
                  <span className={`text-[8px] font-bold uppercase ${statusStyle.text}`}>
                    {driver.status === 'AVAILABLE'
                      ? 'FREE'
                      : driver.status === 'ON_JOB'
                      ? 'JOB'
                      : driver.status}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
