import React from 'react';
import { BarChart3, Clock, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export const ReportsView: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-blue-700 text-white dark:bg-slate-800 border-b border-blue-800 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-sky-200" />
          <h3 className="font-bold text-xs uppercase tracking-wide">
            Operational Service Level & Fleet Dispatch Reports
          </h3>
        </div>
        <span className="text-[10px] font-mono bg-blue-900/60 text-sky-200 px-2 py-0.5 rounded border border-blue-600">
          REAL-TIME TELEMETRY
        </span>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto text-xs">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Average Pickup Response</span>
            <span className="font-mono font-bold text-xl text-blue-700 dark:text-sky-300">
              6.4 mins
            </span>
            <span className="text-[10px] text-emerald-600 block mt-0.5">Under 8m target SLA</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">On-Time Dispatch Rate</span>
            <span className="font-mono font-bold text-xl text-emerald-600 dark:text-emerald-400">
              98.2%
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Top quartile reliability</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">No Show Incident Rate</span>
            <span className="font-mono font-bold text-xl text-amber-600 dark:text-amber-400">
              1.4%
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Below 2% threshold</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Dispatches Today</span>
            <span className="font-mono font-bold text-xl text-slate-900 dark:text-slate-100">
              42 jobs
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Across 8 London plots</span>
          </div>
        </div>

        {/* Plot Performance Breakdown */}
        <div className="border border-slate-200 dark:border-slate-700 rounded overflow-hidden">
          <div className="p-2.5 bg-slate-100 dark:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300">
            Zone / Plot SLA & Driver Utilization
          </div>
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-600 dark:text-slate-400">
              <tr className="h-7 text-[11px]">
                <th className="px-3 py-1">Plot Code</th>
                <th className="px-3 py-1">Zone Name</th>
                <th className="px-3 py-1">Active Bookings</th>
                <th className="px-3 py-1">Available Fleet</th>
                <th className="px-3 py-1">Avg Wait Time</th>
                <th className="px-3 py-1">SLA Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
              <tr className="h-8">
                <td className="px-3 font-mono font-bold text-blue-700 dark:text-sky-300">W1</td>
                <td className="px-3 font-medium">Mayfair & West End</td>
                <td className="px-3 font-mono">8 active</td>
                <td className="px-3 font-mono text-emerald-600 font-bold">4 drivers</td>
                <td className="px-3 font-mono">5.2m</td>
                <td className="px-3 font-mono text-emerald-600 font-bold">99.1%</td>
              </tr>
              <tr className="h-8">
                <td className="px-3 font-mono font-bold text-blue-700 dark:text-sky-300">LHR-T5</td>
                <td className="px-3 font-medium">Heathrow Airport Terminal 5</td>
                <td className="px-3 font-mono">6 active</td>
                <td className="px-3 font-mono text-emerald-600 font-bold">5 drivers</td>
                <td className="px-3 font-mono">7.8m</td>
                <td className="px-3 font-mono text-emerald-600 font-bold">98.5%</td>
              </tr>
              <tr className="h-8">
                <td className="px-3 font-mono font-bold text-blue-700 dark:text-sky-300">EC2</td>
                <td className="px-3 font-medium">City of London / Liverpool St</td>
                <td className="px-3 font-mono">7 active</td>
                <td className="px-3 font-mono text-amber-600 font-bold">2 drivers</td>
                <td className="px-3 font-mono">8.4m</td>
                <td className="px-3 font-mono text-emerald-600 font-bold">97.4%</td>
              </tr>
              <tr className="h-8">
                <td className="px-3 font-mono font-bold text-blue-700 dark:text-sky-300">E14</td>
                <td className="px-3 font-medium">Canary Wharf Financial</td>
                <td className="px-3 font-mono">5 active</td>
                <td className="px-3 font-mono text-emerald-600 font-bold">4 drivers</td>
                <td className="px-3 font-mono">4.9m</td>
                <td className="px-3 font-mono text-emerald-600 font-bold">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
