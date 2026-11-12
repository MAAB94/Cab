import React from 'react';
import { Receipt, TrendingUp, DollarSign, CreditCard, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const FinanceView: React.FC = () => {
  const transactions = [
    { id: 'tx-1', time: '08:15', desc: 'Job CT-9041 (VIP Transfer)', amount: 110.0, method: 'Account', driver: 'D-101', commission: 22.0 },
    { id: 'tx-2', time: '07:55', desc: 'Job CT-9042 (Paddington to Eurostar)', amount: 28.5, method: 'Cash', driver: 'D-102', commission: 5.7 },
    { id: 'tx-3', time: '07:44', desc: 'Job CT-9036 (LHR to BBC MediaCity)', amount: 92.0, method: 'Account', driver: 'D-104', commission: 18.4 },
    { id: 'tx-4', time: '07:18', desc: 'Job CT-9035 (Claridge’s to London City)', amount: 65.0, method: 'Card', driver: 'D-101', commission: 13.0 },
    { id: 'tx-5', time: '06:55', desc: 'Job CT-9037 (Canary Wharf to Liverpool St)', amount: 26.5, method: 'Card', driver: 'D-106', commission: 5.3 },
  ];

  const totalGross = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalCommission = transactions.reduce((acc, t) => acc + t.commission, 0);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-blue-700 text-white dark:bg-slate-800 border-b border-blue-800 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="w-4 h-4 text-sky-200" />
          <h3 className="font-bold text-xs uppercase tracking-wide">
            Finance, Settlement & Driver Commission Reconciliation
          </h3>
        </div>
        <span className="text-[10px] font-mono bg-blue-900/60 text-sky-200 px-2 py-0.5 rounded border border-blue-600">
          DAILY AUDIT SHEET
        </span>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Gross Takings</span>
            <span className="font-mono font-extrabold text-xl text-slate-900 dark:text-slate-100">
              {formatCurrency(totalGross)}
            </span>
            <span className="text-[10px] text-emerald-600 block mt-0.5">+14% vs yesterday</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Company Commission (20%)</span>
            <span className="font-mono font-extrabold text-xl text-blue-700 dark:text-sky-300">
              {formatCurrency(totalCommission)}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Retained net margin</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Driver Payouts</span>
            <span className="font-mono font-extrabold text-xl text-slate-900 dark:text-slate-100">
              {formatCurrency(totalGross - totalCommission)}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">80% driver remittance</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Pending Account Invoices</span>
            <span className="font-mono font-extrabold text-xl text-amber-600 dark:text-amber-400">
              {formatCurrency(202.0)}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Billed to corporate</span>
          </div>
        </div>

        {/* Transaction Ledger Table */}
        <div className="border border-slate-200 dark:border-slate-700 rounded overflow-hidden">
          <div className="p-2.5 bg-slate-100 dark:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300">
            Today's Completed Trips & Settlement Ledger
          </div>
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-600 dark:text-slate-400">
              <tr className="h-7 text-[11px]">
                <th className="px-3 py-1">Time</th>
                <th className="px-3 py-1">Description</th>
                <th className="px-3 py-1">Driver</th>
                <th className="px-3 py-1">Payment Method</th>
                <th className="px-3 py-1 text-right">Trip Fare</th>
                <th className="px-3 py-1 text-right">Commission (20%)</th>
                <th className="px-3 py-1 text-right">Driver Net</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
              {transactions.map((t) => (
                <tr key={t.id} className="h-8 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-3 font-mono text-slate-500">{t.time}</td>
                  <td className="px-3 font-medium text-slate-900 dark:text-slate-100">{t.desc}</td>
                  <td className="px-3 font-mono font-bold text-blue-700 dark:text-blue-400">{t.driver}</td>
                  <td className="px-3 font-mono text-slate-600 dark:text-slate-400">{t.method}</td>
                  <td className="px-3 font-mono font-bold text-right text-slate-900 dark:text-slate-100">{formatCurrency(t.amount)}</td>
                  <td className="px-3 font-mono text-right text-blue-700 dark:text-sky-300 font-semibold">{formatCurrency(t.commission)}</td>
                  <td className="px-3 font-mono text-right text-emerald-600 dark:text-emerald-400 font-bold">{formatCurrency(t.amount - t.commission)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
