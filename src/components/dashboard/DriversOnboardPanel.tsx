import React from 'react';
import { Driver } from '../../types/dispatch';
import { Car, Navigation, CheckSquare, Clock } from 'lucide-react';
import { soundManager } from '../../utils/sound';

interface DriversOnboardPanelProps {
  drivers: Driver[];
  onSelectDriver: (driver: Driver) => void;
  onFojDriver: (driverId: string) => void;
}

export const DriversOnboardPanel: React.FC<DriversOnboardPanelProps> = ({
  drivers,
  onSelectDriver,
  onFojDriver,
}) => {
  const onboardDrivers = drivers.filter((d) => d.status === 'ON_JOB');

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded shadow-xs overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#1b3a5f] text-white dark:bg-slate-800 border-b border-[#254d7d] dark:border-slate-700 text-xs font-semibold">
        <div className="flex items-center gap-1.5">
          <Car className="w-3.5 h-3.5 text-sky-300" />
          <span className="tracking-wide uppercase text-[11px] font-bold">Drivers Onboard</span>
          <span className="ml-1 px-1.5 py-0.2 rounded bg-[#0f243c] text-sky-200 text-[10px] font-mono font-bold border border-[#2b5587]">
            {onboardDrivers.length}
          </span>
        </div>
        <span className="text-[10px] text-sky-300 font-mono font-medium">POB / STC</span>
      </div>

      {/* Driver List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 text-xs min-h-[140px] max-h-[175px]">
        {onboardDrivers.length === 0 ? (
          <div className="h-full flex items-center justify-center p-4 text-slate-400 text-xs">
            No drivers currently on board
          </div>
        ) : (
          onboardDrivers.map((driver) => {
            const isSTC = driver.jobStatus === 'STC';

            return (
              <div
                key={driver.id}
                onClick={() => onSelectDriver(driver)}
                className="p-2 hover:bg-sky-50/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-sky-300 font-mono font-bold text-[11px] border border-slate-300 dark:border-slate-700 shadow-2xs">
                      {driver.driverNumber}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 truncate max-w-[110px] text-[11px]">
                      {driver.fullName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {driver.vehicleRegistration}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono border ${
                        isSTC
                          ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-800'
                          : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                      }`}
                    >
                      {driver.jobStatus || 'POB'}
                    </span>
                    {driver.etaMinutes !== undefined && (
                      <span className="text-[10px] text-slate-500 flex items-center gap-0.5 font-mono">
                        <Clock className="w-2.5 h-2.5 text-slate-400" />
                        {driver.etaMinutes}m
                      </span>
                    )}
                  </div>
                </div>

                {/* Job Route Summary */}
                <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1 min-w-0 flex-1 truncate">
                    <span className="font-mono text-blue-700 dark:text-sky-400 font-bold text-[10px]">
                      {driver.activeJobRef || 'JOB'}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">/</span>
                    <span className="truncate">{driver.activeJobPickup || 'Pickup'}</span>
                    <Navigation className="w-2.5 h-2.5 text-slate-400 shrink-0 mx-0.5" />
                    <span className="truncate text-slate-900 dark:text-slate-100 font-medium">
                      {driver.activeJobDestination || 'Destination'}
                    </span>
                  </div>

                  {/* Quick FOJ (Free On Job) Trigger */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFojDriver(driver.id);
                      soundManager.playRadioClick();
                    }}
                    className={`ml-1.5 px-1.5 py-0.5 text-[9px] rounded font-bold transition border ${
                      isSTC
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-teal-50 hover:text-teal-700'
                    }`}
                    title="Toggle Free On Job (STC)"
                  >
                    <CheckSquare className="w-2.5 h-2.5 inline mr-0.5" />
                    FOJ
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
