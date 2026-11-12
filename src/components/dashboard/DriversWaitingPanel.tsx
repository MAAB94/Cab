import React from 'react';
import { Driver } from '../../types/dispatch';
import { Hourglass, Send, MapPin } from 'lucide-react';

interface DriversWaitingPanelProps {
  drivers: Driver[];
  onSelectDriver: (driver: Driver) => void;
  onQuickDispatch: (driver: Driver) => void;
}

export const DriversWaitingPanel: React.FC<DriversWaitingPanelProps> = ({
  drivers,
  onSelectDriver,
  onQuickDispatch,
}) => {
  const waitingDrivers = drivers
    .filter((d) => d.status === 'WAITING' || d.status === 'AVAILABLE')
    .sort((a, b) => b.waitingDurationMinutes - a.waitingDurationMinutes);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded shadow-xs overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#1b3a5f] text-white dark:bg-slate-800 border-b border-[#254d7d] dark:border-slate-700 text-xs font-semibold">
        <div className="flex items-center gap-1.5">
          <Hourglass className="w-3.5 h-3.5 text-amber-300" />
          <span className="tracking-wide uppercase text-[11px] font-bold">Drivers Waiting (Queue)</span>
          <span className="ml-1 px-1.5 py-0.2 rounded bg-[#0f243c] text-amber-200 text-[10px] font-mono font-bold border border-[#2b5587]">
            {waitingDrivers.length}
          </span>
        </div>
        <span className="text-[10px] text-amber-200 font-mono font-medium">Rank by Wait</span>
      </div>

      {/* Driver List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 text-xs min-h-[140px] max-h-[175px]">
        {waitingDrivers.length === 0 ? (
          <div className="h-full flex items-center justify-center p-4 text-slate-400 text-xs">
            No drivers currently waiting in queue
          </div>
        ) : (
          waitingDrivers.map((driver, index) => {
            return (
              <div
                key={driver.id}
                onClick={() => onSelectDriver(driver)}
                className="p-2 hover:bg-amber-50/40 dark:hover:bg-slate-800/60 transition-colors cursor-pointer flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] font-mono font-bold text-slate-400 w-4 text-right">
                    #{index + 1}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-mono font-bold text-[11px] border border-amber-300 dark:border-amber-800">
                    {driver.driverNumber}
                  </span>
                  <div className="truncate">
                    <p className="font-bold text-slate-900 dark:text-slate-100 truncate text-[11px] leading-tight">
                      {driver.fullName}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono leading-tight">
                      {driver.vehicleModel} · {driver.vehicleType}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Zone/Plot Badge */}
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-sky-50 dark:bg-sky-950 text-sky-800 dark:text-sky-300 text-[10px] font-mono font-bold border border-sky-200 dark:border-sky-800">
                    <MapPin className="w-2.5 h-2.5" />
                    {driver.currentZone}
                  </span>

                  {/* Waiting Timer */}
                  <span className="text-[11px] font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-100/60 dark:bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800/60 tabular-nums">
                    {driver.waitingDurationMinutes}m
                  </span>

                  {/* Dispatch Action */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickDispatch(driver);
                    }}
                    className="p-1 rounded bg-blue-700 hover:bg-blue-600 text-white transition shadow-2xs"
                    title={`Assign / Dispatch ${driver.driverNumber}`}
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
