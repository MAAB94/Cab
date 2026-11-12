import React, { useState } from 'react';
import { Settings, Sliders, Shield, Zap, Bell, Check } from 'lucide-react';
import { soundManager } from '../../utils/sound';

interface SettingsViewProps {
  autoDispatch: boolean;
  setAutoDispatch: (val: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  autoDispatch,
  setAutoDispatch,
  soundEnabled,
  setSoundEnabled,
}) => {
  const [saloonRate, setSaloonRate] = useState(2.8);
  const [execRate, setExecRate] = useState(4.2);
  const [airportSurcharge, setAirportSurcharge] = useState(15.0);
  const [dispatchRadiusKm, setDispatchRadiusKm] = useState(8);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    soundManager.playDispatch();
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-blue-700 text-white dark:bg-slate-800 border-b border-blue-800 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-sky-200" />
          <h3 className="font-bold text-xs uppercase tracking-wide">
            Cab Treasure Cloud X System Dispatch Settings
          </h3>
        </div>
        <span className="text-[10px] font-mono bg-blue-900/60 text-sky-200 px-2 py-0.5 rounded border border-blue-600">
          OPERATIONAL CONFIG
        </span>
      </div>

      <form onSubmit={handleSave} className="p-4 space-y-4 overflow-y-auto text-xs max-w-2xl">
        {/* Auto Dispatch Engine Settings */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Automatic Allocation Engine Configuration</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Master Auto-Dispatch
              </p>
              <p className="text-[11px] text-slate-500">
                Automatically allocate incoming jobs to the closest ranked available driver
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoDispatch}
              onChange={(e) => setAutoDispatch(e.target.checked)}
              className="rounded text-blue-600 focus:ring-0 cursor-pointer h-4 w-4"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Max Dispatch Search Radius (KM)
              </label>
              <input
                type="number"
                value={dispatchRadiusKm}
                onChange={(e) => setDispatchRadiusKm(Number(e.target.value))}
                className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Driver Response Timeout (Seconds)
              </label>
              <input
                type="number"
                defaultValue={30}
                className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Tariffs & Mileage */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>Tariff Rates & Fare Calculation Multipliers</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Saloon Rate (£/mile)
              </label>
              <input
                type="number"
                step="0.1"
                value={saloonRate}
                onChange={(e) => setSaloonRate(Number(e.target.value))}
                className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Executive Rate (£/mile)
              </label>
              <input
                type="number"
                step="0.1"
                value={execRate}
                onChange={(e) => setExecRate(Number(e.target.value))}
                className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Airport Drop-off Toll (£)
              </label>
              <input
                type="number"
                step="1"
                value={airportSurcharge}
                onChange={(e) => setAirportSurcharge(Number(e.target.value))}
                className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Audio Alerts */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-sky-500" />
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Web Audio Synthesizer Feedback
              </p>
              <p className="text-[11px] text-slate-500">
                Radio chirps on dispatches, urgent alert chimes on MDT messages
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(e) => {
              setSoundEnabled(e.target.checked);
              soundManager.setSoundEnabled(e.target.checked);
            }}
            className="rounded text-blue-600 focus:ring-0 cursor-pointer h-4 w-4"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          {saved ? (
            <span className="flex items-center gap-1 text-emerald-600 font-bold font-mono">
              <Check className="w-4 h-4" />
              Settings Updated Successfully
            </span>
          ) : (
            <span className="text-slate-400 text-[11px]">
              Changes apply immediately to active dispatch runtime
            </span>
          )}

          <button
            type="submit"
            className="px-4 py-1.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded transition shadow-sm"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
