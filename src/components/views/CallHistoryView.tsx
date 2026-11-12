import React from 'react';
import { TelephonyCall } from '../../types/dispatch';
import { PhoneCall, PhoneIncoming, PhoneMissed, Plus, Clock } from 'lucide-react';

interface CallHistoryViewProps {
  calls: TelephonyCall[];
  onBookCall: (call: TelephonyCall) => void;
}

export const CallHistoryView: React.FC<CallHistoryViewProps> = ({
  calls,
  onBookCall,
}) => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-blue-700 text-white dark:bg-slate-800 border-b border-blue-800 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-sky-200" />
          <h3 className="font-bold text-xs uppercase tracking-wide">
            Telephony Switchboard & Incoming Call Log
          </h3>
        </div>
        <span className="text-[11px] font-mono text-sky-200">
          PBX INTEGRATION ACTIVE
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
            <tr className="h-8 border-b border-slate-200 dark:border-slate-700">
              <th className="px-3 py-1">Type</th>
              <th className="px-3 py-1">Time</th>
              <th className="px-3 py-1">Caller Name</th>
              <th className="px-3 py-1">Telephone Number</th>
              <th className="px-3 py-1">Account</th>
              <th className="px-3 py-1">Duration</th>
              <th className="px-3 py-1">Status</th>
              <th className="px-3 py-1 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
            {calls.map((c) => (
              <tr key={c.id} className="h-8 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-3">
                  {c.status === 'MISSED' ? (
                    <PhoneMissed className="w-3.5 h-3.5 text-rose-500" />
                  ) : (
                    <PhoneIncoming className="w-3.5 h-3.5 text-emerald-500" />
                  )}
                </td>
                <td className="px-3 font-mono text-slate-500">{c.callTime}</td>
                <td className="px-3 font-semibold text-slate-800 dark:text-slate-200">
                  {c.callerName || 'Unknown Caller'}
                </td>
                <td className="px-3 font-mono text-blue-700 dark:text-sky-400 font-medium">
                  {c.callerNumber}
                </td>
                <td className="px-3 text-slate-600 dark:text-slate-400">
                  {c.account || 'Private / Cash'}
                </td>
                <td className="px-3 font-mono text-slate-500">
                  {c.durationSeconds}s
                </td>
                <td className="px-3">
                  <span
                    className={`px-1.5 py-0.2 rounded font-mono text-[10px] font-bold ${
                      c.status === 'BOOKED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : c.status === 'ANSWERED'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-3 text-center">
                  <button
                    onClick={() => onBookCall(c)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[10px] transition"
                    title="Generate booking for this caller"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Quick Book</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
